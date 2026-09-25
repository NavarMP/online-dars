import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function AdminInstructorsPage() {
  const supabase = await createClient()
  
  const { data: instructors, error } = await supabase
    .from("instructors")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-3 mb-1">Instructors</h1>
          <p className="text-body-sm text-text-muted">Manage the Usthads and instructors on the platform.</p>
        </div>
        <Link href="/admin/instructors/new" className="component-button-primary px-4 py-2 text-body-sm h-auto rounded-sm">
          Add Instructor
        </Link>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-soft">
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Instructor</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Bio</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-body-sm text-[#ef4444]">
                  Failed to load instructors: {error.message}
                </td>
              </tr>
            ) : instructors?.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-body-sm text-text-muted">
                  No instructors found. Add an instructor.
                </td>
              </tr>
            ) : (
              instructors?.map((instructor) => (
                <tr key={instructor.id} className="border-b border-hairline last:border-0 hover:bg-canvas-soft/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-canvas-soft border border-hairline">
                        {instructor.image_url ? (
                          <Image src={instructor.image_url} alt={instructor.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-body-sm text-text-muted">
                            {instructor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-body-sm font-medium text-ink">{instructor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-sm text-text-muted max-w-xs truncate">
                    {instructor.bio}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/instructors/${instructor.id}/edit`} className="text-body-sm text-text-muted hover:text-ink transition-colors">
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
