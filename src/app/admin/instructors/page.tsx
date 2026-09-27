import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, GraduationCap } from "lucide-react"

export default async function AdminInstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q
  const supabase = await createClient()
  
  let supabaseQuery = supabase
    .from("instructors")
    .select("*")

  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`)
  }

  const { data: instructors, error } = await supabaseQuery.order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Instructors</h1>
          <p className="text-body-sm text-text-muted font-[456]">Manage the scholars and educators on your platform.</p>
        </div>
        <Link href="/admin/instructors/new" className="component-button-primary flex items-center gap-2 h-10 px-4 rounded-sm shrink-0">
          <Plus className="w-4 h-4" />
          Add Instructor
        </Link>
      </div>

      <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-hairline-soft flex items-center gap-4 bg-canvas-soft/30">
          <form className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              name="q"
              placeholder="Search instructors by name..." 
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
                <th className="py-4 px-6 font-[600]">Instructor</th>
                <th className="py-4 px-6 font-[600]">Specialization</th>
                <th className="py-4 px-6 font-[600]">Bio</th>
                <th className="py-4 px-6 font-[600] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[#ef4444] font-[600]">
                    Failed to load instructors: {error.message}
                  </td>
                </tr>
              ) : !instructors || instructors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-3">
                        <GraduationCap className="w-5 h-5 text-text-muted opacity-50" />
                      </div>
                      <p className="text-body font-[600] text-ink mb-1">No instructors found</p>
                      <p className="text-body-sm font-[456]">Try adjusting your search query or add a new instructor.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                instructors.map((instructor) => (
                  <tr key={instructor.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-canvas-soft border border-hairline-soft shrink-0">
                          {instructor.image_url ? (
                            <Image src={instructor.image_url} alt={instructor.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-body-sm font-[600] text-text-muted">
                              {instructor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-body-sm font-[600] text-ink">{instructor.title} {instructor.name}</span>
                          <span className="text-caption text-text-muted font-[456]">
                            {instructor.years_of_experience ? `${instructor.years_of_experience}+ yrs experience` : "Verified Isnad"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-sm text-ink font-[456]">
                      {instructor.specialization || "General"}
                    </td>
                    <td className="py-4 px-6 text-body-sm text-text-muted font-[456] truncate max-w-[250px]">
                      {instructor.bio}
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/instructors/${instructor.id}/edit`} className="p-2 text-text-muted hover:text-ink hover:bg-canvas rounded-sm transition-colors" title="Edit Instructor">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-text-muted hover:text-[#ef4444] hover:bg-canvas rounded-sm transition-colors" title="Delete Instructor">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {instructors && instructors.length > 0 && (
          <div className="p-4 border-t border-hairline-soft bg-canvas flex items-center justify-between text-body-sm text-text-muted font-[456]">
            <span>Showing {instructors.length} results</span>
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
