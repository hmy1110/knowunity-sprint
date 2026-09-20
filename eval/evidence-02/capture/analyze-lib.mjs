import fs from 'node:fs'
import { PNG } from './lib.mjs'
const lumaOf = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b
const TOL = 8
// ------------------------------------------------------------------ pixel diff
export function diffPngs(A, B, outPath) {
  if (A.width !== B.width || A.height !== B.height) return { sizeMismatch: `${A.width}x${A.height} vs ${B.width}x${B.height}` }
  const n = A.width * A.height
  let rgb = 0, luma = 0
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1
  const out = outPath ? new PNG({ width: A.width, height: A.height }) : null
  for (let i = 0; i < n; i++) {
    const o = i * 4
    const dr = Math.abs(A.data[o] - B.data[o]), dg = Math.abs(A.data[o + 1] - B.data[o + 1]), db = Math.abs(A.data[o + 2] - B.data[o + 2])
    const ch = dr > TOL || dg > TOL || db > TOL
    const dl = Math.abs(lumaOf(A.data[o], A.data[o + 1], A.data[o + 2]) - lumaOf(B.data[o], B.data[o + 1], B.data[o + 2])) > TOL
    if (ch) {
      rgb++
      const x = i % A.width, y = (i / A.width) | 0
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y
    }
    if (dl) luma++
    if (out) {
      if (ch) { out.data[o] = 255; out.data[o + 1] = 0; out.data[o + 2] = 0; out.data[o + 3] = 255 }
      else { const g = lumaOf(A.data[o], A.data[o + 1], A.data[o + 2]) * 0.35; out.data[o] = out.data[o + 1] = out.data[o + 2] = g; out.data[o + 3] = 255 }
    }
  }
  const pct = (x) => Math.round((x / n) * 100 * 1000) / 1000
  const res = { rgbDiffPct: pct(rgb), lumaDiffPct: pct(luma), identical: rgb === 0 }
  res.hueShiftOnly = rgb / n > 0.01 && luma / n < 0.1 * (rgb / n)
  res.diffBoxCss = rgb ? { x: minx / 2, y: miny / 2, w: (maxx - minx + 1) / 2, h: (maxy - miny + 1) / 2 } : null
  if (out && rgb) fs.writeFileSync(outPath, PNG.sync.write(out))
  return res
}

