import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolSearch from '@/components/tool-search'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saktools.com'

export const metadata: Metadata = {
  alternates: {
    canonical: BASE_URL,
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'sak',
    url: BASE_URL,
    description: 'Fast, free, ad-free web tools. No sign-up, no tracking, no nonsense.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono">sak</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A no-ads Swiss army knife for the web.
        </p>
      </div>
      <Suspense>
        <ToolSearch />
      </Suspense>
      <footer className="mt-16 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400 dark:text-neutral-500">
        Free, open source, no ads, no tracking.
      </footer>
    </main>
  )
}
