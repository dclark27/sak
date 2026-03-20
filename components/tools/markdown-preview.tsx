'use client'

import { useState, useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import TabButton from '@/components/ui/tab-button'
import Textarea from '@/components/ui/textarea'

const PLACEHOLDER = `# Hello, Markdown

Write some **bold**, _italic_, or \`inline code\` here.

## Lists

- Item one
- Item two
  - Nested item

## Code block

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`
\`\`\`

> Blockquotes work too.

[Links](https://example.com) and ~~strikethrough~~ as well.
`

export default function MarkdownPreview() {
  const [source, setSource] = useState(PLACEHOLDER)
  const [view, setView] = useState<'split' | 'preview'>('split')

  const html = useMemo(() => {
    const raw = marked.parse(source, { async: false }) as string
    return DOMPurify.sanitize(raw)
  }, [source])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <TabButton active={view === 'split'} onClick={() => setView('split')}>Split</TabButton>
        <TabButton active={view === 'preview'} onClick={() => setView('preview')}>Preview</TabButton>
      </div>

      <div className={`grid gap-3 ${view === 'split' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {view === 'split' && (
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Markdown</label>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-[calc(100vh-280px)] min-h-64 text-sm resize-none leading-6"
              spellCheck={false}
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Preview</label>
          <div
            className="border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 p-4 h-[calc(100vh-280px)] min-h-64 overflow-auto prose prose-sm prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
