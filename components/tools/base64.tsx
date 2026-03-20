'use client'

import { useState } from 'react'
import TabButton from '@/components/ui/tab-button'
import Textarea from '@/components/ui/textarea'
import CopyButton from '@/components/ui/copy-button'

type Mode = 'encode' | 'decode'

function encode(text: string, urlSafe: boolean): string {
  const b64 = btoa(unescape(encodeURIComponent(text)))
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : b64
}

function decode(b64: string): { result: string; error?: string } {
  try {
    const normalized = b64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    return { result: decodeURIComponent(escape(atob(padded))) }
  } catch {
    return { result: '', error: 'Invalid Base64 string.' }
  }
}

export default function Base64() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)

  const output = input
    ? mode === 'encode'
      ? { result: encode(input, urlSafe) }
      : decode(input)
    : null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <TabButton active={mode === 'encode'} onClick={() => { setMode('encode'); setInput('') }}>Encode</TabButton>
          <TabButton active={mode === 'decode'} onClick={() => { setMode('decode'); setInput('') }}>Decode</TabButton>
        </div>
        {mode === 'encode' && (
          <label className="flex items-center gap-2 text-xs text-neutral-500 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="accent-black"
            />
            URL-safe (no <code className="font-mono">+/=</code>)
          </label>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          {mode === 'encode' ? 'Plain text' : 'Base64 string'}
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Hello, world!' : 'SGVsbG8sIHdvcmxkIQ=='}
          className="w-full h-36 text-sm resize-y"
          spellCheck={false}
          autoFocus
        />
      </div>

      {output && (
        <div>
          {output.error ? (
            <p className="text-xs text-red-600 font-mono">{output.error}</p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
                </label>
                <CopyButton text={output.result} />
              </div>
              <Textarea
                readOnly
                value={output.result}
                className="w-full h-36 text-sm resize-y bg-neutral-50 dark:bg-neutral-900"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          )}
        </div>
      )}

      {!input && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-6">
          {mode === 'encode' ? 'Paste text above to encode it.' : 'Paste a Base64 string above to decode it.'}
        </p>
      )}
    </div>
  )
}
