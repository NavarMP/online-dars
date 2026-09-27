"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { deleteKitab } from "@/app/actions/admin"
import { toast } from "sonner"

export function DeleteKitabButton({ id, title }: { id: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteKitab(id)
    
    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success("Kitab deleted successfully!")
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-text-muted hover:text-[#ef4444] hover:bg-canvas rounded-sm transition-colors disabled:opacity-50" 
      title="Delete Kitab"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
