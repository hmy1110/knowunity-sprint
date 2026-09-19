// Fails if src/ breaks a token rule outside a comment or a markdown code span
// (\`...\`) inside a template string. Rules come from CLAUDE.md.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const RULES = [
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

const blank = (s) => s.replace(/[^\n]/g, '')

const files = readdirSync('src', { recursive: true })
  .filter((f) => /\.(tsx?|css)$/.test(f))
  .map((f) => join('src', f))

let count = 0
for (const file of files) {
  const code = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\\`[^`\n]*?\\`/g, '')
  for (const { message, re } of RULES) {
    for (const m of code.matchAll(re)) {
      const line = code.slice(0, m.index).split('\n').length
      console.log(`${file}:${line}  ${m[0].replace(/\s+/g, ' ')}  (${message})`)
      count++
    }
  }
}

if (count) {
  console.error(`\n${count} token rule violation(s) found.`)
  process.exit(1)
}
console.log('No token rule violations in src/.')
