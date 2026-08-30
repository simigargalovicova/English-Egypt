import type { ColdStartItem } from '../types'

/**
 * Stage 1 — no teaching, no model answers up front. The learner types what
 * they can, rates themselves, and the result is compared with the same six
 * prompts at the very end of the lesson.
 */
export const COLD_START_ITEMS: ColdStartItem[] = [
  {
    id: 'cs-01',
    taskSk: 'Povedz po anglicky: „Som zo Slovenska."',
    taskEn: 'Say that you are from Slovakia.',
    hint: 'Start with I…',
    modelAnswer: "I'm from Slovakia.",
    altModels: ['I am from Slovakia.'],
  },
  {
    id: 'cs-02',
    taskSk: 'Opýtaj sa, kde je toaleta.',
    taskEn: 'Ask where the toilet is.',
    hint: 'Start with Where…',
    modelAnswer: 'Where is the toilet?',
    altModels: ['Excuse me, where is the toilet?', 'Where are the toilets?'],
  },
  {
    id: 'cs-03',
    taskSk: 'Slušne si objednaj vodu.',
    taskEn: 'Order water politely.',
    hint: 'Two ways: Can I… / I’d like…',
    modelAnswer: "I'd like some water, please.",
    altModels: ['Can I have some water, please?', 'Could I have a water, please?'],
  },
  {
    id: 'cs-04',
    taskSk: 'Povedz, že nerozumieš.',
    taskEn: 'Say that you do not understand.',
    hint: "Start with I don't…",
    modelAnswer: "I don't understand.",
    altModels: ['Sorry, I don’t understand.'],
  },
  {
    id: 'cs-05',
    taskSk: 'Povedz, že nehovoríš veľmi dobre po anglicky.',
    taskEn: 'Say that you do not speak English very well.',
    hint: "Start with I don't speak…",
    modelAnswer: "I don't speak English very well.",
    altModels: ["I can't speak English very well.", 'I speak a little English.'],
  },
  {
    id: 'cs-06',
    taskSk: 'Niekto sa ťa spýta: „Where are you from?" Odpovedz.',
    taskEn: 'Answer the question: "Where are you from?"',
    hint: "Start with I'm from…",
    modelAnswer: "I'm from Slovakia.",
    altModels: ["I'm from Slovakia. And you?", 'I am from Bratislava, in Slovakia.'],
  },
]
