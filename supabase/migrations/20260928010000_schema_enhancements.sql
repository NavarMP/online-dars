-- ============================================================
-- Phase 2: Database Schema Enhancements
-- ============================================================

-- 1. Enhance courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0;

-- Add check constraint for difficulty (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'courses_difficulty_check'
  ) THEN
    ALTER TABLE courses ADD CONSTRAINT courses_difficulty_check 
      CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
  END IF;
END $$;

-- 2. Enhance sessions
ALTER TABLE course_sessions ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;
ALTER TABLE course_sessions ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Enhance instructors
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Ustadh';
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;

-- 4. Session completion tracking
CREATE TABLE IF NOT EXISTS session_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES course_sessions(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, session_id)
);
ALTER TABLE session_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students track own completions" ON session_completions FOR SELECT
USING (auth.uid() = student_id);
CREATE POLICY "Students can mark completions" ON session_completions FOR INSERT
WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can delete own completions" ON session_completions FOR DELETE
USING (auth.uid() = student_id);
CREATE POLICY "Admins manage completions" ON session_completions FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'instructors')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active announcements" ON announcements FOR SELECT 
USING (is_active = true);
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. Course Reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON course_reviews FOR SELECT USING (true);
CREATE POLICY "Students can write reviews" ON course_reviews FOR INSERT 
WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can edit own reviews" ON course_reviews FOR UPDATE
USING (auth.uid() = student_id);
CREATE POLICY "Admins manage reviews" ON course_reviews FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
