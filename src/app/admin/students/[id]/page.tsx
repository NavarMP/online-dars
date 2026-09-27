import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Mail, Calendar, BookOpen, Clock } from "lucide-react"

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch student profile
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (studentError || !student) {
    notFound()
  }

  // Fetch enrollments with course details
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select(`
      id,
      created_at,
      courses (
        id,
        title,
        thumbnail_url,
        course_sessions (count)
      )
    `)
    .eq("student_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/students" className="text-body-sm text-text-muted hover:text-ink transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Students
        </Link>
      </div>

      {/* Student Identity Card */}
      <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-canvas-soft border-2 border-hairline-soft overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {student.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={student.avatar_url} alt={student.full_name || "Student"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-heading-3 text-text-muted font-[600] uppercase">{(student.full_name || "S").charAt(0)}</span>
          )}
        </div>
        
        <div className="flex flex-col flex-1">
          <h1 className="text-heading-2 font-[652] tracking-tight text-ink mb-2">
            {student.full_name || "Unknown Student"}
          </h1>
          <div className="flex flex-wrap gap-4 text-body-sm text-text-muted font-[456]">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {student.email || "No email provided"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Joined {new Date(student.created_at).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-canvas-soft border border-hairline-soft text-caption uppercase tracking-wider font-[600]">
              {student.role}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="bg-canvas-soft border border-hairline-soft rounded-sm p-4 flex items-center justify-between">
            <span className="text-caption font-[600] text-text-muted uppercase tracking-wider">Total Enrollments</span>
            <span className="text-title font-[652] text-ink">{enrollments?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Enrollments & Progress */}
      <div>
        <h2 className="text-heading-4 font-[652] text-ink mb-4">Course Enrollments</h2>
        <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden">
          {!enrollments || enrollments.length === 0 ? (
            <div className="p-12 text-center text-body-sm text-text-muted">
              This student has not enrolled in any courses yet.
            </div>
          ) : (
            <ul className="divide-y divide-hairline-soft">
              {enrollments.map((enrollment: any) => (
                <li key={enrollment.id} className="p-6 hover:bg-canvas-soft/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-canvas-soft border border-hairline-soft rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                      {enrollment.courses?.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={enrollment.courses.thumbnail_url} alt="Cover" className="w-full h-full object-cover grayscale opacity-80" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-text-muted opacity-50" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/admin/courses/${enrollment.courses?.id}`} className="text-body font-[600] text-ink hover:underline">
                        {enrollment.courses?.title || "Unknown Course"}
                      </Link>
                      <span className="text-caption text-text-muted font-[456] flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Enrolled on {new Date(enrollment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 min-w-[200px]">
                    <div className="flex-1">
                      <div className="flex justify-between text-caption font-[600] text-text-muted mb-1.5">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full h-1.5 bg-canvas-soft rounded-full overflow-hidden border border-hairline-soft">
                        <div className="h-full bg-ink rounded-full" style={{ width: '0%' }} />
                      </div>
                      <p className="text-[10px] text-text-muted mt-1 text-right">0 of {enrollment.courses?.course_sessions?.[0]?.count || 0} sessions</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
