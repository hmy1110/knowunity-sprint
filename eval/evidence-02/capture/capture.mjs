// Evidence 02 capture. Drives the real UI at http://localhost:3000 and writes screens/, gray/, measure/, aria/, manifest.json.
// Usage: node eval/evidence-02/capture/capture.mjs
// Render and measure only. No scoring.
import fs from 'node:fs'
import { chromium, CHROMIUM_ARGS, OUT, RUN1, BASE, newContext, ensureDirs, sleep, Run, sharp } from './lib.mjs'

ensureDirs()
const run1 = JSON.parse(fs.readFileSync(`${RUN1}/manifest.json`, 'utf8'))
const meta = Object.fromEntries(run1.map((m) => [m.id, { group: m.group, scenario: m.scenario, desc: m.desc }]))
const sink = { manifest: [], console: [], notes: {} }

const browser = await chromium.launch({ headless: true, args: CHROMIUM_ARGS })
let R // current Run

async function fresh({ reducedMotion } = {}) {
  const ctx = await newContext(browser, { reducedMotion })
  const page = await ctx.newPage()
  const r = new Run(page, meta, sink)
  page.on('console', (m) => {
    if (m.type() === 'warning' || m.type() === 'error') sink.console.push({ scenario: r.scenario, type: m.type(), text: m.text(), state: r.lastId || null })
  })
  page.on('pageerror', (e) => sink.console.push({ scenario: r.scenario, type: 'pageerror', text: String(e && e.message || e), state: r.lastId || null }))
  r.ctx = ctx
  return r
}
const snap = async (id, o) => { R.lastId = id; return R.snap(id, o) }
const settle = (ms = 1300) => sleep(ms)

const REJECT = () => {
  navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError'))
}

// ============================================================ A studyplan
R = await fresh()
await R.goto('/')
await snap('A01-studyplan-notStarted-default', { tab: true })
await R.pressed(R.btn('Speak'), () => snap('A02-studyplan-notStarted-speak-pressed'))
await R.page.getByRole('button', { name: 'More options' }).click(); await settle()
await snap('A03-studyplan-kebab-tap-settled')
await R.page.getByText('Finding Ideas', { exact: true }).click(); await settle()
await snap('A04-studyplan-topicnode-tap-settled')
await R.page.mouse.click(36, 790); await settle()
await snap('A05-studyplan-bottomnav-tap-settled')
await R.goto('/?state=bogus'); await snap('A06-studyplan-state-bogus')
await R.goto('/?state=inProgress'); await snap('A07-studyplan-inProgress-REFERENCE')
await R.goto('/?state=finish'); await snap('A08-studyplan-finish-REFERENCE')
await R.goto('/'); await R.btn('Speak').click(); await R.page.waitForURL('**/primer'); await sleep(1000)
await snap('A09-studyplan-speak-destination-primer')

// ============================================================ B summary
await R.goto('/summary')
await snap('B01-summary-mixed-default', { full: true, tab: true })
{ // tag crops from the full-page screenshot
  const rects = await R.page.evaluate(() => {
    const out = {}
    for (const el of document.querySelectorAll('*')) {
      if (el.children.length) continue
      const t = el.textContent.trim()
      if (!['Recalled', 'Hinted', 'Revealed', 'Skipped'].includes(t)) continue
      // tag pill: the text element or its immediate parent, whichever is the ~23px tall pill
      const cand = [el, el.parentElement].map((e) => e.getBoundingClientRect()).find((b) => b.height >= 20 && b.height <= 26 && b.x > 250)
      if (cand) out[t] = { x: cand.x + window.scrollX, y: cand.y + window.scrollY, w: cand.width, h: cand.height }
    }
    return out
  })
  fs.writeFileSync(`${OUT}/measure/B01-tag-rects.json`, JSON.stringify(rects, null, 1))
  for (const [k, r] of Object.entries(rects)) {
    await sharp(`${OUT}/screens/B01-summary-mixed-default-full.png`)
      .extract({ left: Math.round(r.x * 2), top: Math.round(r.y * 2), width: Math.floor(r.w * 2), height: Math.floor(r.h * 2) })
      .toFile(`${OUT}/screens/B01-tag-${k}.png`)
  }
  sink.manifest.push(...['Recalled', 'Hinted', 'Revealed', 'Skipped'].map((k) => ({
    id: `B01-tag-${k}`, group: 'target', scenario: 'B summary', url: '/summary', desc: `crop of the ${k} status tag from B01 full page`, file: `screens/B01-tag-${k}.png`, full: null,
  })))
}
await R.page.evaluate(() => window.scrollTo(0, 99999)); await sleep(500)
await snap('B02-summary-bottom-baseline')
await R.pressed(R.btn('Review what you missed'), () => snap('B02b-summary-review-pressed-scrolled'))
await R.page.evaluate(() => window.scrollTo(0, 99999)); await sleep(300)
await R.pressed(R.btn('Continue'), () => snap('B03b-summary-continue-pressed-scrolled'))
await R.goto('/summary?variant=all-recalled'); await snap('B04-summary-all-recalled', { full: true })
await R.goto('/summary?variant=bogus'); await snap('B05-summary-variant-bogus', { full: true })
await R.goto('/summary'); await R.page.evaluate(() => window.scrollTo(0, 99999)); await sleep(500)
await snap('B06-summary-scrolled-bottom')
await R.goto('/summary'); await R.btn('Back').click(); await R.page.waitForURL(BASE + '/'); await sleep(900)
await snap('B07-summary-back-destination')
await R.goto('/summary'); await R.btn('Continue').click(); await R.page.waitForURL('**/?state=inProgress'); await sleep(900)
await snap('B08-summary-continue-destination')
await R.goto('/summary'); await R.btn('Review what you missed').click(); await R.page.waitForURL('**/session?review=1'); await sleep(900)
await snap('B09-summary-review-destination')

// ============================================================ C/D main walk (one continuous session)
await R.goto('/session')
await snap('C01-t1-idle', { tab: true })
await R.pressed(R.btn('Tap to speak'), () => snap('C02-t1-idle-mic-pressed'))
await R.mic(); await R.btn('Tap to stop').waitFor()
await sleep(900); await snap('C03-t1-recording-a')
await sleep(1300); await snap('C03-t1-recording-b')
await R.stopMic(); await R.waitText('Ready to send'); await sleep(500)
await snap('C04-t1-readyToSend', { tab: true })
await R.btn('Redo').click(); await sleep(800)
await snap('C05-t1-after-redo')
await R.record(); await R.send(); await sleep(300)
await snap('C06-t1-processing')
await R.btn('Continue').waitFor(); await sleep(700)
await snap('C07-t1-resultRecalled')
await R.continue_()
await snap('C08-t2-idle')
await R.mic(); await R.btn('Tap to stop').waitFor(); await sleep(900)
await snap('C09-t2-recording')
await R.stopMic(); await R.waitText('Ready to send'); await sleep(500)
await snap('C10-t2-readyToSend')
await R.send(); await sleep(300)
await snap('C11-t2-processing')
await R.btn('Try again').waitFor(); await sleep(700)
await snap('C12-t2-resultHinted1', { tab: true })
await R.btn('I don’t know').click(); await settle()
await snap('C12b-t2-hinted1-idontknow-tap-settled')
await R.btn('Try again').click(); await R.btn('Tap to stop').waitFor(); await sleep(900)
await snap('C13-t2-Hinted1-recording')
await R.stopMic(); await R.waitText('Ready to send'); await sleep(500)
await snap('D01-t2-Hinted1-readyToSend', { full: true, tab: true })
await R.btn('Resume').click(); await settle()
await snap('D02-t2-Hinted1-readyToSend-resume-tap-settled')
await R.pressed(R.btn('Send'), () => snap('D03-t2-Hinted1-readyToSend-send-pressed'))
await R.pressed(R.btn('Redo'), () => snap('D04-t2-Hinted1-readyToSend-redo-pressed'))
await R.send(); await sleep(300)
await snap('D05-t2-Hinted1-processing')
await R.btn('Continue').waitFor(); await sleep(700)
await snap('E01-t2-Hinted1-recalled', { full: true, tab: true })
await R.pressed(R.btn('Continue'), () => snap('E02-t2-Hinted1-recalled-continue-pressed'))
await R.continue_()
await snap('C17-t3-idle')
await R.btn('I don’t know').click(); await sleep(800)
await snap('C18-t3-resultRevealed')
await R.continue_()
await snap('C19-t4-idle')
await R.btn('Skip').click(); await R.page.waitForURL('**/summary'); await sleep(1200)
await snap('B10-summary-after-real-session', { full: true })

// ============================================================ F failure paths (each replays the real UI to its start)
// F01 reload at Hinted1-recalled
R = await fresh(); await R.goto('/session'); await R.toHinted1Recalled()
await R.page.reload({ waitUntil: 'load' }); await sleep(1000)
await snap('F01-reload-after-Hinted1-recalled')
// F02 Close X at Hinted1
R = await fresh(); await R.goto('/session'); await R.toT2Hinted1()
await R.btn('Close').click(); await R.page.waitForURL(BASE + '/'); await sleep(900)
await snap('F02-close-X-at-Hinted1')
// F03-F06b term 2 typing (now: Type instead is inert on term 2)
R = await fresh(); await R.goto('/session'); await R.toT2Idle()
await snap('F03-t2-idle-before-type')
await R.btn('I don’t know').click(); await settle()
await snap('F04-t2-idle-idontknow-tap-settled')
await R.btn('Type instead').click(); await settle()
const inputs = await R.page.locator('input, textarea').count()
const submits = await R.page.getByRole('button', { name: 'Submit', exact: true }).count()
sink.notes.termTwoTyping = { inputsAfterTypeInsteadTap: inputs, submitButtonsAfterTap: submits, url: R.page.url() }
await snap('F05-t2-typeInput', { desc: "term 2 after tapping \"Type instead\" (settled 1.3s). Run 1: typeInput screen. Run 2: no type-input screen appears; term 2 idle is unchanged", note: `input/textarea count ${inputs}, Submit count ${submits}` })
await snap('F05b-t2-typeInput-filled', { desc: "Run 1: term 2 typeInput with text entered. Run 2: not reachable, no text field exists; same screen as F05 (term 2 idle)", note: `input/textarea count ${inputs}` })
await sleep(500 - 0)
await snap('F06-t2-typeProcessing-0.5s', { desc: "Run 1: term 2 typeProcessing, 0.5s after Submit. Run 2: not reachable, no Submit exists; term 2 idle, captured 0.5s after F05b", note: `Submit count ${submits}` })
await sleep(7000)
await snap('F06b-t2-typeProcessing-7s', { desc: "Run 1: term 2 typeProcessing, 7s after Submit. Run 2: not reachable, no Submit exists; term 2 idle, captured 7s after F06", note: `Submit count ${submits}` })
// F07/F08 term 1 typed path (control) + extra term-1 typeInput states for the Submit default/disabled pair
R = await fresh(); await R.goto('/session')
await R.btn('Type instead').click(); await R.page.locator('input, textarea').first().waitFor(); await sleep(600)
await snap('X01-t1-typeInput', { group: 'extra-run2', scenario: 'F failure paths', desc: 'ADDED IN RUN 2: term 1 typeInput (stands in for run 1 F05, which was term 2)' })
await R.page.locator('input, textarea').first().fill('Inspiration is where ideas come from'); await sleep(300)
const submitBox = await R.btn('Submit').boundingBox()
await snap('X02-t1-typeInput-filled', { group: 'extra-run2', scenario: 'F failure paths', desc: 'ADDED IN RUN 2: term 1 typeInput with text entered (stands in for run 1 F05b)' })
await R.btn('Submit').click(); await sleep(300)
await snap('F07-t1-typeProcessing')
await R.waitText('Nice!', 6000); await sleep(800)
await snap('F08-t1-typeResultRecalled')
fs.writeFileSync(`${OUT}/measure/submit-box-t1.json`, JSON.stringify(submitBox))
// F09 mic denied at term 1
R = await fresh(); await R.goto('/session')
await R.page.evaluate(REJECT)
await R.mic(); await settle()
await snap('F09-t1-mic-denied-settled', { desc: "FAILURE PATH: mic tap with getUserMedia rejecting (NotAllowedError). Run 2 result: the screen does not change (term 1 idle stays)" })
// F10 Try again with mic revoked
R = await fresh(); await R.goto('/session'); await R.toT2Hinted1()
await R.page.evaluate(REJECT)
await R.btn('Try again').click(); await settle()
await snap('F10-t2-tryagain-mic-denied-settled', { desc: "FAILURE PATH: \"Try again\" with getUserMedia rejecting (NotAllowedError). Run 2 result: the screen does not change (Hinted1 result stays)" })
// F11 Redo from Hinted1 ready
R = await fresh(); await R.goto('/session'); await R.toHinted1Ready()
await R.btn('Redo').click(); await sleep(800)
await snap('F11-Hinted1-ready-Redo-result')
// F12 reload at Hinted1 ready
R = await fresh(); await R.goto('/session'); await R.toHinted1Ready()
await R.page.reload({ waitUntil: 'load' }); await sleep(1000)
await snap('F12-reload-at-Hinted1-ready')

// ============================================================ reduced motion
const loopStates = {}
for (const rm of ['no-preference', 'reduce']) {
  R = await fresh({ reducedMotion: rm })
  const anims = async (k) => { await sleep(300); loopStates[rm] = loopStates[rm] || {}; loopStates[rm][k] = await R.page.evaluate(() => document.getAnimations().map((a) => ({ type: a.constructor.name, name: a.animationName || a.transitionProperty || null, target: a.effect && a.effect.target ? a.effect.target.tagName.toLowerCase() : null, playState: a.playState, duration: a.effect ? a.effect.getComputedTiming().duration : null, iterations: a.effect ? String(a.effect.getComputedTiming().iterations) : null }))) }
  await R.goto('/session'); await anims('t1-idle')
  await R.mic(); await R.btn('Tap to stop').waitFor(); await anims('t1-recording')
  await R.stopMic(); await R.waitText('Ready to send'); await anims('t1-readyToSend')
  await R.send(); await anims('t1-processing')
  await R.btn('Continue').waitFor(); await anims('t1-resultRecalled')
  await R.continue_(); await R.record(); await R.send(); await R.btn('Try again').waitFor(); await anims('t2-resultHinted1')
  await R.btn('Try again').click(); await R.btn('Tap to stop').waitFor(); await anims('t2-Hinted1-recording')
  await R.stopMic(); await R.waitText('Ready to send'); await anims('t2-Hinted1-readyToSend')
  await R.send(); await anims('t2-Hinted1-processing')
  await R.btn('Continue').waitFor(); await anims('t2-Hinted1-recalled')
  await R.ctx.close()
}
fs.writeFileSync(`${OUT}/measure/R-reduced-motion-animations.json`, JSON.stringify(loopStates, null, 1))

// ============================================================ write manifest + console
const order = new Map(run1.map((m, i) => [m.id, i]))
sink.manifest.sort((a, b) => (order.has(a.id) ? order.get(a.id) : 999) - (order.has(b.id) ? order.get(b.id) : 999))
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(sink.manifest, null, 1))
fs.writeFileSync(`${OUT}/logs/console.json`, JSON.stringify(sink.console, null, 1))
fs.writeFileSync(`${OUT}/measure/capture-notes.json`, JSON.stringify(sink.notes, null, 1))
await browser.close()
console.log('DONE', sink.manifest.length, 'states;', sink.console.length, 'console entries')
