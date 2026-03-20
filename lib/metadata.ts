import type { Metadata } from 'next'
import { TOOLS } from './tools'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saktools.com'

export function toolMetadata(slug: string): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug)!
  const ogUrl = `/og?title=${encodeURIComponent(tool.name)}&description=${encodeURIComponent(tool.description)}`

  return {
    title: tool.name,
    description: `${tool.description} Free, no ads, no tracking.`,
    alternates: {
      canonical: `${BASE_URL}/tools/${slug}`,
    },
    openGraph: {
      title: tool.name,
      description: tool.description,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: tool.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.description,
      images: [ogUrl],
    },
  }
}
