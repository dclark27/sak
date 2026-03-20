import Link from 'next/link'

export default function Nav() {
  return (
    <header className="border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center">
        <Link
          href="/"
          className="font-mono font-bold text-sm tracking-tight hover:opacity-70 transition-opacity"
        >
          sak
        </Link>
        <span className="ml-3 text-xs text-neutral-400 hidden sm:inline">
          swiss army knife
        </span>
      </div>
    </header>
  )
}
