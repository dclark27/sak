'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import TabButton from '@/components/ui/tab-button'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

const ERROR_LEVELS: { value: ErrorLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '~7% recovery' },
  { value: 'M', label: 'M', desc: '~15% recovery' },
  { value: 'Q', label: 'Q', desc: '~25% recovery' },
  { value: 'H', label: 'H', desc: '~30% recovery' },
]

export default function QrCode() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: { dark: '#0a0a0a', light: '#ffffff' },
    }).then(() => setError('')).catch((e: Error) => setError(e.message))
  }, [text, size, errorLevel])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Content</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com or any text..."
          className="w-full h-24 text-sm resize-none"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border border-neutral-200 dark:border-neutral-800 px-2 py-1.5 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 bg-white dark:bg-neutral-900 dark:text-neutral-100"
          >
            {[128, 192, 256, 384, 512].map((s) => (
              <option key={s} value={s}>{s}×{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Error correction</label>
          <div className="flex gap-1">
            {ERROR_LEVELS.map((lvl) => (
              <TabButton
                key={lvl.value}
                active={errorLevel === lvl.value}
                onClick={() => setErrorLevel(lvl.value)}
                title={lvl.desc}
              >
                {lvl.label}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-mono">{error}</p>}

      {text.trim() && (
        <div className="flex flex-col items-start gap-3">
          <div className="border border-neutral-200 dark:border-neutral-800 p-3 inline-block dark:bg-white">
            <canvas ref={canvasRef} />
          </div>
          <Button variant="primary" onClick={download}>
            Download PNG
          </Button>
        </div>
      )}

      {!text.trim() && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
          Enter some text or a URL above to generate a QR code.
        </p>
      )}
    </div>
  )
}
