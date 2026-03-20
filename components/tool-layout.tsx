import Link from 'next/link'

interface ToolLayoutProps {
  name: string
  description: string
  children: React.ReactNode
}

export default function ToolLayout({ name, description, children }: ToolLayoutProps) {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-mono"
        >
          ← sak
        </Link>
        <h1 className="mt-2 text-lg font-semibold">{name}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
      </div>
      {children}
    </main>
  )
}
