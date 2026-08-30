import type { SmallTalkItem } from '../types'

/** Stage 8 — a friendly stranger at the pool. Short answers pass, longer ones score. */
export const SMALL_TALK_ITEMS: SmallTalkItem[] = [
  {
    id: 'st-01',
    question: 'Where are you from?',
    questionSk: 'Odkiaľ ste?',
    hint1: 'Start with I…',
    hint2: "I'm from …",
    expandPrompt: 'Now add one more thing — the city, or ask them back.',
    answer: {
      rules: [{ requires: [['i am from', 'i come from', 'from slovakia', 'slovakia']] }],
      modelAnswer: "I'm from Slovakia — from Bratislava. And you?",
      altModels: ["I'm from Slovakia."],
    },
  },
  {
    id: 'st-02',
    question: 'Is this your first time in Egypt?',
    questionSk: 'Ste v Egypte prvýkrát?',
    hint1: 'Yes or no — then say a little more.',
    hint2: 'Yes, it is. / No, I was here …',
    expandPrompt: 'Add why, or when you came before.',
    answer: {
      rules: [
        { requires: [['yes', 'no', 'first time', 'second time']] },
      ],
      modelAnswer: 'Yes, it is. This is my first time in Egypt.',
      altModels: ['No, I was here two years ago.'],
    },
  },
  {
    id: 'st-03',
    question: 'What do you do?',
    questionSk: 'Čo robíte? (Aké máte povolanie?)',
    hint1: 'Say your job with I am…',
    hint2: "I'm a … / I work in …",
    expandPrompt: 'Add where you work, or whether you like it.',
    answer: {
      rules: [
        { requires: [['i am a', 'i am an', 'i work', 'i am unemployed', 'i am retired', 'i am a student', 'i study']] },
      ],
      modelAnswer: "I'm a teacher. I work in a small school.",
      altModels: ['I work in an office in Bratislava.'],
    },
  },
  {
    id: 'st-04',
    question: 'How long are you staying?',
    questionSk: 'Ako dlho tu zostávate?',
    hint1: 'Use a length of time.',
    hint2: "I'm staying for …",
    expandPrompt: 'Add when you go home, or that you wish it were longer.',
    answer: {
      rules: [
        { requires: [['week', 'days', 'nights', 'month', 'day', 'night', 'two weeks', 'ten days']] },
      ],
      modelAnswer: "I'm staying for one week. I go home on Saturday.",
      altModels: ['Ten days. And you?'],
    },
  },
  {
    id: 'st-05',
    question: 'Do you like Egypt?',
    questionSk: 'Páči sa vám Egypt?',
    hint1: 'Answer with I…',
    hint2: 'Yes, I … / I like …',
    expandPrompt: 'Add what exactly you like — the food, the sea, the people.',
    answer: {
      rules: [
        { requires: [['i like', 'i love', 'yes i', 'it is', 'i really like', 'i do not like']] },
      ],
      modelAnswer: 'Yes, I like it a lot. The sea is beautiful.',
      altModels: ['I love it here. The food is very good.'],
    },
  },
  {
    id: 'st-06',
    question: 'What do you like doing on holiday?',
    questionSk: 'Čo radi robíte na dovolenke?',
    hint1: 'I like + verb-ing.',
    hint2: 'I like swimming / reading / walking …',
    expandPrompt: 'Add one more activity, or where you like doing it.',
    answer: {
      rules: [
        { requires: [['i like', 'i love', 'i enjoy']] },
      ],
      modelAnswer: 'I like swimming and reading. I also like walking in the evening.',
      altModels: ['I like relaxing by the pool.'],
    },
  },
]

/** Answers longer than this earn the "you expanded" badge nudge. */
export const EXPANDED_WORD_COUNT = 7
export const SMALL_TALK_EXPANDED_REQUIRED = 3
