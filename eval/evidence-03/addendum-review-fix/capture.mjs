import { chromium } from '/Users/mengyahao/Desktop/knowunity-sprint/node_modules/playwright/index.mjs'
const out = '/Users/mengyahao/Desktop/knowunity-sprint/eval/evidence-03/addendum-review-fix/'
const b = await chromium.launch({ args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'] })
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, colorScheme:'dark', permissions:['microphone'] })
const p = await ctx.newPage()
const txt = async () => (await p.evaluate(() => document.body.innerText)).replace(/\n+/g,' | ').slice(0,200)
await p.goto('http://localhost:3000/session'); await p.waitForTimeout(800); console.log('MAIN t1 :', await txt())
await p.goto('http://localhost:3000/session?review=1'); await p.waitForTimeout(800); console.log('REVIEW t2:', await txt())
await p.screenshot({path: out+'review-idle.png'})
for (const n of [2,3,4]) {
  await p.getByRole('button',{name:'Tap to speak'}).click(); await p.waitForTimeout(500)
  await p.getByRole('button',{name:'Tap to stop'}).click(); await p.waitForTimeout(400)
  await p.getByRole('button',{name:'Send'}).click(); await p.waitForTimeout(2200)
  console.log('REVIEW result t'+n+':', await txt())
  if (n===2) await p.screenshot({path: out+'review-result-t2.png'})
  await p.getByRole('button',{name:'Continue'}).click(); await p.waitForTimeout(700)
}
console.log('END url:', p.url())
console.log('SUMMARY:', await txt())
await p.screenshot({path: out+'summary-review.png', fullPage:true})
await p.goto('http://localhost:3000/summary'); await p.waitForTimeout(600); console.log('MIXED summary:', await txt())
await b.close()
