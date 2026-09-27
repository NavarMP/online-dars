import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AddSessionForm } from "@/components/admin/add-session-form"
import { AddMaterialForm } from "@/components/admin/add-material-form"
import { SessionListEditor } from "@/components/admin/session-list-editor"
import { ChevronRight, PlayCircle, FileText, ExternalLink } from "lucide-react"

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
    .eq("id", id)
    .single()

  if (error || !course) {
    notFound()
  }

  // Sort sessions
  const sessions = course.course_sessions.sort((a: any, b: any) => a.session_order - b.session_order)

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-caption font-[600] uppercase tracking-wider text-text-muted">
          <Link href="/admin/courses" className="hover:text-ink transition-colors">Courses</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink truncate max-w-xs">{course.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-heading-2 font-[652] tracking-tight text-ink mb-2">{course.title}</h1>
            <p className="text-body-sm text-text-muted font-[456] flex items-center gap-2">
              {course.instructors?.name ? `Taught by ${course.instructors.name}` : "No Instructor Assigned"}
              <span className="w-1 h-1 rounded-full bg-hairline-soft" />
              {course.kutub?.title ? `Kitab: ${course.kutub.title}` : "No Kitab Assigned"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/courses/${course.id}`} target="_blank" className="component-button-outline flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Public Page
            </Link>
            <span className={`px-3 py-1.5 rounded-sm text-caption font-[600] tracking-wider uppercase border ${
              course.status === 'published' 
                ? 'bg-ink text-on-primary border-ink' 
                : 'bg-canvas-soft text-text-muted border-hairline-soft'
            }`}>
              {course.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Sessions Manager */}
          <section className="bg-canvas border border-hairline-soft rounded-md shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-4 font-[652] text-ink">Course Modules</h2>
              <span className="text-caption text-text-muted font-[600] bg-canvas-soft px-2.5 py-1 rounded-full border border-hairline-soft">
                {sessions.length} Modules
              </span>
            </div>
            
            <div className="bg-field border border-hairline-soft rounded-sm overflow-hidden">
              <SessionListEditor initialSessions={sessions} courseId={course.id} />
            </div>
            
            <div className="pt-4 border-t border-hairline-soft">
              <h3 className="text-body-sm font-[600] text-ink mb-4">Add New Module</h3>
              <AddSessionForm courseId={course.id} />
            </div>
          </section>

          {/* Materials Manager */}
          <section className="bg-canvas border border-hairline-soft rounded-md shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-4 font-[652] text-ink">Study Materials</h2>
              <span className="text-caption text-text-muted font-[600] bg-canvas-soft px-2.5 py-1 rounded-full border border-hairline-soft">
                {course.materials.length} Resources
              </span>
            </div>
            
            <div className="bg-field border border-hairline-soft rounded-sm overflow-hidden">
              {course.materials.length === 0 ? (
                <div className="p-8 text-center text-body-sm text-text-muted font-[456]">
                  No resources have been uploaded yet.
                </div>
              ) : (
                <ul className="divide-y divide-hairline-soft">
                  {course.materials.map((material: any) => (
                    <li key={material.id} className="p-4 hover:bg-canvas transition-colors flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-canvas-soft border border-hairline-soft flex items-center justify-center">
                          <FileText className="w-4 h-4 text-text-muted" />
                        </div>
                        <div>
                          <p className="font-[600] text-body-sm text-ink">{material.title}</p>
                          <p className="text-caption text-text-muted uppercase tracking-wider mt-0.5">{material.type}</p>
                        </div>
                      </div>
                      <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="text-link text-body-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        View File
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 border-t border-hairline-soft">
              <h3 className="text-body-sm font-[600] text-ink mb-4">Upload Resource</h3>
              <AddMaterialForm courseId={course.id} sessions={sessions} />
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm p-6 sticky top-24">
            <h3 className="font-[652] text-ink mb-6 text-heading-4">Course Properties</h3>
            
            <div className="flex flex-col gap-4 text-body-sm font-[456]">
              <div className="flex items-center justify-between py-2 border-b border-hairline-soft">
                <span className="text-text-muted">Visibility</span>
                <span className="font-[600] text-ink capitalize">{course.status}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline-soft">
                <span className="text-text-muted">Price</span>
                <span className="font-[600] text-ink">{course.is_free ? <span className="text-[#10b981]">Free</span> : `$${course.price}`}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline-soft">
                <span className="text-text-muted">Total Modules</span>
                <span className="font-[600] text-ink">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline-soft">
                <span className="text-text-muted">Created On</span>
                <span className="font-[600] text-ink">{new Date(course.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-4">
              <Link href={`/admin/courses/${course.id}/edit`} className="component-button-primary w-full text-center block">
                Edit Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
