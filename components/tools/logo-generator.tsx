'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateGlyph, mirrorGlyph, hashSeed, type Symmetry } from '@/lib/glyph'
import { renderGlyphToCanvas, renderGlyphAtSize, downloadCanvas } from '@/lib/export-image'
import TabButton from '@/components/ui/tab-button'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

const GRID_SIZES = [8, 16, 32, 64, 128] as const
const BLOCK_SIZE = 8 // fixed display: 8px per cell (64px–1024px canvas)

const SYMMETRY_OPTIONS: { value: Symmetry; label: string; title: string }[] = [
  { value: 'none', label: 'None', title: 'No symmetry' },
  { value: 'x', label: '←→', title: 'Mirror left/right' },
  { value: 'y', label: '↕', title: 'Mirror top/bottom' },
  { value: 'both', label: '✦', title: 'Mirror both axes' },
]

type ColorScheme = 'light' | 'dark' | 'transparent'

const COLOR_SCHEMES: { value: ColorScheme; label: string; fg: string; bg: string }[] = [
  { value: 'light', label: 'Light', fg: '#0a0a0a', bg: '#ffffff' },
  { value: 'dark', label: 'Dark', fg: '#ffffff', bg: '#0a0a0a' },
  { value: 'transparent', label: 'Clear', fg: '#0a0a0a', bg: 'transparent' },
]

const SITE_PACK = [
  { size: 32, filename: 'favicon.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
  { size: 192, filename: 'icon-192.png' },
  { size: 512, filename: 'icon-512.png' },
] as const

function randomSeed() {
  return String(Math.floor(Math.random() * 0xffffff))
}

// Checkered transparency pattern for the preview background
const CHECKER =
  'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px'
const CHECKER_DARK =
  'repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%) 0 0 / 16px 16px'

export default function LogoGenerator() {
  const [seedStr, setSeedStr] = useState(() => randomSeed())
  const [gridSize, setGridSize] = useState<typeof GRID_SIZES[number]>(16)
  const [symmetry, setSymmetry] = useState<Symmetry>('x')
  const [scheme, setScheme] = useState<ColorScheme>('light')
  const [isDark, setIsDark] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Track dark mode for checker pattern
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const { fg, bg } = COLOR_SCHEMES.find((s) => s.value === scheme)!

  const grid = useCallback(() => {
    const seed = /^\d+$/.test(seedStr) ? parseInt(seedStr) : hashSeed(seedStr)
    return mirrorGlyph(generateGlyph(seed, gridSize), symmetry)
  }, [seedStr, gridSize, symmetry])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const src = renderGlyphToCanvas(grid(), BLOCK_SIZE, fg, bg)
    canvas.width = src.width
    canvas.height = src.height
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(src, 0, 0)
  }, [grid, fg, bg])

  const handleExport = (size: number, filename: string) => {
    const g = grid()
    const canvas = size === 0
      ? renderGlyphToCanvas(g, BLOCK_SIZE, fg, bg)
      : renderGlyphAtSize(g, size, fg, bg)
    downloadCanvas(canvas, filename)
  }

  const handleSitePack = () => {
    const g = grid()
    SITE_PACK.forEach(({ size, filename }, i) => {
      setTimeout(() => downloadCanvas(renderGlyphAtSize(g, size, fg, bg), filename), i * 200)
    })
  }

  const previewBg = scheme === 'transparent'
    ? (isDark ? CHECKER_DARK : CHECKER)
    : undefined

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="inline-block"
        style={{ background: previewBg }}
      >
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated', display: 'block' }} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Seed */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Seed
          </label>
          <div className="flex gap-2">
            <Input
              value={seedStr}
              onChange={(e) => setSeedStr(e.target.value)}
              placeholder="any text or number"
              className="flex-1 text-sm"
            />
            <Button onClick={() => setSeedStr(randomSeed())} title="Randomize">
              ⟳
            </Button>
          </div>
        </div>

        {/* Color scheme */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Colors
          </label>
          <div className="flex gap-1">
            {COLOR_SCHEMES.map((s) => (
              <TabButton
                key={s.value}
                active={scheme === s.value}
                onClick={() => setScheme(s.value)}
              >
                {s.label}
              </TabButton>
            ))}
          </div>
        </div>

        {/* Symmetry */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Symmetry
          </label>
          <div className="flex gap-1">
            {SYMMETRY_OPTIONS.map((s) => (
              <TabButton
                key={s.value}
                active={symmetry === s.value}
                onClick={() => setSymmetry(s.value)}
                title={s.title}
              >
                {s.label}
              </TabButton>
            ))}
          </div>
        </div>

        {/* Grid size */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Grid
          </label>
          <div className="flex gap-1">
            {GRID_SIZES.map((s) => (
              <TabButton
                key={s}
                active={gridSize === s}
                onClick={() => setGridSize(s)}
                title={`${s}×${s} cells`}
              >
                {s}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Export</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleExport(0, 'logo.png')}>PNG</Button>
          <Button onClick={() => handleExport(32, 'favicon.png')}>Favicon 32</Button>
          <Button onClick={() => handleExport(180, 'apple-touch-icon.png')}>Icon 180</Button>
          <Button onClick={() => handleExport(192, 'icon-192.png')}>Icon 192</Button>
          <Button onClick={() => handleExport(512, 'icon-512.png')}>Icon 512</Button>
          <Button variant="primary" onClick={handleSitePack} title="Download favicon.png, apple-touch-icon.png, icon-192.png, icon-512.png">
            Site Pack ↓
          </Button>
        </div>
        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
          All exports are PNG. &ldquo;Site Pack&rdquo; downloads all four icon sizes at once.
          {scheme === 'transparent' && ' Clear exports preserve transparency.'}
        </p>
      </div>
    </div>
  )
}
