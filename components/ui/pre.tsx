interface PreProps {
  children: React.ReactNode
  className?: string
}

export default function Pre({ children, className = '' }: PreProps) {
  return (
    <pre className={`border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-100 overflow-auto leading-5 ${className}`}>
      {children}
    </pre>
  )
}
