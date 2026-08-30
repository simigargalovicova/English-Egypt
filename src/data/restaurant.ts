import type { DialogueTurn } from '../types'

/** Stage 7 — a full restaurant interaction, six fixed turns. */
export const RESTAURANT_TURNS: DialogueTurn[] = [
  {
    id: 'rs-01',
    npc: 'Good evening. What would you like to drink?',
    npcSk: 'Dobrý večer. Čo si dáte na pitie?',
    goalSk: 'Objednaj si nápoj.',
    goalEn: 'Order a drink.',
    hint1: 'Use a polite request frame.',
    hint2: "I'd like … / Can I have …",
    answer: {
      rules: [
        { requires: [['i would like', 'can i have', 'could i have', 'can i get', 'may i have', 'we would like']] },
      ],
      modelAnswer: "I'd like a water, please.",
      altModels: ['Can I have a Coke, please?', "I'd like a beer, please."],
    },
    reply: 'Of course.',
    replySk: 'Samozrejme.',
  },
  {
    id: 'rs-02',
    npc: 'Still or sparkling?',
    npcSk: 'Neperlivá alebo perlivá?',
    goalSk: 'Vyber si jednu možnosť.',
    goalEn: 'Choose one.',
    hint1: 'A short answer works — but add "please".',
    hint2: 'Still, please. / Sparkling, please.',
    answer: {
      rules: [
        { requires: [['still', 'sparkling', 'no gas', 'with gas', 'without gas']] },
      ],
      modelAnswer: 'Still, please.',
      altModels: ['Sparkling, please.', "I'd like still water, please."],
    },
    reply: 'Perfect.',
    replySk: 'Výborne.',
  },
  {
    id: 'rs-03',
    npc: 'Would you like anything to eat?',
    npcSk: 'Dáte si niečo na jedenie?',
    goalSk: 'Objednaj si jedlo.',
    goalEn: 'Order some food.',
    hint1: 'Same polite frame as the drink.',
    hint2: "I'd like … / Can I have …",
    answer: {
      rules: [
        { requires: [['i would like', 'can i have', 'could i have', 'can i get', 'may i have', 'we would like']] },
      ],
      modelAnswer: "Yes, I'd like the chicken, please.",
      altModels: ['Can I have the fish, please?', "I'd like a salad, please."],
    },
    reply: 'A very good choice.',
    replySk: 'Veľmi dobrá voľba.',
  },
  {
    id: 'rs-04',
    npc: 'Anything else?',
    npcSk: 'Ešte niečo?',
    goalSk: 'Povedz nie — slušne. Alebo si objednaj ešte niečo.',
    goalEn: 'Say no politely, or order one more thing.',
    hint1: 'Two words plus "thank you" is enough.',
    hint2: 'No, thank you. / Can I also have …',
    answer: {
      rules: [
        { requires: [['no thank', 'no thanks', 'that is all', 'that is everything', 'nothing else', 'no that is']] },
        { requires: [['i would like', 'can i have', 'could i have', 'can i get', 'also']] },
      ],
      modelAnswer: "No, thank you. That's all.",
      altModels: ['Can I also have some bread, please?'],
    },
    reply: 'I will bring it right away.',
    replySk: 'Hneď to prinesiem.',
  },
  {
    id: 'rs-05',
    npc: 'How was everything?',
    npcSk: 'Ako vám chutilo?',
    goalSk: 'Povedz, že to bolo dobré.',
    goalEn: 'Say that it was good.',
    hint1: 'Past tense is not required — keep it simple.',
    hint2: 'It was … / Very …',
    answer: {
      rules: [
        { requires: [['very good', 'delicious', 'lovely', 'great', 'excellent', 'it was good', 'really good', 'nice', 'perfect', 'i liked it', 'i like it']] },
      ],
      modelAnswer: 'It was very good, thank you.',
      altModels: ['Delicious, thank you!', 'Very nice, thank you.'],
    },
    reply: 'I am glad to hear that.',
    replySk: 'Teší ma.',
  },
  {
    id: 'rs-06',
    npc: 'Can I get you anything else before you go?',
    npcSk: 'Môžem vám ešte niečo priniesť?',
    goalSk: 'Popros o účet.',
    goalEn: 'Ask for the bill.',
    hint1: 'Ask for the paper with the price on it.',
    hint2: 'Can I have the …',
    answer: {
      acceptedAnswers: ['Can I have the bill, please', 'Could I have the bill, please', 'Can we have the bill, please'],
      rules: [
        { requires: [['can i have', 'could i have', 'can we have', 'could we have', 'i would like', 'can i get'], ['bill', 'check']] },
        { requires: [['can i pay', 'could i pay', 'i would like to pay', 'the bill please', 'the check please']] },
      ],
      modelAnswer: 'Can I have the bill, please?',
      altModels: ['Could we have the bill, please?'],
    },
    reply: 'Here you are. Thank you, and have a lovely evening!',
    replySk: 'Nech sa páči. Ďakujeme a pekný večer!',
  },
]

/**
 * One of these is inserted at random after the food order, so the learner has
 * to react to something that was not in the script.
 */
export const RESTAURANT_EVENTS: DialogueTurn[] = [
  {
    id: 'rev-01',
    npc: "Sorry, we don't have that today.",
    npcSk: 'Prepáčte, to dnes nemáme.',
    goalSk: 'Zareaguj a objednaj si niečo iné.',
    goalEn: 'React, and order something else.',
    hint1: 'Accept it, then make a new request.',
    hint2: 'Okay. Can I have … instead?',
    answer: {
      rules: [
        { requires: [['can i have', 'could i have', 'i would like', 'can i get', 'may i have', 'what do you have', 'what do you recommend']] },
      ],
      modelAnswer: 'Okay. Can I have the chicken instead, please?',
      altModels: ["No problem. I'd like the fish, then.", 'What do you recommend?'],
    },
    reply: 'Good choice. I will bring that.',
    replySk: 'Dobrá voľba. Prinesiem to.',
  },
  {
    id: 'rev-02',
    npc: 'We have no coffee. Would you like tea instead?',
    npcSk: 'Nemáme kávu. Dáte si radšej čaj?',
    goalSk: 'Prijmi alebo slušne odmietni.',
    goalEn: 'Accept, or say no politely.',
    hint1: 'Yes or no — but make it polite.',
    hint2: 'Yes, please. / No, thank you. Can I have …',
    answer: {
      rules: [
        { requires: [['yes please', 'yes thank', 'okay yes', 'tea please', 'yes i would like', 'sure']] },
        { requires: [['no thank', 'no thanks', 'not for me']] },
        { requires: [['can i have', 'could i have', 'i would like']] },
      ],
      modelAnswer: 'Okay. Can I have tea instead, please?',
      altModels: ['Yes, please.', "No, thank you. I'd like water, please."],
    },
    reply: 'Of course.',
    replySk: 'Samozrejme.',
  },
  {
    id: 'rev-03',
    npc: 'I am very sorry — the kitchen is closed.',
    npcSk: 'Veľmi ma to mrzí — kuchyňa je zatvorená.',
    goalSk: 'Zareaguj slušne — napríklad si objednaj len nápoj.',
    goalEn: 'React politely — for example, order only a drink.',
    hint1: 'Say it is fine, then ask for something they can still bring.',
    hint2: "That's okay. Can I have …",
    answer: {
      rules: [
        { requires: [['can i have', 'could i have', 'i would like', 'can i get', 'just a', 'only a']] },
        { requires: [['that is okay', 'no problem', 'it is fine', 'that is fine', 'never mind', 'no worries']] },
      ],
      modelAnswer: "That's okay. Can I have just a drink, please?",
      altModels: ['No problem. Can I have a coffee, please?'],
    },
    reply: 'Thank you for understanding.',
    replySk: 'Ďakujem za pochopenie.',
  },
]
