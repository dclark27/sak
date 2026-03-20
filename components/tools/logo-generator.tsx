'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateGlyph, mirrorGlyph, hashSeed, type Symmetry } from '@/lib/glyph'
import { renderGlyphToCanvas, renderGlyphAtSize, downloadCanvas } from '@/lib/export-image'
import TabButton from '@/components/ui/tab-button'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

const GRID_SIZES = [9, 15, 21, 31] as const
const BLOCK_SIZES = [8, 12, 16, 24] as const

const SYMMETRY_OPTIONS: { value: Symmetry; label: string; title: string }[] = [
  { value: 'none', label: 'None', title: 'No symmetry' },
  { value: 'x', label: '←→', title: 'Mirror left/right' },
  { value: 'y', label: '↕', title: 'Mirror top/bottom' },
  { value: 'both', label: '✦', title: 'Mirror both axes' },
]

const EXPORT_SIZES = [
  { label: 'PNG', size: 0, filename: 'logo.png' },
  { label: 'Favicon 32', size: 32, filename: 'favicon.png' },
  { label: 'Icon 180', size: 180, filename: 'apple-touch-icon.png' },
  { label: 'Icon 192', size: 192, filename: 'icon-192.png' },
  { label: 'Icon 512', size: 512, filename: 'icon-512.png' },
] as const

function randomSeed() {
  return String(Math.floor(Math.random() * 0xffffff))
}

export default function LogoGenerator() {
  const [seedStr, setSeedStr] = useState(() => randomSeed())
  const [gridSize, setGridSize] = useState<typeof GRID_SIZES[number]>(15)
  const [blockSize, setBlockSize] = useState<typeof BLOCK_SIZES[number]>(16)
  const [symmetry, setSymmetry] = useState<Symmetry>('x')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const grid = useCallback(() => {
    const seed = /^\d+$/.test(seedStr) ? parseInt(seedStr) : hashSeed(seedStr)
    return mirrorGlyph(generateGlyph(seed, gridSize), symmetry)
  }, [seedStr, gridSize, symmetry])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const g = grid()
    const src = renderGlyphToCanvas(g, blockSize)
    canvas.width = src.width
    canvas.height = src.height
    canvas.getContext('2d')!.drawImage(src, 0, 0)
  }, [grid, blockSize])

  const handleExport = (size: number, filename: string) => {
    const g = grid()
    const canvas = size === 0
      ? renderGlyphToCanvas(g, blockSize)
      : renderGlyphAtSize(g, size)
    downloadCanvas(canvas, filename)
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center">
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 inline-block">
          <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
        </div>
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
            <Button onClick={() => setSeedStr(randomSeed())} title="Shuffle">
              ⟳
            </Button>
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

        {/* Block size */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Scale
          </label>
          <div className="flex gap-1">
            {BLOCK_SIZES.map((s) => (
              <TabButton
                key={s}
                active={blockSize === s}
                onClick={() => setBlockSize(s)}
                title={`${s}px per cell`}
              >
                {s}px
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Export</p>
        <div className="flex flex-wrap gap-2">
          {EXPORT_SIZES.map(({ label, size, filename }) => (
            <Button key={label} onClick={() => handleExport(size, filename)}>
              {label}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
          All exports are PNG. Use a converter for .ico if needed.
        </p>
      </div>
    </div>
  )
}
