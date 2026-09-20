// Evidence 02 capture. Drives the real UI at http://localhost:3000 and writes screens/, gray/, measure/, aria/, manifest.json.
// Usage: node eval/evidence-03/capture/capture.mjs
// Render and measure only. No scoring.
import fs from 'node:fs'
import { chromium, CHROMIUM_ARGS, OUT, RUN2, BASE, newContext, ensureDirs, sleep, Run, sharp } from './lib.mjs'

ensureDirs()
const run2 = JSON.parse(fs.readFileSync(`${RUN2}/manifest.json`, 'utf8'))
const meta = Object.fromEntries(run2.map((m) => [m.id, { group: m.group, scenario: m.scenario, desc: m.desc }]))
const sink = { manifest: [], console: [], notes: {} }

const browser = await chromium.launch({ headless: true, args: CHROMIUM_ARGS })
let R // current Run

async function fresh({ reducedMotion, viewport } = {}) {
  const ctx = await newContext(browser, { reducedMotion, viewport })
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
await snap('F05-t2-typeInput', { desc: "term 2 after tapping \"Type instead\" (settled 1.3s). Run 1: typeInput screen. Runs 2 and 3: no type-input screen appears; term 2 idle is unchanged", note: `input/textarea count ${inputs}, Submit count ${submits}` })
await snap('F05b-t2-typeInput-filled', { desc: "Run 1: term 2 typeInput with text entered. Runs 2 and 3: not reachable, no text field exists; same screen as F05 (term 2 idle)", note: `input/textarea count ${inputs}` })
await sleep(500 - 0)
await snap('F06-t2-typeProcessing-0.5s', { desc: "Run 1: term 2 typeProcessing, 0.5s after Submit. Runs 2 and 3: not reachable, no Submit exists; term 2 idle, captured 0.5s after F05b", note: `Submit count ${submits}` })
await sleep(7000)
await snap('F06b-t2-typeProcessing-7s', { desc: "Run 1: term 2 typeProcessing, 7s after Submit. Runs 2 and 3: not reachable, no Submit exists; term 2 idle, captured 7s after F06", note: `Submit count ${submits}` })
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
await snap('F09-t1-mic-denied-settled', { desc: "FAILURE PATH: mic tap with getUserMedia rejecting (NotAllowedError). Result in runs 2 and 3: the screen does not change (term 1 idle stays)" })
// F10 Try again with mic revoked
R = await fresh(); await R.goto('/session'); await R.toT2Hinted1()
await R.page.evaluate(REJECT)
await R.btn('Try again').click(); await settle()
await snap('F10-t2-tryagain-mic-denied-settled', { desc: "FAILURE PATH: \"Try again\" with getUserMedia rejecting (NotAllowedError). Result in runs 2 and 3: the screen does not change (Hinted1 result stays)" })
// F11 Redo from Hinted1 ready
R = await fresh(); await R.goto('/session'); await R.toHinted1Ready()
await R.btn('Redo').click(); await sleep(800)
await snap('F11-Hinted1-ready-Redo-result')
// F12 reload at Hinted1 ready
R = await fresh(); await R.goto('/session'); await R.toHinted1Ready()
await R.page.reload({ waitUntil: 'load' }); await sleep(1000)
await snap('F12-reload-at-Hinted1-ready')


// ============================================================ H feedback-honesty run (run 3 addition)
// One real session driven through all four terms as the app scripts them, with a plain-text log of what is on screen at each step.
{
  const logLines = []
  let step = 0
  const bodyLines = async () => (await R.page.evaluate(() => document.body.innerText.split('\n').map((s) => s.trim()).filter(Boolean))).join(' | ')
  const log = async (action, stateLabel) => {
    step++
    logLines.push(`STEP ${String(step).padStart(2, '0')} | action: ${action} | screen: ${stateLabel} | url: ${R.page.url().replace(BASE, '')}\n         visible text: ${await bodyLines()}`)
  }
  const G = (o) => ({ group: 'honesty', scenario: 'H feedback-honesty run', ...o })
  R = await fresh(); await R.goto('/session')
  await log('open /session', 'term 1 idle')
  await R.record(); await R.send(); await R.btn('Continue').waitFor(); await sleep(700)
  await log('term 1: record, Send', 'term 1 result (Recalled path; Continue shown)')
  await snap('H01-t1-result', G({ desc: 'Honesty run, term 1 after a voice attempt (scripted outcome Recalled)' }))
  await R.continue_()
  await log('Continue', 'term 2 idle')
  await R.record(); await R.send(); await R.btn('Try again').waitFor(); await sleep(700)
  await log('term 2: record, Send', 'term 2 result (Hinted path; Try again shown)')
  await snap('H02-t2-result-hinted', G({ desc: 'Honesty run, term 2 after a voice attempt (scripted outcome Hinted)' }))
  await R.btn('Try again').click(); await R.btn('Tap to stop').waitFor(); await sleep(900); await R.stopMic(); await R.waitText('Ready to send'); await sleep(400)
  await R.send(); await R.btn('Continue').waitFor(); await sleep(700)
  await log('term 2: Try again, record, Send', 'term 2 Hinted1-recalled (retry result; Continue shown)')
  await snap('H03-t2-hinted-retry-result', G({ desc: 'Honesty run, term 2 after the Try again attempt' }))
  await R.continue_()
  await log('Continue', 'term 3 idle')
  await R.btn('I don’t know').click(); await sleep(800)
  await log('term 3: I don’t know', 'term 3 result (Revealed path)')
  await snap('H04-t3-result-revealed', G({ desc: 'Honesty run, term 3 after "I don’t know" (scripted outcome Revealed)' }))
  await R.continue_()
  await log('Continue', 'term 4 idle')
  await snap('H05-t4-idle', G({ desc: 'Honesty run, term 4 idle (Skip in the Steps row)' }))
  await R.btn('Skip').click(); await R.page.waitForURL('**/summary'); await sleep(1200)
  await log('term 4: Skip', 'Summary')
  await snap('H06-summary-after-mixed-run', G({ full: true, desc: 'Honesty run: the Summary reached at the end of the run (term 1 voice attempt, term 2 hint + retry, term 3 I don’t know, term 4 Skip)' }))
  const summaryText = await bodyLines()
  fs.mkdirSync(`${OUT}/logs`, { recursive: true })
  const head = `Session log for the feedback-honesty run (rubric section 7). Driven through the real UI on http://localhost:3000/session, 390x844.\nEach STEP lists the action taken, the screen it produced (state named from which controls were on screen) and every visible text line on it, in DOM order, separated by " | ".\n\nActions taken per term, in order:\n  term 1: one voice attempt (fake microphone), Send\n  term 2: one voice attempt, Send, Try again, one voice attempt, Send\n  term 3: "I don’t know"\n  term 4: Skip\n\n`
  fs.writeFileSync(`${OUT}/logs/session-log.txt`, head + logLines.join('\n') + `\n\nSUMMARY REACHED (H06), visible text:\n${summaryText}\n`)
}

// ============================================================ R review entry (?review=1) (run 3 addition)
{
  const logLines = []
  const bodyLines = async () => (await R.page.evaluate(() => document.body.innerText.split('\n').map((s) => s.trim()).filter(Boolean))).join(' | ')
  const counter = async () => R.page.evaluate(() => { const t = document.body.innerText; return (t.match(/[^\n]*\b\d+\s*(of|\/)\s*\d+[^\n]*/gi) || []).map((x) => x.trim()) })
  const G = (o) => ({ group: 'review', scenario: 'R review run', ...o })
  R = await fresh(); await R.goto('/session?review=1')
  const c0 = await counter()
  await snap('R01-review-entry', G({ full: true, desc: '/session?review=1 first screen' }))
  logLines.push(`R01 /session?review=1 entry | counter-like text lines: ${JSON.stringify(c0)}\n    visible text: ${await bodyLines()}`)
  const stepsEl = await R.page.evaluate(() => { const el = [...document.querySelectorAll('*')].find((e) => !e.children.length && /^\s*Topics?\b/i.test(e.textContent)); return el ? el.textContent.trim() : null })
  logLines.push(`    text node starting "Topic": ${JSON.stringify(stepsEl)}`)
  for (const [termLabel, idn] of [['t2', 'R02'], ['t3', 'R04'], ['t4', 'R06']]) {
    await R.record(); await R.send(); await R.btn('Continue').waitFor(); await sleep(700)
    await snap(`${idn}-review-${termLabel}-result`, G({ desc: `review run, ${termLabel} after a voice attempt` }))
    logLines.push(`${idn} review ${termLabel} result | counter-like: ${JSON.stringify(await counter())}\n    visible text: ${await bodyLines()}`)
    if (termLabel === 't4') { await R.btn('Continue').click(); await R.page.waitForURL('**/summary?variant=all-recalled'); await sleep(1000); break }
    await R.continue_()
    const idi = idn === 'R02' ? 'R03' : 'R05'
    await snap(`${idi}-review-${termLabel === 't2' ? 't3' : 't4'}-idle`, G({ desc: `review run, ${termLabel === 't2' ? 't3' : 't4'} idle` }))
    logLines.push(`${idi} review next term idle | counter-like: ${JSON.stringify(await counter())}\n    visible text: ${await bodyLines()}`)
  }
  await snap('R07-review-summary-all-recalled', G({ full: true, desc: 'review run end: /summary?variant=all-recalled' }))
  logLines.push(`R07 summary at end of review run | url ${R.page.url().replace(BASE, '')}\n    visible text: ${await bodyLines()}`)
  fs.writeFileSync(`${OUT}/logs/review-log.txt`, `Review entry run (?review=1), driven through the real UI. Counter-like = any visible text line matching "N of M" or "N/M".\n\n` + logLines.join('\n') + '\n')
}

// ============================================================ short viewport 390x664 (run 3 addition)
{
  const SV = { width: 390, height: 664 }
  const G = (o) => ({ group: 'short-viewport', scenario: 'S short viewport 390x664', ...o })
  R = await fresh({ viewport: SV })
  await R.goto('/')
  await snap('A01-studyplan-notStarted-default-664', G({ full: true, desc: 'A01 at 390x664' }))
  await R.goto('/summary')
  await snap('B01-summary-mixed-default-664', G({ full: true, desc: 'B01 at 390x664' }))
  R = await fresh({ viewport: SV }); await R.goto('/session'); await R.toHinted1Ready()
  await snap('D01-t2-Hinted1-readyToSend-664', G({ full: true, desc: 'D01 at 390x664' }))
  await R.send(); await R.btn('Continue').waitFor(); await sleep(700)
  await snap('E01-t2-Hinted1-recalled-664', G({ full: true, desc: 'E01 at 390x664' }))
}

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
const order = new Map(run2.map((m, i) => [m.id, i]))
sink.manifest.sort((a, b) => (order.has(a.id) ? order.get(a.id) : 999) - (order.has(b.id) ? order.get(b.id) : 999))
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(sink.manifest, null, 1))
fs.writeFileSync(`${OUT}/logs/console.json`, JSON.stringify(sink.console, null, 1))
fs.writeFileSync(`${OUT}/measure/capture-notes.json`, JSON.stringify(sink.notes, null, 1))
await browser.close()
console.log('DONE', sink.manifest.length, 'states;', sink.console.length, 'console entries')
