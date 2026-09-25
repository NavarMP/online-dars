import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { EnrollButton } from "@/components/enroll-button"

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      instructors ( name, bio, image_url ),
      kutub ( title, arabic_title, description ),
      course_sessions ( id, title, session_order )
    `)
    .eq("id", id)
    .single()

  if (!course) {
    notFound()
  }

  // Check enrollment
  let isEnrolled = false
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", id)
      .eq("student_id", user.id)
      .single()
    
    if (enrollment) isEnrolled = true
  }

  // Sort sessions by order
  const sessions = (course.course_sessions || []).sort((a: any, b: any) => a.session_order - b.session_order)

  return (
    <main className="min-h-screen pt-30 pb-20 px-6 max-w-5xl mx-auto">
      {/* Course Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/courses" className="text-caption text-text-muted hover:text-ink transition-colors">Courses</Link>
            <span className="text-caption text-text-muted">/</span>
            <span className="text-caption text-ink">{course.title}</span>
          </div>
          
          <h1 className="text-heading-2 mb-4">{course.title}</h1>
          <p className="text-body-lg text-text-muted mb-8">{course.description}</p>
          
          <div className="flex items-center gap-4">
            {course.instructors?.image_url ? (
              <Image src={course.instructors.image_url} alt={course.instructors.name} width={48} height={48} className="rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center">
                <span className="text-title text-text-muted">{course.instructors?.name?.charAt(0) || "U"}</span>
              </div>
            )}
            <div>
              <p className="text-label text-ink">{course.instructors?.name || "TBA"}</p>
              <p className="text-caption text-text-muted">Instructor</p>
            </div>
          </div>
        </div>
        
        {/* Checkout / Enrollment Card (Placeholder) */}
        <div className="w-full md:w-1/3 bg-canvas-soft border border-hairline-soft rounded-md p-6 md:sticky md:top-30">
          <div className="text-heading-3 mb-4">{course.is_free ? "Free" : `$${course.price}`}</div>
          <p className="text-body-sm text-text-muted mb-6">Full lifetime access to {sessions.length} sessions and all related study materials.</p>
          <EnrollButton courseId={course.id} isFree={course.is_free} isEnrolled={isEnrolled} />
          <div className="mt-4 text-center text-caption text-text-muted">
            Includes a verified completion certificate.
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="max-w-3xl">
        <h2 className="text-heading-3 mb-6">Course Syllabus</h2>
        
        {sessions.length === 0 ? (
          <p className="text-body text-text-muted bg-canvas-soft p-6 rounded-md border border-hairline-soft">
            The syllabus is currently being finalized.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session: any, index: number) => (
              <div key={session.id} className="flex items-center gap-4 p-4 rounded-sm bg-canvas border border-hairline hover:border-ink transition-colors">
                <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center text-label text-text-muted shrink-0">
                  {index + 1}
                </div>
                <div className="text-body font-[500]">{session.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
