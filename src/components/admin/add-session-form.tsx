"use client"

import { useActionState, useRef } from "react"
import { createSession } from "@/app/actions/course-management"

export function AddSessionForm({ courseId }: { courseId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createSession(formData)
      if (result?.success) {
        formRef.current?.reset()
      }
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <form ref={formRef} action={formAction} className="bg-canvas border border-hairline rounded-sm p-4 flex flex-col gap-4">
      {state?.error && <div className="text-[#ef4444] text-body-sm">{state.error}</div>}
      
      <input type="hidden" name="course_id" value={courseId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="title">Session Title</label>
          <input 
            id="title" name="title" type="text" required 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
            placeholder="e.g. Introduction to Kitab"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="session_order">Order (Number)</label>
          <input 
            id="session_order" name="session_order" type="number" defaultValue="1" required 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-label text-ink font-[600]" htmlFor="video_url">Video URL</label>
        <input 
          id="video_url" name="video_url" type="url" 
          className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
          placeholder="e.g. https://vimeo.com/..."
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="component-button-primary disabled:opacity-50 px-4 py-2 h-auto text-body-sm rounded-sm">
          {isPending ? "Adding..." : "Add Session"}
        </button>
      </div>
    </form>
  )
}
