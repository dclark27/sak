'use client'

import { useState, useMemo } from 'react'
import { diffLines, type Change } from 'diff'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'

export default function TextDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [changesOnly, setChangesOnly] = useState(false)

  const diff = useMemo<Change[]>(() => {
    if (!left && !right) return []
    return diffLines(left, right)
  }, [left, right])

  const { added, removed } = useMemo(() => {
    let added = 0, removed = 0
    for (const c of diff) {
      if (c.added) added += c.count ?? 0
      else if (c.removed) removed += c.count ?? 0
    }
    return { added, removed }
  }, [diff])

  const hasChanges = added > 0 || removed > 0

  const visibleDiff = changesOnly ? diff.filter((c) => c.added || c.removed) : diff

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Original</label>
          <Textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full h-48 text-sm resize-y"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Changed</label>
          <Textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste changed text here..."
            className="w-full h-48 text-sm resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {diff.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              {hasChanges ? (
                <>
                  <span className="text-green-700">+{added} lines</span>
                  <span className="text-red-700">-{removed} lines</span>
                </>
              ) : (
                <span className="text-neutral-400">No differences</span>
              )}
            </div>
            {hasChanges && (
              <Button
                onClick={() => setChangesOnly((v) => !v)}
                className="text-xs px-2 py-1"
              >
                {changesOnly ? 'Show all lines' : 'Changes only'}
              </Button>
            )}
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 overflow-auto">
            <pre className="text-xs font-mono leading-5">
              {visibleDiff.map((part, i) => (
                <div
                  key={i}
                  className={part.added ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300' : part.removed ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300' : 'text-neutral-600 dark:text-neutral-400'}
                >
                  {part.value.replace(/\n$/, '').split('\n').map((line, j) => (
                    <div key={j} className="px-3 flex">
                      <span className="w-4 mr-3 select-none opacity-50">
                        {part.added ? '+' : part.removed ? '-' : ' '}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}

      {!left && !right && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
          Paste text into both boxes to see the diff.
        </p>
      )}
    </div>
  )
}
