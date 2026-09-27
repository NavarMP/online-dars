import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { KitabForm } from "@/components/admin/kitab-form"

export default async function EditKitabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: kitab, error } = await supabase
    .from("kutub")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !kitab) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/kutub" className="text-body-sm text-text-muted hover:text-ink transition-colors">Kutub Library</Link>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink truncate max-w-[200px]">{kitab.title}</span>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink">Edit</span>
      </div>

      <div>
        <h1 className="text-heading-3 mb-1">Edit Kitab</h1>
        <p className="text-body-sm text-text-muted">Update the details of this classical text.</p>
      </div>

      <KitabForm kitab={kitab} />
    </div>
  )
}
