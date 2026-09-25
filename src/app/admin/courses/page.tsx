import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  
  const { data: courses } = await supabase
    .from("courses")
    .select("*, instructors(name), kutub(title)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 mb-1">Courses</h1>
          <p className="text-body-sm text-text-muted">Manage the platform's course catalog.</p>
        </div>
        <Link href="/admin/courses/new" className="component-button-primary flex items-center gap-2 h-10 px-4 rounded-sm">
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-canvas-soft border-b border-hairline text-text-muted">
            <tr>
              <th className="py-3 px-4 font-[600]">Title</th>
              <th className="py-3 px-4 font-[600]">Kitab</th>
              <th className="py-3 px-4 font-[600]">Instructor</th>
              <th className="py-3 px-4 font-[600]">Status</th>
              <th className="py-3 px-4 font-[600]">Price</th>
              <th className="py-3 px-4 font-[600] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!courses || courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted">No courses found. Create one to get started.</td>
              </tr>
            ) : (
              courses.map((course: any) => (
                <tr key={course.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft transition-colors">
                  <td className="py-3 px-4 font-[500]">
                    <Link href={`/admin/courses/${course.id}`} className="hover:underline hover:text-ink">
                      {course.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{course.kutub?.title || "—"}</td>
                  <td className="py-3 px-4">{course.instructors?.name || "None"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-sm text-label ${
                      course.status === 'published' ? 'bg-ink text-on-primary' : 'bg-hairline-soft text-text-muted'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{course.is_free ? "Free" : `$${course.price}`}</td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <Link href={`/admin/courses/${course.id}`} className="p-1 text-text-muted hover:text-ink transition-colors"><Edit className="w-4 h-4" /></Link>
                    <button className="p-1 text-text-muted hover:text-[#ef4444] transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
