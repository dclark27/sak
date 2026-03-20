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

function countNeighbors(grid: boolean[][], x: number, y: number, size: number): number {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx, ny = y + dy
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx]) n++
    }
  }
  return n
}

// 1. Random fill biased toward center
// 2. Cellular automata smoothing — rounds edges, fills holes, removes tendrils
// 3. Connectivity prune — keep only the blob containing the center
export function generateGlyph(seed: number, size: number): boolean[][] {
  const rand = mulberry32(seed)
  const cx = (size - 1) / 2
  const cy = (size - 1) / 2
  const maxDist = Math.sqrt(cx * cx + cy * cy)

  // Step 1: distance-biased random seed
  let grid: boolean[][] = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist
      // High fill near center, sparse at edges
      const prob = Math.max(0, 1 - Math.pow(d, 1.5)) * 0.75 + 0.10
      return rand() < prob
    })
  )

  // Step 2: CA smoothing — more iterations for larger grids
  const iters = size <= 12 ? 2 : 3
  for (let i = 0; i < iters; i++) {
    const next = grid.map(row => [...row])
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = countNeighbors(grid, x, y, size)
        // Filled survives with ≥4 neighbors; empty is born with ≥5
        next[y][x] = grid[y][x] ? n >= 4 : n >= 5
      }
    }
    grid = next
  }

  // Step 3: ensure center is filled, flood-fill to prune islands
  const sx = Math.round(cx)
  const sy = Math.round(cy)
  grid[sy][sx] = true

  const visited = new Set<string>()
  const queue: [number, number][] = [[sx, sy]]
  visited.add(`${sx},${sy}`)
  while (queue.length > 0) {
    const [x, y] = queue.pop()!
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue
      const k = `${nx},${ny}`
      if (visited.has(k) || !grid[ny][nx]) continue
      visited.add(k)
      queue.push([nx, ny])
    }
  }

  return grid.map((row, y) =>
    row.map((filled, x) => filled && visited.has(`${x},${y}`))
  )
}

export type Symmetry = 'none' | 'x' | 'y' | 'both'

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
