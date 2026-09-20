// Fails if src/ breaks a token rule outside a comment or a markdown code span
// (\`...\`) inside a template string. Rules come from CLAUDE.md.
//
// Two kinds of rule:
//
// 1. Hard rules (raw hex, var() fallback, primitive color read). Always fail.
//
// 2. Deviation rules. These flag values that bypass the token layer:
//      color-fn      rgb()/rgba()/hsl()/hsla() literal
//      font-family   hard-coded font-family instead of a --type-scale-*-font-family token
//      font-stretch  any font-stretch other than `normal` (docs/sprint-context.md pins it)
//      px-token      px literal equal to a token value (candidate for binding by value)
//    A deviation is allowed only if it is recorded in both places:
//      - at the site: a comment on the same line, or in the comment block directly above,
//        containing  [gap:<id>]
//      - in the ledger: component-gaps.md, in the entry that names what is missing,
//        containing the same  [gap:<id>]
//    A marker whose id has no ledger entry fails, wherever it appears.
//    Deviations that predate this check are counted per file and rule in
//    scripts/check-tokens.baseline.json. A file may not exceed its recorded count.
//    Lower it with:  npm run check:tokens -- --update-baseline
//    (refuses to raise a count unless --allow-increase is also passed).
//
// Deviation rules skip *.stories.* and src/stories/ (Storybook catalog, not shipped UI),
// and @font-face blocks (they define fonts). The px-token rule reads .ts/.tsx only.
// It does not catch a px literal that matches no token; that stays a review call.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const HARD_RULES = [
  {
    message: 'raw hex color, use a semantic token from tokens/tokens.json',
    re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g,
  },
  {
    message: 'var() fallback, a missing token must fail loudly',
    re: /var\(\s*--[\w-]+\s*,/g,
  },
  {
    message: 'primitive color read, bind the semantic layer instead',
    re: /--color-primitives-[\w-]+/g,
  },
]

const PX_PROPS = [
  'gap', 'rowGap', 'columnGap',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingInline', 'paddingBlock',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'top', 'left', 'right', 'bottom',
  'borderRadius', 'fontSize', 'lineHeight',
].join('|')

const DEVIATION_RULES = [
  {
    id: 'color-fn',
    message: 'rgb()/rgba()/hsl()/hsla() literal, bind a semantic color token or record the gap',
    re: /\b(?:rgba?|hsla?)\(/g,
    ext: /\.(tsx?|css)$/,
  },
  {
    id: 'font-family',
    message: 'hard-coded font-family, bind a --type-scale-*-font-family token or record the gap',
    re: /(?:fontFamily|font-family)\s*:\s*(['"`])(?!var\()[^'"`]*\1/g,
    ext: /\.(tsx?|css)$/,
  },
  {
    id: 'font-stretch',
    message: 'font-stretch other than normal, docs/sprint-context.md pins the standard width',
    re: /(?:fontStretch|font-stretch)\s*:\s*['"`]?(?!normal\b|var\()[^\s,;}'"`]+/g,
    ext: /\.(tsx?|css)$/,
  },
  {
    id: 'px-token',
    px: true,
    ext: /\.tsx?$/,
  },
]

const LEDGER = 'component-gaps.md'
const BASELINE = 'scripts/check-tokens.baseline.json'
const TOKENS_CSS = 'build/css/tokens.css'
const MARKER = /\[gap:([a-z0-9][a-z0-9-]*)\]/g

const args = new Set(process.argv.slice(2))
const blank = (s) => s.replace(/[^\n]/g, '')
const lineOf = (text, index) => text.slice(0, index).split('\n').length

// px value -> names of the tokens that carry it (spacing, radius, icon, illustration, font size).
// A match is a prompt to bind the token if the role matches, or to record a gap if it does not.
function loadPxTokens() {
  if (!existsSync(TOKENS_CSS)) {
    console.error(`${TOKENS_CSS} is missing. Run npm run tokens first.`)
    process.exit(1)
  }
  const map = new Map()
  const re = /^\s*(--(?:size-(?:space|radius|icon|illustration)-[\w-]+|type-scale-[\w-]+-font-size)):\s*([\d.]+)px/gm
  for (const m of readFileSync(TOKENS_CSS, 'utf8').matchAll(re)) {
    const value = Number(m[2])
    if (value <= 0 || value >= 1000) continue
    if (!map.has(value)) map.set(value, [])
    map.get(value).push(m[1])
  }
  return map
}

const ledgerIds = new Set(
  existsSync(LEDGER) ? [...readFileSync(LEDGER, 'utf8').matchAll(MARKER)].map((m) => m[1]) : [],
)

// line number -> ids of [gap:...] markers found inside comments on that line
function markersByLine(raw) {
  const map = new Map()
  const add = (index, text) => {
    const start = lineOf(raw, index)
    text.split('\n').forEach((ln, k) => {
      for (const m of ln.matchAll(MARKER)) {
        if (!map.has(start + k)) map.set(start + k, [])
        map.get(start + k).push(m[1])
      }
    })
  }
  for (const m of raw.matchAll(/\/\*[\s\S]*?\*\//g)) add(m.index, m[0])
  for (const m of raw.matchAll(/(^|[^:])\/\/(.*)$/gm)) add(m.index + m[1].length, m[0].slice(m[1].length))
  return map
}

const files = readdirSync('src', { recursive: true })
  .filter((f) => /\.(tsx?|css)$/.test(f))
  .map((f) => join('src', f))

const pxTokens = loadPxTokens()
const hard = []
const unmarked = [] // { file, line, rule, text, message }
const orphanMarkers = [] // { file, line, id }

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const code = raw
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\\`[^`\n]*?\\`/g, '')

  for (const { message, re } of HARD_RULES) {
    for (const m of code.matchAll(re)) {
      hard.push(`${file}:${lineOf(code, m.index)}  ${m[0].replace(/\s+/g, ' ')}  (${message})`)
    }
  }

  const markers = markersByLine(raw)
  for (const [line, ids] of markers) {
    for (const id of ids) if (!ledgerIds.has(id)) orphanMarkers.push({ file, line, id })
  }

  const isStory = /\.stories\.|^src[\\/]stories[\\/]/.test(file)
  if (isStory) continue

  const rawLines = raw.split('\n')
  const codeLines = code.split('\n')
  // a line that held only a comment: non-empty in the source, nothing but braces/space once stripped
  const commentOnly = (i) => rawLines[i].trim() !== '' && codeLines[i].replace(/[{}\s]/g, '') === ''
  const covered = (line) => {
    if (markers.has(line)) return true
    for (let l = line - 1; l >= 1 && commentOnly(l - 1); l--) if (markers.has(l)) return true
    return false
  }

  const scan = file.endsWith('.css') ? code.replace(/@font-face\s*\{[^}]*\}/g, blank) : code
  const found = []
  for (const rule of DEVIATION_RULES) {
    if (!rule.ext.test(file)) continue
    if (rule.px) {
      const numeric = new RegExp(`\\b(?:${PX_PROPS})\\s*:\\s*(\\d+(?:\\.\\d+)?)(?![\\d.%a-z])`, 'g')
      const literal = /(?<![\w.-])(\d+(?:\.\d+)?)px\b/g
      for (const re of [numeric, literal]) {
        for (const m of scan.matchAll(re)) {
          const names = pxTokens.get(Number(m[1]))
          if (!names) continue
          found.push({
            rule: rule.id,
            index: m.index,
            text: m[0].replace(/\s+/g, ' '),
            message: `${m[1]}px equals ${names.join(', ')}. Bind a token only if the role matches (do not bind by value), otherwise record the gap`,
          })
        }
      }
    } else {
      for (const m of scan.matchAll(rule.re)) {
        found.push({ rule: rule.id, index: m.index, text: m[0].replace(/\s+/g, ' '), message: rule.message })
      }
    }
  }
  for (const f of found) {
    const line = lineOf(scan, f.index)
    if (!covered(line)) unmarked.push({ file, line, rule: f.rule, text: f.text, message: f.message })
  }
}

// ---- baseline: existing unmarked deviations, counted per file and rule ----
const counts = {}
for (const u of unmarked) {
  counts[u.file] ??= {}
  counts[u.file][u.rule] = (counts[u.file][u.rule] ?? 0) + 1
}
const recorded = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')).counts ?? {} : {}
const recordedCount = (file, rule) => recorded[file]?.[rule] ?? 0

if (args.has('--update-baseline')) {
  const raised = []
  for (const [file, rules] of Object.entries(counts)) {
    for (const [rule, n] of Object.entries(rules)) if (n > recordedCount(file, rule)) raised.push(`${file}  ${rule}  ${recordedCount(file, rule)} -> ${n}`)
  }
  if (raised.length && !args.has('--allow-increase')) {
    console.error('Refusing to raise the baseline. These would go up:')
    raised.forEach((r) => console.error('  ' + r))
    console.error('Mark each one with [gap:<id>] and log it in component-gaps.md, or pass --allow-increase deliberately.')
    process.exit(1)
  }
  const sorted = Object.fromEntries(
    Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([f, r]) => [f, Object.fromEntries(Object.entries(r).sort(([a], [b]) => a.localeCompare(b)))]),
  )
  writeFileSync(
    BASELINE,
    JSON.stringify(
      {
        _note: 'Deviations that predate the deviation rules in scripts/check-tokens.mjs, counted per file and rule. A file may not exceed its count. Lower it with: npm run check:tokens -- --update-baseline',
        counts: sorted,
      },
      null,
      2,
    ) + '\n',
  )
  const total = Object.values(sorted).flatMap((r) => Object.values(r)).reduce((a, b) => a + b, 0)
  console.log(`Wrote ${BASELINE}: ${total} known deviation(s) in ${Object.keys(sorted).length} file(s).`)
  process.exit(0)
}

let failures = hard.length + orphanMarkers.length
hard.forEach((h) => console.log(h))
for (const o of orphanMarkers) {
  console.log(`${o.file}:${o.line}  [gap:${o.id}]  (marker has no ledger entry, add [gap:${o.id}] to its entry in ${LEDGER})`)
}
for (const [file, rules] of Object.entries(counts)) {
  for (const [rule, n] of Object.entries(rules)) {
    const allowed = recordedCount(file, rule)
    if (n <= allowed) continue
    const over = unmarked.filter((u) => u.file === file && u.rule === rule)
    console.log(`\n${file}: ${n} unmarked ${rule} deviation(s), baseline allows ${allowed}. Mark each new one with [gap:<id>] in a comment at the site and in its ${LEDGER} entry:`)
    for (const u of over) console.log(`${u.file}:${u.line}  ${u.text}  (${u.message})`)
    failures += n - allowed
  }
}

if (failures) {
  console.error(`\n${failures} token rule violation(s) found.`)
  process.exit(1)
}

const known = Object.values(counts).flatMap((r) => Object.values(r)).reduce((a, b) => a + b, 0)
const byRule = {}
for (const u of unmarked) byRule[u.rule] = (byRule[u.rule] ?? 0) + 1
console.log('No token rule violations in src/.')
if (known) {
  console.log(`Known deviations still unmarked (grandfathered in ${BASELINE}): ${known} (${Object.entries(byRule).map(([r, n]) => `${r} ${n}`).join(', ')}).`)
}
const stale = Object.entries(recorded).some(([f, r]) => Object.entries(r).some(([rule, n]) => (counts[f]?.[rule] ?? 0) < n))
if (stale) console.log(`Baseline is higher than the current count. Lower it: npm run check:tokens -- --update-baseline`)
