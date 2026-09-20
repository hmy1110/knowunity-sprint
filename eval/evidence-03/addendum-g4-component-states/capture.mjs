// Renders Storybook stories (http://localhost:6006) at 390px dark and saves the story root as PNG.
import { chromium } from '/Users/mengyahao/Desktop/knowunity-sprint/node_modules/playwright/index.mjs'
import fs from 'fs'
const out = '/Users/mengyahao/Desktop/knowunity-sprint/eval/evidence-03/addendum-g4-component-states/shots/'
const idx = await (await fetch('http://localhost:6006/index.json')).json()
const ids = Object.keys(idx.entries).filter(k => idx.entries[k].type === 'story' && /^components-(button|buttonicon|micbutton)--/.test(k) && /(default|pressed|disabled|idle$|recording|processing$)/.test(k) && !/label-hidden|try-again/.test(k))
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 390, height: 600 }, deviceScaleFactor: 2, colorScheme: 'dark' })).newPage()
for (const id of ids) {
  await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story&globals=backgrounds.value:!hex(0a0e1a)`)
  await p.waitForSelector('#storybook-root > *', { timeout: 15000 })
  await p.waitForTimeout(300)
  await p.locator('#storybook-root').screenshot({ path: out + id + '.png' })
}
fs.writeFileSync(out + '../ids.json', JSON.stringify(ids, null, 1))
console.log('captured', ids.length)
await b.close()
