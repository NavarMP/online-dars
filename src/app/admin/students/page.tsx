import { createClient } from "@/lib/supabase/server"

export default async function AdminStudentsPage() {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-heading-3 mb-1">Students</h1>
        <p className="text-body-sm text-text-muted">View and manage enrolled students.</p>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-soft">
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Name</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Joined Date</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Status</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-body-sm text-[#ef4444]">
                  Failed to load students: {error.message}
                </td>
              </tr>
            ) : students?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-body-sm text-text-muted">
                  No students registered yet.
                </td>
              </tr>
            ) : (
              students?.map((student) => (
                <tr key={student.id} className="border-b border-hairline last:border-0 hover:bg-canvas-soft/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-field border border-hairline overflow-hidden flex items-center justify-center">
                        {student.avatar_url ? (
                          <img src={student.avatar_url} alt={student.full_name || "Student"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-text-muted uppercase">{(student.full_name || "S").charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-body-sm font-medium text-ink">{student.full_name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-sm text-text-muted">
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-canvas-soft border border-hairline text-ink text-xs px-2 py-1 rounded-sm">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-body-sm text-ink hover:underline transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
