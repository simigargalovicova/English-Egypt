import type { AcceptRule, OpenAnswer } from '../types'

/**
 * Answer evaluation for a false-beginner learner.
 *
 * The guiding rule from the lesson design is "communication before
 * perfection": we normalise away everything that does not change meaning
 * (case, punctuation, contractions, doubled spaces) and we accept any of
 * several natural phrasings rather than one exact string.
 */

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bcan't\b/g, 'can not'],
  [/\bcannot\b/g, 'can not'],
  [/\bwon't\b/g, 'will not'],
  [/\bshan't\b/g, 'shall not'],
  [/n't\b/g, ' not'],
  [/\bi'm\b/g, 'i am'],
  [/\bi'd\b/g, 'i would'],
  [/\bi've\b/g, 'i have'],
  [/\bi'll\b/g, 'i will'],
  [/\byou're\b/g, 'you are'],
  [/\byou'd\b/g, 'you would'],
  [/\byou've\b/g, 'you have'],
  [/\byou'll\b/g, 'you will'],
  [/\bwe're\b/g, 'we are'],
  [/\bwe'd\b/g, 'we would'],
  [/\bwe've\b/g, 'we have'],
  [/\bthey're\b/g, 'they are'],
  [/\bthey'd\b/g, 'they would'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\bit's\b/g, 'it is'],
  [/\bthat's\b/g, 'that is'],
  [/\bthere's\b/g, 'there is'],
  [/\bwhat's\b/g, 'what is'],
  [/\bwhere's\b/g, 'where is'],
  [/\bwho's\b/g, 'who is'],
  [/\bhow's\b/g, 'how is'],
  [/\blet's\b/g, 'let us'],
]

/** British/American and other harmless spelling variants. */
const SPELLING: Array<[RegExp, string]> = [
  [/\bholidays\b/g, 'holiday'],
  [/\bvacation\b/g, 'holiday'],
  [/\bfavourite\b/g, 'favorite'],
  [/\btravelling\b/g, 'traveling'],
  [/\bpractise\b/g, 'practice'],
  [/\bwifi\b/g, 'wi fi'],
  [/\bwi-fi\b/g, 'wi fi'],
  [/\bok\b/g, 'okay'],
]

/**
 * Lower-cases, straightens quotes, expands contractions, strips punctuation
 * and collapses whitespace. `I'm from Slovakia.` and `i am from slovakia`
 * both become `i am from slovakia`.
 */
export function normalize(input: string): string {
  let s = (input ?? '').toLowerCase()
  s = s.replace(/[‘’ʼ′]/g, "'")
  s = s.replace(/[“”]/g, '"')
  s = s.replace(/ /g, ' ')
  // Separate the apostrophe forms so the word-boundary rules below can fire.
  s = s.replace(/\s+/g, ' ').trim()
  for (const [re, to] of CONTRACTIONS) s = s.replace(re, to)
  for (const [re, to] of SPELLING) s = s.replace(re, to)
  s = s.replace(/[.,!?;:"()…–—]/g, ' ')
  s = s.replace(/'/g, '')
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

/**
 * Politeness wrappers that never change the message. Stripped only for a
 * second-chance comparison, so "can I have a towel" matches a model answer
 * that ends in "please".
 */
const POLITE_PATTERNS: RegExp[] = [
  /^(hello|hi|hey)\b/,
  /^good (morning|afternoon|evening)\b/,
  /^excuse me\b/,
  /^(sorry|yes|yeah|okay|sure)\b/,
  /\bplease\b/g,
  /\b(thank you|thanks)\b/g,
]

/** Normalises, then removes politeness words that carry no meaning. */
export function normalizeLoose(input: string): string {
  let s = normalize(input)
  for (const re of POLITE_PATTERNS) s = s.replace(re, ' ')
  return s.replace(/\s+/g, ' ').trim()
}

export function words(input: string): string[] {
  const n = normalize(input)
  return n ? n.split(' ') : []
}

/** Classic Levenshtein distance, used only to detect near-misses. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = new Array<number>(b.length + 1)
  let curr = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    const tmp = prev
    prev = curr
    curr = tmp
  }
  return prev[b.length]
}

/** True when two strings differ only by a small typo. */
export function isNearMiss(a: string, b: string): boolean {
  if (!a || !b) return false
  const distance = levenshtein(a, b)
  if (distance === 0) return true
  const allowed = Math.max(1, Math.floor(Math.max(a.length, b.length) / 12))
  return distance <= allowed
}

function ruleMatches(text: string, rule: AcceptRule): boolean {
  const loose = normalizeLoose(text)
  for (const forbidden of rule.forbids ?? []) {
    const f = normalize(forbidden)
    if (f && (text.includes(f) || loose.includes(f))) return false
  }
  for (const group of rule.requires) {
    const hit = group.some((alt) => {
      const a = normalize(alt)
      if (!a) return false
      return text.includes(a) || loose.includes(a)
    })
    if (!hit) return false
  }
  return true
}

export type MatchQuality = 'correct' | 'close' | 'wrong' | 'empty'

export interface MatchResult {
  quality: MatchQuality
  /** The accepted answer that was closest, useful for feedback. */
  nearest?: string
}

/**
 * Evaluates a typed answer against an OpenAnswer spec.
 * `acceptedAnswers` are compared as whole normalised sentences (with a small
 * typo tolerance); `rules` are keyword-shaped and let genuinely open
 * production pass with many different wordings.
 */
export function matchAnswer(input: string, spec: OpenAnswer): MatchResult {
  const text = normalize(input)
  if (!text) return { quality: 'empty' }

  const accepted = spec.acceptedAnswers ?? []
  for (const candidate of accepted) {
    if (text === normalize(candidate)) return { quality: 'correct' }
  }
  // Ignore politeness words when comparing whole sentences too, so
  // "can I have a towel" passes where the model says "please".
  const loose = normalizeLoose(input)
  for (const candidate of accepted) {
    if (loose && loose === normalizeLoose(candidate)) return { quality: 'correct' }
  }

  for (const rule of spec.rules ?? []) {
    if (ruleMatches(text, rule)) return { quality: 'correct' }
  }

  let nearest: string | undefined
  for (const candidate of [...accepted, spec.modelAnswer, ...(spec.altModels ?? [])]) {
    if (
      isNearMiss(text, normalize(candidate)) ||
      (loose.length > 0 && isNearMiss(loose, normalizeLoose(candidate)))
    ) {
      nearest = candidate
      break
    }
  }
  if (nearest) return { quality: 'close', nearest }

  return { quality: 'wrong' }
}

/** Compares a typed answer with a single target sentence (word order drills). */
export function matchExact(input: string, target: string): MatchResult {
  const a = normalize(input)
  const b = normalize(target)
  if (!a) return { quality: 'empty' }
  if (a === b) return { quality: 'correct' }
  if (normalizeLoose(input) === normalizeLoose(target)) return { quality: 'correct' }
  if (isNearMiss(a, b)) return { quality: 'close', nearest: target }
  return { quality: 'wrong' }
}

/* ------------------------------------------------------------------ *
 * Structure detection — powers the Final Boss win condition and the
 * "which engine did you use?" feedback.
 * ------------------------------------------------------------------ */

export type Structure =
  | 'BE'
  | 'DO'
  | 'CAN'
  | 'WOULD_LIKE'
  | 'WH_QUESTION'
  | 'POLITE'
  | 'THERE_IS'
  | 'AFFIRM'
  | 'THANKS'

const STRUCTURE_TESTS: Array<[Structure, RegExp]> = [
  ['BE', /\b(i|you|it|this|we|they|he|she|there)\s+(am|are|is)\b|\b(am|are|is)\s+(i|you|it|this|we|they|he|she|the|a|an|my|your|there)\b/],
  ['DO', /\b(do|does|do not|does not)\s+(i|you|we|they|he|she|it)\b|\b(i|you|we|they)\s+do not\b/],
  ['CAN', /\bcan\b|\bcould\b/],
  ['WOULD_LIKE', /\bwould like\b/],
  ['WH_QUESTION', /\b(what|where|when|how|why|who|which)\b/],
  ['POLITE', /\bplease\b|\bcould\b|\bwould\b|\bexcuse me\b|\bsorry\b/],
  ['THERE_IS', /\bthere (is|are)\b/],
  // Accepting, refusing and thanking are real moves at A1, not filler — the
  // Final Boss counts them so a learner who answers naturally can pass.
  ['AFFIRM', /\b(yes|yeah|no|of course|sure|okay|certainly|absolutely|not for me)\b/],
  ['THANKS', /\b(thank you|thanks)\b/],
]

export function detectStructures(input: string): Structure[] {
  const text = normalize(input)
  const found: Structure[] = []
  for (const [name, re] of STRUCTURE_TESTS) {
    if (re.test(text)) found.push(name)
  }
  return found
}

/* ------------------------------------------------------------------ *
 * Gentle coaching on classic false-beginner slips.
 * ------------------------------------------------------------------ */

export interface Slip {
  match: string
  note: string
  fix?: string
}

const SLIPS: Array<{ re: RegExp; note: string; fix?: string }> = [
  {
    re: /\b(i|you|we|they) (am|are|is) (like|want|need|have|speak|eat|drink|live|work|go|come|understand)\b/,
    note: 'Normal verbs do not take am/are/is. Say "I like", not "I am like".',
    fix: 'I like Egypt.',
  },
  {
    re: /\bdo you are\b|\bdo you is\b/,
    note: 'Use ARE on its own for identity and feelings: "Are you from Slovakia?"',
    fix: 'Are you from Slovakia?',
  },
  {
    re: /\b(do not|does not) can\b/,
    note: 'CAN makes its own negative: "I can\'t", never "I don\'t can".',
    fix: "I can't speak Arabic.",
  },
  {
    re: /\bcan (to )?(speak|swim|help|have|go|come|eat|drink|understand) \b.*\bto \b/,
    note: 'After CAN use the plain verb: "can speak", not "can to speak".',
  },
  {
    re: /\bcan (to |(you|i|we|they|he|she) to )\b/,
    note: 'After CAN use the plain verb: "can help", not "can to help".',
    fix: 'Can you help me?',
  },
  {
    re: /\bwould like (order|have|drink|eat|book|buy)\b/,
    note: 'After "I\'d like" use TO + verb, or just a noun: "I\'d like a coffee."',
    fix: "I'd like a coffee.",
  },
  {
    re: /\bi no \b|\byou no \b/,
    note: 'Make negatives with don\'t: "I don\'t understand."',
    fix: "I don't understand.",
  },
  {
    re: /\bwhere (the|a) [a-z ]+ is\b/,
    note: 'In questions the verb comes first: "Where is the toilet?"',
    fix: 'Where is the toilet?',
  },
  {
    re: /\b(what|where|when|how) (you|i|we|they) (like|want|need|speak|do|go|live|work)\b/,
    note: 'Questions with normal verbs need DO: "Where do you live?"',
  },
  {
    re: /\bi am agree\b/,
    note: 'Say "I agree" — agree is a normal verb.',
    fix: 'I agree.',
  },
  {
    re: /\bi have (\d+|one|two|three|twenty|thirty|forty) years\b/,
    note: 'Age uses BE in English: "I am 30."',
    fix: 'I am 30 years old.',
  },
  {
    re: /\bhow much cost\b|\bhow much is cost\b/,
    note: 'Say "How much is it?" or "How much does it cost?"',
    fix: 'How much is it?',
  },
]

/** Returns coaching notes for slips found in an answer (may be empty). */
export function findSlips(input: string): Slip[] {
  const text = normalize(input)
  const out: Slip[] = []
  for (const slip of SLIPS) {
    const m = text.match(slip.re)
    if (m) out.push({ match: m[0], note: slip.note, fix: slip.fix })
  }
  return out.slice(0, 2)
}

/** Rough word count, used to nudge learners to add one extra detail. */
export function wordCount(input: string): number {
  return words(input).length
}

/** Shuffles a copy of an array (Fisher-Yates). */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = items.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Picks `count` random items without repeats. */
export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length))
}
