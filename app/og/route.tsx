import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'sak'
  const description = searchParams.get('description') ?? 'A no-ads Swiss army knife for the web.'
  const isHome = !searchParams.has('title')

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#ffffff',
          padding: '72px 80px 68px',
          position: 'relative',
        }}
      >
        {/* Top wordmark */}
        <div style={{ display: 'flex', marginBottom: 56 }}>
          <span
            style={{
              fontSize: 14,
              color: '#a3a3a3',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: '"Courier New", monospace',
            }}
          >
            sak
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: isHome ? 96 : 76,
            fontWeight: 700,
            color: '#0a0a0a',
            lineHeight: 1.0,
            marginBottom: 32,
            letterSpacing: '-0.025em',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: '#737373',
            lineHeight: 1.5,
            maxWidth: 760,
            flex: 1,
          }}
        >
          {description}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 15, color: '#a3a3a3' }}>
            free · no ads · no tracking
          </span>
          <span
            style={{
              fontSize: 15,
              color: '#d4d4d4',
              fontFamily: '"Courier New", monospace',
            }}
          >
            saktools.com
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#0a0a0a',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
