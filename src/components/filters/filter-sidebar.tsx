"use client"

import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/search-params'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce' // Need to install use-debounce

interface Category {
  name: string
}

export function FilterSidebar({ categories }: { categories: Category[] }) {
  const [category, setCategory] = useQueryState('category', searchParams.category)
  const [difficulty, setDifficulty] = useQueryState('difficulty', searchParams.difficulty)
  const [price, setPrice] = useQueryState('price', searchParams.price)
  const [q, setQ] = useQueryState('q', searchParams.q)
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(q || '')

  const debouncedSetQ = useDebouncedCallback((val: string) => {
    setQ(val || null)
  }, 500)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetQ(e.target.value)
  }

  const clearAll = () => {
    setCategory('All')
    setDifficulty(null)
    setPrice('all')
    setQ(null)
    setSearchInput('')
  }

  const hasActiveFilters = category !== 'All' || difficulty !== null || price !== 'all' || q !== null

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-canvas-soft border border-hairline-soft rounded-lg text-body-sm font-[500]"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Sidebar / Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-canvas border-r border-hairline-soft transform transition-transform duration-300 lg:relative lg:transform-none lg:w-64 lg:z-auto p-6 flex flex-col h-full lg:h-auto overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h2 className="text-heading-4 font-[652]">Filters</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-canvas-soft rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full bg-canvas-soft border border-hairline-soft rounded-lg pl-9 pr-4 py-2.5 text-body-sm outline-none focus:border-ink transition-colors"
          />
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearAll}
            className="mb-6 text-sm text-ink hover:text-primary transition-colors text-left font-[500]"
          >
            Clear all filters
          </button>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-body-sm font-[600] text-ink uppercase tracking-wider mb-4">Categories</h3>
          <ul className="flex flex-col gap-1">
            <li>
              <button 
                onClick={() => setCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-md text-body-sm transition-colors ${
                  category === 'All' 
                    ? "bg-canvas-soft text-ink font-[600]" 
                    : "text-text-muted hover:bg-canvas-soft/50 hover:text-ink"
                }`}
              >
                All Categories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.name}>
                <button 
                  onClick={() => setCategory(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-md text-body-sm transition-colors ${
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

        {/* Difficulty */}
        <div className="mb-8">
          <h3 className="text-body-sm font-[600] text-ink uppercase tracking-wider mb-4">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {['beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(difficulty === lvl ? null : lvl as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-[500] capitalize transition-all border ${
                  difficulty === lvl 
                    ? "bg-ink border-ink text-canvas" 
                    : "bg-transparent border-hairline-soft text-text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-8">
          <h3 className="text-body-sm font-[600] text-ink uppercase tracking-wider mb-4">Price</h3>
          <div className="flex flex-col gap-2">
            {[
              { value: 'all', label: 'All Courses' },
              { value: 'free', label: 'Free' },
              { value: 'paid', label: 'Premium' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  price === option.value ? 'border-primary' : 'border-hairline-soft group-hover:border-ink'
                }`}>
                  {price === option.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className={`text-body-sm transition-colors ${
                  price === option.value ? 'text-ink font-[500]' : 'text-text-muted group-hover:text-ink'
                }`}>
                  {option.label}
                </span>
                {/* Invisible input to make it semantically correct if needed, or just onClick wrapper */}
                <input 
                  type="radio" 
                  name="price" 
                  value={option.value} 
                  checked={price === option.value}
                  onChange={() => setPrice(option.value as any)}
                  className="hidden" 
                />
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
