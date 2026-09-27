"use client"

import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/search-params'
import { X } from 'lucide-react'

export function ActiveFilters() {
  const [category, setCategory] = useQueryState('category', searchParams.category)
  const [difficulty, setDifficulty] = useQueryState('difficulty', searchParams.difficulty)
  const [price, setPrice] = useQueryState('price', searchParams.price)
  const [q, setQ] = useQueryState('q', searchParams.q)

  const hasActiveFilters = category !== 'All' || difficulty !== null || price !== 'all' || q !== null

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-body-sm text-text-muted mr-2">Active filters:</span>
      
      {q && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft border border-hairline-soft rounded-full text-xs font-[500] text-ink">
          Search: {q}
          <button onClick={() => setQ(null)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
        </span>
      )}

      {category !== 'All' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft border border-hairline-soft rounded-full text-xs font-[500] text-ink">
          Category: {category}
          <button onClick={() => setCategory('All')} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
        </span>
      )}

      {difficulty && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft border border-hairline-soft rounded-full text-xs font-[500] text-ink capitalize">
          Difficulty: {difficulty}
          <button onClick={() => setDifficulty(null)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
        </span>
      )}

      {price !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft border border-hairline-soft rounded-full text-xs font-[500] text-ink capitalize">
          Price: {price}
          <button onClick={() => setPrice('all')} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
        </span>
      )}

      <button 
        onClick={() => {
          setCategory('All')
          setDifficulty(null)
          setPrice('all')
          setQ(null)
        }}
        className="text-xs text-text-muted hover:text-ink transition-colors ml-2 font-[500] underline decoration-hairline-soft underline-offset-4"
      >
        Clear all
      </button>
    </div>
  )
}
