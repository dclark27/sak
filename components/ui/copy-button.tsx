'use client'

import { useCopy } from '@/hooks/use-copy'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { isCopied, copy } = useCopy()
  return (
    <button
      onClick={() => copy(text)}
      className={`text-xs border border-neutral-200 dark:border-neutral-800 dark:text-neutral-300 px-2 py-0.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${className}`}
    >
      {isCopied() ? 'Copied!' : 'Copy'}
    </button>
  )
}
