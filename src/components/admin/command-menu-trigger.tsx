"use client"

import { Search } from "lucide-react"

export function CommandMenuTrigger() {
  return (
    <div 
      onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))}
      className="hidden sm:flex items-center gap-2 bg-field border border-hairline-soft rounded-sm px-3 py-1.5 text-text-muted hover:text-ink transition-colors cursor-pointer select-none"
    >
      <Search className="w-4 h-4" />
      <span className="text-body-sm">Search...</span>
      <kbd className="ml-4 bg-canvas-soft border border-hairline-soft px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold text-text-muted">⌘K</kbd>
    </div>
  )
}
