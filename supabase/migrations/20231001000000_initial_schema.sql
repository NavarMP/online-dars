-- 1. Profiles (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Instructors (Usthad profiles)
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Optional link to auth
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- 3. Kutub (Classical texts)
CREATE TABLE kutub (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  arabic_title TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kutub ENABLE ROW LEVEL SECURITY;

-- 4. Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  kutub_id UUID REFERENCES kutub(id) ON DELETE SET NULL,
  instructor_id UUID REFERENCES instructors(id) ON DELETE RESTRICT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_free BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 5. Course Sessions (Lessons)
CREATE TABLE course_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT,
  session_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;

-- 6. Materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  session_id UUID REFERENCES course_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- 7. Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 8. Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  unique_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 9. Orders (Dummy Payments)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic public reads, authenticated student operations, admin full access)

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Instructors & Kutub
CREATE POLICY "Instructors are viewable by everyone." ON instructors FOR SELECT USING (true);
CREATE POLICY "Kutub are viewable by everyone." ON kutub FOR SELECT USING (true);

-- Courses
CREATE POLICY "Published courses are viewable by everyone." ON courses FOR SELECT USING (status = 'published');

-- Sessions & Materials
-- Only enrolled students or admins can view sessions/materials
CREATE POLICY "Enrolled students can view sessions." ON course_sessions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = course_sessions.course_id 
    AND enrollments.student_id = auth.uid()
  )
);
CREATE POLICY "Enrolled students can view materials." ON materials FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = materials.course_id 
    AND enrollments.student_id = auth.uid()
  )
);

-- Enrollments
CREATE POLICY "Students can view own enrollments." ON enrollments FOR SELECT USING (auth.uid() = student_id);

-- Certificates
CREATE POLICY "Certificates are publicly verifiable." ON certificates FOR SELECT USING (status = 'active');

-- Orders
CREATE POLICY "Students can view own orders." ON orders FOR SELECT USING (auth.uid() = student_id);

-- Trigger for new user signup -> profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
