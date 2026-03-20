function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// djb2 hash — string seed → stable integer
export function hashSeed(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 33) ^ str.charCodeAt(i)) >>> 0
  }
  return h
}

// BFS flood fill from center. Fill probability falls off with distance.
export function generateGlyph(seed: number, size: number): boolean[][] {
  const rand = mulberry32(seed)
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))
  const cx = Math.floor(size / 2)
  const cy = Math.floor(size / 2)
  const maxDist = Math.sqrt(cx * cx + cy * cy)

  grid[cy][cx] = true
  const queue: [number, number][] = [[cx, cy]]
  const visited = new Set<string>([`${cx},${cy}`])
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const

  while (queue.length > 0) {
    const [x, y] = queue.shift()!
    for (const [dx, dy] of dirs) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue
      const k = `${nx},${ny}`
      if (visited.has(k)) continue
      visited.add(k)
      const d = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2) / maxDist
      // smooth falloff: ~0.94 at center edge, ~0.12 at corners
      const p = Math.pow(1 - d, 0.65) * 0.82 + 0.12
      if (rand() < p) {
        grid[ny][nx] = true
        queue.push([nx, ny])
      }
    }
  }

  return grid
}

export type Symmetry = 'none' | 'x' | 'y' | 'both'

// Mirror a generated glyph along one or both axes
export function mirrorGlyph(grid: boolean[][], axis: Symmetry): boolean[][] {
  if (axis === 'none') return grid
  const size = grid.length
  const result = grid.map(row => [...row])
  const cx = Math.floor(size / 2)
  const cy = Math.floor(size / 2)

  if (axis === 'x' || axis === 'both') {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < cx; x++) {
        result[y][size - 1 - x] = result[y][x]
      }
    }
  }
  if (axis === 'y' || axis === 'both') {
    for (let y = 0; y < cy; y++) {
      for (let x = 0; x < size; x++) {
        result[size - 1 - y][x] = result[y][x]
      }
    }
  }

  return result
}
