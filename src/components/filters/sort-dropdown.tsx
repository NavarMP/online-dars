"use client"

import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/search-params'
import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SortOption {
  value: string
  label: string
}

export function SortDropdown({ options }: { options: SortOption[] }) {
  const [sort, setSort] = useQueryState('sort', searchParams.sort)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeOption = options.find((o) => o.value === sort) || options[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-canvas-soft border border-hairline-soft rounded-lg text-body-sm font-[500] hover:bg-canvas transition-colors"
      >
        <span>Sort by: <span className="text-ink">{activeOption.label}</span></span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-canvas border border-hairline-soft rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSort(option.value as any)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-body-sm hover:bg-canvas-soft transition-colors flex items-center justify-between group"
            >
              <span className={sort === option.value ? "text-ink font-[600]" : "text-text-muted group-hover:text-ink"}>
                {option.label}
              </span>
              {sort === option.value && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
