import { createClient } from "@/lib/supabase/server"
import { Search, Filter, Mail, MoreHorizontal, UserCheck } from "lucide-react"
import Link from "next/link"

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q
  const supabase = await createClient()

  let supabaseQuery = supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")

  if (query) {
    supabaseQuery = supabaseQuery.ilike("full_name", `%${query}%`)
  }

  const { data: students, error } = await supabaseQuery.order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Students</h1>
          <p className="text-body-sm text-text-muted font-[456]">View and manage enrolled students and their progress.</p>
        </div>
      </div>

      <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-hairline-soft flex items-center gap-4 bg-canvas-soft/30">
          <form className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              name="q"
              placeholder="Search students by name..." 
              defaultValue={query}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm outline-none focus:border-ink transition-colors font-[456]"
            />
          </form>
          <button className="flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm text-ink hover:bg-canvas-soft transition-colors font-[456]">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm whitespace-nowrap">
            <thead className="bg-canvas-soft/50 border-b border-hairline-soft text-text-muted text-caption uppercase tracking-wider font-[600]">
              <tr>
                <th className="py-4 px-6 font-[600]">Student Name</th>
                <th className="py-4 px-6 font-[600]">Joined Date</th>
                <th className="py-4 px-6 font-[600]">Status</th>
                <th className="py-4 px-6 font-[600] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[#ef4444] font-[600]">
                    Failed to load students: {error.message}
                  </td>
                </tr>
              ) : !students || students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-3">
                        <UserCheck className="w-5 h-5 text-text-muted opacity-50" />
                      </div>
                      <p className="text-body font-[600] text-ink mb-1">No students found</p>
                      <p className="text-body-sm font-[456]">Try adjusting your search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-canvas-soft border border-hairline-soft overflow-hidden flex items-center justify-center shrink-0">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt={student.full_name || "Student"} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-body-sm text-text-muted font-[600] uppercase">{(student.full_name || "S").charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-body-sm font-[600] text-ink">{student.full_name || "Unknown"}</span>
                          <span className="text-caption text-text-muted font-[456] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-sm text-text-muted font-[456]">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption font-[600] tracking-wide uppercase bg-canvas-soft border border-hairline-soft text-text-muted">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/students/${student.id}`} className="px-3 py-1.5 text-caption font-[600] text-ink bg-canvas hover:bg-canvas-soft border border-hairline-soft rounded-sm transition-colors uppercase tracking-wider">
                          View Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {students && students.length > 0 && (
          <div className="p-4 border-t border-hairline-soft bg-canvas flex items-center justify-between text-body-sm text-text-muted font-[456]">
            <span>Showing {students.length} students</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
