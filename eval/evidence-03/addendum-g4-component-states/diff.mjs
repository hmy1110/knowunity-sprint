// Pairwise pixel diff of the story screenshots (per-channel tolerance 8), as in the run's pixel-diffs.
import fs from 'fs'
import { PNG } from '/Users/mengyahao/Desktop/knowunity-sprint/node_modules/pngjs/lib/png.js'
const dir = '/Users/mengyahao/Desktop/knowunity-sprint/eval/evidence-03/addendum-g4-component-states/'
const ids = JSON.parse(fs.readFileSync(dir + 'ids.json'))
const read = id => PNG.sync.read(fs.readFileSync(dir + 'shots/' + id + '.png'))
const diff = (a, b) => {
  const A = read(a), B = read(b); const w = Math.max(A.width, B.width), h = Math.max(A.height, B.height)
  let n = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ia = x < A.width && y < A.height ? (y * A.width + x) * 4 : -1
    const ib = x < B.width && y < B.height ? (y * B.width + x) * 4 : -1
    if (ia < 0 || ib < 0) { n++; continue }
    if (Math.abs(A.data[ia]-B.data[ib])>8 || Math.abs(A.data[ia+1]-B.data[ib+1])>8 || Math.abs(A.data[ia+2]-B.data[ib+2])>8) n++
  }
  return (100 * n / (w * h))
}
const rows = []
const pairs = []
for (const id of ids) {
  if (id.endsWith('-default')) { const p = id.replace('-default', '-pressed'), dsb = id.replace('-default', '-disabled'); if (ids.includes(p)) pairs.push([id, p, 'Default vs Pressed']); if (ids.includes(dsb)) pairs.push([id, dsb, 'Default vs Disabled']) }
}
const mic = ['idle', 'pressed', 'recording', 'processing'].map(s => 'components-micbutton--' + s).filter(i => ids.includes(i))
for (let i = 0; i < mic.length; i++) for (let j = i + 1; j < mic.length; j++) pairs.push([mic[i], mic[j], 'MicButton'])
let md = '# G4 component states (Storybook, 390px dark)\n\nPer-channel tolerance 8. `diff%` = share of pixels that differ.\n\n| pair | A | B | diff% | differs |\n|---|---|---|---|---|\n'
let same = 0
for (const [a, b, kind] of pairs) { const v = diff(a, b); if (v === 0) same++; md += `| ${kind} | ${a.replace('components-','')} | ${b.replace('components-','')} | ${v.toFixed(2)} | ${v > 0 ? 'yes' : '**NO**'} |\n` }
md += `\n${pairs.length} pairs, ${same} identical.\n`
fs.writeFileSync(dir + 'pixel-diffs.md', md)
console.log(pairs.length, 'pairs,', same, 'identical')
console.log(md.split('\n').filter(l => l.includes('**NO**') || /micbutton/.test(l)).join('\n'))
