import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { PlayCircle, FileText, Download, CheckCircle, ArrowLeft } from "lucide-react"

export default async function LearningPortal({ params, searchParams }: { params: { courseId: string }, searchParams: { session?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, progress")
    .eq("course_id", params.courseId)
    .eq("student_id", user.id)
    .single()

  if (!enrollment) redirect(`/courses/${params.courseId}`) // Redirect to course page if not enrolled

  // Fetch course data
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, title, description,
      course_sessions(*),
      materials(*)
    `)
    .eq("id", params.courseId)
    .single()

  if (!course) notFound()

  // Sort sessions
  const sessions = course.course_sessions.sort((a: any, b: any) => a.session_order - b.session_order)
  
  // Determine active session
  const activeSessionId = searchParams.session || (sessions.length > 0 ? sessions[0].id : null)
  const activeSession = sessions.find((s: any) => s.id === activeSessionId)

  // Filter materials for active session or course-wide
  const courseMaterials = course.materials.filter((m: any) => !m.session_id)
  const sessionMaterials = course.materials.filter((m: any) => m.session_id === activeSessionId)

  return (
    <main className="min-h-screen bg-field flex flex-col md:flex-row">
      {/* Main Content (Video Player) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 bg-canvas border-b border-hairline flex items-center px-6 gap-4 sticky top-0 z-10">
          <Link href="/account" className="text-text-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-[1px] bg-hairline"></div>
          <h1 className="text-body font-[600] text-ink truncate">{course.title}</h1>
        </header>

        <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-8">
          {activeSession ? (
            <div className="flex flex-col gap-6">
              {/* Video Player Placeholder */}
              <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative border border-hairline-soft">
                {activeSession.video_url ? (
                  <iframe 
                    src={activeSession.video_url} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-white/50">
                    <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-body-sm">Video not available</p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-heading-3 mb-2">{activeSession.title}</h2>
                <p className="text-body text-text-muted">Session {activeSession.session_order} of {sessions.length}</p>
              </div>
              
              {/* Session specific materials */}
              {sessionMaterials.length > 0 && (
                <div className="bg-canvas border border-hairline p-6 rounded-md">
                  <h3 className="text-title mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-text-muted" /> Session Materials
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {sessionMaterials.map((m: any) => (
                      <li key={m.id} className="flex justify-between items-center p-3 rounded-sm bg-canvas-soft border border-hairline-soft hover:border-hairline transition-colors">
                        <span className="text-body-sm font-[500]">{m.title}</span>
                        <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-ink">
                          <Download className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-heading-3 mb-2">Welcome to {course.title}</h2>
              <p className="text-text-muted">This course doesn't have any sessions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Syllabus) */}
      <aside className="w-full md:w-80 lg:w-96 bg-canvas border-l border-hairline h-screen flex flex-col sticky top-0 shrink-0">
        <div className="p-6 border-b border-hairline">
          <h2 className="text-title mb-2">Course Curriculum</h2>
          <div className="w-full bg-canvas-soft h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-ink h-full" style={{ width: `${enrollment.progress}%` }}></div>
          </div>
          <p className="text-caption text-text-muted mt-2">{enrollment.progress}% Completed</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-body-sm text-text-muted">No sessions available.</div>
          ) : (
            <ul className="flex flex-col">
              {sessions.map((session: any) => {
                const isActive = session.id === activeSessionId
                // Mock completion logic:
                const isCompleted = false 
                return (
                  <li key={session.id}>
                    <Link 
                      href={`/learn/${course.id}?session=${session.id}`}
                      className={`flex gap-3 p-4 border-b border-hairline transition-colors ${
                        isActive ? 'bg-canvas-soft border-l-2 border-l-ink' : 'hover:bg-canvas-soft/50 border-l-2 border-l-transparent'
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-accent" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-hairline flex items-center justify-center text-[10px] text-text-muted">
                            {session.session_order}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-body-sm ${isActive ? 'font-[600] text-ink' : 'text-text-muted'}`}>
                          {session.title}
                        </span>
                        <span className="text-caption text-text-muted flex items-center gap-1 mt-1">
                          <PlayCircle className="w-3 h-3" /> Video
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Course-wide materials */}
          {courseMaterials.length > 0 && (
            <div className="p-6">
              <h3 className="text-label uppercase tracking-wider text-text-muted mb-4">Course Resources</h3>
              <ul className="flex flex-col gap-3">
                {courseMaterials.map((m: any) => (
                  <li key={m.id}>
                    <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-body-sm text-text-muted hover:text-ink transition-colors">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{m.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </main>
  )
}
