import Link from 'next/link'
import type { Tool } from '@/lib/tools'

const CATEGORY_LABELS: Record<string, string> = {
  text: 'Text',
  code: 'Code',
  data: 'Data',
  media: 'Media',
  convert: 'Convert',
}

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="block border border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium text-sm">{tool.name}</h2>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono shrink-0">
          {CATEGORY_LABELS[tool.category]}
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 leading-snug">
        {tool.description}
      </p>
    </Link>
  )
}
