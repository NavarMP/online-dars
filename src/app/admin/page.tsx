import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Example metric queries (these would be replaced with real RPC or aggregated queries)
  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")

  const { count: courseCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })

  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-heading-3 mb-2">Dashboard</h1>
        <p className="text-body-3 text-text-muted">Overview of platform metrics and recent activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-canvas border border-hairline p-4 rounded-3 shadow-3 flex flex-col gap-3">
          <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Total Students</span>
          <span className="text-heading-2">{studentCount || 0}</span>
        </div>
        <div className="bg-canvas border border-hairline p-4 rounded-3 shadow-3 flex flex-col gap-3">
          <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Active Courses</span>
          <span className="text-heading-2">{courseCount || 0}</span>
        </div>
        <div className="bg-canvas border border-hairline p-4 rounded-3 shadow-3 flex flex-col gap-3">
          <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Total Enrollments</span>
          <span className="text-heading-2">{enrollmentCount || 0}</span>
        </div>
      </div>

      {/* Recent Activity Table placeholder */}
      <div className="bg-canvas border border-hairline rounded-3 shadow-3 overflow-hidden">
        <div className="p-4 border-b border-hairline bg-canvas-soft flex items-center justify-between">
          <h3 className="text-title">Recent Enrollments</h3>
          <button className="text-label text-ink hover:underline">View all</button>
        </div>
        <div className="p-8 text-center text-body-3 text-text-muted">
          No recent activity to display.
        </div>
      </div>
    </div>
  )
}
