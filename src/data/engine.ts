import type { EngineItem } from '../types'

const OPTIONS = ['Are', 'Do', 'Can']

/** Stage 2 — the main round. Twelve mixed items, shown in random order. */
export const ENGINE_ITEMS: EngineItem[] = [
  {
    id: 'eng-01',
    prompt: '___ you from Slovakia?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Use ARE for identity — who you are, where you are from.',
  },
  {
    id: 'eng-02',
    prompt: '___ you like Egypt?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Use DO with normal verbs like like, want, eat, drink.',
  },
  {
    id: 'eng-03',
    prompt: '___ you speak English?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'Use CAN for ability — what you are able to do.',
  },
  {
    id: 'eng-04',
    prompt: '___ you hungry?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Use ARE with feelings and adjectives: hungry, tired, ready.',
  },
  {
    id: 'eng-05',
    prompt: '___ you drink coffee?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Drink is a normal verb, so the question needs DO.',
  },
  {
    id: 'eng-06',
    prompt: '___ you swim?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'Use CAN for ability: can swim, can drive, can cook.',
  },
  {
    id: 'eng-07',
    prompt: '___ you help me, please?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'CAN also makes polite requests: Can you help me?',
  },
  {
    id: 'eng-08',
    prompt: '___ you ready?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Ready is an adjective, so it takes ARE.',
  },
  {
    id: 'eng-09',
    prompt: '___ you want a taxi?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Want is a normal verb — DO you want…?',
  },
  {
    id: 'eng-10',
    prompt: '___ you on holiday?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'No verb here, just a situation — so ARE.',
  },
  {
    id: 'eng-11',
    prompt: '___ you repeat that, please?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'A request again: Can you repeat that, please?',
  },
  {
    id: 'eng-12',
    prompt: '___ you have a room for two nights?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Have is a normal verb here, so it needs DO.',
  },
]

/** Extra items used only for the repair round after a failed mastery check. */
export const ENGINE_REPAIR_ITEMS: EngineItem[] = [
  {
    id: 'engr-01',
    prompt: '___ you tired?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Feelings take ARE: Are you tired?',
  },
  {
    id: 'engr-02',
    prompt: '___ you eat fish?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Eat is a normal verb: Do you eat fish?',
  },
  {
    id: 'engr-03',
    prompt: '___ you drive?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'Ability again: Can you drive?',
  },
  {
    id: 'engr-04',
    prompt: '___ you a tourist?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Identity — a tourist, a teacher, a doctor — takes ARE.',
  },
  {
    id: 'engr-05',
    prompt: '___ you understand me?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Understand is a normal verb: Do you understand?',
  },
  {
    id: 'engr-06',
    prompt: '___ you speak more slowly, please?',
    options: OPTIONS,
    answer: 'Can',
    explanation: 'A polite request uses CAN.',
  },
  {
    id: 'engr-07',
    prompt: '___ you cold?',
    options: OPTIONS,
    answer: 'Are',
    explanation: 'Cold is an adjective here, so ARE.',
  },
  {
    id: 'engr-08',
    prompt: '___ you need help?',
    options: OPTIONS,
    answer: 'Do',
    explanation: 'Need is a normal verb: Do you need help?',
  },
]

export const ENGINE_MASTERY_REQUIRED = 9
export const ENGINE_REPAIR_COUNT = 5
export const ENGINE_REPAIR_REQUIRED = 4
