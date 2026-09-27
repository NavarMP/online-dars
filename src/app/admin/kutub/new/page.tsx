"use client"

import Link from "next/link"
import { KitabForm } from "@/components/admin/kitab-form"

export default function NewKitabPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/kutub" className="text-body-sm text-text-muted hover:text-ink transition-colors">Kutub Library</Link>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink">New Kitab</span>
      </div>

      <div>
        <h1 className="text-heading-3 mb-1">Add Kitab</h1>
        <p className="text-body-sm text-text-muted">Add a new classical text to the library.</p>
      </div>

      <KitabForm />
    </div>
  )
}
