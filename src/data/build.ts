import type { FreeItem, ReorderItem, ScaffoldItem } from '../types'

/** Stage 5 Level A — arrange the given words. */
export const REORDER_ITEMS: ReorderItem[] = [
  {
    id: 'ra-01',
    tiles: ['two', 'please', 'coffees', "I'd", 'like'],
    answer: "I'd like two coffees, please.",
    slovak: 'Prosím si dve kávy.',
    explanation: "I'd like + what you want + please. The polite order never changes.",
  },
  {
    id: 'ra-02',
    tiles: ['is', 'where', 'the', 'restaurant'],
    answer: 'Where is the restaurant?',
    slovak: 'Kde je reštaurácia?',
    explanation: 'In WHERE questions, IS comes before the thing: Where is the…?',
  },
  {
    id: 'ra-03',
    tiles: ['have', 'I', 'can', 'the', 'bill', 'please'],
    answer: 'Can I have the bill, please?',
    slovak: 'Môžem dostať účet, prosím?',
    explanation: 'Can I have + the thing + please. Your safest request in English.',
  },
  {
    id: 'ra-04',
    tiles: ['speak', "don't", 'I', 'English', 'well', 'very'],
    answer: "I don't speak English very well.",
    slovak: 'Nehovorím veľmi dobre po anglicky.',
    explanation: "don't + plain verb. Then very well goes at the end.",
  },
  {
    id: 'ra-05',
    tiles: ['you', 'can', 'me', 'help', 'please'],
    answer: 'Can you help me, please?',
    slovak: 'Môžete mi pomôcť, prosím?',
    explanation: 'Can you + plain verb + me. Never "can you to help".',
  },
  {
    id: 'ra-06',
    tiles: ['staying', "I'm", 'one', 'for', 'week'],
    answer: "I'm staying for one week.",
    slovak: 'Zostávam jeden týždeň.',
    explanation: "I'm staying for + a length of time.",
  },
]

/** Stage 5 Level B — the shape is given, the learner fills the gaps. */
export const SCAFFOLD_ITEMS: ScaffoldItem[] = [
  {
    id: 'rb-01',
    slovak: 'Môžem dostať uterák, prosím?',
    scaffold: 'Can I _ _, please?',
    blanks: [
      ['have', 'get'],
      ['a towel', 'towel', 'another towel', 'one towel'],
    ],
    modelAnswer: 'Can I have a towel, please?',
    hint: 'The first gap is the verb you always use after "Can I".',
  },
  {
    id: 'rb-02',
    slovak: 'Kde je toaleta?',
    scaffold: 'Where _ the _?',
    blanks: [
      ['is'],
      ['toilet', 'toilets', 'bathroom', 'restroom'],
    ],
    modelAnswer: 'Where is the toilet?',
    hint: 'One small verb, then the place.',
  },
  {
    id: 'rb-03',
    slovak: 'Prosím si vodu.',
    scaffold: "I'd _ _, please.",
    blanks: [
      ['like'],
      ['some water', 'water', 'a water', 'a bottle of water'],
    ],
    modelAnswer: "I'd like some water, please.",
    hint: "I'd is short for I would. What comes next?",
  },
  {
    id: 'rb-04',
    slovak: 'Nerozumiem. Môžete hovoriť pomalšie?',
    scaffold: "I don't _. Can you speak more _, please?",
    blanks: [
      ['understand'],
      ['slowly', 'slow'],
    ],
    modelAnswer: "I don't understand. Can you speak more slowly, please?",
    hint: 'Two of the most useful words for a traveller.',
  },
  {
    id: 'rb-05',
    slovak: 'O koľkej sú raňajky?',
    scaffold: 'What _ is _?',
    blanks: [
      ['time'],
      ['breakfast'],
    ],
    modelAnswer: 'What time is breakfast?',
    hint: 'What ____ is …? — the word you need is about the clock.',
  },
  {
    id: 'rb-06',
    slovak: 'Som tu na dovolenke. Som v Egypte prvýkrát.',
    scaffold: "I'm here on _. This is my _ time in Egypt.",
    blanks: [
      ['holiday', 'vacation'],
      ['first', '1st'],
    ],
    modelAnswer: "I'm here on holiday. This is my first time in Egypt.",
    hint: 'Two classic small-talk sentences.',
  },
]

/** Stage 5 Level C — no English and no Slovak on screen. Produce it. */
export const FREE_ITEMS: FreeItem[] = [
  {
    id: 'rc-01',
    scenario: 'You are at hotel reception. You need another towel.',
    scenarioSk: 'Si na recepcii. Potrebuješ ďalší uterák.',
    hint1: 'Make a polite request.',
    hint2: 'Can I have …',
    answer: {
      acceptedAnswers: [
        'Can I have another towel, please',
        'Could I have another towel, please',
        'Can I get another towel, please',
      ],
      rules: [
        { requires: [['can i have', 'could i have', 'can i get', 'may i have', 'i would like', 'can we have'], ['towel']] },
      ],
      modelAnswer: 'Can I have another towel, please?',
      altModels: ['Could I have another towel, please?'],
    },
  },
  {
    id: 'rc-02',
    scenario: 'You are in the lobby and you cannot find the swimming pool.',
    scenarioSk: 'Si v hale a nevieš nájsť bazén.',
    hint1: 'Ask for a place.',
    hint2: 'Where is …',
    answer: {
      acceptedAnswers: ['Where is the pool', 'Where is the swimming pool'],
      rules: [
        { requires: [['where is', 'where are', 'how do i get to', 'how can i get to'], ['pool']] },
      ],
      modelAnswer: 'Where is the pool?',
      altModels: ['Excuse me, where is the swimming pool?'],
    },
  },
  {
    id: 'rc-03',
    scenario: 'The waiter is speaking very fast. You want them to slow down.',
    scenarioSk: 'Čašník hovorí veľmi rýchlo. Chceš, aby spomalil.',
    hint1: 'Ask them politely to change how they speak.',
    hint2: 'Can you speak …',
    answer: {
      acceptedAnswers: [
        'Can you speak more slowly, please',
        'Could you speak more slowly, please',
        'Can you speak slowly, please',
      ],
      rules: [{ requires: [['can you', 'could you'], ['slowly', 'slower', 'slow']] }],
      modelAnswer: 'Can you speak more slowly, please?',
      altModels: ['Could you speak more slowly, please?'],
    },
  },
  {
    id: 'rc-04',
    scenario: 'A stranger at the pool asks where you come from.',
    scenarioSk: 'Cudzí človek pri bazéne sa pýta, odkiaľ si.',
    hint1: 'Answer with I…',
    hint2: "I'm from …",
    answer: {
      acceptedAnswers: ["I'm from Slovakia", 'I am from Slovakia'],
      rules: [{ requires: [['i am from', 'i come from']] }],
      modelAnswer: "I'm from Slovakia.",
      altModels: ["I'm from Slovakia. And you?"],
    },
  },
  {
    id: 'rc-05',
    scenario: 'You have finished your meal. You want to pay.',
    scenarioSk: 'Dojedol si. Chceš zaplatiť.',
    hint1: 'Ask for the piece of paper with the price on it.',
    hint2: 'Can I have …',
    answer: {
      acceptedAnswers: [
        'Can I have the bill, please',
        'Could I have the bill, please',
        'Can we have the bill, please',
        'Can I have the check, please',
      ],
      rules: [
        { requires: [['can i have', 'could i have', 'can we have', 'could we have', 'i would like'], ['bill', 'check']] },
        { requires: [['i would like to pay', 'can i pay', 'could i pay']] },
      ],
      modelAnswer: 'Can I have the bill, please?',
      altModels: ['Could we have the bill, please?'],
    },
  },
  {
    id: 'rc-06',
    scenario: 'You want to know what time breakfast starts.',
    scenarioSk: 'Chceš vedieť, o koľkej sú raňajky.',
    hint1: 'Ask a question about the clock.',
    hint2: 'What time …',
    answer: {
      acceptedAnswers: ['What time is breakfast', 'When is breakfast'],
      rules: [{ requires: [['what time', 'when'], ['breakfast']] }],
      modelAnswer: 'What time is breakfast?',
      altModels: ['When is breakfast?'],
    },
  },
]

export const BUILD_REQUIRED_PER_LEVEL = 4
