"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { createKitab, updateKitab } from "@/app/actions/admin"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface KitabFormProps {
  kitab?: any
}

export function KitabForm({ kitab }: KitabFormProps) {
  const [categories, setCategories] = useState<{name: string}[]>([])
  
  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('kutub_categories').select('name').order('name')
      if (data) {
        setCategories(data)
      }
    }
    fetchCategories()
  }, [])

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = kitab
        ? await updateKitab(kitab.id, formData)
        : await createKitab(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`Kitab ${kitab ? 'updated' : 'created'} successfully!`)
      }
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <form action={formAction} className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm flex flex-col gap-6">
      {state?.error && (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-3 rounded-sm text-body-sm font-[600]">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="title">Title (English)</label>
          <input 
            id="title" name="title" type="text" required defaultValue={kitab?.title || ""}
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
            placeholder="e.g. Fat'h al-Mu'in"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-label text-ink font-[600]" htmlFor="arabic_title">Title (Arabic)</label>
          <input 
            id="arabic_title" name="arabic_title" type="text" required dir="rtl" defaultValue={kitab?.arabic_title || ""}
            className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors font-serif text-lg"
            placeholder="e.g. فتح المعين"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-label text-ink font-[600]" htmlFor="category">Category</label>
          <Link href="/admin/categories" className="text-xs text-text-muted hover:text-ink transition-colors underline">
            Manage Categories
          </Link>
        </div>
        <select 
          id="category" name="category" required defaultValue={kitab?.category || ""}
          className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors appearance-none font-[456]"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat.name}>{cat.name}</option>
          ))}
          {/* Fallback if the saved category is not in the list */}
          {kitab?.category && !categories.find(c => c.name === kitab.category) && (
            <option value={kitab.category}>{kitab.category}</option>
          )}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-label text-ink font-[600]" htmlFor="description">Description</label>
        <textarea 
          id="description" name="description" required rows={4} defaultValue={kitab?.description || ""}
          className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors resize-none font-[456]"
          placeholder="Detailed description of the book..."
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_featured" name="is_featured" value="true" defaultChecked={kitab ? kitab.is_featured : false} className="w-4 h-4 accent-ink" />
        <label className="text-body-sm font-[600] text-ink" htmlFor="is_featured">Feature on Home Page</label>
      </div>

      <div className="pt-4 border-t border-hairline flex justify-end gap-3">
        <Link href="/admin/kutub" className="px-4 py-2 text-body-sm text-ink font-[600] hover:bg-canvas-soft rounded-sm transition-colors border border-hairline">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="component-button-primary disabled:opacity-50 px-6 py-2 h-auto text-body-sm rounded-sm">
          {isPending ? "Saving..." : (kitab ? "Save Changes" : "Add Kitab")}
        </button>
      </div>
    </form>
  )
}
