import type { Metadata } from 'next'
import { TOOLS } from './tools'

export function toolMetadata(slug: string): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug)!
  const ogUrl = `/og?title=${encodeURIComponent(tool.name)}&description=${encodeURIComponent(tool.description)}`

  return {
    title: tool.name,
    description: `${tool.description} Free, no ads, no tracking.`,
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
