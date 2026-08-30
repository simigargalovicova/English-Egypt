import type { ErrorItem } from '../types'

/** Stage 9 — the learner types the repaired sentence. No multiple choice. */
export const ERROR_ITEMS: ErrorItem[] = [
  {
    id: 'err-01',
    wrong: 'I am like Egypt.',
    rule: 'Normal verbs do not need am/are/is. Just: I like Egypt.',
    answer: {
      acceptedAnswers: ['I like Egypt'],
      rules: [{ requires: [['i like'], ['egypt']], forbids: ['i am like'] }],
      modelAnswer: 'I like Egypt.',
    },
  },
  {
    id: 'err-02',
    wrong: 'Do you are from Slovakia?',
    rule: 'ARE is already the engine. You do not need DO as well.',
    answer: {
      acceptedAnswers: ['Are you from Slovakia'],
      rules: [{ requires: [['are you from'], ['slovakia']], forbids: ['do you are'] }],
      modelAnswer: 'Are you from Slovakia?',
    },
  },
  {
    id: 'err-03',
    wrong: "I don't can speak Arabic.",
    rule: "CAN makes its own negative: can't. Never don't can.",
    answer: {
      acceptedAnswers: ["I can't speak Arabic", 'I cannot speak Arabic'],
      rules: [{ requires: [['i can not speak'], ['arabic']], forbids: ['do not can'] }],
      modelAnswer: "I can't speak Arabic.",
    },
  },
  {
    id: 'err-04',
    wrong: 'I would like order coffee.',
    rule: "After I'd like, use a noun (a coffee) or TO + verb (to order).",
    answer: {
      acceptedAnswers: ["I'd like a coffee", 'I would like a coffee', 'I would like to order a coffee', "I'd like a coffee, please"],
      rules: [{ requires: [['i would like'], ['coffee']], forbids: ['would like order'] }],
      modelAnswer: "I'd like a coffee, please.",
    },
  },
  {
    id: 'err-05',
    wrong: 'Where the toilet is?',
    rule: 'In questions, IS jumps in front: Where is the toilet?',
    answer: {
      acceptedAnswers: ['Where is the toilet'],
      rules: [{ requires: [['where is'], ['toilet']] }],
      modelAnswer: 'Where is the toilet?',
    },
  },
  {
    id: 'err-06',
    wrong: 'I no understand.',
    rule: "English makes negatives with don't, not with no.",
    answer: {
      acceptedAnswers: ["I don't understand", 'I do not understand'],
      rules: [{ requires: [['i do not understand']] }],
      modelAnswer: "I don't understand.",
    },
  },
  {
    id: 'err-07',
    wrong: 'Can you to help me?',
    rule: 'After CAN, use the plain verb: can help, not can to help.',
    answer: {
      acceptedAnswers: ['Can you help me'],
      rules: [{ requires: [['can you help'], ['me']], forbids: ['can you to'] }],
      modelAnswer: 'Can you help me?',
    },
  },
  {
    id: 'err-08',
    wrong: "I am not speak English.",
    rule: "Speak is a normal verb, so the negative is don't speak.",
    answer: {
      acceptedAnswers: ["I don't speak English", 'I do not speak English', "I don't speak English very well"],
      rules: [{ requires: [['i do not speak'], ['english']], forbids: ['am not speak'] }],
      modelAnswer: "I don't speak English.",
    },
  },
  {
    id: 'err-09',
    wrong: 'How much cost it?',
    rule: 'Say How much is it? or How much does it cost?',
    answer: {
      acceptedAnswers: ['How much is it', 'How much does it cost'],
      rules: [{ requires: [['how much'], ['is it', 'does it cost']] }],
      modelAnswer: 'How much is it?',
    },
  },
  {
    id: 'err-10',
    wrong: 'You like coffee?',
    rule: 'Questions with normal verbs start with DO: Do you like coffee?',
    answer: {
      acceptedAnswers: ['Do you like coffee'],
      rules: [{ requires: [['do you like'], ['coffee']] }],
      modelAnswer: 'Do you like coffee?',
    },
  },
]

export const ERRORS_REQUIRED = 8
