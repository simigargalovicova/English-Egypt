import type { SurgeryItem } from '../types'

/**
 * Stage 3 — each sentence must be turned into a negative and a question.
 * The learner can tap word tiles or type; both go through the same matcher.
 */
export const SURGERY_ITEMS: SurgeryItem[] = [
  {
    id: 'sur-01',
    base: 'I am from Slovakia.',
    baseSk: 'Som zo Slovenska.',
    engine: 'BE',
    negative: {
      acceptedAnswers: ["I'm not from Slovakia", 'I am not from Slovakia'],
      modelAnswer: "I'm not from Slovakia.",
    },
    question: {
      acceptedAnswers: ['Are you from Slovakia'],
      modelAnswer: 'Are you from Slovakia?',
    },
    negativeTiles: ['I', 'am', 'not', 'from', 'Slovakia'],
  },
  {
    id: 'sur-02',
    base: 'I like spicy food.',
    baseSk: 'Mám rád pikantné jedlo.',
    engine: 'DO',
    negative: {
      acceptedAnswers: ["I don't like spicy food", 'I do not like spicy food'],
      modelAnswer: "I don't like spicy food.",
    },
    question: {
      acceptedAnswers: ['Do you like spicy food'],
      modelAnswer: 'Do you like spicy food?',
    },
    negativeTiles: ['I', "don't", 'like', 'spicy', 'food'],
  },
  {
    id: 'sur-03',
    base: 'I can speak a little English.',
    baseSk: 'Viem trochu po anglicky.',
    engine: 'CAN',
    negative: {
      acceptedAnswers: [
        "I can't speak English very well",
        'I cannot speak English very well',
        "I can't speak a little English",
      ],
      rules: [{ requires: [['i can not'], ['speak'], ['english']] }],
      modelAnswer: "I can't speak English very well.",
    },
    question: {
      acceptedAnswers: ['Can you speak English', 'Can you speak a little English'],
      modelAnswer: 'Can you speak English?',
    },
    negativeTiles: ['I', "can't", 'speak', 'English', 'very', 'well'],
  },
  {
    id: 'sur-04',
    base: 'I am hungry.',
    baseSk: 'Som hladný.',
    engine: 'BE',
    negative: {
      acceptedAnswers: ["I'm not hungry", 'I am not hungry'],
      modelAnswer: "I'm not hungry.",
    },
    question: {
      acceptedAnswers: ['Are you hungry'],
      modelAnswer: 'Are you hungry?',
    },
    negativeTiles: ['I', 'am', 'not', 'hungry'],
  },
  {
    id: 'sur-05',
    base: 'I want a taxi.',
    baseSk: 'Chcem taxík.',
    engine: 'DO',
    negative: {
      acceptedAnswers: ["I don't want a taxi", 'I do not want a taxi'],
      modelAnswer: "I don't want a taxi.",
    },
    question: {
      acceptedAnswers: ['Do you want a taxi'],
      modelAnswer: 'Do you want a taxi?',
    },
    negativeTiles: ['I', "don't", 'want', 'a', 'taxi'],
  },
  {
    id: 'sur-06',
    base: 'I can swim.',
    baseSk: 'Viem plávať.',
    engine: 'CAN',
    negative: {
      acceptedAnswers: ["I can't swim", 'I cannot swim'],
      modelAnswer: "I can't swim.",
    },
    question: {
      acceptedAnswers: ['Can you swim'],
      modelAnswer: 'Can you swim?',
    },
    negativeTiles: ['I', "can't", 'swim'],
  },
]

export const SURGERY_REQUIRED = 5
