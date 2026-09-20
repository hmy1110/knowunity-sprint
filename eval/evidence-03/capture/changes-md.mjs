// Generates CHANGES-SINCE-RUN-2.md from measure/run-comparison.json plus run 2 / run 3 measure files.
// Facts and numbers only. No scores, no opinions.
import fs from 'node:fs'
import { OUT, RUN2 } from './lib.mjs'

const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const cmp = rd(`${OUT}/measure/run-comparison.json`)
const m1 = rd(`${RUN2}/manifest.json`)
const order = m1.map((m) => m.id)
const states = order.filter((id) => cmp.states[id])

// ---- per-state change strings
const changes = {}
for (const id of states) {
  const r = cmp.states[id]
  const list = []
  if (r.urlChanged) list.push(`url ${r.urlChanged.run2} -> ${r.urlChanged.run3}`)
  if (r.scroll.run2.sh !== r.scroll.run3.sh) list.push(`scrollHeight ${r.scroll.run2.sh} -> ${r.scroll.run3.sh}`)
  if (r.bodyText) {
    const a = r.bodyText.run2.split(' | '), b = r.bodyText.run3.split(' | ')
    const only1 = a.filter((x) => !b.includes(x)), only2 = b.filter((x) => !a.includes(x))
    if (only1.length || only2.length) list.push(`visible text: removed [${only1.join(' | ')}]; added [${only2.join(' | ')}]`)
    else list.push('visible text: same items, different order or count')
  }
  for (const e of r.interactive.added) list.push(`control added: "${e.name}" (${e.tag}) own ${e.own.w}x${e.own.h}@${e.own.x},${e.own.y}, hit ${e.hit ? e.hit.w + 'x' + e.hit.h : 'offscreen'}, onClick ${e.hasOnClick}`)
  for (const e of r.interactive.removed) list.push(`control removed: "${e.name}" (${e.tag}) own ${e.own.w}x${e.own.h}@${e.own.x},${e.own.y}, hit ${e.hit ? e.hit.w + 'x' + e.hit.h : 'offscreen'}, onClick ${e.hasOnClick}`)
  for (const c of r.interactive.changed) {
    const bits = []
    for (const rk of ['ownRect', 'unionRect', 'effectiveHit']) if (c[rk]) bits.push(`${rk.replace('Rect', '')} ` + (Array.isArray(c[rk]) ? c[rk].map((x) => JSON.stringify(x)).join(' -> ') : Object.entries(c[rk]).map(([k, v]) => `${k} ${v[0]}->${v[1]}`).join(', ')))
    for (const fk of ['hasOnClick', 'hotspotMarked', 'disabled', 'native']) if (c[fk]) bits.push(`${fk} ${c[fk][0]}->${c[fk][1]}`)
    list.push(`control "${c.name}": ${bits.join('; ')}`)
  }
  for (const t of r.texts.added) list.push(`text added: "${t.text}" ${t.fontSize}px/${t.fontWeight}, y ${t.y}, nominal ${t.nominalRatio}`)
  for (const t of r.texts.removed) list.push(`text removed: "${t.text}" ${t.fontSize}px/${t.fontWeight}, y ${t.y}, nominal ${t.nominalRatio}`)
  for (const t of r.texts.changed) {
    const bits = []
    for (const k of ['fontSize', 'fontWeight', 'color', 'nominalRatio']) if (t[k]) bits.push(`${k} ${t[k][0]}->${t[k][1]}`)
    if (t.rect) bits.push('rect ' + Object.entries(t.rect).map(([k, v]) => `${k} ${v[0]}->${v[1]}`).join(', '))
    list.push(`text "${t.text}": ${bits.join('; ')}`)
  }
  for (const l of r.aria.linesOnlyRun1) if (l.trim()) list.push(`aria line only in run 2: ${l.trim()}`)
  for (const l of r.aria.linesOnlyRun2) if (l.trim()) list.push(`aria line only in run 3: ${l.trim()}`)
  changes[id] = list
}

// ---- aggregate identical change strings across states
const agg = new Map()
for (const id of states) for (const c of changes[id]) { if (!agg.has(c)) agg.set(c, []); agg.get(c).push(id) }
const common = [...agg.entries()].filter(([, ids]) => ids.length >= 4).sort((a, b) => b[1].length - a[1].length)
const commonKey = new Map(common.map(([c], i) => [c, 'K' + String(i + 1).padStart(2, '0')]))

const shortIds = (ids) => {
  // compress runs of ids by prefix letters
  return ids.join(', ')
}

let md = `# Changes since run 2

Neutral list of every state whose render or behaviour differs between \`eval/evidence-02/\` (run 2) and this folder (run 3). Facts and numbers only. No scores, no opinions on whether a change is good.

Code between the two runs: commit \`55d1f5f\` (every S button gets a 48px hit area; the exam-score chip on \`/\` is static), plus \`99c01af\` which touches only \`eval/rubric.md\`. \`git diff --stat 9c5f1dd HEAD -- src\` lists \`src/app/page.tsx\` and \`src/components/Button/Button.tsx\` only. Run 3 uses the same 61 state ids as run 2 and adds ids listed in \`INDEX.md\` (\`-664\` short-viewport states, \`H\` honesty-run states, \`R\` review-run states); those have no run 2 twin and are not compared here.

## How the comparison was made

- **Pixel**: each shared screenshot compared with its run 2 twin (same viewport, 780x1688), per-channel tolerance 8. Diff images: \`diffs/vs-run2/<id>.png\` (red = changed pixel). Full-page twins are compared where both runs have one.
- **Measure**: \`measure/<id>.json\` of run 2 against run 3. Controls are matched by tag and name, text runs by their first 80 characters. Rects match within 0.15 px (controls) or 0.6 px (text); effective hit boxes within 2 px (the grid step). Raw result: \`measure/run-comparison.json\`.
- **Aria**: \`aria/<id>.txt\` compared line by line.
- **Noise floor**: the capture scripts are run 2's, with paths and baselines changed. As a check on the method, the states whose screenshots are pixel-identical to run 2 were also compared by measure: ${(() => { const same = states.filter((id) => cmp.states[id].pixel.identical); const zero = same.filter((id) => changes[id].length === 0); return `${same.length} states are pixel-identical and ${zero.length} of them have 0 measure differences (${same.filter((id) => changes[id].length).join(', ') || 'no exceptions'})` })()}.
- The effective hit box is read on a 2 px grid, so it can move by 2 px without the element moving.

## Summary by state

Pixel columns are the viewport screenshot vs run 2. "measure" is the number of differing measure items (controls + text runs + visible-text line). Full-page pixel column shows only where both runs have a full-page image.

| id | pixel rgb% | pixel luma% | changed box (css px) | full-page rgb% | measure items | common changes |
|---|---|---|---|---|---|---|
`
for (const id of states) {
  const r = cmp.states[id]
  const p = r.pixel
  const box = p.diffBoxCss ? `${p.diffBoxCss.x},${p.diffBoxCss.y} ${p.diffBoxCss.w}x${p.diffBoxCss.h}` : '-'
  const full = r.pixelFull ? (r.pixelFull.sizeMismatch ? `size ${r.pixelFull.sizeMismatch}` : r.pixelFull.rgbDiffPct) : '-'
  const keys = [...new Set(changes[id].map((c) => commonKey.get(c)).filter(Boolean))]
  md += `| ${id} | ${p.rgbDiffPct} | ${p.lumaDiffPct} | ${box} | ${full} | ${changes[id].length} | ${keys.join(' ') || '-'} |\n`
}

md += `\n## States with no difference

Pixel-identical to run 2 (rgb 0%) and no measure difference: ${states.filter((id) => cmp.states[id].pixel.identical && changes[id].length === 0).join(', ') || 'none'}.

Pixel-identical to run 2 with a measure difference (listed per state below): ${states.filter((id) => cmp.states[id].pixel.identical && changes[id].length > 0).join(', ') || 'none'}.

## Changes that recur across states (K-list)

Each line is one measured change that appears in 4 or more states. Values are run 2 -> run 3.

`
for (const [c, ids] of common) md += `- **${commonKey.get(c)}** (${ids.length} states) ${c}\n  - ${shortIds(ids)}\n`

md += `\n## State-specific changes\n\nOnly changes not listed in the K-list. States with nothing extra are omitted.\n\n`
for (const id of states) {
  const own = changes[id].filter((c) => !commonKey.has(c))
  if (!own.length) continue
  md += `### ${id}\n\n`
  for (const c of own) md += `- ${c}\n`
  md += '\n'
}

// ---- behaviour: pair identical flips
const p1 = rd(`${RUN2}/measure/pixel-diffs.json`).diffs, p2 = rd(`${OUT}/measure/pixel-diffs.json`).diffs
const rows = []
for (const a of p1) {
  const b = p2.find((x) => x.a === a.a && x.b === a.b)
  if (!b) continue
  const A = a.identical ? 'identical' : a.rgbDiffPct !== undefined ? `${a.rgbDiffPct}%` : 'size mismatch'
  const B = b.identical ? 'identical' : b.rgbDiffPct !== undefined ? `${b.rgbDiffPct}%` : 'size mismatch'
  if (a.identical !== b.identical) rows.push({ tag: a.tag, a: a.a, b: a.b, A, B, flip: true })
}
md += `## Behaviour: state pairs whose identical / not-identical result flipped

Pairs from \`pixel-diffs.md\` where run 2 and run 3 disagree on "the two screens are pixel-identical". A pair that stays identical or stays different is not listed (percent values for those moved because the Steps row and other components moved; see the tables above).

`
if (rows.length) { md += `| group | A | B | run 2 | run 3 |\n|---|---|---|---|---|\n`; for (const r of rows) md += `| ${r.tag} | ${r.a} | ${r.b} | ${r.A} | ${r.B} |\n` } else md += 'None.\n'

md += `
## Behaviour: term 2 typing (F03 to F06b) and denied mic (F09, F10)

Facts from \`measure/capture-notes.json\`, the pixel-diff rows and the command logs:

- Term 2 "Type instead" tap: input/textarea count ${rd(`${OUT}/measure/capture-notes.json`).termTwoTyping.inputsAfterTypeInsteadTap}, Submit count ${rd(`${OUT}/measure/capture-notes.json`).termTwoTyping.submitButtonsAfterTap} in run 3; run 2 recorded ${(() => { try { const n = rd(`${RUN2}/measure/capture-notes.json`).termTwoTyping; return `${n.inputsAfterTypeInsteadTap} and ${n.submitButtonsAfterTap}` } catch { return 'n/a' } })()}.
- Pixel-diff rows for the F03 to F06b group are in the flip table above (only rows whose identical / not-identical result changed are listed there) and in \`pixel-diffs.md\`.
- Denied mic at term 1 (\`F09\`) against \`C01\`: ${(() => { const d = rd(`${OUT}/measure/pixel-diffs.json`).diffs.find((x) => x.a === 'C01-t1-idle' && x.b.startsWith('F09')); return d ? (d.identical ? 'pixel-identical' : d.rgbDiffPct + '%') : 'pair not in list' })()}. Denied mic at Hinted1 "Try again" (\`F10\`) against \`C12\`: ${(() => { const d = rd(`${OUT}/measure/pixel-diffs.json`).diffs.find((x) => x.a.startsWith('C12') && x.b.startsWith('F10')); return d ? (d.identical ? 'pixel-identical' : d.rgbDiffPct + '%') : 'pair not in list' })()}.

## Contrast rows (runs compared with the same two methods)
`
{
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  void lin
  const key = (id, t) => `${id}|${t.text.slice(0, 80)}|${t.fontSize}`
  const lowSet = (j) => { const s = new Map(); for (const [id, arr] of Object.entries(j)) for (const t of arr) if (t.nominalRatio < 4.5 || (t.renderedRatio !== null && t.renderedRatio !== undefined && t.renderedRatio < 4.5)) s.set(key(id, t), t); return s }
  const c1 = rd(`${RUN2}/measure/contrast-per-state.json`), c2 = rd(`${OUT}/measure/contrast-per-state.json`)
  const s1 = lowSet(c1), s2 = lowSet(c2)
  const gone = [...s1.keys()].filter((k) => !s2.has(k)), added = [...s2.keys()].filter((k) => !s1.has(k))
  const stateCount1 = Object.keys(c1).length, stateCount2 = Object.keys(c2).length
  md += `\nRows under 4.5:1 on either number: run 2 ${s1.size} (${stateCount1} states), run 3 ${s2.size} (${stateCount2} states). Rows are keyed by state, first 80 characters of the text and font size.\n\n`
  const listRows = (keys, s) => keys.map((k) => { const t = s.get(k); return `- ${k.split('|')[0]} "${t.text.slice(0, 60)}" ${t.fontSize}px/${t.fontWeight}: nominal ${t.nominalRatio}, rendered ${t.renderedRatio}` }).join('\n')
  md += `In run 2 only (${gone.length}):\n\n${listRows(gone, s1) || 'none'}\n\nIn run 3 only (${added.length}):\n\n${listRows(added, s2) || 'none'}\n`
  // rows in both whose numbers moved
  const moved = []
  for (const k of s1.keys()) if (s2.has(k)) { const a = s1.get(k), b = s2.get(k); if (Math.abs(a.nominalRatio - b.nominalRatio) > 0.05 || Math.abs((a.renderedRatio ?? 0) - (b.renderedRatio ?? 0)) > 0.05) moved.push(`- ${k.split('|')[0]} "${b.text.slice(0, 60)}": nominal ${a.nominalRatio} -> ${b.nominalRatio}, rendered ${a.renderedRatio} -> ${b.renderedRatio}`) }
  md += `\nIn both runs, numbers moved (${moved.length}):\n\n${moved.join('\n') || 'none'}\n`
}

md += `\n## Hit areas\n`
{
  const h1 = rd(`${RUN2}/measure/hit-areas.json`), h2 = rd(`${OUT}/measure/hit-areas.json`)
  const grp = (h) => { const m = new Map(); for (const e of h) { if (!e.under44) continue; const k = `${e.name}|${e.own}|${e.effectiveHit}`; if (!m.has(k)) m.set(k, []); m.get(k).push(e.state) } return m }
  const g1 = grp(h1), g2 = grp(h2)
  const names1 = new Set([...g1.keys()].map((k) => k.split('|')[0])), names2 = new Set([...g2.keys()].map((k) => k.split('|')[0]))
  md += `\nElements with an effective hit under 44x44: run 2 ${[...g1.values()].reduce((s, v) => s + v.length, 0)} state-element rows over ${g1.size} distinct element sizes; run 3 ${[...g2.values()].reduce((s, v) => s + v.length, 0)} rows over ${g2.size} distinct sizes.\n\n`
  md += `Under 44 in run 2 and not in run 3: ${[...names1].filter((n) => !names2.has(n)).join('; ') || 'none'}.\n\nUnder 44 in run 3 and not in run 2: ${[...names2].filter((n) => !names1.has(n)).join('; ') || 'none'}.\n\n`
  // size changes of same-named controls (aggregate)
  const dims = (x) => { const m = String(x).match(/^([\d.]+)x([\d.]+)$/); return m ? [Number(m[1]), Number(m[2])] : null }
  const hitDiffers = (a, b) => {
    const oa = dims(a.own), ob = dims(b.own), ea = dims(a.effectiveHit), eb = dims(b.effectiveHit)
    if (oa && ob && (Math.abs(oa[0] - ob[0]) > 0.15 || Math.abs(oa[1] - ob[1]) > 0.15)) return true
    if (ea && eb) return Math.abs(ea[0] - eb[0]) > 2.01 || Math.abs(ea[1] - eb[1]) > 2.01
    return !!ea !== !!eb
  }
  const sizes = new Map()
  const idx = (h) => { const m = new Map(); for (const e of h) { const k = `${e.state}|${e.name}`; if (!m.has(k)) m.set(k, e) } return m }
  const i1 = idx(h1), i2 = idx(h2)
  for (const [k, a] of i1) { const b = i2.get(k); if (!b) continue; if (hitDiffers(a, b)) { const kk = `${a.name}: own ${a.own} -> ${b.own}; effective hit ${a.effectiveHit} -> ${b.effectiveHit}`; if (!sizes.has(kk)) sizes.set(kk, []); sizes.get(kk).push(a.state) } }
  md += `Same-named controls whose size changed (own box or effective hit):\n\n`
  for (const [k, ids] of sizes) md += `- ${k} (${ids.length} states: ${ids.join(', ')})\n`
  // inert buttons
  const inert = (h) => { const m = new Map(); for (const e of h) if (e.tag === 'button' && !e.hasOnClick) { if (!m.has(e.name)) m.set(e.name, new Set()); m.get(e.name).add(e.state) } return m }
  const n1 = inert(h1), n2 = inert(h2)
  md += `\nNative buttons with no onClick, by name (states in run 2 / run 3):\n\n`
  for (const name of new Set([...n1.keys(), ...n2.keys()])) md += `- ${name}: ${n1.get(name)?.size ?? 0} / ${n2.get(name)?.size ?? 0}\n`
}

md += `\n## Structure

`
{
  const rowsS = []
  for (const id of states) { const r = cmp.states[id]; if (r.scroll.run2.sh !== r.scroll.run3.sh || r.scroll.run2.sw !== r.scroll.run3.sw) rowsS.push(`${id}: scrollHeight ${r.scroll.run2.sh} -> ${r.scroll.run3.sh}, scrollWidth ${r.scroll.run2.sw} -> ${r.scroll.run3.sw}`) }
  md += rowsS.length ? rowsS.map((x) => `- ${x}`).join('\n') : 'scrollHeight and scrollWidth are the same in every shared state; no horizontal scroll in either run.'
  md += '\n'
}

md += `\n## Animations\n\nSee \`measure/R-reduced-motion-animations.json\`. Run 2: ${(() => { const j = rd(`${RUN2}/measure/R-reduced-motion-animations.json`); const n = (k) => Object.values(j[k]).reduce((s, a) => s + a.length, 0); return `${n('no-preference')} running animations across the 10 loop states without the preference, ${n('reduce')} with it` })()}. Run 3: ${(() => { const j = rd(`${OUT}/measure/R-reduced-motion-animations.json`); const n = (k) => Object.values(j[k]).reduce((s, a) => s + a.length, 0); return `${n('no-preference')} running animations across the 10 loop states without the preference, ${n('reduce')} with it` })()}. Per-state \`animations\` arrays in \`measure/<id>.json\`: ${states.filter((id) => cmp.states[id].animations.run2 !== cmp.states[id].animations.run3).length} shared states differ in count.\n`

md += `\n## Command logs\n\n`
{
  const line = (p) => { try { return fs.readFileSync(p, 'utf8').trim().split('\n').filter((l) => /EXIT/.test(l)).pop() } catch { return 'missing' } }
  const cnt = (p) => { try { return fs.readFileSync(p, 'utf8').trim().split('\n').filter((l) => l && !/^EXIT/.test(l)).length } catch { return 'missing' } }
  md += `| log | run 2 | run 3 |\n|---|---|---|\n`
  md += `| check:tokens exit | ${line(`${RUN2}/logs/check-tokens.txt`)} | ${line(`${OUT}/logs/check-tokens.txt`)} |\n`
  md += `| lint exit | ${line(`${RUN2}/logs/lint.txt`)} | ${line(`${OUT}/logs/lint.txt`)} |\n`
  md += `| build exit | ${line(`${RUN2}/logs/build.txt`)} | ${line(`${OUT}/logs/build.txt`)} |\n`
  for (const g of ['grep-rgba-hsla', 'grep-hex-raw', 'grep-var-fallback', 'grep-primitives']) md += `| ${g}.txt matching lines | ${cnt(`${RUN2}/logs/${g}.txt`)} | ${cnt(`${OUT}/logs/${g}.txt`)} |\n`
  const ck = (p) => { try { return fs.readFileSync(p, 'utf8').split('\n').filter((l) => /Known deviations|No token rule/.test(l)).join(' / ') } catch { return 'missing' } }
  md += `| check:tokens summary lines | ${ck(`${RUN2}/logs/check-tokens.txt`)} | ${ck(`${OUT}/logs/check-tokens.txt`)} |\n`
  const co = (p) => { const j = rd(p); const m = new Map(); for (const e of j) m.set(`${e.type}: ${e.text.slice(0, 70)}`, (m.get(`${e.type}: ${e.text.slice(0, 70)}`) || 0) + 1); return m }
  const o1 = co(`${RUN2}/logs/console.json`), o2 = co(`${OUT}/logs/console.json`)
  md += `\n### Console warnings and errors\n\n`
  for (const k of new Set([...o1.keys(), ...o2.keys()])) md += `- ${k}: run 2 ${o1.get(k) ?? 0}, run 3 ${o2.get(k) ?? 0}\n`
}
fs.writeFileSync(`${OUT}/CHANGES-SINCE-RUN-2.md`, md)
console.log('wrote CHANGES-SINCE-RUN-2.md', md.length, 'chars;', common.length, 'common changes')
