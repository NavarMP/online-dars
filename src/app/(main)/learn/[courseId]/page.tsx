import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { PlayCircle, FileText, Download, CheckCircle, ArrowLeft, MoreVertical, Layout, LayoutGrid, Clock } from "lucide-react"

export default async function LearningPortal({ params, searchParams }: { params: Promise<{ courseId: string }>, searchParams: Promise<{ session?: string }> }) {
  const { courseId } = await params
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, progress")
    .eq("course_id", courseId)
    .eq("student_id", user.id)
    .single()

  if (!enrollment) redirect(`/courses/${courseId}`)

  // Fetch course data
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, title, description, thumbnail_url,
      course_sessions(*),
      materials(*)
    `)
    .eq("id", courseId)
    .single()

  if (!course) notFound()

  const sessions = course.course_sessions.sort((a: any, b: any) => a.session_order - b.session_order)
  
  const activeSessionId = resolvedSearchParams.session || (sessions.length > 0 ? sessions[0].id : null)
  const activeSession = sessions.find((s: any) => s.id === activeSessionId)

  const courseMaterials = course.materials.filter((m: any) => !m.session_id)
  const sessionMaterials = course.materials.filter((m: any) => m.session_id === activeSessionId)

  return (
    <main className="h-screen bg-canvas flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sidebar (Syllabus) */}
      <aside className="w-full md:w-[380px] bg-canvas-soft border-r border-hairline-soft h-screen flex flex-col shrink-0 z-20">
        <div className="p-6 border-b border-hairline-soft bg-canvas flex flex-col gap-4">
          <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-2 text-caption text-text-muted hover:text-ink transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Exit Portal
          </Link>
          <h2 className="text-heading-4 font-[652] text-ink leading-tight line-clamp-2">{course.title}</h2>
          
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-caption font-[600] text-text-muted uppercase tracking-wider">Your Progress</span>
              <span className="text-caption text-ink font-[600]">{enrollment.progress}%</span>
            </div>
            <div className="w-full bg-hairline-soft h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-ink h-full rounded-full transition-all duration-500" 
                style={{ width: `${enrollment.progress}%` }} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {sessions.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <LayoutGrid className="w-8 h-8 text-text-muted opacity-50 mb-3" />
              <p className="text-body-sm text-text-muted font-[456]">No sessions available yet.</p>
            </div>
          ) : (
            <div className="py-2">
              <h3 className="px-6 py-4 text-caption text-text-muted font-[600] uppercase tracking-wider">Course Modules</h3>
              <ul className="flex flex-col">
                {sessions.map((session: any) => {
                  const isActive = session.id === activeSessionId
                  const isCompleted = false // Mock logic
                  return (
                    <li key={session.id}>
                      <Link 
                        href={`/learn/${course.id}?session=${session.id}`}
                        className={`flex gap-4 px-6 py-4 transition-colors relative ${
                          isActive 
                            ? 'bg-canvas before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-ink' 
                            : 'hover:bg-canvas'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-ink" />
                          ) : isActive ? (
                            <PlayCircle className="w-5 h-5 text-ink fill-ink/10" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-hairline flex items-center justify-center text-[10px] text-text-muted font-[600]">
                              {session.session_order}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className={`text-body-sm font-[456] line-clamp-2 ${isActive ? 'font-[600] text-ink' : 'text-text-muted group-hover:text-ink transition-colors'}`}>
                            {session.title}
                          </span>
                          <span className="text-caption text-text-muted mt-1.5 flex items-center gap-1.5 font-[456]">
                            <Clock className="w-3 h-3" /> {session.duration_minutes || 45} mins
                          </span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {courseMaterials.length > 0 && (
            <div className="px-6 py-8 border-t border-hairline-soft mt-auto">
              <h3 className="text-caption text-text-muted font-[600] uppercase tracking-wider mb-4">Course Resources</h3>
              <ul className="flex flex-col gap-2">
                {courseMaterials.map((m: any) => (
                  <li key={m.id}>
                    <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-md bg-canvas border border-hairline-soft hover:border-hairline text-body-sm text-ink transition-all group">
                      <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center group-hover:bg-ink group-hover:text-on-primary transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="truncate flex-1 font-[456]">{m.title}</span>
                      <Download className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content (Theater) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-canvas relative">
        <div className="w-full max-w-6xl mx-auto flex flex-col min-h-full">
          {activeSession ? (
            <>
              {/* Premium Theater Player */}
              <div className="w-full aspect-video bg-ink md:mt-8 md:rounded-lg overflow-hidden relative shadow-2xl shrink-0 group">
                {activeSession.video_url ? (
                  <video 
                    controls
                    className="absolute inset-0 w-full h-full object-contain"
                    poster={course.thumbnail_url || undefined}
                    src={activeSession.video_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-on-primary/50 bg-ink">
                    <Layout className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-body font-[456]">Content rendering in progress</p>
                  </div>
                )}
              </div>
              
              {/* Session Meta */}
              <div className="p-8 flex-1">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-label text-ink font-[600] px-3 py-1 bg-canvas-soft rounded-full border border-hairline-soft">
                    Module {activeSession.session_order}
                  </span>
                </div>
                
                <h1 className="text-heading-2 font-[652] text-ink mb-4">{activeSession.title}</h1>
                <p className="text-body-lg text-text-muted font-[456] max-w-3xl leading-relaxed mb-12">
                  {activeSession.description || "In this session, we will cover the foundational concepts related to this chapter. Detailed explanation of the text along with practical applications will be provided."}
                </p>
                
                {/* Session specific materials */}
                {sessionMaterials.length > 0 && (
                  <div className="max-w-3xl">
                    <h3 className="text-heading-4 font-[652] text-ink mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Module Resources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sessionMaterials.map((m: any) => (
                        <a key={m.id} href={m.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-md bg-canvas-soft border border-hairline-soft hover:border-ink transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center border border-hairline group-hover:bg-ink group-hover:text-on-primary group-hover:border-ink transition-all">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-body-sm font-[600] text-ink">{m.title}</span>
                            <span className="text-caption text-text-muted">PDF Document</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-6">
                <Layout className="w-10 h-10 text-text-muted opacity-50" />
              </div>
              <h2 className="text-heading-2 font-[652] text-ink mb-4">Welcome to {course.title}</h2>
              <p className="text-body-lg text-text-muted max-w-md">This course is currently being prepared. Check back soon for the first module.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
