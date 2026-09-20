// Post-capture analysis for evidence-03: pixel diffs, contrast, hit areas, structure.
// Reads screens/ + measure/ written by capture.mjs. Render and measure only. No scoring.
// Usage: node eval/evidence-03/capture/analyze.mjs
import fs from 'node:fs'
import { OUT, RUN2, PNG } from './lib.mjs'

const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
let manifest = rd(`${OUT}/manifest.json`)
// tag crops are files of B01, not states: keep run 2's manifest shape (state entries only)
manifest = manifest.filter((m) => !m.id.startsWith('B01-tag-'))
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1))
const ids = manifest.map((m) => m.id)
const load = (p) => PNG.sync.read(fs.readFileSync(p))
const TOL = 8

import { diffPngs } from './analyze-lib.mjs'

const run2Pairs = rd(`${RUN2}/measure/pixel-diffs.json`).diffs.map((d) => ({ a: d.a, b: d.b, tag: d.tag }))
const extraPairs = []
const pathOf = (n) => `${OUT}/screens/${n}.png`
const diffs = []
fs.mkdirSync(`${OUT}/diffs`, { recursive: true })
for (const p of [...run2Pairs, ...extraPairs]) {
  if (!fs.existsSync(pathOf(p.a)) || !fs.existsSync(pathOf(p.b))) { diffs.push({ ...p, missing: true }); continue }
  const r = diffPngs(load(pathOf(p.a)), load(pathOf(p.b)), `${OUT}/diffs/${p.a}__vs__${p.b}.png`)
  diffs.push({ ...p, ...r })
}
fs.writeFileSync(`${OUT}/measure/pixel-diffs.json`, JSON.stringify({ tolerancePerChannel: TOL, note: 'rgbDiffPct = % of pixels differing by >tol in any channel; lumaDiffPct = same on luma only (0.299R+0.587G+0.114B); hueShiftOnly = many RGB diffs but almost no luma diff', diffs }, null, 1))
{
  const fmtBox = (b) => (b ? `${b.x},${b.y} ${b.w}x${b.h}` : '-')
  let md = `# Pixel diffs (390px @2x, dark)\n\nPer-channel tolerance ${TOL}. \`rgb%\` = share of pixels that differ; \`luma%\` = share that differ in luminance alone. \`hue-only\` = colour changes with almost no luminance change. Diff images are in \`diffs/\` (red = changed pixel); an identical pair has no image.\n\n| group | A | B | rgb% | luma% | identical | hue-only | changed box (css px) |\n|---|---|---|---|---|---|---|---|\n`
  for (const d of diffs) {
    if (d.missing) md += `| ${d.tag} | ${d.a} | ${d.b} | not captured | | | | |\n`
    else if (d.sizeMismatch) md += `| ${d.tag} | ${d.a} | ${d.b} | size mismatch ${d.sizeMismatch} | | no | | |\n`
    else md += `| ${d.tag} | ${d.a} | ${d.b} | ${d.rgbDiffPct} | ${d.lumaDiffPct} | ${d.identical ? 'YES' : 'no'} | ${d.hueShiftOnly ? 'YES' : 'no'} | ${fmtBox(d.diffBoxCss)} |\n`
  }
  fs.writeFileSync(`${OUT}/pixel-diffs.md`, md)
}
// ------------------------------------------------------------------ Submit default vs disabled (term 1 stand-in)
{
  const box = rd(`${OUT}/measure/submit-box-t1.json`)
  const crop = (n) => {
    const P = load(pathOf(n))
    const x0 = Math.round(box.x * 2), y0 = Math.round(box.y * 2), w = Math.round(box.width * 2), h = Math.round(box.height * 2)
    const out = new PNG({ width: w, height: h })
    PNG.bitblt(P, out, x0, y0, w, h, 0, 0)
    return out
  }
  const r = diffPngs(crop('X02-t1-typeInput-filled'), crop('F07-t1-typeProcessing'))
  fs.writeFileSync(`${OUT}/measure/submit-default-vs-disabled.json`, JSON.stringify({
    note: `G4 pair 'Primary button Default vs Disabled'. Crop of the Submit button box (x=${box.x},y=${box.y},${box.width}x${box.height} css px) from two screenshots; per-channel tolerance 8. Runs 2 and 3 use term 1 (run 1 used term 2, where the typed path no longer exists).`,
    default: 'screens/X02-t1-typeInput-filled.png', disabled: 'screens/F07-t1-typeProcessing.png', rgbDiffPct: r.rgbDiffPct, lumaDiffPct: r.lumaDiffPct, identical: r.identical,
  }, null, 1))
}

// ------------------------------------------------------------------ tag fills
{
  const rects = rd(`${OUT}/measure/B01-tag-rects.json`)
  const F = load(pathOf('B01-summary-mixed-default-full'))
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
  const tags = {}
  for (const [k, r] of Object.entries(rects)) {
    // fill = mode colour of the pill's box
    const hist = new Map()
    const x0 = Math.round(r.x * 2), y0 = Math.round(r.y * 2), w = Math.floor(r.w * 2), h = Math.floor(r.h * 2)
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const o = (y * F.width + x) * 4; const key = `${F.data[o]},${F.data[o + 1]},${F.data[o + 2]}`; hist.set(key, (hist.get(key) || 0) + 1) }
    const fill = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number)
    tags[k] = { size: `${Math.round(r.w)}x${Math.round(r.h)} css px`, fill, luminance: Math.round(L(fill) * 10000) / 10000 }
  }
  const ks = Object.keys(tags), pairwise = []
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
    const a = tags[ks[i]].luminance, b = tags[ks[j]].luminance
    pairwise.push({ a: ks[i], b: ks[j], fillLuminanceRatio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100 })
  }
  fs.writeFileSync(`${OUT}/measure/tag-fills.json`, JSON.stringify({ tags, pairwise }, null, 1))
}

// ------------------------------------------------------------------ contrast (nominal + rendered)
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const relL = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
const ratio = (a, b) => { const x = relL(a), y = relL(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
const round2 = (n) => Math.round(n * 100) / 100
const pngCache = new Map()
const getPng = (p) => { if (!pngCache.has(p)) pngCache.set(p, load(p)); return pngCache.get(p) }
function sample(P, rect, yOff) {
  const x0 = Math.max(0, Math.floor(rect.x * 2)), x1 = Math.min(P.width, Math.ceil((rect.x + rect.w) * 2))
  const y0 = Math.max(0, Math.floor((rect.y + yOff) * 2)), y1 = Math.min(P.height, Math.ceil((rect.y + yOff + rect.h) * 2))
  if (x1 <= x0 || y1 <= y0) return null
  const hist = new Map()
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const o = (y * P.width + x) * 4; const k = (P.data[o] << 16) | (P.data[o + 1] << 8) | P.data[o + 2]; hist.set(k, (hist.get(k) || 0) + 1) }
  const unpack = (k) => [(k >> 16) & 255, (k >> 8) & 255, k & 255]
  const bg = unpack([...hist.entries()].sort((a, b) => b[1] - a[1])[0][0])
  const lb = relL(bg)
  let best = bg, bd = -1
  for (const k of hist.keys()) { const c = unpack(k); const d = Math.abs(relL(c) - lb); if (d > bd) { bd = d; best = c } }
  return { fg: best, bg, ratio: ratio(best, bg) }
}
const contrast = {}
for (const id of ids) {
  const m = rd(`${OUT}/measure/${id}.json`)
  const entry = manifest.find((x) => x.id === id)
  const vp = getPng(`${OUT}/${entry.file}`)
  const full = entry.full ? getPng(`${OUT}/${entry.full}`) : null
  const sy = m.scroll.scrollY || 0
  contrast[id] = m.texts.map((t) => {
    const r0 = t.rect[0]
    const union = t.rect.reduce((u, r) => ({ x: Math.min(u.x, r.x), y: Math.min(u.y, r.y), w: 0, h: 0, x2: Math.max(u.x2, r.x + r.w), y2: Math.max(u.y2, r.y + r.h) }), { x: r0.x, y: r0.y, x2: r0.x + r0.w, y2: r0.y + r0.h, w: 0, h: 0 })
    const rect = { x: union.x, y: union.y, w: union.x2 - union.x, h: union.y2 - union.y }
    let s = null
    const VH = m.scroll.clientHeight || 844
    const inView = rect.y >= 0 && rect.y + rect.h <= VH && rect.x >= 0 && rect.x + rect.w <= 390
    if (inView) s = sample(vp, rect, 0)
    else if (full) s = sample(full, rect, sy)
    return {
      text: t.text, fontSize: t.fontSize, fontWeight: t.fontWeight, cssColor: t.color,
      nominalRatio: t.nominalRatio, nominalFg: t.nominalFg, nominalBg: t.nominalBg, bgUnknown: t.bgUnknown,
      renderedRatio: s ? round2(s.ratio) : null, renderedFg: s ? s.fg : null, renderedBg: s ? s.bg : null,
    }
  })
}
fs.writeFileSync(`${OUT}/measure/contrast-per-state.json`, JSON.stringify(contrast, null, 1))
{
  let rows = 0
  let md = `# Text contrast per state\n\nTwo independent numbers per text run. **rendered** = sampled from the screenshot (most common colour in the text box = background, colour farthest from it in luminance = glyph core). **nominal** = computed from CSS colours with alpha and group opacity composited down the DOM chain (does not see scrims/overlays/images). Rows below are every run under 4.5:1 on either number, listed once per state. Antialiasing can pull the rendered figure slightly low on thin glyphs. Full data: \`measure/contrast-per-state.json\`. Text below the fold in a state with no full-page screenshot has no rendered figure (\`n/a\`).\n\n| state | text | size/weight | nominal | rendered | rendered fg / bg |\n|---|---|---|---|---|---|\n`
  for (const id of ids) {
    const seen = new Set()
    for (const t of contrast[id]) {
      const low = t.nominalRatio < 4.5 || (t.renderedRatio !== null && t.renderedRatio < 4.5)
      if (!low) continue
      const key = t.text + '|' + t.fontSize
      if (seen.has(key)) continue
      seen.add(key)
      rows++
      md += `| ${id} | ${t.text.slice(0, 80).replace(/\|/g, '\\|')} | ${t.fontSize}px/${t.fontWeight} | ${t.nominalRatio} | ${t.renderedRatio === null ? 'n/a' : t.renderedRatio} | ${t.renderedFg ? `rgb(${t.renderedFg}) / rgb(${t.renderedBg})` : 'n/a'} |\n`
    }
  }
  md += `\n${rows} rows under 4.5:1 across ${ids.length} states.\n`
  fs.writeFileSync(`${OUT}/contrast.md`, md)
}

// ------------------------------------------------------------------ hit areas + structure
const hits = []
const structure = []
for (const id of ids) {
  const m = rd(`${OUT}/measure/${id}.json`)
  structure.push({ id, route: m.url, sw: m.scroll.scrollWidth, cw: m.scroll.clientWidth, hs: m.scroll.horizontalScroll, sh: m.scroll.scrollHeight })
  for (const e of m.interactive) {
    if (e.role === 'progressbar' || e.disabled) continue
    hits.push({
      state: id, name: e.name, tag: e.tag, ariaLabel: e.ariaLabel, native: e.native,
      own: `${e.ownRect.w}x${e.ownRect.h}`, union: `${e.unionRect.w}x${e.unionRect.h}`, effectiveHit: e.effectiveHit ? `${e.effectiveHit.w}x${e.effectiveHit.h}` : 'offscreen',
      offscreen: e.offscreen, under44: !e.offscreen && !!e.effectiveHit && (e.effectiveHit.w < 44 || e.effectiveHit.h < 44), ownUnder44: e.ownRect.w < 44 || e.ownRect.h < 44,
      hasOnClick: e.hasOnClick, hotspotMarked: e.hotspotMarked,
    })
  }
}
fs.writeFileSync(`${OUT}/measure/hit-areas.json`, JSON.stringify(hits, null, 1))
{
  const short = (arr) => arr.slice(0, 6).join(', ') + (arr.length > 6 ? ` (+${arr.length - 6})` : '')
  const g = new Map()
  for (const h of hits) {
    if (!h.under44) continue
    const k = `${h.name}|${h.tag}|${h.ariaLabel}|${h.own}|${h.union}|${h.effectiveHit}`
    if (!g.has(k)) g.set(k, { ...h, states: [] })
    g.get(k).states.push(h.state)
  }
  let md = `# Hit areas (interactive elements, enabled only)\n\n"effective hit" = bounding box of every 2px grid point inside the element's own box plus its descendants' boxes where \`elementFromPoint\` lands inside the element. That is the tappable area, not the glyph. "under 44" is w<44 or h<44 CSS px on the effective hit. A native \`<button>\` with no React \`onClick\` is listed as inert. Elements below the fold at scroll position are flagged \`offscreen\` in \`measure/hit-areas.json\` and not counted. Full data: \`measure/hit-areas.json\`.\n\n## Under 44x44 (one row per element per state, deduplicated by name+size)\n\n| element | tag | own | union | effective hit | states seen |\n|---|---|---|---|---|---|\n`
  for (const v of g.values()) md += `| ${v.name} | ${v.tag}${v.ariaLabel ? ` (aria-label="${v.ariaLabel}")` : ''} | ${v.own} | ${v.union} | ${v.effectiveHit} | ${short(v.states)} |\n`
  const inert = new Map()
  for (const h of hits) {
    if (h.tag !== 'button' || h.hasOnClick) continue
    const k = `${h.name}|${h.hotspotMarked}`
    if (!inert.has(k)) inert.set(k, { name: h.name, marked: h.hotspotMarked, states: [] })
    inert.get(k).states.push(h.state)
  }
  md += `\n## Native <button> with no onClick handler\n\n| state | name | marked as live (data-hotspot*) |\n|---|---|---|\n`
  for (const v of inert.values()) md += `| ${v.states.slice(0, 5).join(', ')}${v.states.length > 5 ? ` (+${v.states.length - 5})` : ''} | ${v.name} | ${v.marked} |\n`
  // also list own-box under 44 where effective hit differs, for comparability with the own/union columns
  fs.writeFileSync(`${OUT}/hit-areas.md`, md)
}
{
  let md = `# Structure per state\n\n| state | route | scrollWidth/clientWidth | horizontal scroll | scrollHeight |\n|---|---|---|---|---|\n`
  for (const s of structure) md += `| ${s.id} | ${s.route} | ${s.sw}/${s.cw} | ${s.hs ? 'YES' : 'no'} | ${s.sh} |\n`
  fs.writeFileSync(`${OUT}/structure.md`, md)
}
console.log('analyze done', ids.length, 'states,', diffs.length, 'diff pairs')
