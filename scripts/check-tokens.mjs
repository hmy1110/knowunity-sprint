// Fails if a raw hex color appears in src/ outside a comment or a markdown
// code span (\`...\`) inside a template string.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g
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
  code.split('\n').forEach((line, i) => {
    for (const hex of line.match(HEX) ?? []) {
      console.log(`${file}:${i + 1}  ${hex}`)
      count++
    }
  })
}

if (count) {
  console.error(`\n${count} raw hex color(s) found. Use a token from tokens/tokens.json.`)
  process.exit(1)
}
console.log('No raw hex colors in src/.')
