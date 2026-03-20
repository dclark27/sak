'use client'

import { useState, useMemo } from 'react'
import { useCopy } from '@/hooks/use-copy'

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  try {
    return decodeURIComponent(
      atob(padded).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
  } catch {
    return atob(padded)
  }
}

function tryParse(str: string): unknown {
  try { return JSON.parse(str) } catch { return str }
}

type Section = { label: string; raw: string; parsed: unknown }
type Status = 'idle' | 'valid' | 'error'

const PART_COLORS = ['text-pink-600', 'text-purple-600', 'text-sky-600'] as const

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const { isCopied, copy } = useCopy()

  const result = useMemo<{ status: Status; sections: Section[]; error?: string; expired?: boolean }>(() => {
    const t = token.trim()
    if (!t) return { status: 'idle', sections: [] }
    const parts = t.split('.')
    if (parts.length !== 3) return { status: 'error', sections: [], error: 'JWT must have exactly 3 parts separated by dots.' }
    try {
      const [headerRaw, payloadRaw, signatureRaw] = parts
      const headerStr = base64urlDecode(headerRaw)
      const payloadStr = base64urlDecode(payloadRaw)
      const headerParsed = tryParse(headerStr)
      const payloadParsed = tryParse(payloadStr)
      const payload = payloadParsed as Record<string, unknown>
      const expired = typeof payload?.exp === 'number' ? payload.exp * 1000 < Date.now() : undefined
      return {
        status: 'valid',
        expired,
        sections: [
          { label: 'Header', raw: headerStr, parsed: headerParsed },
          { label: 'Payload', raw: payloadStr, parsed: payloadParsed },
          { label: 'Signature', raw: signatureRaw, parsed: signatureRaw },
        ],
      }
    } catch (e) {
      return { status: 'error', sections: [], error: (e as Error).message }
    }
  }, [token])

  const tokenParts = token.trim().split('.')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0..."
          className="w-full h-28 font-mono text-xs border border-neutral-200 px-3 py-2 resize-none focus:outline-none focus:border-neutral-400 break-all"
          spellCheck={false}
        />
      </div>

      {token.trim() && result.status === 'valid' && (
        <div className="font-mono text-xs break-all border border-neutral-200 p-3 bg-neutral-50 leading-6">
          {tokenParts.map((part, i) => (
            <span key={i}>
              <span className={PART_COLORS[i]}>{part}</span>
              {i < 2 && <span className="text-neutral-400">.</span>}
            </span>
          ))}
        </div>
      )}

      {result.status === 'error' && (
        <p className="text-xs text-red-600 font-mono">{result.error}</p>
      )}

      {result.status === 'valid' && (
        <div className="space-y-3">
          {typeof result.expired === 'boolean' && (
            <div className={`text-xs font-mono px-3 py-2 border ${result.expired ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
              {result.expired ? '✗ Token is expired' : '✓ Token is not expired'}
            </div>
          )}

          {result.sections.map((section, i) => {
            const content = section.label === 'Signature' ? section.raw : JSON.stringify(section.parsed, null, 2)
            return (
              <div key={section.label}>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-medium ${PART_COLORS[i]}`}>{section.label}</label>
                  <button
                    onClick={() => copy(content as string, section.label)}
                    className="text-xs border border-neutral-200 px-2 py-0.5 hover:bg-neutral-50 transition-colors"
                  >
                    {isCopied(section.label) ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="border border-neutral-200 px-3 py-2 text-xs font-mono bg-neutral-50 overflow-auto leading-5">
                  {content}
                </pre>
              </div>
            )
          })}
        </div>
      )}

      {result.status === 'idle' && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Paste a JWT above to decode it. Decoding happens entirely in your browser.
        </p>
      )}
    </div>
  )
}
