// Shared helpers for the evidence-04 capture. Render and measure only; no scoring.
// Playwright is imported by absolute path (per the run brief). pngjs and sharp resolve from the repo.
import { createRequire } from 'node:module'
import fs from 'node:fs'

export const ROOT = '/Users/mengyahao/Desktop/knowunity-sprint'
export const OUT = `${ROOT}/eval/evidence-04`
export const RUN2 = `${ROOT}/eval/evidence-03`
export const BASE = 'http://localhost:3000'
const require = createRequire(`${ROOT}/package.json`)
export const { chromium } = require(`${ROOT}/node_modules/playwright`)
export const { PNG } = require('pngjs')
export const sharp = require('sharp')

export const VIEWPORT = { width: 390, height: 844 }
export const CHROMIUM_ARGS = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']

// Hide the Next.js dev-tools badge (screenshots only; console is captured separately).
const HIDE_BADGE_CSS = 'nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-tools-button], [data-next-badge-root]{display:none !important}'

export async function newContext(browser, { reducedMotion, viewport } = {}) {
  const ctx = await browser.newContext({
    viewport: viewport || VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: reducedMotion || 'no-preference',
    permissions: ['microphone'],
    hasTouch: false,
  })
  await ctx.addInitScript((css) => {
    const add = () => {
      const parent = document.head || document.documentElement
      if (!parent || document.getElementById('__hide_badge')) return
      const s = document.createElement('style')
      s.id = '__hide_badge'
      s.textContent = css
      parent.appendChild(s)
    }
    add()
    document.addEventListener('DOMContentLoaded', add)
  }, HIDE_BADGE_CSS)
  return ctx
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function ensureDirs() {
  for (const d of ['screens', 'gray', 'measure', 'aria', 'diffs', 'logs', 'capture']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true })
}

// ---------------------------------------------------------------------------
// In-page measurement (runs inside the browser). Returns interactive elements, text runs
// with a nominal (CSS-composited) contrast ratio, scroll metrics and running animations.
// ---------------------------------------------------------------------------
export const MEASURE_FN = () => {
  const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const cx = cv.getContext('2d', { willReadFrequently: true })
  const parse = (c) => {
    if (!c) return [0, 0, 0, 0]
    let m = c.match(/^rgba?\(([^)]+)\)/)
    if (m) {
      const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number)
      return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]
    }
    m = c.match(/^color\(srgb ([^)]+)\)/)
    if (m) {
      const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number)
      return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] === undefined ? 1 : p[3]]
    }
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = '#000'
    cx.fillStyle = c
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const over = (fg, bg) => {
    const a = fg[3]
    return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1]
  }
  const mix = (a, b, t) => [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, a[2] * (1 - t) + b[2] * t, 1]
  const lin = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  // Composite the background chain top-down (root to element), applying group opacity per layer.
  const nominal = (el) => {
    const chain = []
    for (let e = el; e; e = e.parentElement) chain.push(e)
    chain.reverse()
    let backdrop = parse(getComputedStyle(document.body).backgroundColor)
    let unknown = false
    if (backdrop[3] === 0) {
      backdrop = parse(getComputedStyle(document.documentElement).backgroundColor)
      if (backdrop[3] === 0) { backdrop = [0, 0, 0, 1]; unknown = true }
    }
    backdrop = [backdrop[0], backdrop[1], backdrop[2], 1]
    let groupOpacity = 1
    for (const e of chain) {
      const s = getComputedStyle(e)
      const prev = backdrop
      const bg = parse(s.backgroundColor)
      let cur = bg[3] > 0 ? over(bg, prev) : prev
      if (s.backgroundImage && s.backgroundImage !== 'none') unknown = true
      const o = parseFloat(s.opacity)
      if (!isNaN(o) && o < 1) {
        cur = mix(prev, cur, o)
        if (e !== el || true) groupOpacity *= o
      }
      backdrop = cur
    }
    const fgRaw = parse(getComputedStyle(el).color)
    const fgA = fgRaw[3] * (groupOpacity)
    const fg = over([fgRaw[0], fgRaw[1], fgRaw[2], Math.min(1, fgA)], backdrop)
    return { fg, bg: backdrop, ratio: ratio(fg, backdrop), unknown }
  }

  const vis = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  const propsOf = (el) => {
    const k = Object.keys(el).find((x) => x.startsWith('__reactProps'))
    return k ? el[k] : null
  }
  const nameOf = (el) =>
    (el.getAttribute('aria-label') || el.innerText || el.value || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ')

  // interactive
  const sel = 'button, a[href], input, textarea, select, [role=button], [role=progressbar], [role=slider], [role=link], [role=tab]'
  const interactive = []
  for (const el of document.querySelectorAll(sel)) {
    if (!vis(el) && !el.querySelector('*')) continue
    const own = el.getBoundingClientRect()
    let u = { l: own.left, t: own.top, r: own.right, b: own.bottom }
    for (const d of el.querySelectorAll('*')) {
      const r = d.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) continue
      u = { l: Math.min(u.l, r.left), t: Math.min(u.t, r.top), r: Math.max(u.r, r.right), b: Math.max(u.b, r.bottom) }
    }
    // effective hit on a 2px grid inside the union, restricted to the viewport
    const W = window.innerWidth, H = window.innerHeight
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
    const offscreen = u.b <= 0 || u.t >= H || u.r <= 0 || u.l >= W
    if (!offscreen) {
      for (let x = Math.max(0, Math.floor(u.l / 2) * 2); x < Math.min(u.r, W); x += 2) {
        for (let y = Math.max(0, Math.floor(u.t / 2) * 2); y < Math.min(u.b, H); y += 2) {
          const h = document.elementFromPoint(x, y)
          if (h && el.contains(h)) {
            if (x < minx) minx = x; if (x > maxx) maxx = x
            if (y < miny) miny = y; if (y > maxy) maxy = y
          }
        }
      }
    }
    const eff = offscreen ? null : minx === Infinity ? { x: 0, y: 0, w: 0, h: 0 } : { x: minx, y: miny, w: maxx - minx + 2, h: maxy - miny + 2 }
    const p = propsOf(el)
    interactive.push({
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      name: nameOf(el),
      ariaLabel: el.getAttribute('aria-label'),
      native: ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName),
      disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
      hasOnClick: !!(p && p.onClick),
      // Obsolete since 2026-09-21: the hotspot layer and every data-hotspot attribute were removed, so this reads false.
      hotspotMarked: !!el.closest('[data-hotspot], [data-hotspot-within]'),
      offscreen,
      ownRect: { x: round(own.left), y: round(own.top), w: round(own.width), h: round(own.height) },
      unionRect: { x: round(u.l), y: round(u.t), w: round(u.r - u.l), h: round(u.b - u.t) },
      effectiveHit: eff,
    })
  }

  // text runs
  const texts = []
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = w.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (!t) continue
    const el = n.parentElement
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
    if (el.closest('nextjs-portal')) continue
    if (!vis(el)) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
    if (!rects.length) continue
    const s = getComputedStyle(el)
    const nm = nominal(el)
    texts.push({
      text: t, tag: el.tagName.toLowerCase(), fontSize: parseFloat(s.fontSize), fontWeight: s.fontWeight, color: s.color,
      nominalRatio: round(nm.ratio, 2), nominalFg: nm.fg.map(Math.round).slice(0, 3), nominalBg: nm.bg.map(Math.round).slice(0, 3),
      bgUnknown: nm.unknown, rect: rects.map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })),
    })
  }

  const anims = document.getAnimations().map((a) => ({
    type: a.constructor.name,
    name: a.animationName || a.transitionProperty || a.id || null,
    target: a.effect && a.effect.target ? a.effect.target.tagName.toLowerCase() + (a.effect.target.className && typeof a.effect.target.className === 'string' ? '.' + a.effect.target.className.split(' ')[0] : '') : null,
    playState: a.playState,
    duration: a.effect ? a.effect.getComputedTiming().duration : null,
    iterations: a.effect ? String(a.effect.getComputedTiming().iterations) : null,
  }))

  const de = document.documentElement
  return {
    url: location.pathname + location.search,
    scroll: {
      scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, scrollHeight: de.scrollHeight, clientHeight: de.clientHeight,
      horizontalScroll: de.scrollWidth > de.clientWidth, scrollY: window.scrollY,
    },
    bodyText: document.body.innerText.split('\n').map((s) => s.trim()).filter(Boolean).join(' | '),
    interactive,
    texts,
    animations: anims,
  }
}

// ---------------------------------------------------------------------------
// Session driver. Every helper drives the real UI (no state injection).
// ---------------------------------------------------------------------------
export class Run {
  constructor(page, manifestMeta, sink) {
    this.page = page
    this.meta = manifestMeta // id -> {group,scenario,desc}
    this.sink = sink // {manifest:[], console:[], notes:[]}
    this.scenario = ''
  }
  async goto(p) {
    await this.page.goto(BASE + p, { waitUntil: 'load' })
    await sleep(900)
  }
  btn(name) {
    return this.page.getByRole('button', { name, exact: true })
  }
  async mic() {
    await this.btn('Tap to speak').click()
  }
  async stopMic() {
    await this.btn('Tap to stop').click()
  }
  async waitText(t, timeout = 8000) {
    await this.page.getByText(t, { exact: false }).first().waitFor({ state: 'visible', timeout })
  }
  // idle -> recording -> readyToSend (fake mic; records ~0.7s)
  async record(holdMs = 700) {
    await this.mic()
    await this.btn('Tap to stop').waitFor()
    await sleep(holdMs)
    await this.stopMic()
    await this.waitText('Ready to send')
    await sleep(400)
  }
  async send() {
    await this.btn('Send').click()
  }
  async continue_() {
    await this.btn('Continue').click()
    await sleep(600)
  }
  // Term 1 idle -> ... -> term 1 result Recalled
  async toT1Result() {
    await this.record()
    await this.send()
    await this.btn('Continue').waitFor()
    await sleep(700)
  }
  async toT2Idle() {
    await this.toT1Result()
    await this.continue_()
  }
  async toT2Hinted1() {
    await this.toT2Idle()
    await this.record()
    await this.send()
    await this.btn('Try again').waitFor()
    await sleep(700)
  }
  async toHinted1Recording() {
    await this.toT2Hinted1()
    await this.btn('Try again').click()
    await this.btn('Tap to stop').waitFor()
    await sleep(900)
  }
  async toHinted1Ready() {
    await this.toHinted1Recording()
    await this.stopMic()
    await this.waitText('Ready to send')
    await sleep(500)
  }
  async toHinted1Recalled() {
    await this.toHinted1Ready()
    await this.send()
    await this.btn('Continue').waitFor()
    await sleep(700)
  }

  // Press-and-hold on a locator, then slide off the control so no click fires. Returns after capture callback.
  async pressed(locator, fn) {
    const box = await locator.boundingBox()
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2
    await this.page.mouse.move(cx, cy)
    await this.page.mouse.down()
    await sleep(350)
    await fn()
    await this.page.mouse.move(cx, cy > 422 ? cy - 300 : cy + 300, { steps: 4 })
    await this.page.mouse.up()
    await sleep(1100)
  }

  // ------------------------------------------------------------------ snapshot
  async snap(id, o = {}) {
    const m = this.meta[id] || { group: o.group || 'context', scenario: o.scenario || '', desc: o.desc || '' }
    this.scenario = m.scenario
    const page = this.page
    const desc = o.desc || m.desc
    const file = `screens/${id}.png`
    await page.screenshot({ path: `${OUT}/${file}` })
    let full = null
    if (o.full) {
      full = `screens/${id}-full.png`
      await page.screenshot({ path: `${OUT}/${full}`, fullPage: true })
    }
    await sharp(`${OUT}/${file}`).grayscale().toFile(`${OUT}/gray/${id}.png`)
    const data = await page.evaluate(MEASURE_FN)
    if (o.tab) data.tabOrder = await this.tabWalk(id)
    fs.writeFileSync(`${OUT}/measure/${id}.json`, JSON.stringify(data, null, 1))
    const aria = await page.locator('body').ariaSnapshot()
    fs.writeFileSync(`${OUT}/aria/${id}.txt`, aria)
    const entry = { id, group: m.group, scenario: m.scenario, url: data.url, desc, file, full }
    if (o.note) entry.note = o.note
    this.sink.manifest.push(entry)
    console.log('captured', id, data.url)
    return data
  }

  async tabWalk(id) {
    const page = this.page
    const out = []
    const seen = new Set()
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab')
      const f = await page.evaluate(() => {
        const e = document.activeElement
        if (!e || e === document.body) return null
        const r = e.getBoundingClientRect()
        const s = getComputedStyle(e)
        return { tag: e.tagName.toLowerCase(), name: (e.getAttribute('aria-label') || e.innerText || '').trim().replace(/\s+/g, ' '), y: Math.round(r.y), x: Math.round(r.x), outline: s.outline, boxShadow: s.boxShadow }
      })
      if (!f) break
      const key = f.name + '@' + f.x + ',' + f.y
      if (seen.has(key)) break
      seen.add(key)
      out.push(f)
      if (i === 0) await page.screenshot({ path: `${OUT}/screens/${id}-tab1.png` })
    }
    await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur())
    return out
  }
}
