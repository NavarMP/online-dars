"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, BookOpen, Users, Settings, GraduationCap, TrendingUp, Plus } from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    
    const openMenu = () => setOpen(true)
    document.addEventListener("open-command-menu", openMenu)
    
    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("open-command-menu", openMenu)
    }
  }, [])

  const runCommand = (command: () => unknown) => {
    setOpen(false)
    command()
  }

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] sm:pt-[20vh] outline-none"
    >
      <Command className="w-full max-w-xl bg-canvas border border-hairline-soft rounded-lg shadow-2xl overflow-hidden flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-hairline-soft gap-3">
          <Search className="w-5 h-5 text-text-muted" />
          <Command.Input 
            placeholder="Search for courses, students, settings..." 
            className="flex-1 bg-transparent border-none outline-none text-body-sm font-[500] placeholder:text-text-muted"
          />
          <div className="flex items-center gap-1">
            <kbd className="bg-canvas-soft px-1.5 py-0.5 rounded-sm text-[10px] text-text-muted font-mono font-bold">ESC</kbd>
          </div>
        </div>
        
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="p-6 text-center text-body-sm text-text-muted">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-caption font-[600] text-text-muted p-2 uppercase tracking-wider">
            <Command.Item onSelect={() => runCommand(() => router.push("/admin"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <TrendingUp className="w-4 h-4 text-text-muted" /> Dashboard
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/courses"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <BookOpen className="w-4 h-4 text-text-muted" /> Courses
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/students"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <Users className="w-4 h-4 text-text-muted" /> Students
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/settings"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <Settings className="w-4 h-4 text-text-muted" /> Settings
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Quick Actions" className="text-caption font-[600] text-text-muted p-2 uppercase tracking-wider mt-2 border-t border-hairline-soft pt-4">
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/courses/new"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <Plus className="w-4 h-4 text-text-muted" /> Create new course
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/kutub/new"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <BookOpen className="w-4 h-4 text-text-muted" /> Add new kitab
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/admin/instructors/new"))} className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-canvas-soft cursor-pointer aria-selected:bg-canvas-soft aria-selected:text-ink text-body-sm font-[500] text-ink transition-colors">
              <GraduationCap className="w-4 h-4 text-text-muted" /> Add new instructor
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </Command.Dialog>
  )
}
