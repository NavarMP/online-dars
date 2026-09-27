"use client"

import { useState } from "react"
import { Archive, ArchiveRestore } from "lucide-react"
import { toggleCourseArchive } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

export function ArchiveCourseButton({ id, isArchived }: { id: string, isArchived: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const { error } = await toggleCourseArchive(id, !isArchived)
    if (error) {
      alert("Error: " + error)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 text-text-muted hover:text-ink hover:bg-canvas rounded-sm transition-colors ${loading ? 'opacity-50' : ''}`}
      title={isArchived ? "Unarchive Course" : "Archive Course"}
    >
      {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
    </button>
  )
}
