/**
 * End-to-end smoke test. Drives the entire lesson in a real browser at a phone
 * viewport, asserting that every stage completes, that mastery gates unlock the
 * next mission, that progress survives a reload, and that the app logs nothing
 * to the console.
 *
 *   npm run build && npm run smoke
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { extname, join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname
const SHOTS = new URL('../screenshots/', import.meta.url).pathname
const PORT = Number(process.env.SMOKE_PORT ?? 4188)
const ORIGIN = `http://127.0.0.1:${PORT}`
const CHROME = process.env.CHROME_PATH || undefined

/**
 * The production build may be rooted at a sub-path (GitHub Pages serves this
 * repo from /English-Egypt/). Read the prefix back out of the built HTML so the
 * test exercises exactly what gets deployed, whatever `base` is set to.
 */
async function readBasePath() {
  const html = await readFile(join(DIST, 'index.html'), 'utf8')
  const match = html.match(/<script[^>]+src="([^"]*)\/assets\//)
  const prefix = match ? match[1] : ''
  return prefix.endsWith('/') ? prefix : `${prefix}/`
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json',
}

const steps = []
const problems = []
let step = 'startup'
const ok = (m) => steps.push(`  ✓ ${m}`)
const bad = (m, d) => problems.push(`  ✗ ${m}${d ? ` — ${d}` : ''}`)

function serve(basePath) {
  const server = createServer(async (req, res) => {
    let pathname = decodeURIComponent(req.url.split('?')[0])
    if (basePath !== '/' && pathname.startsWith(basePath)) {
      pathname = `/${pathname.slice(basePath.length)}`
    }
    let file = join(DIST, pathname)
    const info = await stat(file).catch(() => null)
    if (!info || info.isDirectory()) file = join(DIST, 'index.html')
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end('not found')
    }
  })
  return new Promise((r) => server.listen(PORT, '127.0.0.1', () => r(server)))
}

/* ------------------------------------------------------------------ *
 * Answers keyed on what is actually visible on screen, so the script
 * survives the app shuffling item order.
 * ------------------------------------------------------------------ */

const ENGINE = [
  ['from Slovakia', 'Are'], ['like Egypt', 'Do'], ['speak English', 'Can'], ['hungry', 'Are'],
  ['drink coffee', 'Do'], ['swim', 'Can'], ['help me', 'Can'], ['ready', 'Are'],
  ['want a taxi', 'Do'], ['on holiday', 'Are'], ['repeat that', 'Can'], ['have a room', 'Do'],
  ['tired', 'Are'], ['eat fish', 'Do'], ['drive', 'Can'], ['a tourist', 'Are'],
  ['understand me', 'Do'], ['more slowly', 'Can'], ['cold', 'Are'], ['need help', 'Do'],
]

const SURGERY = [
  ['I am from Slovakia', ['I', 'am', 'not', 'from', 'Slovakia'], 'Are you from Slovakia?'],
  ['I like spicy food', ['I', "don't", 'like', 'spicy', 'food'], 'Do you like spicy food?'],
  ['I can speak a little', ['I', "can't", 'speak', 'English', 'very', 'well'], 'Can you speak English?'],
  ['I am hungry', ['I', 'am', 'not', 'hungry'], 'Are you hungry?'],
  ['I want a taxi', ['I', "don't", 'want', 'a', 'taxi'], 'Do you want a taxi?'],
  ['I can swim', ['I', "can't", 'swim'], 'Can you swim?'],
]

// Tiles are lower-cased except for I / proper nouns, so the capital letter
// never gives away which word starts the sentence.
const REORDER = [
  ['dve kávy', ["I'd", 'like', 'two', 'coffees', 'please']],
  ['Kde je reštaurácia', ['where', 'is', 'the', 'restaurant']],
  ['účet', ['can', 'I', 'have', 'the', 'bill', 'please']],
  ['Nehovorím', ['I', "don't", 'speak', 'English', 'very', 'well']],
  ['pomôcť', ['can', 'you', 'help', 'me', 'please']],
  ['jeden týždeň', ["I'm", 'staying', 'for', 'one', 'week']],
]

const SCAFFOLD = [
  ['uterák', ['have', 'a towel']],
  ['toaleta', ['is', 'toilet']],
  ['vodu', ['like', 'some water']],
  ['Nerozumiem', ['understand', 'slowly']],
  ['raňajky', ['time', 'breakfast']],
  ['dovolenke', ['holiday', 'first']],
]

const ERRORS = [
  ['I am like Egypt', 'I like Egypt.'],
  ['Do you are from Slovakia', 'Are you from Slovakia?'],
  ["I don't can speak Arabic", "I can't speak Arabic."],
  ['I would like order coffee', "I'd like a coffee, please."],
  ['Where the toilet is', 'Where is the toilet?'],
  ['I no understand', "I don't understand."],
  ['Can you to help me', 'Can you help me?'],
  ['I am not speak English', "I don't speak English."],
  ['How much cost it', 'How much is it?'],
  ['You like coffee', 'Do you like coffee?'],
]

/** Goal text (English or Slovak) -> a natural answer. Used by every mission. */
const GOALS = [
  ['kde je bazén', 'Where is the pool?'],
  ['where the pool is', 'Where is the pool?'],
  ['o koľkej bazén', 'What time does the pool open?'],
  ['what time the pool opens', 'What time does the pool open?'],
  ['ďalší uterák', 'Can I have another towel, please?'],
  ['another towel', 'Can I have another towel, please?'],
  ['izbe 214', "It's room 214."],
  ['room 214', "It's room 214."],
  ['majú Wi-Fi', 'Is there Wi-Fi here?'],
  ['if there is Wi-Fi', 'Is there Wi-Fi here?'],
  ['na heslo', "What's the password?"],
  ['for the password', "What's the password?"],
  ['o koľkej sú raňajky', 'What time is breakfast?'],
  ['what time breakfast', 'What time is breakfast?'],
  ['kde je reštaurácia', 'Where is the restaurant?'],
  ['where the restaurant is', 'Where is the restaurant?'],
  ['Objednaj si nápoj', "I'd like a water, please."],
  ['Order a drink', "I'd like a water, please."],
  ['Vyber si jednu', 'Still, please.'],
  ['Choose one', 'Still, please.'],
  ['Objednaj si jedlo', 'Can I have the chicken, please?'],
  ['Order some food', 'Can I have the chicken, please?'],
  ['Povedz nie', 'No, thank you.'],
  ['Say no politely', 'No, thank you.'],
  ['bolo dobré', 'It was very good, thank you.'],
  ['it was good', 'It was very good, thank you.'],
  ['Popros o účet', 'Can I have the bill, please?'],
  ['Ask for the bill', 'Can I have the bill, please?'],
  ['objednaj si niečo iné', 'Okay. Can I have the fish instead, please?'],
  ['choose something else', 'Okay. Can I have the fish instead, please?'],
  ['order something else', 'Okay. Can I have the fish instead, please?'],
  ['Prijmi alebo slušne odmietni', 'Yes, please.'],
  ['objednaj len nápoj', "That's okay. Can I have just a drink, please?"],
  ['order only a drink', "That's okay. Can I have just a drink, please?"],
  ['tell them your name', 'Yes, my name is Simona.'],
  ['Hand it over politely', 'Here you are.'],
  ['where the lift is', 'Where is the lift?'],
  ['what time breakfast starts', 'What time is breakfast?'],
  ['something you need in your room', 'Can I have another towel, please?'],
  ['Thank them and say goodnight', 'Thank you very much. Good night!'],
  ['how many people', 'For two, please.'],
  ['React, and choose something else', 'Okay. Can I have the fish instead, please?'],
  ['Say it was good', 'It was delicious, thank you.'],
  ['Say yes, politely', 'Yes, of course.'],
  ['where you are from', "I'm from Slovakia."],
  ['add one more detail', 'Yes, it is my first time in Egypt and I like it a lot.'],
  ['what your job is', "I'm a teacher. I work in a small school."],
  ['Accept, or say no politely', "Yes, I'd like that."],
  ['question back about her holiday', 'Do you like it here?'],
  ['Thank her and say goodbye', 'Thank you. See you later!'],
  ['Say goodbye', 'See you later. Nice to meet you!'],
  ['you are just looking', "Thank you, I'm just looking."],
  ['ask the price', 'Yes, I like it. How much is it?'],
  ['ask for a lower price', "That's too expensive. Can you do 200?"],
  ['say you will take it', "Okay, I'll take it."],
  ['pay by card', 'Can I pay by card?'],
  ['Thank them and say goodbye', 'Thank you very much. Goodbye!'],
]

const SMALL_TALK = [
  ['Where are you from', "I'm from Slovakia, from a small town near Bratislava."],
  ['first time in Egypt', 'Yes, it is my first time here and I really like it.'],
  ['What do you do', 'I am a teacher and I work in a small school in my town.'],
  ['How long are you staying', 'I am staying for one week and I go home on Saturday.'],
  ['Do you like Egypt', 'Yes, I like it a lot because the sea is very beautiful.'],
  ['like doing on holiday', 'I like swimming and reading books by the pool every day.'],
]

const RETRIEVAL = [
  ["I'M", "I'm from Slovakia and I am here on holiday."],
  ["I DON'T", "I don't eat meat, only fish and vegetables."],
  ['CAN YOU', 'Can you help me with my bag, please?'],
  ["I'D LIKE", "I'd like a coffee and some water, please."],
  ['WHERE IS', 'Where is the nearest beach from here?'],
]

/** Longest key wins, so "say goodbye" never shadows "thank them and say goodbye". */
function lookup(table, haystack) {
  const text = haystack.toLowerCase()
  let best = null
  for (const [key, value] of table) {
    if (!text.includes(key.toLowerCase())) continue
    if (!best || key.length > best[0].length) best = [key, value]
  }
  return best ? best[1] : null
}

async function main() {
  await mkdir(SHOTS, { recursive: true })
  const basePath = await readBasePath()
  const BASE = ORIGIN + basePath
  const server = await serve(basePath)
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {})
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })

  page.on('console', (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return
    // Web fonts come from a CDN; a blocked network is the sandbox, not the app.
    if (/ERR_(CONNECTION|NAME_NOT_RESOLVED|INTERNET)/.test(msg.text())) return
    bad(`console.${msg.type()} during "${step}"`, msg.text())
  })
  page.on('pageerror', (err) => bad(`page error during "${step}"`, err.message))

  const btn = (name) => page.getByRole('button', { name, exact: false }).first()
  const shot = (n) => page.screenshot({ path: join(SHOTS, n) })

  let badgesSeen = 0
  /** Badge popups are modal by design; clear any that opened before acting. */
  async function clearBadge() {
    const pop = page.locator('.badge-pop')
    await page.waitForTimeout(80)
    while (await pop.isVisible().catch(() => false)) {
      badgesSeen += 1
      await page.getByRole('button', { name: 'Nice!' }).first().click()
      await page.waitForTimeout(150)
    }
  }
  async function click(target) {
    const loc = typeof target === 'string' ? btn(target) : target
    let last
    for (let attempt = 0; attempt < 4; attempt++) {
      await clearBadge()
      try {
        await loc.waitFor({ state: 'visible', timeout: 8000 })
        await loc.scrollIntoViewIfNeeded()
        await loc.click({ timeout: 4000 })
        return
      } catch (err) {
        last = err
        await page.waitForTimeout(250)
      }
    }
    throw last
  }
  async function fill(text, nth = 0) {
    await clearBadge()
    const f = page.locator('input.input:not([disabled]), textarea.input:not([disabled])').nth(nth)
    await f.waitFor({ state: 'visible', timeout: 10000 })
    await f.fill(text)
  }
  async function answer(text) {
    await fill(text)
    await click('Check')
    await click('Continue')
  }
  async function clickTiles(wordList) {
    for (const word of wordList) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      await click(
        page.locator('.tile:not(.tile--placed):not(.tile--used)')
          .filter({ hasText: new RegExp(`^${escaped}$`) }).first(),
      )
    }
  }
  async function visible(text) {
    await clearBadge()
    return page.getByText(text, { exact: false }).first().isVisible().catch(() => false)
  }
  /** Reads the goal banner and answers whatever mission we are in. */
  async function answerGoal() {
    const goal = await page.locator('.goal-banner').first().innerText()
    const reply = lookup(GOALS, goal)
    if (!reply) throw new Error(`no scripted answer for goal: ${goal.replace(/\n/g, ' | ')}`)
    await fill(reply)
    await click('Check')
    const cont = page.getByRole('button', { name: /Continue|Say it|Finish|Done at|Pay and|See how/ }).first()
    try {
      await click(cont)
    } catch {
      const fb = await page.locator('.feedback').first().innerText().catch(() => '(no feedback)')
      throw new Error(
        `answer rejected — goal: "${goal.replace(/\n/g, ' | ')}" answer: "${reply}" feedback: ${fb.replace(/\n/g, ' | ')}`,
      )
    }
  }

  await page.goto(BASE, { waitUntil: 'load', timeout: 20000 })
  await page.waitForSelector('button.mission', { timeout: 10000 })

  /* ------------------------------------------------------------ map */
  step = 'map'
  const locked = await page.locator('button.mission:disabled').count()
  if (locked === 10) ok('map shows 11 missions with 10 locked')
  else bad('initial locking', `expected 10 locked, got ${locked}`)
  await shot('01-map.png')

  /* --------------------------------------------------------- stage 1 */
  step = 'stage 1 cold start'
  await click('Cold Start')
  const COLD = [
    "I'm from Slovakia.", 'Where is the toilet?', "I'd like some water, please.",
    "I don't understand.", "I don't speak English very well.", "I'm from Slovakia.",
  ]
  for (const line of COLD) {
    await fill(line)
    await click("That's my answer")
    await click('I know this')
  }
  if (await visible('Baseline saved')) ok('stage 1 completes and stores a baseline')
  else bad('stage 1 completion')
  await shot('02-baseline.png')
  await click('Start learning')

  /* --------------------------------------------------------- stage 2 */
  step = 'stage 2 engine'
  await click('The English Engine')
  for (let i = 0; i < 12; i++) {
    const prompt = await page.locator('.prompt-big').first().innerText()
    const choice = lookup(ENGINE, prompt)
    if (!choice) throw new Error(`unknown engine prompt: ${prompt}`)
    await click(page.getByRole('button', { name: choice, exact: true }).first())
    await click('Continue')
  }
  if (await visible('Three engines, three shapes')) ok('stage 2 teaches the pattern only after practice')
  else bad('stage 2 explanation order')
  await shot('03-engine-blocks.png')
  await click('See my score')
  if (await visible('12/12')) ok('stage 2 scores 12/12 and passes its 9/12 gate')
  else bad('stage 2 score')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 3 */
  step = 'stage 3 sentence surgery'
  await click('Sentence Surgery')
  for (let i = 0; i < 6; i++) {
    const base = await page.locator('.prompt-big').first().innerText()
    const row = SURGERY.find(([k]) => base.includes(k))
    if (!row) throw new Error(`unknown surgery base: ${base}`)
    await clickTiles(row[1])
    await click('Check')
    await click('Continue')
    await answer(row[2])
  }
  if (await visible('6/6')) ok('stage 3 scores 6/6 across tiles and typing')
  else bad('stage 3 score')
  await shot('04-surgery.png')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 4 */
  step = 'stage 4 travel chunks'
  await click('Travel Chunks')
  await shot('05-phrase-card.png')
  for (let i = 0; i < 16; i++) {
    const english = await page.locator('.phrase__en').first().innerText()
    await click("Hide it")
    await answer(english)
  }
  if (await visible('Sixteen phrases in your pocket')) ok('stage 4 runs all 16 phrase cards with recall checks')
  else bad('stage 4 completion')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 5 */
  step = 'stage 5 build it'
  await click('Build It')
  await click('Start Level A')
  for (let i = 0; i < 6; i++) {
    const sk = await page.locator('.prompt-big').first().innerText()
    const row = REORDER.find(([k]) => sk.includes(k))
    if (!row) throw new Error(`unknown reorder prompt: ${sk}`)
    await clickTiles(row[1])
    await click('Check')
    await click('Continue')
  }
  await click('On to Level B')
  await click('Start Level B')
  for (let i = 0; i < 6; i++) {
    const sk = await page.locator('.prompt-big').first().innerText()
    const row = SCAFFOLD.find(([k]) => sk.includes(k))
    if (!row) throw new Error(`unknown scaffold prompt: ${sk}`)
    for (let b = 0; b < row[1].length; b++) await fill(row[1][b], b)
    await click('Check')
    await click('Continue')
  }
  await click('On to Level C')
  await click('Start Level C')
  await shot('06-free-production.png')
  for (let i = 0; i < 6; i++) {
    const scenario = await page.locator('.goal-banner').first().innerText()
    const reply = lookup([
      ['another towel', 'Can I have another towel, please?'],
      ['swimming pool', 'Where is the pool?'],
      ['speaking very fast', 'Can you speak more slowly, please?'],
      ['where you come from', "I'm from Slovakia."],
      ['want to pay', 'Can I have the bill, please?'],
      ['breakfast starts', 'What time is breakfast?'],
    ], scenario)
    if (!reply) throw new Error(`unknown level C scenario: ${scenario}`)
    await answer(reply)
  }
  await click('Finish the stage')
  if (await visible('All three levels cleared')) ok('stage 5 clears all three difficulty levels')
  else bad('stage 5 completion')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 6 */
  step = 'stage 6 hotel mission'
  await click('Hotel Mission')
  for (const intent of ['Find the pool', 'Ask for another towel', 'Ask about the Wi-Fi']) {
    await click(intent)
    await answerGoal()
    await answerGoal()
  }
  if (await visible('You survived reception')) ok('stage 6 passes after 3 of 4 branches')
  else bad('stage 6 completion')
  await shot('07-hotel.png')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 8 */
  step = 'stage 8 small talk'
  await click('Small Talk Challenge')
  for (let i = 0; i < 6; i++) {
    const q = await page.locator('.bubble--npc').last().innerText()
    const reply = lookup(SMALL_TALK, q)
    if (!reply) throw new Error(`unknown small talk question: ${q}`)
    await fill(reply)
    await click('Check')
    await click('Send')
  }
  if (await visible('You held a conversation')) ok('stage 8 completes with expanded answers')
  else bad('stage 8 completion')
  await shot('08-smalltalk.png')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 7 */
  step = 'stage 7 restaurant mission'
  await click('Restaurant Mission')
  for (let i = 0; i < 7; i++) await answerGoal()
  if (await visible('Table cleared')) ok('stage 7 handles six turns plus a random surprise')
  else bad('stage 7 completion')
  await shot('09-restaurant.png')
  await click('Back to the map')

  /* --------------------------------------------------------- stage 9 */
  step = 'stage 9 error detective'
  await click('Error Detective')
  for (let i = 0; i < 10; i++) {
    const wrong = await page.locator('.prompt-big').first().innerText()
    const fix = lookup(ERRORS, wrong)
    if (!fix) throw new Error(`unknown broken sentence: ${wrong}`)
    await answer(fix)
  }
  if (await visible('10/10')) ok('stage 9 scores 10/10 and passes its 8/10 gate')
  else bad('stage 9 score')
  await shot('10-errors.png')
  await click('Back to the map')

  /* -------------------------------------------------------- stage 10 */
  step = 'stage 10 final boss'
  await click('Final Boss')
  await shot('11-boss-intro.png')
  await click('Begin')
  for (let i = 0; i < 6; i++) await answerGoal()
  if (await visible('You handled it')) ok('stage 10 passes on turns cleared and structures used')
  else bad('stage 10 completion')
  await shot('12-boss-result.png')
  await click('Back to the map')

  /* -------------------------------------------------------- stage 11 */
  step = 'stage 11 survival english'
  await click('Survival English')
  for (let i = 0; i < 5; i++) {
    const starter = await page.locator('.prompt-big').first().innerText()
    const sentence = lookup(RETRIEVAL, starter)
    if (!sentence) throw new Error(`unknown starter: ${starter}`)
    await fill(sentence)
    await click('Save my sentence')
  }
  const picks = page.locator('button.pick')
  for (let i = 0; i < 5; i++) await click(picks.nth(i))
  await click('Save my survival card')
  if (await visible('My Egypt Survival English')) ok('stage 11 saves five survival sentences')
  else bad('stage 11 completion')
  await shot('13-survival.png')

  /* -------------------------------------------------------- summary */
  step = 'final summary'
  await click('See my full summary')
  if (await visible('Then and now')) ok('summary offers the baseline comparison')
  else bad('summary comparison')
  await click('Do the six again')
  for (const line of COLD) {
    await fill(line)
    await click('Next')
  }
  if (await visible('at the start')) ok('before/after comparison renders')
  else bad('before/after comparison')
  await shot('14-summary.png')

  /* ------------------------------------------------- badges + persistence */
  step = 'persistence'
  const xpBefore = await page.locator('.stat-chip--xp').first().innerText()
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('.stat-chip--xp', { timeout: 10000 })
  const xpAfter = await page.locator('.stat-chip--xp').first().innerText()
  if (xpBefore === xpAfter && parseInt(xpAfter.replace(/\D/g, ''), 10) > 200) {
    ok(`progress persists across a reload (${xpAfter.trim()})`)
  } else {
    bad('persistence', `${xpBefore} vs ${xpAfter}`)
  }

  const unlockedNow = await page.locator('button.mission:disabled').count()
  if (unlockedNow === 0) ok('every mission is unlocked once the lesson is finished')
  else bad('unlocking', `${unlockedNow} still locked`)

  /* -------------------------------------------------------- settings */
  step = 'settings and reset'
  await click(page.getByRole('button', { name: 'Settings and progress' }))
  await shot('15-settings.png')
  await click('Reset all progress')
  await click('Yes, reset everything')
  if (await visible('Progress cleared')) ok('reset progress works')
  else bad('reset progress')
  await click('Back to the map')
  const relocked = await page.locator('button.mission:disabled').count()
  if (relocked === 10) ok('reset re-locks the map')
  else bad('reset re-locks', `${relocked} locked`)

  /* -------------------------------------------- no dead controls anywhere */
  step = 'dead control sweep'
  if (badgesSeen >= 5) ok(`badge popups fired ${badgesSeen} times during the lesson`)
  else bad('badge awards', `only ${badgesSeen} badge popups seen`)

  const dead = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button'))
      .filter((b) => !b.disabled && !b.textContent.trim() && !b.getAttribute('aria-label'))
      .length,
  )
  if (dead === 0) ok('no unlabelled buttons on the map')
  else bad('unlabelled buttons', String(dead))

  await browser.close()
  server.close()
}

try {
  await main()
} catch (err) {
  bad(`fatal during "${step}"`, err.message)
}

console.log(`\nSMOKE TEST\n${steps.join('\n')}`)
if (problems.length) {
  console.log(`\nPROBLEMS\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('\nAll checks passed.')
process.exit(0)
