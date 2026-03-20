import type { Metadata } from 'next'
import ToolSearch from '@/components/tool-search'

export const metadata: Metadata = {
  title: {
    absolute: 'sak – swiss army knife for the web',
  },
  description: 'Fast, free, ad-free web tools. Text diff, JSON formatter, scratchpad, and more. No sign-up, no tracking, no nonsense.',
  openGraph: {
    title: 'sak – swiss army knife for the web',
    description: 'Fast, free, ad-free web tools. No sign-up, no tracking, no nonsense.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'sak – swiss army knife for the web' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sak – swiss army knife for the web',
    description: 'Fast, free, ad-free web tools. No sign-up, no tracking, no nonsense.',
    images: ['/og'],
  },
}

export default function HomePage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono">sak</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A no-ads Swiss army knife for the web.{' '}
          <span className="text-neutral-400">Fast. Simple. Free.</span>
        </p>
      </div>
      <ToolSearch />
      <footer className="mt-16 pt-6 border-t border-neutral-100 text-xs text-neutral-400">
        Free, open source, no ads, no tracking.
      </footer>
    </main>
  )
}
