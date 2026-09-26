"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({ name: "", description: "" })

  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kutub_categories').select('*').order('name')
    if (error) setError(error.message)
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async () => {
    if (!formData.name) return
    
    if (editingId) {
      const { error } = await supabase
        .from('kutub_categories')
        .update({ name: formData.name, description: formData.description })
        .eq('id', editingId)
      
      if (error) {
        setError(error.message)
      } else {
        setEditingId(null)
        setFormData({ name: "", description: "" })
        fetchCategories()
      }
    } else {
      const { error } = await supabase
        .from('kutub_categories')
        .insert([{ name: formData.name, description: formData.description }])
      
      if (error) {
        setError(error.message)
      } else {
        setIsAdding(false)
        setFormData({ name: "", description: "" })
        fetchCategories()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    const { error } = await supabase
      .from('kutub_categories')
      .delete()
      .eq('id', id)
      
    if (error) {
      alert("Failed to delete: " + error.message)
    } else {
      fetchCategories()
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-3 mb-1">Categories</h1>
          <p className="text-body-sm text-text-muted">Manage categories for Kutub (Classical Texts).</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            setFormData({ name: "", description: "" })
          }}
          className="component-button-primary px-4 py-2 text-body-sm h-auto rounded-sm"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-3 rounded-sm text-body-sm">
          {error}
        </div>
      )}

      {(isAdding || editingId) && (
        <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-body font-semibold">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-label text-ink font-[600]">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
              placeholder="e.g. Fiqh"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-label text-ink font-[600]">Description (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors resize-none"
              placeholder="Description of the category..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
              }}
              className="px-4 py-2 text-body-sm text-ink hover:bg-canvas-soft rounded-sm transition-colors border border-hairline"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="component-button-primary px-6 py-2 h-auto text-body-sm rounded-sm"
            >
              Save Category
            </button>
          </div>
        </div>
      )}

      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-soft">
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Name</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600]">Description</th>
              <th className="px-6 py-4 text-label text-text-muted font-[600] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-body-sm text-text-muted">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-body-sm text-text-muted">
                  No categories found. Create one above.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-hairline last:border-0 hover:bg-canvas-soft/50 transition-colors">
                  <td className="px-6 py-4 text-body-sm font-medium text-ink">{cat.name}</td>
                  <td className="px-6 py-4 text-body-sm text-text-muted truncate max-w-[300px]">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setEditingId(cat.id)
                        setFormData({ name: cat.name, description: cat.description || "" })
                        setIsAdding(false)
                      }}
                      className="text-body-sm text-ink hover:underline transition-colors mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="text-body-sm text-[#ef4444] hover:underline transition-colors"
                    >
                      Delete
                    </button>
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
