import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default async function AccountDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("progress, courses(id, title, description, instructors(name))")
    .eq("student_id", user.id)

  return (
    <main className="min-h-screen pt-30 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-12 border-b border-hairline pb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 mb-2">My Learning</h1>
          <p className="text-body text-text-muted">Welcome back, {profile?.full_name || "Student"}</p>
        </div>
        <form action="/actions/auth" method="post">
          {/* We'll use a simple Link to sign out or just an anchor to a server action for now */}
        </form>
      </div>

      <h2 className="text-heading-4 mb-6">Enrolled Courses</h2>
      
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
                <h3 className="text-title mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-body-sm text-text-muted mb-6 line-clamp-2">{course.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between text-caption text-text-muted mb-2">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-canvas-soft rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-ink" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <Link href={`/learn/${course.id}`} className="block text-center bg-canvas-soft w-full py-2 rounded-sm text-label text-ink hover:bg-hairline-soft transition-colors">
                    Resume Course
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
