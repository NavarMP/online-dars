"use client"

import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/search-params'
import { Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'

interface Category {
  name: string
}

export function LibrarySidebar({ categories }: { categories: Category[] }) {
  const [category, setCategory] = useQueryState('category', searchParams.category)
  const [q, setQ] = useQueryState('q', searchParams.q)
  
  const [searchInput, setSearchInput] = useState(q || '')

  const debouncedSetQ = useDebouncedCallback((val: string) => {
    setQ(val || null)
  }, 500)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetQ(e.target.value)
  }

  return (
    <div className="sticky top-32">
      {/* Search Box */}
      <div className="mb-8 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search library..." 
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full bg-canvas-soft border border-hairline-soft rounded-sm pl-9 pr-4 py-2 text-body-sm outline-none focus:border-ink transition-colors"
        />
      </div>

      <h2 className="text-body-sm font-[600] text-ink uppercase tracking-wider mb-4">Categories</h2>
      <ul className="flex flex-col gap-1">
        <li>
          <button 
            onClick={() => setCategory('All')}
            className={`w-full text-left px-3 py-2 rounded-sm text-body-sm transition-colors ${
              category === 'All' 
                ? "bg-canvas-soft text-ink font-[600]" 
                : "text-text-muted hover:bg-canvas-soft/50 hover:text-ink"
            }`}
          >
            All Texts
          </button>
        </li>
        {categories?.map((cat) => (
          <li key={cat.name}>
            <button 
              onClick={() => setCategory(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-sm text-body-sm transition-colors ${
                category === cat.name 
                  ? "bg-canvas-soft text-ink font-[600]" 
                  : "text-text-muted hover:bg-canvas-soft/50 hover:text-ink"
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
