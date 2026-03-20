'use client'

import { useState, useMemo } from 'react'
import { TOOLS, CATEGORIES, type Category } from '@/lib/tools'
import ToolCard from '@/components/tool-card'

export default function ToolSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return TOOLS.filter((tool) => {
      const matchesCategory = category === 'all' || tool.category === category
      if (!matchesCategory) return false
      if (!q) return true
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.includes(q))
      )
    })
  }, [query, category])

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="flex-1 border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 font-mono"
          autoComplete="off"
        />
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`text-xs px-3 py-2 border transition-colors ${
                category === cat.value
                  ? 'bg-black text-white border-black'
                  : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-neutral-400">
          No tools match &ldquo;{query}&rdquo;
          <button
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
            className="ml-2 underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
