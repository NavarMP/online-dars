import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CourseForm } from "@/components/admin/course-form"

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !course) {
    notFound()
  }

  // Fetch data for dropdowns
  const { data: instructors } = await supabase.from("instructors").select("id, name").order("name")
  const { data: kutub } = await supabase.from("kutub").select("id, title").order("title")

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/courses" className="text-body-sm text-text-muted hover:text-ink transition-colors">Courses</Link>
        <span className="text-caption text-text-muted">/</span>
        <Link href={`/admin/courses/${course.id}`} className="text-body-sm text-text-muted hover:text-ink transition-colors">{course.title}</Link>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink">Edit</span>
      </div>

      <div>
        <h1 className="text-heading-3 mb-1">Edit Course</h1>
        <p className="text-body-sm text-text-muted">Update course properties and settings.</p>
      </div>

      <CourseForm instructors={instructors || []} kutub={kutub || []} course={course} />
    </div>
  )
}
