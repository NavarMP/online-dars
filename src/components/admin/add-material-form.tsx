"use client"

import { useActionState, useRef } from "react"
import { createMaterial } from "@/app/actions/course-management"

export function AddMaterialForm({ courseId, sessions }: { courseId: string, sessions: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createMaterial(formData)
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
          <label className="text-label text-ink font-[600]" htmlFor="title">Material Title</label>
          <input 
            id="title" name="title" type="text" required 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
            placeholder="e.g. Chapter 1 Notes"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="type">File Type</label>
          <select 
            id="type" name="type" required 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
          >
            <option value="pdf">PDF Document</option>
            <option value="link">External Link</option>
            <option value="audio">Audio File</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="file_url">File URL</label>
          <input 
            id="file_url" name="file_url" type="url" required
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
            placeholder="https://..."
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="session_id">Link to Session (Optional)</label>
          <select 
            id="session_id" name="session_id" 
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink"
          >
            <option value="">Course-wide Material</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="component-button-outline disabled:opacity-50 px-4 py-2 h-auto text-body-sm rounded-sm">
          {isPending ? "Adding..." : "Add Material"}
        </button>
      </div>
    </form>
  )
}
