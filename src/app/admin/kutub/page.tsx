import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function AdminKutubPage() {
  const supabase = await createClient()
  
  const { data: kutub, error } = await supabase
    .from("kutub")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-3 mb-1">Kutub Library</h1>
          <p className="text-body-sm text-text-muted">Manage the classical texts available on the platform.</p>
        </div>
        <Link href="/admin/kutub/new" className="component-button-primary px-4 py-2 text-body-sm h-auto rounded-sm">
          Add Kitab
        </Link>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-soft">
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Title</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Arabic Title</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Category</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-body-sm text-[#ef4444]">
                  Failed to load kutub: {error.message}
                </td>
              </tr>
            ) : kutub?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-body-sm text-text-muted">
                  No kutub found. Add your first classical text.
                </td>
              </tr>
            ) : (
              kutub?.map((kitab) => (
                <tr key={kitab.id} className="border-b border-hairline last:border-0 hover:bg-canvas-soft/50 transition-colors">
                  <td className="px-6 py-4 text-body-sm font-medium text-ink">{kitab.title}</td>
                  <td className="px-6 py-4 text-body-sm text-ink font-arabic" dir="rtl">{kitab.arabic_title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-canvas-soft border border-hairline text-ink text-xs px-2 py-1 rounded-sm">
                      {kitab.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/kutub/${kitab.id}/edit`} className="text-body-sm text-text-muted hover:text-ink transition-colors">
                      Edit
                    </Link>
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
