import type { BadgeDef, LocationDef, StageDef, StageId } from '../types'

export const LOCATIONS: LocationDef[] = [
  {
    id: 'airport',
    name: 'Cairo Airport',
    slovakName: 'Letisko',
    emoji: '🛬',
    blurb: 'You land. Passport in hand, English somewhere in your head.',
  },
  {
    id: 'hotel',
    name: 'Hotel Reception',
    slovakName: 'Hotel',
    emoji: '🏨',
    blurb: 'Check in, ask for what you need, survive the front desk.',
  },
  {
    id: 'pool',
    name: 'The Pool',
    slovakName: 'Bazén',
    emoji: '🌴',
    blurb: 'Sun, water, and a friendly stranger who wants to chat.',
  },
  {
    id: 'restaurant',
    name: 'The Restaurant',
    slovakName: 'Reštaurácia',
    emoji: '🍽️',
    blurb: 'Order, react to surprises, and ask for the bill.',
  },
  {
    id: 'bazaar',
    name: 'The Bazaar',
    slovakName: 'Trhovisko',
    emoji: '🏺',
    blurb: 'Noise, colour, and English that needs repairing fast.',
  },
  {
    id: 'oasis',
    name: 'The Oasis',
    slovakName: 'Oáza',
    emoji: '🐫',
    blurb: 'The final test — no hints, no Slovak, just you.',
  },
]

export const STAGES: StageDef[] = [
  {
    id: 'coldstart',
    num: 1,
    locationId: 'airport',
    title: 'Cold Start',
    slovakTitle: 'Čo už vieš?',
    tagline: 'What can you already do? No teaching yet.',
    minutes: 5,
    icon: '🎒',
    teacher: {
      objective:
        'Get a baseline. Find out what the learner can already produce under mild pressure, before any input.',
      targetGrammar: ['I am …', 'Where is …?', "Can I have …?", "I don't …"],
      correct: ['Nothing yet. This stage is diagnosis, not correction.'],
      ignore: [
        'All errors. Do not correct at this stage.',
        'Long pauses — silence here is data.',
      ],
      prompts: [
        '"Just try. Any words are fine."',
        '"Say it out loud first, then type it."',
      ],
      moveOn:
        'Move on as soon as all six prompts have an attempt, even if most are empty or wrong. The comparison at the end of the lesson is the payoff.',
    },
  },
  {
    id: 'engine',
    num: 2,
    locationId: 'airport',
    title: 'The English Engine',
    slovakTitle: 'Motor angličtiny',
    tagline: 'BE vs DO vs CAN — pick the right engine.',
    minutes: 10,
    icon: '⚙️',
    teacher: {
      objective:
        'Learner reliably chooses between the three question engines: ARE (identity/feelings), DO (normal verbs), CAN (ability/requests).',
      targetGrammar: ['Are you …?', 'Do you …?', 'Can you …?'],
      correct: [
        'Wrong engine choice — this is the whole point of the stage.',
        '"Do you are …?" — the classic double-engine error.',
      ],
      ignore: ['Pronunciation', 'Spelling of the content word'],
      prompts: [
        '"Is it a feeling or a normal verb?"',
        '"Say the sentence out loud — which one sounds right?"',
      ],
      moveOn:
        'At least 9 of 12 correct. Below that the app generates a repair round automatically — let it run rather than explaining more.',
    },
  },
  {
    id: 'surgery',
    num: 3,
    locationId: 'hotel',
    title: 'Sentence Surgery',
    slovakTitle: 'Operácia vety',
    tagline: 'Turn a statement into a negative and a question.',
    minutes: 8,
    icon: '🩺',
    teacher: {
      objective:
        'Learner can transform a positive statement into a negative and into a question, keeping the same engine.',
      targetGrammar: ["I'm not …", "I don't …", "I can't …", 'Are you …?', 'Do you …?', 'Can you …?'],
      correct: [
        'Engine switching mid-sentence ("I don\'t can").',
        'Missing DO in questions ("You like coffee?").',
      ],
      ignore: ['Contraction vs full form — both are accepted.', 'Capital letters'],
      prompts: [
        '"Same engine. Just move it or add NOT."',
        '"What word goes first in the question?"',
      ],
      moveOn: 'At least 5 of 6 items correct after feedback.',
    },
  },
  {
    id: 'chunks',
    num: 4,
    locationId: 'hotel',
    title: 'Travel Chunks',
    slovakTitle: 'Užitočné frázy',
    tagline: 'Sixteen phrases that do most of the work abroad.',
    minutes: 7,
    icon: '🧳',
    teacher: {
      objective:
        'Learner meets, hears and immediately retrieves 16 high-frequency travel frames.',
      targetGrammar: ["I'd like …", 'Can I have …?', 'Where is …?', 'Can you …?', "I'm …"],
      correct: ['Only the frame itself. The content word can be anything.'],
      ignore: ['Word choice inside the frame', 'Articles (a/the) at this stage'],
      prompts: [
        '"Listen once, then say it before you type."',
        '"Cover the screen. What was the phrase?"',
      ],
      moveOn:
        'All 16 cards seen and each recall check attempted. Speed matters more than perfection here.',
    },
  },
  {
    id: 'build',
    num: 5,
    locationId: 'hotel',
    title: 'Build It',
    slovakTitle: 'Postav vetu',
    tagline: 'Reorder → fill the gaps → produce it yourself.',
    minutes: 8,
    icon: '🧱',
    teacher: {
      objective:
        'Move the learner from arranging given words to producing a sentence with no English on screen.',
      targetGrammar: ["I'd like …", 'Can I have …?', 'Could I …?', 'Where is …?'],
      correct: ['Word order in requests', 'Missing "please" is fine; missing verb is not'],
      ignore: ['Choice of polite form (can/could/may)'],
      prompts: [
        '"Level C has no Slovak. Try before you use a hint."',
        '"Say it, then type it."',
      ],
      moveOn: 'All three levels finished with at least 4 of 5 correct in each.',
    },
  },
  {
    id: 'hotel',
    num: 6,
    locationId: 'hotel',
    title: 'Hotel Mission',
    slovakTitle: 'Misia: Hotel',
    tagline: 'Four things to sort out at reception.',
    minutes: 8,
    icon: '🔑',
    teacher: {
      objective:
        'Learner chooses an intention and produces their own sentence for it, then handles the reply.',
      targetGrammar: ['Can I have …?', 'Where is …?', 'What time …?', 'Is there …?'],
      correct: [
        'Only what blocks understanding.',
        'Recast once after the learner finishes the whole turn.',
      ],
      ignore: ['Articles', 'Tiny word-order slips that keep the meaning'],
      prompts: [
        '"What do you actually want? Say that first in Slovak, then in English."',
        '"Shorter is fine. One clear sentence."',
      ],
      moveOn: 'At least 3 of the 4 branches completed.',
    },
  },
  {
    id: 'smalltalk',
    num: 8,
    locationId: 'pool',
    title: 'Small Talk Challenge',
    slovakTitle: 'Small talk pri bazéne',
    tagline: 'Answer a friendly stranger — and add one extra detail.',
    minutes: 6,
    icon: '☀️',
    teacher: {
      objective:
        'Learner answers common social questions and extends beyond a one-word answer.',
      targetGrammar: ["I'm from …", "I'm here on holiday", "I'm staying for …", 'I like …'],
      correct: ['Only errors that confuse the listener.'],
      ignore: [
        'Short answers on the first attempt — the app nudges for more.',
        'Prepositions of time (for/since)',
      ],
      prompts: [
        '"Now add one more thing. Why? How long? With who?"',
        '"Ask them the same question back."',
      ],
      moveOn: 'All six questions answered; at least three answers expanded.',
    },
  },
  {
    id: 'restaurant',
    num: 7,
    locationId: 'restaurant',
    title: 'Restaurant Mission',
    slovakTitle: 'Misia: Reštaurácia',
    tagline: 'A full meal, from drinks to the bill — with one surprise.',
    minutes: 10,
    icon: '🍲',
    teacher: {
      objective:
        'Learner sustains a six-turn transactional conversation and reacts to an unexpected problem.',
      targetGrammar: ["I'd like …", 'Can I have …?', 'Could we have the bill?', 'Yes, please / No, thank you'],
      correct: ['Breakdown of meaning only. Recast after the mission, not during.'],
      ignore: ['Countable/uncountable slips', 'Menu vocabulary'],
      prompts: [
        '"They said no. What do you say now?"',
        '"How do you ask to pay?"',
      ],
      moveOn: 'All six turns plus the surprise handled.',
    },
  },
  {
    id: 'errors',
    num: 9,
    locationId: 'bazaar',
    title: 'Error Detective',
    slovakTitle: 'Detektív chýb',
    tagline: 'Ten broken sentences. Repair them by typing.',
    minutes: 6,
    icon: '🔍',
    teacher: {
      objective:
        'Learner notices and repairs the errors they are most likely to make themselves.',
      targetGrammar: ['All three engines', 'Question word order'],
      correct: ['Everything here — this stage is explicitly about accuracy.'],
      ignore: ['Spelling typos, which the app marks as "almost".'],
      prompts: [
        '"Which engine is wrong?"',
        '"Read it aloud. Where does it break?"',
      ],
      moveOn: 'At least 8 of 10 correct.',
    },
  },
  {
    id: 'finalboss',
    num: 10,
    locationId: 'oasis',
    title: 'Final Boss',
    slovakTitle: 'Finálna výzva',
    tagline: 'One random scenario, six turns, no Slovak.',
    minutes: 8,
    icon: '🏆',
    teacher: {
      objective:
        'Unsupported transfer. The learner handles a whole interaction without scaffolding.',
      targetGrammar: ['Everything from the lesson, mixed'],
      correct: ['Nothing during the mission. Debrief afterwards with one or two recasts.'],
      ignore: ['Almost everything. Judge whether the message worked.'],
      prompts: [
        '"You can use a hint, but try first."',
        '"It does not need to be perfect. It needs to work."',
      ],
      moveOn:
        'Passed when the meaning got through in at least 4 of 6 turns without a full-answer hint, using at least 4 different target structures.',
    },
  },
  {
    id: 'retrieval',
    num: 11,
    locationId: 'oasis',
    title: 'Survival English',
    slovakTitle: 'Moja záchranná angličtina',
    tagline: 'Five sentence starters from memory, then pick your five.',
    minutes: 5,
    icon: '📜',
    teacher: {
      objective:
        'Free recall with everything hidden, then the learner chooses the five sentences they will actually use.',
      targetGrammar: ["I'm …", "I don't …", 'Can you …?', "I'd like …", 'Where is …?'],
      correct: ['Only what stops the sentence working.'],
      ignore: ['Ambition — reward any original sentence.'],
      prompts: [
        '"Your own sentence. Not one from the lesson."',
        '"Which five would save you at the airport tomorrow?"',
      ],
      moveOn: 'All five starters used and five survival sentences saved.',
    },
  },
]

/** Stages in the order the learner walks the map. */
export const STAGE_ORDER: StageId[] = STAGES.map((s) => s.id)

export function getStage(id: StageId): StageDef {
  const stage = STAGES.find((s) => s.id === id)
  if (!stage) throw new Error(`Unknown stage: ${id}`)
  return stage
}

export function stagesForLocation(locationId: string): StageDef[] {
  return STAGES.filter((s) => s.locationId === locationId)
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-sentence',
    name: 'First Sentence',
    slovakName: 'Prvá veta',
    emoji: '🌱',
    description: 'You produced your first English sentence of the lesson.',
  },
  {
    id: 'grammar-detective',
    name: 'Grammar Detective',
    slovakName: 'Detektív gramatiky',
    emoji: '🔍',
    description: 'You repaired at least 8 of 10 broken sentences.',
  },
  {
    id: 'hotel-survivor',
    name: 'Hotel Survivor',
    slovakName: 'Prežil si hotel',
    emoji: '🔑',
    description: 'You handled reception in English.',
  },
  {
    id: 'restaurant-ready',
    name: 'Restaurant Ready',
    slovakName: 'Pripravený na reštauráciu',
    emoji: '🍽️',
    description: 'You ordered, reacted to a problem and asked for the bill.',
  },
  {
    id: 'small-talk-starter',
    name: 'Small Talk Starter',
    slovakName: 'Majster small talku',
    emoji: '☀️',
    description: 'You gave more than a one-word answer to a stranger.',
  },
  {
    id: 'engine-master',
    name: 'Engine Master',
    slovakName: 'Majster motora',
    emoji: '⚙️',
    description: 'BE, DO and CAN — you picked the right one every time.',
  },
  {
    id: 'streak-10',
    name: 'On Fire',
    slovakName: 'V jednom ťahu',
    emoji: '🔥',
    description: 'Ten correct answers in a row.',
  },
  {
    id: 'egypt-explorer',
    name: 'Egypt English Explorer',
    slovakName: 'Objaviteľ',
    emoji: '🐫',
    description: 'You finished the whole adventure.',
  },
]

export function getBadge(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id)
}
