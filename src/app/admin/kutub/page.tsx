import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus, Search, Filter, Edit, BookOpen } from "lucide-react"
import { DeleteKitabButton } from "@/components/admin/delete-kitab-button"

export default async function AdminKutubPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q
  const supabase = await createClient()
  
  let supabaseQuery = supabase
    .from("kutub")
    .select("*")

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`)
  }

  const { data: kutub, error } = await supabaseQuery.order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Kutub Library</h1>
          <p className="text-body-sm text-text-muted font-[456]">Manage the classical texts and manuscripts in your collection.</p>
        </div>
        <Link href="/admin/kutub/new" className="component-button-primary flex items-center gap-2 h-10 px-4 rounded-sm shrink-0">
          <Plus className="w-4 h-4" />
          Add Kitab
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
              placeholder="Search library texts..." 
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
                <th className="py-4 px-6 font-[600]">Title</th>
                <th className="py-4 px-6 font-[600] text-right">Arabic Title</th>
                <th className="py-4 px-6 font-[600]">Category</th>
                <th className="py-4 px-6 font-[600]">Date Added</th>
                <th className="py-4 px-6 font-[600] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#ef4444] font-[600]">
                    Failed to load kutub: {error.message}
                  </td>
                </tr>
              ) : !kutub || kutub.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-3">
                        <BookOpen className="w-5 h-5 text-text-muted opacity-50" />
                      </div>
                      <p className="text-body font-[600] text-ink mb-1">No texts found</p>
                      <p className="text-body-sm font-[456]">Try adjusting your search query or add a new text.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                kutub.map((kitab) => (
                  <tr key={kitab.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/40 transition-colors group">
                    <td className="py-4 px-6 font-[600] text-ink">
                      {kitab.title}
                    </td>
                    <td className="py-4 px-6 text-body-lg text-ink font-arabic text-right opacity-80" dir="rtl">
                      {kitab.arabic_title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-caption font-[600] tracking-wide uppercase bg-canvas-soft border border-hairline-soft text-text-muted">
                        {kitab.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-body-sm text-text-muted font-[456]">
                      {new Date(kitab.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/kutub/${kitab.id}/edit`} className="p-2 text-text-muted hover:text-ink hover:bg-canvas rounded-sm transition-colors" title="Edit Kitab">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteKitabButton id={kitab.id} title={kitab.title} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {kutub && kutub.length > 0 && (
          <div className="p-4 border-t border-hairline-soft bg-canvas flex items-center justify-between text-body-sm text-text-muted font-[456]">
            <span>Showing {kutub.length} texts</span>
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
