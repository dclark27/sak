import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/theme-toggle'

export default function Nav() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0"
        >
          <Image src="/favicon.png" alt="sak" width={20} height={20} className="dark:invert" />
        </Link>
        <span className="text-xs text-neutral-400 hidden sm:inline shrink-0">
          swiss army knife
        </span>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
