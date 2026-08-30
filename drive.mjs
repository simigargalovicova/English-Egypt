import { chromium } from 'playwright'
const OUT='/tmp/claude-0/-home-user-Medication-emergency-app/bc22dc69-1660-5bf8-a8f1-eb03e314002f/scratchpad/run'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const errs = []
page.on('console', m => { if (m.type()==='error' && !/ERR_(CONNECTION|NAME_NOT_RESOLVED)/.test(m.text())) errs.push(m.text()) })
page.on('pageerror', e => errs.push('pageerror: '+e.message))

const clear = async () => { await page.waitForTimeout(120)
  while (await page.locator('.badge-pop').isVisible().catch(()=>false)) { await page.getByRole('button',{name:'Nice!'}).click(); await page.waitForTimeout(160) } }
const tap = async n => { await clear(); await page.getByRole('button',{name:n}).first().click(); await page.waitForTimeout(220) }
const put = async t => { await clear(); await page.locator('textarea.input, input.input').first().fill(t) }
const shot = n => page.screenshot({ path: `${OUT}/${n}.png` })

await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'load' })
await page.waitForSelector('button.mission')
console.log('loaded:', await page.title())

// --- Stage 1: answer as a real false beginner would, then self-rate
await tap('Cold Start')
await put("I'm from Slovakia.")
await tap("That's my answer")
await shot('a-coldstart-correct')
await tap('I know this')

// a broken answer, to see that nothing is corrected at baseline
await put('I no speak english good')
await tap("That's my answer")
await shot('b-coldstart-nocorrection')
await tap('Show me one good answer'); await shot('c-coldstart-model')
await tap('Almost')

for (const t of ['Can I have some water please','I don\'t understand','I don\'t speak English very well',"I'm from Slovakia"]) {
  await put(t); await tap("That's my answer"); await tap('I know this')
}
await shot('d-baseline-result')
await tap('Start learning')

// --- Stage 2: get one WRONG on purpose to see the teaching feedback
await tap('The English Engine')
const prompt1 = await page.locator('.prompt-big').first().innerText()
console.log('engine prompt:', prompt1.trim())
await tap('Do')                      // "___ you from Slovakia?" -> wrong on purpose
await shot('e-engine-wrong-feedback')
await tap('Continue')

// then answer the rest correctly
const KEY = {'from Slovakia':'Are','like Egypt':'Do','speak English':'Can',hungry:'Are','drink coffee':'Do',swim:'Can','help me':'Can',ready:'Are','want a taxi':'Do','on holiday':'Are','repeat that':'Can','have a room':'Do'}
for (let i=0;i<11;i++){
  const p = await page.locator('.prompt-big').first().innerText()
  const k = Object.keys(KEY).find(k=>p.includes(k))
  await clear(); await page.getByRole('button',{name:KEY[k],exact:true}).first().click(); await page.waitForTimeout(180)
  await tap('Continue')
}
await shot('f-engine-blocks')
await tap('See my score')
const score = await page.locator('.result-banner__score').innerText()
console.log('engine score:', score.trim(), '(pass mark 9/12)')
await shot('g-engine-result')
await tap('Back to the map')
await shot('h-map-progress')

// --- fuzzy matching, live, on a real typed answer
await tap('Sentence Surgery')
for (const w of ['I','am','not','from','Slovakia']) {
  await clear()
  await page.locator('.tile:not(.tile--placed):not(.tile--used)')
    .filter({ hasText: new RegExp(`^${w}$`) }).first().click()
}
await shot('i-tiles-built')
await tap('Check'); await shot('j-tiles-correct')
await tap('Continue')

// the same question typed sloppily: no capital, no question mark
await put('are you from slovakia')
await tap('Check')
const verdict = await page.locator('.feedback__title').first().innerText()
console.log('\n"are you from slovakia" (no caps, no punctuation) ->', JSON.stringify(verdict))
await shot('k-fuzzy-accepted')

const xp = await page.locator('.stat-chip--xp').innerText()
console.log('XP so far:', xp.trim().replace(/\s+/g,' '))

console.log('\nconsole errors:', errs.length ? errs : 'none')
await browser.close(); process.exit(0)
