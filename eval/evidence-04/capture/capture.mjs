// Evidence 04 capture. Drives the real UI at http://localhost:3000 through the free voice/type flow.
// Usage: node eval/evidence-04/capture/capture.mjs   Render and measure only. No scoring.
import fs from 'node:fs'
import { chromium, CHROMIUM_ARGS, OUT, BASE, PNG, newContext, ensureDirs, sleep, Run } from './lib.mjs'

ensureDirs()
const sink = { manifest: [], console: [], notes: [] }
const browser = await chromium.launch({ headless: true, args: CHROMIUM_ARGS })
let R
async function fresh({ viewport, reject } = {}) {
  const ctx = await newContext(browser, { viewport })
  if (reject) await ctx.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')) })
  const page = await ctx.newPage()
  const r = new Run(page, {}, sink)
  page.on('console', (m) => { if (['warning', 'error'].includes(m.type())) sink.console.push({ scenario: r.scenario, type: m.type(), text: m.text(), state: r.lastId }) })
  page.on('pageerror', (e) => sink.console.push({ scenario: r.scenario, type: 'pageerror', text: String(e?.message || e), state: r.lastId }))
  return r
}
const snap = (id, o = {}) => { R.lastId = id; return R.snap(id, { scenario: o.scenario || R.scenario, ...o }) }
const note = (t) => { sink.notes.push(t); console.log('NOTE', t) }
async function step(name, fn) {
  try { await fn() } catch (e) { note(`STEP FAILED [${name}]: ${String(e.message).split('\n')[0]}`) }
}
const IDK = 'I don’t know'
const settle = (ms = 1300) => sleep(ms)
const has = async (name) => (await R.page.getByRole('button', { name, exact: true }).count()) > 0
async function typeAnswer(text = 'a short answer I typed') {
  await R.page.getByLabel('Type a short answer').fill(text); await sleep(200)
}

// ---- A. home + primer
R = await fresh(); R.scenario = 'A home and primer'
await step('A', async () => {
  await R.goto('/'); await snap('A01-home-notStarted', { full: true, tab: true })
  await R.btn('Speak').click(); await R.page.waitForURL('**/primer'); await sleep(900)
  await snap('A02-primer', { full: true })
  await R.page.goBack(); await sleep(600)
})
await R.goto('/?state=inProgress'); await snap('A03-home-inProgress-REFERENCE', { full: true })
await R.goto('/?state=finish'); await snap('A04-home-finish-REFERENCE', { full: true })

// ---- B. voice first run: Recalled, Hinted(retry by voice), Revealed (I don't know), Skipped
R = await fresh(); R.scenario = 'B voice first run'
await step('B', async () => {
  await R.goto('/session'); await snap('B01-t1-idle', { tab: true })
  await R.mic(); await R.btn('Tap to stop').waitFor(); await sleep(900); await snap('B02-t1-recording')
  await R.stopMic(); await R.waitText('Ready to send'); await sleep(400); await snap('B03-t1-readyToSend')
  await R.send(); await sleep(350); await snap('B04-t1-processing')
  await R.btn('Continue').waitFor(); await sleep(700); await snap('B05-t1-result-Recalled')
  await R.continue_(); await snap('B06-t2-idle')
  await R.record(); await R.send(); await R.btn('Try again').waitFor(); await sleep(700); await snap('B07-t2-result-Hinted1', { full: true })
  await R.btn('Try again').click(); await R.btn('Tap to stop').waitFor(); await sleep(800); await snap('B08-t2-hint-recording')
  await R.stopMic(); await R.waitText('Ready to send'); await sleep(400); await snap('B09-t2-hint-readyToSend')
  await R.send(); await R.btn('Continue').waitFor(); await sleep(700); await snap('B10-t2-result-Hinted-retry-recalled')
  await R.continue_(); await snap('B11-t3-idle')
  await R.btn(IDK).click(); await sleep(900); await snap('B12-t3-result-Revealed')
  await R.btn('Continue').click(); await sleep(700); await snap('B13-t4-idle')
  await R.btn('Skip').click(); await sleep(1500); await snap('B14-after-t4-skip', { full: true })
})
await step('B-summary', async () => {
  await R.page.waitForURL('**/summary', { timeout: 6000 }).catch(() => {})
  await sleep(800); await snap('B15-summary-mixed-real-run', { full: true, tab: true })
  note('B: Summary URL after run = ' + R.page.url())
})

// ---- C. review run from Summary, then study plan
await step('C', async () => {
  R.scenario = 'C review run'
  await R.btn('Review what you missed').click(); await sleep(1000); await snap('C01-review-first-term-idle')
  const seen = []
  for (let i = 0; i < 3; i++) {
    if (!(await has('Tap to speak'))) break
    await R.record(); await R.send()
    await R.btn('Continue').waitFor({ timeout: 6000 }); await sleep(600)
    if (i === 0) await snap('C02-review-result-Recalled')
    await R.btn('Continue').click(); await sleep(900); seen.push(R.page.url())
  }
  await sleep(600); await snap('C03-review-summary', { full: true })
  note('C: review ended at ' + R.page.url())
})
await step('C-home', async () => {
  const b = R.page.getByRole('button', { name: /Continue|Review|Finish|Done/ })
  await R.goto('/'); await snap('C04-home-after-review', { full: true })
})

// ---- D. text path from the primer: typed run
R = await fresh(); R.scenario = 'D typed run'
await step('D', async () => {
  await R.goto('/primer')
  await R.page.getByRole('button', { name: /can.t talk right now/ }).click(); await sleep(1000)
  await snap('D01-t1-typeInput-empty', { tab: true })
  note('D: Submit disabled when empty = ' + (await R.page.getByRole('button', { name: 'Submit', exact: true }).isDisabled().catch(() => 'n/a')))
  await typeAnswer(); await snap('D02-t1-typeInput-filled')
  await R.btn('Submit').click(); await sleep(350); await snap('D03-t1-typeProcessing')
  await R.btn('Continue').waitFor(); await sleep(700); await snap('D04-t1-result-typed-Recalled')
  await R.btn('Continue').click(); await sleep(800); await snap('D05-t2-after-continue-mode-sticks')
  await typeAnswer(); await R.btn('Submit').click(); await R.btn('Try again').waitFor(); await sleep(700); await snap('D06-t2-typed-Hinted1')
  await R.btn('Try again').click(); await sleep(800); await snap('D07-t2-typed-retry-input')
  await typeAnswer(); await R.btn('Submit').click(); await R.btn('Continue').waitFor(); await sleep(700); await snap('D08-t2-typed-retry-result')
  await R.btn('Continue').click(); await sleep(800)
  await typeAnswer(); await R.btn('Submit').click(); await sleep(1500); await snap('D09-t3-typed-result-Revealed?')
  await R.btn('Continue').click(); await sleep(800); await snap('D10-t4-typeInput')
  await R.btn('Skip').click(); await sleep(1500)
  note('D: after t4 skip url = ' + R.page.url()); await snap('D11-summary-typed-run', { full: true })
})

// ---- E. close early -> Continue label
R = await fresh(); R.scenario = 'E close early'
await step('E', async () => {
  await R.goto('/session'); await R.record(); await R.send(); await R.btn('Continue').waitFor(); await sleep(500)
  await R.page.getByRole('button', { name: 'Close' }).first().click(); await sleep(1000)
  note('E: after Close url = ' + R.page.url()); await snap('E01-home-after-early-close', { full: true })
  const label = await R.page.getByRole('button', { name: /^(Continue|Review)$/ }).first().innerText().catch(() => 'not found')
  note('E: home primary button label = ' + label)
  await R.page.getByRole('button', { name: /^(Continue|Review)$/ }).first().click(); await sleep(1000)
  note('E: home Continue goes to ' + R.page.url()); await snap('E02-continue-run-first-term')
})

// ---- F. Redo / Resume / Skip on idle with typing / mic denied
R = await fresh(); R.scenario = 'F controls'
await step('F-redo-resume', async () => {
  await R.goto('/session'); await R.record(); await snap('F01-readyToSend')
  await R.btn('Resume').click(); await R.btn('Tap to stop').waitFor(); await sleep(700); await snap('F02-resume-recording-continues')
  await R.stopMic(); await R.waitText('Ready to send'); await sleep(300)
  await R.page.getByRole('button', { name: 'Redo' }).click(); await sleep(800); await snap('F03-after-redo')
})
R = await fresh({ reject: true }); R.scenario = 'F mic denied mid-session'
await step('F-denied', async () => {
  await R.goto('/session'); await R.btn('Tap to speak').click(); await sleep(1200); await snap('F04-mic-denied-after-tap', { full: true, tab: true })
  note('F04: controls = ' + (await R.page.evaluate(() => Array.from(document.querySelectorAll('button')).map((b) => (b.getAttribute('aria-label') || b.innerText).trim().replace(/\s+/g, ' ')).filter(Boolean).join(' | '))))
  note('F04: Steps row present = ' + ((await R.page.getByText(/Topics \d of \d/).count()) > 0))
})
// The way out of the denied screen that keeps the student working.
R = await fresh({ reject: true }); R.scenario = 'F denied -> continue with text'
await step('F-denied-text', async () => {
  await R.goto('/session'); await R.btn('Tap to speak').click(); await sleep(1200)
  await R.btn('Continue with text').click(); await sleep(900); await snap('F07-denied-continue-with-text', { tab: true })
  note('F07: landed on a typing screen = ' + ((await R.page.getByLabel('Type a short answer').count()) > 0) + ', url ' + R.page.url())
})
// Denied on a hint retry, then granted: does it come back to the same screen?
R = await fresh(); R.scenario = 'F denied on hint retry, then granted'
await step('F-denied-retry', async () => {
  await R.goto('/session')
  await R.record(); await R.send(); await R.btn('Continue').waitFor(); await sleep(500); await R.continue_()
  await R.record(); await R.send(); await R.btn('Try again').waitFor(); await sleep(600)
  await snap('F08-hint-retry-before-denial')
  await R.page.evaluate(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')) })
  await R.btn('Try again').click(); await sleep(1200); await snap('F09-denied-on-hint-retry', { full: true })
  await R.page.evaluate(() => { navigator.mediaDevices.getUserMedia = () => Promise.resolve(new MediaStream()) })
  await R.btn('Turn on my microphone').click(); await sleep(1100); await snap('F10-after-granting-back-on-retry')
  note('F10: back on the hint retry screen = ' + ((await R.page.getByRole('button', { name: 'Try again' }).count()) > 0) + ', first attempt still there = ' + ((await R.page.getByRole('button', { name: /Play recording/ }).count()) > 0))
})
R = await fresh(); R.scenario = 'F Type instead on idle'
await step('F-typeinstead', async () => {
  await R.goto('/session'); const t = R.page.getByRole('button', { name: /Type instead|Type/ }).first(); await t.click(); await sleep(800); await snap('F05-idle-type-instead')
  await R.btn('Switch to voice').click(); await sleep(800); await snap('F06-switch-to-voice')
})

// ---- G. 664px viewport
R = await fresh({ viewport: { width: 390, height: 664 } }); R.scenario = 'G 664 viewport'
await step('G', async () => {
  await R.goto('/'); await snap('G01-home-664')
  await R.goto('/session'); await snap('G02-session-idle-664')
  await R.goto('/summary'); await snap('G03-summary-664', { full: true })
})

// ---------------------------------------------------------------------------
// Added for evidence-04, to close the gaps scorecard-04 listed under
// "What this run cannot say". Render and measure only; no scoring.
// ---------------------------------------------------------------------------

// The app frame is a fixed 844 with overflow:hidden, so a fullPage screenshot
// shows exactly what the viewport shows. Evidence-04 read that as a clipped
// table. Scroll the inner <main> and capture what the person actually reaches.
async function snapScrolled(id, o = {}) {
  const main = R.page.locator('main').first()
  if ((await main.count()) === 0) return note(`no <main> to scroll for ${id}`)
  const metrics = await main.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }))
  await main.evaluate((el) => { el.scrollTop = el.scrollHeight })
  await sleep(350)
  await snap(id, o)
  note(`${id}: main scrollHeight ${metrics.scrollHeight} / clientHeight ${metrics.clientHeight} (scrollable = ${metrics.scrollHeight > metrics.clientHeight})`)
  await main.evaluate((el) => { el.scrollTop = 0 })
  await sleep(200)
}

// ---- H. every Summary headline tier and both percent captions, seeded
// through the real store so the copy is whatever the record produces.
const SUMMARY_CASES = [
  ['H01-summary-first-1of4', '/summary', { results: ['Recalled', 'Hinted', 'Revealed', 'Skipped'], reviewResults: [null, null, null, null], firstRunDone: true, lastReview: [] }],
  ['H02-summary-first-2of4', '/summary', { results: ['Recalled', 'Recalled', 'Revealed', 'Skipped'], reviewResults: [null, null, null, null], firstRunDone: true, lastReview: [] }],
  ['H03-summary-first-3of4', '/summary', { results: ['Recalled', 'Recalled', 'Revealed', 'Recalled'], reviewResults: [null, null, null, null], firstRunDone: true, lastReview: [] }],
  ['H04-summary-first-0of4', '/summary', { results: ['Skipped', 'Skipped', 'Revealed', 'Skipped'], reviewResults: [null, null, null, null], firstRunDone: true, lastReview: [] }],
  ['H05-summary-first-4of4', '/summary', { results: ['Recalled', 'Recalled', 'Recalled', 'Recalled'], reviewResults: [null, null, null, null], firstRunDone: true, lastReview: [] }],
  ['H06-summary-review-allRecalled', '/summary?variant=review', { results: ['Recalled', 'Hinted', 'Revealed', 'Skipped'], reviewResults: [null, 'Recalled', 'Recalled', 'Recalled'], firstRunDone: true, lastReview: [1, 2, 3] }],
  ['H07-summary-review-mixed', '/summary?variant=review', { results: ['Recalled', 'Hinted', 'Revealed', 'Skipped'], reviewResults: [null, 'Recalled', 'Revealed', 'Skipped'], firstRunDone: true, lastReview: [1, 2, 3] }],
  ['H08-summary-cold-mixed-FIGMA-SAMPLE', '/summary', null],
  ['H09-summary-cold-review-FIGMA-SAMPLE', '/summary?variant=review', null],
]
R = await fresh(); R.scenario = 'H summary copy tiers'
for (const [id, url, store] of SUMMARY_CASES) {
  await step(id, async () => {
    await R.goto('/')
    await R.page.evaluate((st) => { st ? sessionStorage.setItem('recall-session', JSON.stringify(st)) : sessionStorage.removeItem('recall-session') }, store)
    await R.goto(url); await sleep(700)
    await snap(id, { full: true })
    await snapScrolled(id + '-scrolled')
    const read = await R.page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('main p, main span, main div')).map((e) => e.textContent.trim())
      return {
        headline: document.querySelector('main p')?.textContent.trim(),
        percentLine: all.find((x) => /recalled (this session|in this review)/.test(x) && x.length < 60),
        titles: [...new Set(all.filter((x) => /^(Recalled on your own|Recalled on review|Needed a hint|Revealed|Skipped)$/.test(x)))],
        stats: all.filter((x) => /^\d+\/\d+$|^\d:\d\d$/.test(x)),
      }
    })
    note(`${id}: headline="${read.headline}" | percent="${read.percentLine}" | titles=[${read.titles.join(', ')}] | stats=[${read.stats.join(', ')}]`)
  })
}

// ---- I. reduced-motion run. scorecard-04 could not say whether anything
// respects prefers-reduced-motion, or whether anything animates at all.
R = await fresh({ reducedMotion: 'reduce' }); R.scenario = 'I reduced motion'
await step('I', async () => {
  await R.goto('/'); await snap('I01-home-reducedMotion')
  await R.goto('/session'); await snap('I02-session-idle-reducedMotion')
  await R.mic(); await R.btn('Tap to stop').waitFor(); await sleep(800); await snap('I03-recording-reducedMotion')
  await R.stopMic(); await R.waitText('Ready to send'); await sleep(300)
  await R.send(); await sleep(350); await snap('I04-processing-reducedMotion')
  await R.btn('Continue').waitFor(); await sleep(600); await snap('I05-result-reducedMotion')
})

// ---- J. Primer denied, never captured in evidence-04.
R = await fresh({ reject: true }); R.scenario = 'J primer denied'
await step('J', async () => {
  await R.goto('/primer'); await sleep(600); await snap('J01-primer-intro-beforeTap', { full: true })
  await R.page.getByRole('button', { name: /microphone|Speak|Allow|Start/i }).first().click().catch(() => {})
  await sleep(1400); await snap('J02-primer-after-denied-tap', { full: true, tab: true })
  note('J: url after denied tap = ' + R.page.url())
})

// ---- K. the recording scrim. evidence-04 could only estimate this: its
// in-page contrast reads composited CSS colors and ignores the overlay.
// Sample the rendered pixels instead, inside each text run's own box.
await step('K-scrim', async () => {
  const out = []
  for (const id of ['B02-t1-recording', 'B08-t2-hint-recording', 'I03-recording-reducedMotion']) {
    const file = `${OUT}/screens/${id}.png`
    if (!fs.existsSync(file)) { note(`K: no screenshot for ${id}`); continue }
    const m = JSON.parse(fs.readFileSync(`${OUT}/measure/${id}.json`, 'utf8'))
    const png = PNG.sync.read(fs.readFileSync(file))
    const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
    for (const t of (m.texts || []).slice(0, 40)) {
      const box = (t.rect || [])[0]
      if (!box || box.w < 8 || box.h < 8) continue
      const px = []
      for (let y = Math.round(box.y * 2); y < Math.round((box.y + box.h) * 2) && y < png.height; y++) {
        for (let x = Math.round(box.x * 2); x < Math.round((box.x + box.w) * 2) && x < png.width; x++) {
          const i = (png.width * y + x) << 2
          px.push(lum(png.data[i], png.data[i + 1], png.data[i + 2]))
        }
      }
      if (px.length < 40) continue
      px.sort((a, b) => a - b)
      // Glyph core vs the field it sits on, as a pixel tool reads them.
      const dark = px[Math.floor(px.length * 0.05)]
      const light = px[Math.floor(px.length * 0.95)]
      const ratio = (Math.max(dark, light) + 0.05) / (Math.min(dark, light) + 0.05)
      out.push({ state: id, text: String(t.text).slice(0, 44), nominalRatio: t.nominalRatio ?? null, pixelRatio: Math.round(ratio * 100) / 100, fontPx: t.fontSize ?? null, fontWeight: t.fontWeight ?? null, box })
    }
  }
  fs.writeFileSync(`${OUT}/logs/scrim-contrast.json`, JSON.stringify(out, null, 1))
  note(`K: sampled ${out.length} text runs from the rendered pixels under the recording scrim`)
})


fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(sink.manifest, null, 1))
fs.writeFileSync(`${OUT}/logs/console.json`, JSON.stringify(sink.console, null, 1))
fs.writeFileSync(`${OUT}/logs/notes.json`, JSON.stringify(sink.notes, null, 1))
await browser.close()
console.log('DONE', sink.manifest.length, 'states;', sink.console.length, 'console msgs;', sink.notes.length, 'notes')
