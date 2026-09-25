"use client"

import { useActionState } from "react"
import Link from "next/link"
import { createInstructor } from "@/app/actions/admin"

export default function NewInstructorPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createInstructor(formData)
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/instructors" className="text-body-sm text-text-muted hover:text-ink transition-colors">Instructors</Link>
        <span className="text-caption text-text-muted">/</span>
        <span className="text-body-sm text-ink">New</span>
      </div>

      <div>
        <h1 className="text-heading-3 mb-1">Add Instructor</h1>
        <p className="text-body-sm text-text-muted">Add a new Usthad to the platform.</p>
      </div>

      <form action={formAction} className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm flex flex-col gap-6">
        {state?.error && (
          <div className="bg-[#ef4444]/10 text-[#ef4444] p-3 rounded-sm text-body-sm">
            {state.error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="name">Full Name</label>
          <input 
            id="name" name="name" type="text" required 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
            placeholder="e.g. Usthad C K Abdurahman Faizy"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="bio">Biography</label>
          <textarea 
            id="bio" name="bio" required rows={5}
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors resize-none"
            placeholder="Detailed biography and credentials..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="image_url">Image URL</label>
          <input 
            id="image_url" name="image_url" type="url"
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-caption text-text-muted mt-1">Leave empty if uploading is not configured yet.</p>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-end gap-3">
          <Link href="/admin/instructors" className="px-4 py-2 text-body-sm text-ink hover:bg-canvas-soft rounded-sm transition-colors border border-hairline">
            Cancel
          </Link>
          <button type="submit" disabled={isPending} className="component-button-primary disabled:opacity-50 px-6 py-2 h-auto text-body-sm rounded-sm">
            {isPending ? "Saving..." : "Add Instructor"}
          </button>
        </div>
      </form>
    </div>
  )
}
