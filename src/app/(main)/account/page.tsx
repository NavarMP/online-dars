import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, LogOut, User, Clock, Award } from "lucide-react"
import { signout } from "@/app/actions/auth"

export const metadata = {
  title: "My Learning | Suffa",
  description: "Your personal learning dashboard on Suffa.",
}

export default async function AccountDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("progress, courses(id, title, description, instructors(name))")
    .eq("student_id", user.id)

  // Count stats
  const totalCourses = enrollments?.length || 0
  const completedCourses = enrollments?.filter((e: any) => e.progress >= 100)?.length || 0

  return (
    <main className="min-h-screen pt-30 pb-20 px-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="mb-12 border-b border-hairline pb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-6 h-6 text-text-muted" />
            )}
          </div>
          <div>
            <h1 className="text-heading-3 mb-1">{profile?.full_name || "Student"}</h1>
            <p className="text-body-sm text-text-muted">{user.email}</p>
          </div>
        </div>
        <form action={signout}>
          <button type="submit" className="component-button-outline flex items-center gap-2 text-body-sm">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-canvas border border-hairline rounded-md p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-heading-4">{totalCourses}</p>
            <p className="text-caption text-text-muted">Enrolled</p>
          </div>
        </div>
        <div className="bg-canvas border border-hairline rounded-md p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center">
            <Award className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-heading-4">{completedCourses}</p>
            <p className="text-caption text-text-muted">Completed</p>
          </div>
        </div>
        <div className="bg-canvas border border-hairline rounded-md p-5 flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center">
            <Clock className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-heading-4">
              {Math.round((enrollments ?? []).reduce((acc: number, e: any) => acc + (e.progress || 0), 0) / Math.max(totalCourses, 1))}%
            </p>
            <p className="text-caption text-text-muted">Avg. Progress</p>
          </div>
        </div>
      </div>

      <h2 className="text-heading-4 mb-6">My Courses</h2>
      
      {!enrollments || enrollments.length === 0 ? (
        <div className="bg-canvas-soft border border-hairline-soft rounded-md p-12 text-center">
          <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-4" />
          <h3 className="text-title mb-2">No courses yet</h3>
          <p className="text-body-sm text-text-muted mb-6">You haven't enrolled in any courses.</p>
          <Link href="/courses" className="component-button-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enrollment: any) => {
            const course = enrollment.courses
            return (
              <div key={course.id} className="group bg-canvas border border-hairline-soft hover:border-hairline rounded-md p-6 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption text-text-muted">{course.instructors?.name || "Instructor"}</span>
                  {enrollment.progress >= 100 && (
                    <span className="text-label bg-ink text-on-primary px-2 py-0.5 rounded-full">Completed</span>
                  )}
                </div>
                <h3 className="text-title mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-body-sm text-text-muted mb-6 line-clamp-2">{course.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between text-caption text-text-muted mb-2">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-canvas-soft rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-ink rounded-full transition-all duration-500" 
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <Link 
                    href={`/learn/${course.id}`} 
                    className="component-button-primary w-full text-center block"
                  >
                    {enrollment.progress > 0 ? "Resume Course" : "Start Course"}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
