import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/theme-toggle'

export default function Nav() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <Image src="/favicon.png" alt="sak" width={20} height={20} className="dark:invert" />
          <span className="font-mono font-bold text-sm tracking-tight">sak</span>
        </Link>
        <span className="ml-3 text-xs text-neutral-400 hidden sm:inline">
          swiss army knife
        </span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
