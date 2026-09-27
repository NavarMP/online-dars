"use client"

import { useActionState } from "react"
import Link from "next/link"
import { createCourse, updateCourse } from "@/app/actions/admin"
import { ImageUploader } from "@/components/admin/media/image-uploader"
import { useState } from "react"

type CourseFormProps = {
  instructors: any[]
  kutub: any[]
  course?: any
}

export function CourseForm({ instructors, kutub, course }: CourseFormProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url || "")

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (thumbnailUrl) {
        formData.set("thumbnail_url", thumbnailUrl)
      }
      
      const result = course 
        ? await updateCourse(course.id, formData)
        : await createCourse(formData)
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <form action={formAction} className="flex flex-col gap-12 max-w-5xl">
      {state?.error && (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-4 rounded-sm text-body-sm font-[600] border border-[#ef4444]/20">
          {state.error}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-heading-4 font-[652] text-ink mb-2">Basic Information</h2>
          <p className="text-body-sm text-text-muted font-[456]">The core details of the course that will be displayed to students.</p>
        </div>
        <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="title">Course Title</label>
            <input 
              id="title" name="title" type="text" required defaultValue={course?.title || ""}
              className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
              placeholder="e.g. Fiqh Al-Akbar Mastery"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="description">Description</label>
            <textarea 
              id="description" name="description" required rows={5} defaultValue={course?.description || ""}
              className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors resize-none font-[456]"
              placeholder="Provide a comprehensive description of the course content..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Course Thumbnail</label>
            <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
            <ImageUploader 
              defaultImage={course?.thumbnail_url} 
              onUploadSuccess={(url) => setThumbnailUrl(url)} 
            />
          </div>
        </div>
      </div>

      {/* Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-heading-4 font-[652] text-ink mb-2">Curriculum Links</h2>
          <p className="text-body-sm text-text-muted font-[456]">Connect this course to an instructor and a foundational text (Kitab).</p>
        </div>
        <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="instructor_id">Instructor</label>
              <select 
                id="instructor_id" name="instructor_id" defaultValue={course?.instructor_id || ""}
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
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
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="kutub_id">Kitab / Core Text</label>
              <select 
                id="kutub_id" name="kutub_id" defaultValue={course?.kutub_id || ""}
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
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
        </div>
      </div>

      {/* Pricing & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-heading-4 font-[652] text-ink mb-2">Publishing</h2>
          <p className="text-body-sm text-text-muted font-[456]">Set the availability and pricing for this course.</p>
        </div>
        <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="status">Status</label>
              <select 
                id="status" name="status" defaultValue={course?.status || "draft"}
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider" htmlFor="price">Price (USD)</label>
              <input 
                id="price" name="price" type="number" step="0.01" min="0" defaultValue={course?.price || 0}
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-canvas-soft border border-hairline-soft rounded-sm">
            <input type="checkbox" id="is_free" name="is_free" value="true" defaultChecked={course ? course.is_free : true} className="w-5 h-5 accent-ink rounded-sm" />
            <div className="flex flex-col">
              <label className="text-body-sm font-[600] text-ink cursor-pointer" htmlFor="is_free">Free Course</label>
              <span className="text-caption text-text-muted">If checked, the course will be free to enroll regardless of the price set above.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-8 border-t border-hairline-soft mt-8">
        <Link href={course ? `/admin/courses/${course.id}` : "/admin/courses"} className="px-6 py-3 text-body-sm font-[600] text-ink hover:bg-canvas-soft rounded-full transition-colors border border-hairline-soft">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="component-button-primary disabled:opacity-50 px-8 py-3 text-body-sm rounded-full">
          {isPending ? (course ? "Saving..." : "Creating...") : (course ? "Save Changes" : "Create Course")}
        </button>
      </div>
    </form>
  )
}
