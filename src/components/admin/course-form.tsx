"use client"

import { useActionState } from "react"
import Link from "next/link"
import { createCourse } from "@/app/actions/admin"

type CourseFormProps = {
  instructors: any[]
  kutub: any[]
}

export function CourseForm({ instructors, kutub }: CourseFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createCourse(formData)
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <form action={formAction} className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm flex flex-col gap-6">
      {state?.error && (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-3 rounded-sm text-body-sm">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-label text-ink font-[600]" htmlFor="title">Course Title</label>
        <input 
          id="title" name="title" type="text" required 
          className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
          placeholder="e.g. Fiqh Al-Akbar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="instructor_id">Instructor</label>
          <select 
            id="instructor_id" name="instructor_id"
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
          >
            <option value="">Select Instructor (Optional)</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="kutub_id">Kitab / Core Text</label>
          <select 
            id="kutub_id" name="kutub_id"
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
          >
            <option value="">Select Kitab (Optional)</option>
            {kutub.map((kitab) => (
              <option key={kitab.id} value={kitab.id}>
                {kitab.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-label text-ink font-[600]" htmlFor="description">Description</label>
        <textarea 
          id="description" name="description" required rows={4}
          className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors resize-none"
          placeholder="Detailed course description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="price">Price (USD)</label>
          <input 
            id="price" name="price" type="number" step="0.01" min="0" defaultValue="0"
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="status">Status</label>
          <select 
            id="status" name="status" defaultValue="draft"
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_free" name="is_free" value="true" defaultChecked className="w-4 h-4" />
        <label className="text-body-sm text-ink" htmlFor="is_free">This course is free</label>
      </div>

      <div className="pt-4 border-t border-hairline flex justify-end gap-3">
        <Link href="/admin/courses" className="px-4 py-2 text-body-sm text-ink hover:bg-canvas-soft rounded-sm transition-colors border border-hairline">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="component-button-primary disabled:opacity-50 px-6 py-2 h-auto text-body-sm rounded-sm">
          {isPending ? "Saving..." : "Create Course"}
        </button>
      </div>
    </form>
  )
}
