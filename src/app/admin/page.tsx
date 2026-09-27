import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Users, BookOpen, GraduationCap, TrendingUp, Plus, Settings } from "lucide-react"
import { AnalyticsChart } from "@/components/admin/analytics-chart"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
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

  // Fetch recent enrollments
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select("id, created_at, profiles!enrollments_student_id_fkey(full_name, email), courses(title)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch enrollments for chart (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: recentChartData } = await supabase
    .from("enrollments")
    .select("created_at")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: true })

  // Group by date
  const chartDataMap = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    chartDataMap.set(d.toISOString().split('T')[0], 0)
  }
  
  recentChartData?.forEach(e => {
    const dateStr = new Date(e.created_at).toISOString().split('T')[0]
    if (chartDataMap.has(dateStr)) {
      chartDataMap.set(dateStr, chartDataMap.get(dateStr)! + 1)
    }
  })

  const chartData = Array.from(chartDataMap.entries()).map(([dateStr, count]) => {
    const d = new Date(dateStr)
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      enrollments: count
    }
  })

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 mb-2 font-[652] tracking-tight">Overview</h1>
          <p className="text-body text-text-muted font-[456]">Track platform metrics and recent student activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new" className="component-button-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Course
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-canvas border border-hairline-soft p-6 rounded-md shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center">
              <Users className="w-4 h-4 text-ink" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-heading-1 font-[652] tracking-tight leading-none">{studentCount || 0}</span>
          </div>
        </div>
        <div className="bg-canvas border border-hairline-soft p-6 rounded-md shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Active Courses</span>
            <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-ink" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-heading-1 font-[652] tracking-tight leading-none">{courseCount || 0}</span>
          </div>
        </div>
        <div className="bg-canvas border border-hairline-soft p-6 rounded-md shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted font-[600] uppercase tracking-wider">Total Enrollments</span>
            <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-ink" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-heading-1 font-[652] tracking-tight leading-none">{enrollmentCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-canvas border border-hairline-soft p-6 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-title font-[600]">Enrollments Over Time</h3>
            <p className="text-body-sm text-text-muted">Last 7 days of platform activity</p>
          </div>
          <div className="flex items-center gap-2 text-caption font-[600] text-ink bg-canvas-soft px-3 py-1.5 rounded-full border border-hairline-soft">
            <TrendingUp className="w-4 h-4 text-ink" />
            Weekly View
          </div>
        </div>
        <AnalyticsChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-hairline-soft flex items-center justify-between">
            <h3 className="text-title font-[600]">Recent Enrollments</h3>
            <Link href="/admin/students" className="text-label text-link text-ink hover:underline">View all</Link>
          </div>
          <div className="flex-1 overflow-auto">
            {!recentEnrollments || recentEnrollments.length === 0 ? (
              <div className="p-12 text-center text-body-sm text-text-muted">
                No recent enrollments to display.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-hairline-soft bg-canvas-soft/50">
                    <th className="px-6 py-3 text-caption text-text-muted font-[600] uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-caption text-text-muted font-[600] uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-caption text-text-muted font-[600] uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-body-sm font-[600] text-ink">{enrollment.profiles?.full_name || "Unknown"}</span>
                          <span className="text-caption text-text-muted">{enrollment.profiles?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-body-sm text-ink font-[456]">{enrollment.courses?.title || "Unknown Course"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-caption text-text-muted">
                          {new Date(enrollment.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-hairline-soft">
            <h3 className="text-title font-[600]">Quick Actions</h3>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <Link href="/admin/courses/new" className="flex items-center gap-4 p-4 rounded-sm hover:bg-canvas-soft transition-colors border border-transparent hover:border-hairline-soft group">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center border border-hairline-soft group-hover:bg-ink group-hover:text-on-primary group-hover:border-ink transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-[600] text-ink">Create Course</span>
                <span className="text-caption text-text-muted">Draft a new curriculum</span>
              </div>
            </Link>
            
            <Link href="/admin/kutub/new" className="flex items-center gap-4 p-4 rounded-sm hover:bg-canvas-soft transition-colors border border-transparent hover:border-hairline-soft group">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center border border-hairline-soft group-hover:bg-ink group-hover:text-on-primary group-hover:border-ink transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-[600] text-ink">Add Kutub</span>
                <span className="text-caption text-text-muted">Digitize a new text</span>
              </div>
            </Link>

            <Link href="/admin/settings" className="flex items-center gap-4 p-4 rounded-sm hover:bg-canvas-soft transition-colors border border-transparent hover:border-hairline-soft group">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center border border-hairline-soft group-hover:bg-ink group-hover:text-on-primary group-hover:border-ink transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-[600] text-ink">Platform Settings</span>
                <span className="text-caption text-text-muted">Manage global config</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
