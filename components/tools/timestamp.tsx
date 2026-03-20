'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useCopy } from '@/hooks/use-copy'
import Input from '@/components/ui/input'
import CopyButton from '@/components/ui/copy-button'

function relativeTime(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000
  const abs = Math.abs(diff)
  const future = diff < 0
  const fmt = (n: number, unit: string) =>
    `${Math.round(n)} ${unit}${Math.round(n) !== 1 ? 's' : ''} ${future ? 'from now' : 'ago'}`

  if (abs < 5) return 'just now'
  if (abs < 60) return fmt(abs, 'second')
  if (abs < 3600) return fmt(abs / 60, 'minute')
  if (abs < 86400) return fmt(abs / 3600, 'hour')
  if (abs < 86400 * 30) return fmt(abs / 86400, 'day')
  if (abs < 86400 * 365) return fmt(abs / (86400 * 30), 'month')
  return fmt(abs / (86400 * 365), 'year')
}

function detectInput(raw: string): { type: 'epoch-s' | 'epoch-ms' | 'date' | 'unknown'; date: Date | null } {
  const trimmed = raw.trim()
  if (!trimmed) return { type: 'unknown', date: null }

  if (/^\d{1,10}$/.test(trimmed)) {
    const date = new Date(parseInt(trimmed) * 1000)
    return { type: 'epoch-s', date: isNaN(date.getTime()) ? null : date }
  }
  if (/^\d{11,13}$/.test(trimmed)) {
    const date = new Date(parseInt(trimmed))
    return { type: 'epoch-ms', date: isNaN(date.getTime()) ? null : date }
  }

  const date = new Date(trimmed)
  if (!isNaN(date.getTime())) return { type: 'date', date }

  return { type: 'unknown', date: null }
}

function formatRow(label: string, value: string, key: string) {
  return (
    <div key={key} className="flex items-center justify-between py-2.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 gap-4">
      <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 w-36">{label}</span>
      <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200 flex-1 truncate">{value}</span>
      <CopyButton text={value} />
    </div>
  )
}

export default function Timestamp() {
  const [now, setNow] = useState(() => new Date())
  const [input, setInput] = useState('')
  const [tz, setTz] = useState<'local' | 'utc'>('local')
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const { isCopied, copy } = useCopy()

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(new Date()), 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const detected = useMemo(() => detectInput(input), [input])
  const date = detected.date

  const tzOpts = (d: Date): Intl.DateTimeFormatOptions => ({
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
    ...(tz === 'utc' ? { timeZone: 'UTC' } : {}),
  })

  const rows = date
    ? [
        { label: 'Unix (seconds)', value: String(Math.floor(date.getTime() / 1000)), key: 'unix-s' },
        { label: 'Unix (ms)', value: String(date.getTime()), key: 'unix-ms' },
        { label: 'ISO 8601', value: date.toISOString(), key: 'iso' },
        { label: tz === 'utc' ? 'UTC' : 'Local time', value: date.toLocaleString('en-US', tzOpts(date)), key: 'human' },
        { label: 'Relative', value: relativeTime(date), key: 'relative' },
        { label: 'Day of week', value: date.toLocaleDateString('en-US', { weekday: 'long', ...(tz === 'utc' ? { timeZone: 'UTC' } : {}) }), key: 'weekday' },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Live clock */}
      <div className="border border-neutral-200 dark:border-neutral-800 p-4">
        <p className="text-xs text-neutral-400 mb-2">Current Unix timestamp</p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <button
            onClick={() => copy(String(Math.floor(now.getTime() / 1000)), 'now-s')}
            className="font-mono text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors tabular-nums"
            title="Click to copy"
          >
            {Math.floor(now.getTime() / 1000)}
          </button>
          <span className="text-xs text-neutral-300 font-mono">
            {isCopied('now-s') ? 'copied!' : 'seconds'}
          </span>
          <button
            onClick={() => copy(String(now.getTime()), 'now-ms')}
            className="font-mono text-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors tabular-nums"
            title="Click to copy"
          >
            {now.getTime()}
          </button>
          <span className="text-xs text-neutral-300 font-mono">
            {isCopied('now-ms') ? 'copied!' : 'milliseconds'}
          </span>
        </div>
      </div>

      {/* Converter */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Timestamp or date string
            </label>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="1700000000  or  2024-01-15T10:30:00Z  or  January 15 2024"
              className="w-full text-sm"
              spellCheck={false}
            />
          </div>
          <div className="flex gap-1 mt-5">
            {(['local', 'utc'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTz(t)}
                className={`text-xs px-3 py-2 border font-mono transition-colors ${tz === t ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-neutral-200 dark:border-neutral-800 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {input && !date && (
          <p className="text-xs text-red-600 font-mono">Could not parse — try a Unix timestamp or ISO date string.</p>
        )}

        {detected.type !== 'unknown' && date && (
          <p className="text-xs text-neutral-400 font-mono">
            Detected: {detected.type === 'epoch-s' ? 'Unix timestamp (seconds)' : detected.type === 'epoch-ms' ? 'Unix timestamp (milliseconds)' : 'date string'}
          </p>
        )}

        {rows.length > 0 && (
          <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 px-4">
            {rows.map(({ label, value, key }) => formatRow(label, value, key))}
          </div>
        )}

        {!input && (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
            Enter a Unix timestamp or any date string above.
          </p>
        )}
      </div>

      {/* Quick reference */}
      <div className="text-xs text-neutral-400 dark:text-neutral-500 space-y-1">
        <p className="font-medium text-neutral-500 dark:text-neutral-400">Quick reference</p>
        <p>10 digits = Unix seconds &nbsp;·&nbsp; 13 digits = Unix milliseconds</p>
        <p>Accepts ISO 8601, RFC 2822, and most natural date strings</p>
      </div>
    </div>
  )
}
