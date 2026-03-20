// Render a boolean grid to an offscreen canvas at the given block size
export function renderGlyphToCanvas(
  grid: boolean[][],
  blockSize: number,
  fg = '#0a0a0a',
  bg = '#ffffff',
): HTMLCanvasElement {
  const size = grid.length
  const px = size * blockSize
  const canvas = document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')!
  if (bg !== 'transparent') {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, px, px)
  }
  ctx.fillStyle = fg
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x]) {
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)
      }
    }
  }
  return canvas
}

// Render a glyph centered in a square canvas of exactly `targetSize` pixels.
// Uses the largest integer block size that fits, with background padding around it.
export function renderGlyphAtSize(
  grid: boolean[][],
  targetSize: number,
  fg = '#0a0a0a',
  bg = '#ffffff',
): HTMLCanvasElement {
  const blockSize = Math.max(1, Math.floor(targetSize / grid.length))
  const rendered = renderGlyphToCanvas(grid, blockSize, fg, bg)
  const dest = document.createElement('canvas')
  dest.width = targetSize
  dest.height = targetSize
  const ctx = dest.getContext('2d')!
  if (bg !== 'transparent') {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, targetSize, targetSize)
  }
  ctx.imageSmoothingEnabled = false
  const ox = Math.floor((targetSize - rendered.width) / 2)
  const oy = Math.floor((targetSize - rendered.height) / 2)
  ctx.drawImage(rendered, ox, oy)
  return dest
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
