-- ============================================================
-- Phase 1: Fix Critical RLS Policies & Schema Enhancements
-- ============================================================

-- 1. Fix course SELECT policy to allow admins to see all courses (draft, published, archived)
-- Drop the existing restrictive policy first
DROP POLICY IF EXISTS "Published courses are viewable by everyone." ON courses;

-- Recreate: public sees published, admins see all
CREATE POLICY "Courses viewable by public or admin" ON courses FOR SELECT
USING (
  status = 'published' 
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Allow students to enroll themselves
CREATE POLICY "Students can enroll themselves" ON enrollments FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 3. Allow students to create orders
CREATE POLICY "Students can create orders" ON orders FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 4. Allow admins to view all enrollments (for admin dashboard)
CREATE POLICY "Admins can view all enrollments" ON enrollments FOR SELECT
USING (
  auth.uid() = student_id 
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Drop the old student-only policy since we're replacing it
DROP POLICY IF EXISTS "Students can view own enrollments." ON enrollments;

-- 5. Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT
USING (
  auth.uid() = student_id 
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Students can view own orders." ON orders;

-- 6. Allow admin full CRUD on enrollments
CREATE POLICY "Admins can manage enrollments" ON enrollments FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 7. Allow admin full CRUD on orders
CREATE POLICY "Admins can manage orders" ON orders FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. Allow admin full CRUD on certificates
CREATE POLICY "Admins can manage certificates" ON certificates FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 9. Allow public to view session titles (for course detail syllabus preview)
CREATE POLICY "Public can preview sessions for published courses" ON course_sessions FOR SELECT
USING (
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND status = 'published')
  OR EXISTS (SELECT 1 FROM enrollments WHERE course_id = course_sessions.course_id AND student_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Enrolled students can view sessions." ON course_sessions;

-- 10. Fix materials access to include admin
CREATE POLICY "Materials accessible to enrolled or admin" ON materials FOR SELECT
USING (
  EXISTS (SELECT 1 FROM enrollments WHERE course_id = materials.course_id AND student_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Enrolled students can view materials." ON materials;

-- 11. Allow students to update their own enrollment progress
CREATE POLICY "Students can update own enrollment" ON enrollments FOR UPDATE
USING (auth.uid() = student_id);
