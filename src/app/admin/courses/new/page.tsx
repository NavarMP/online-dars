import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { CourseForm } from "@/components/admin/course-form"

export default async function NewCoursePage() {
  const supabase = await createClient()

  // Fetch data for dropdowns
  const { data: instructors } = await supabase.from("instructors").select("id, name").order("name")
  const { data: kutub } = await supabase.from("kutub").select("id, title").order("title")

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/courses" className="text-body-sm text-text-muted hover:text-ink transition-colors">Courses</Link>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink">New</span>
      </div>

      <div>
        <h1 className="text-heading-3 mb-1">Create Course</h1>
        <p className="text-body-sm text-text-muted">Add a new course to the platform, optionally linking it to an Usthad and a Kitab.</p>
      </div>

      <CourseForm instructors={instructors || []} kutub={kutub || []} />
    </div>
  )
}
