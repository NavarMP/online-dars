import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AddSessionForm } from "@/components/admin/add-session-form"
import { AddMaterialForm } from "@/components/admin/add-material-form"

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      instructors(name),
      kutub(title),
      course_sessions(*),
      materials(*)
    `)
    .eq("id", params.id)
    .single()

  if (error || !course) {
    notFound()
  }

  // Sort sessions
  const sessions = course.course_sessions.sort((a: any, b: any) => a.session_order - b.session_order)

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link href="/admin/courses" className="text-body-sm text-text-muted hover:text-ink transition-colors">Courses</Link>
          <span className="text-caption text-text-muted">/</span>
          <span className="text-body-sm text-ink font-[500] truncate max-w-xs">{course.title}</span>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-heading-2 mb-1">{course.title}</h1>
            <p className="text-body-sm text-text-muted">
              {course.instructors?.name ? `Taught by ${course.instructors.name}` : "No Instructor Assigned"}
              {" • "}
              {course.kutub?.title ? `Kitab: ${course.kutub.title}` : "No Kitab Assigned"}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-sm text-body-sm ${
              course.status === 'published' ? 'bg-ink text-on-primary' : 'bg-canvas-soft text-text-muted border border-hairline'
            }`}>
              {course.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Sessions Manager */}
          <section className="flex flex-col gap-4">
            <h2 className="text-heading-3">Course Sessions</h2>
            <div className="bg-canvas border border-hairline rounded-sm overflow-hidden">
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-body-sm text-text-muted">
                  No sessions have been added to this course yet.
                </div>
              ) : (
                <ul className="divide-y divide-hairline">
                  {sessions.map((session: any) => (
                    <li key={session.id} className="p-4 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <span className="font-[600] text-ink">{session.session_order}. {session.title}</span>
                        {session.video_url && (
                          <span className="text-caption bg-canvas-soft px-2 py-0.5 rounded-sm text-text-muted">Has Video</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mt-2">
              <h3 className="text-body-sm font-[600] mb-3">Add New Session</h3>
              <AddSessionForm courseId={course.id} />
            </div>
          </section>

          {/* Materials Manager */}
          <section className="flex flex-col gap-4 pt-4 border-t border-hairline">
            <h2 className="text-heading-3">Study Materials</h2>
            <div className="bg-canvas border border-hairline rounded-sm overflow-hidden">
              {course.materials.length === 0 ? (
                <div className="p-6 text-center text-body-sm text-text-muted">
                  No materials have been uploaded yet.
                </div>
              ) : (
                <ul className="divide-y divide-hairline">
                  {course.materials.map((material: any) => (
                    <li key={material.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-[500] text-ink">{material.title}</p>
                        <p className="text-caption text-text-muted uppercase tracking-wider mt-0.5">{material.type}</p>
                      </div>
                      <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="text-link text-body-sm hover:underline">
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-2">
              <h3 className="text-body-sm font-[600] mb-3">Add Material</h3>
              <AddMaterialForm courseId={course.id} sessions={sessions} />
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-canvas border border-hairline rounded-sm p-5">
            <h3 className="font-[600] text-ink mb-4 text-body">Course Details</h3>
            <div className="flex flex-col gap-3 text-body-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Price:</span>
                <span className="font-[500]">{course.is_free ? "Free" : `$${course.price}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Created:</span>
                <span className="font-[500]">{new Date(course.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Sessions:</span>
                <span className="font-[500]">{sessions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
