import type { Metadata } from 'next'
import { Figtree, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/nav'
import ThemeProvider from '@/components/theme-provider'
import './globals.css'

const geistSans = Figtree({
  variable: '--font-figtree-sans',
  subsets: ['latin'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saktools.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s – sak',
    default: 'sak – swiss army knife for the web',
  },
  description: 'Fast, free, ad-free web tools. No sign-up, no tracking, no nonsense.',
  openGraph: {
    siteName: 'sak',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'sak – swiss army knife for the web' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og'],
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
