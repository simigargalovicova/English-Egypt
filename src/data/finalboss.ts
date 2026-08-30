import type { BossScenario, RetrievalStarter } from '../types'

/**
 * Stage 10 — one scenario is drawn at random. No Slovak on screen unless the
 * learner asks for a hint, and hints escalate: category → opening words →
 * full model answer.
 */
export const BOSS_SCENARIOS: BossScenario[] = [
  {
    id: 'boss-hotel',
    title: 'Hotel Reception',
    emoji: '🔑',
    intro: 'You arrive at the hotel late in the evening. The receptionist looks up and smiles.',
    introSk: 'Prichádzaš do hotela neskoro večer. Recepčná sa na teba usmeje.',
    turns: [
      {
        id: 'bh-1',
        npc: 'Good evening. Do you have a reservation?',
        goalSk: 'Povedz áno a povedz svoje meno.',
        goalEn: 'Say yes, and tell them your name.',
        hint1: 'Confirm, then identify yourself.',
        hint2: 'Yes, my name is …',
        answer: {
          rules: [
            { requires: [['my name is', 'i am', 'it is under', 'this is', 'the name is', 'reservation is']] },
          ],
          modelAnswer: 'Yes, my name is Simona.',
          altModels: ["Yes, I have. It's under Novak."],
        },
        reply: 'Thank you. Let me check… yes, one room for a week.',
      },
      {
        id: 'bh-2',
        npc: 'Can I see your passport, please?',
        goalSk: 'Podaj im pas a povedz niečo slušné.',
        goalEn: 'Hand it over politely.',
        hint1: 'A short, polite phrase is all you need.',
        hint2: 'Here you …',
        answer: {
          rules: [
            { requires: [['here you are', 'here it is', 'here you go', 'of course', 'sure', 'yes of course', 'no problem']] },
          ],
          modelAnswer: 'Here you are.',
          altModels: ['Of course, here it is.'],
        },
        reply: 'Thank you very much.',
      },
      {
        id: 'bh-3',
        npc: 'Your room is on the third floor.',
        goalSk: 'Opýtaj sa, kde je výťah.',
        goalEn: 'Ask where the lift is.',
        hint1: 'Ask about a place.',
        hint2: 'Where is …',
        answer: {
          rules: [{ requires: [['where is', 'where are', 'how do i get to'], ['lift', 'elevator', 'stairs']] }],
          modelAnswer: 'Where is the lift?',
          altModels: ['Where is the elevator, please?'],
        },
        reply: "It's just behind you, on the left.",
      },
      {
        id: 'bh-4',
        npc: 'Breakfast is served in the main restaurant.',
        goalSk: 'Opýtaj sa, o koľkej sú raňajky.',
        goalEn: 'Ask what time breakfast starts.',
        hint1: 'Ask a question about the clock.',
        hint2: 'What time …',
        answer: {
          rules: [{ requires: [['what time', 'when'], ['breakfast', 'start', 'starts', 'is it']] }],
          modelAnswer: 'What time is breakfast?',
          altModels: ['When does breakfast start?'],
        },
        reply: 'From seven until ten every morning.',
      },
      {
        id: 'bh-5',
        npc: 'Is there anything else you need tonight?',
        goalSk: 'Popros o niečo, čo potrebuješ na izbu.',
        goalEn: 'Ask for something you need in your room.',
        hint1: 'Make a polite request.',
        hint2: 'Can I have …',
        answer: {
          rules: [
            { requires: [['can i have', 'could i have', 'can i get', 'i would like', 'is there', 'do you have', 'may i have']] },
          ],
          modelAnswer: 'Can I have another towel, please?',
          altModels: ["I'd like some water, please."],
        },
        reply: "Of course. I'll send it up to your room.",
      },
      {
        id: 'bh-6',
        npc: 'Enjoy your stay!',
        goalSk: 'Poďakuj sa a rozlúč sa.',
        goalEn: 'Thank them and say goodnight.',
        hint1: 'Thank them, then say goodbye.',
        hint2: 'Thank you. Good …',
        answer: {
          rules: [{ requires: [['thank you', 'thanks']] }],
          modelAnswer: 'Thank you very much. Good night!',
          altModels: ['Thanks a lot. Good night.'],
        },
        reply: "You're very welcome. Good night!",
      },
    ],
  },
  {
    id: 'boss-restaurant',
    title: 'Dinner Out',
    emoji: '🍽️',
    intro: 'A warm evening. You walk into a busy restaurant by the sea.',
    introSk: 'Teplý večer. Vchádzaš do rušnej reštaurácie pri mori.',
    turns: [
      {
        id: 'br-1',
        npc: 'Good evening! A table for how many?',
        goalSk: 'Povedz, koľko vás je.',
        goalEn: 'Say how many people.',
        hint1: 'A number is enough — add "please".',
        hint2: 'For …',
        answer: {
          rules: [
            { requires: [['for one', 'for two', 'for three', 'for four', 'one person', 'two people', 'just me', 'a table for', 'two please', 'one please']] },
          ],
          modelAnswer: 'For two, please.',
          altModels: ['A table for two, please.'],
        },
        reply: 'This way, please.',
      },
      {
        id: 'br-2',
        npc: 'Here is the menu. What would you like to drink?',
        goalSk: 'Objednaj si nápoj.',
        goalEn: 'Order a drink.',
        hint1: 'Use a polite request frame.',
        hint2: "I'd like …",
        answer: {
          rules: [{ requires: [['i would like', 'can i have', 'could i have', 'can i get', 'may i have', 'we would like']] }],
          modelAnswer: "I'd like a water, please.",
          altModels: ['Can I have a beer, please?'],
        },
        reply: 'Certainly.',
      },
      {
        id: 'br-3',
        npc: 'And what would you like to eat?',
        goalSk: 'Objednaj si jedlo.',
        goalEn: 'Order some food.',
        hint1: 'Same frame as the drink.',
        hint2: 'Can I have …',
        answer: {
          rules: [{ requires: [['i would like', 'can i have', 'could i have', 'can i get', 'may i have', 'we would like']] }],
          modelAnswer: 'Can I have the chicken, please?',
          altModels: ["I'd like the fish, please."],
        },
        reply: 'Excellent choice.',
      },
      {
        id: 'br-4',
        npc: "I'm very sorry — we don't have that tonight.",
        goalSk: 'Zareaguj a objednaj si niečo iné.',
        goalEn: 'React, and choose something else.',
        hint1: 'Accept it, then make a new request or ask for advice.',
        hint2: 'Okay. Can I have …',
        answer: {
          rules: [
            { requires: [['can i have', 'could i have', 'i would like', 'can i get', 'what do you recommend', 'what do you have', 'may i have']] },
          ],
          modelAnswer: 'Okay. Can I have the fish instead, please?',
          altModels: ['No problem. What do you recommend?'],
        },
        reply: "Very good. I'll bring it right away.",
      },
      {
        id: 'br-5',
        npc: 'How was your meal?',
        goalSk: 'Povedz, že to bolo dobré.',
        goalEn: 'Say it was good.',
        hint1: 'A short opinion is perfect.',
        hint2: 'It was …',
        answer: {
          rules: [
            { requires: [['very good', 'delicious', 'lovely', 'great', 'excellent', 'it was good', 'really good', 'nice', 'perfect', 'i liked it', 'wonderful']] },
          ],
          modelAnswer: 'It was delicious, thank you.',
          altModels: ['Very good, thank you!'],
        },
        reply: 'I am very glad to hear that.',
      },
      {
        id: 'br-6',
        npc: 'Would you like anything else?',
        goalSk: 'Popros o účet.',
        goalEn: 'Ask for the bill.',
        hint1: 'Ask for the paper with the price on it.',
        hint2: 'Can I have the …',
        answer: {
          rules: [
            { requires: [['can i have', 'could i have', 'can we have', 'could we have', 'i would like', 'can i get'], ['bill', 'check']] },
            { requires: [['can i pay', 'could i pay', 'i would like to pay']] },
          ],
          modelAnswer: 'Can I have the bill, please?',
          altModels: ['Could we have the bill, please?'],
        },
        reply: 'Here you are. Thank you, and have a lovely evening!',
      },
    ],
  },
  {
    id: 'boss-tourist',
    title: 'A Friendly Stranger',
    emoji: '🕶️',
    intro: 'You are lying by the pool. Someone puts their towel on the chair next to you.',
    introSk: 'Ležíš pri bazéne. Niekto si položí uterák na ležadlo vedľa teba.',
    turns: [
      {
        id: 'bt-1',
        npc: 'Hi! Is this seat free?',
        goalSk: 'Povedz áno — slušne.',
        goalEn: 'Say yes, politely.',
        hint1: 'A very short, friendly yes.',
        hint2: 'Yes, of …',
        answer: {
          rules: [
            { requires: [['yes', 'of course', 'sure', 'go ahead', 'please do', 'it is free', 'no problem']] },
          ],
          modelAnswer: 'Yes, of course.',
          altModels: ['Sure, go ahead!'],
        },
        reply: 'Thanks!',
      },
      {
        id: 'bt-2',
        npc: "I'm Anna, from Poland. Where are you from?",
        goalSk: 'Povedz, odkiaľ si.',
        goalEn: 'Say where you are from.',
        hint1: 'Answer with I…',
        hint2: "I'm from …",
        answer: {
          rules: [{ requires: [['i am from', 'i come from', 'slovakia']] }],
          modelAnswer: "I'm from Slovakia. Nice to meet you.",
          altModels: ["I'm from Slovakia, from Bratislava."],
        },
        reply: "Oh, Slovakia! I've never been there.",
      },
      {
        id: 'bt-3',
        npc: 'Is this your first time in Egypt?',
        goalSk: 'Odpovedz a pridaj jednu informáciu navyše.',
        goalEn: 'Answer, and add one more detail.',
        hint1: 'Yes or no — then say a little more.',
        hint2: 'Yes, it …',
        answer: {
          rules: [{ requires: [['yes', 'no', 'first time', 'second time', 'i was here']] }],
          modelAnswer: 'Yes, it is. This is my first time in Egypt.',
          altModels: ['No, I was here two years ago.'],
        },
        reply: 'Same for me. I love it already!',
      },
      {
        id: 'bt-4',
        npc: "I'm here for two weeks with my sister. We come every year.",
        goalSk: 'Opýtaj sa jej niečo o jej dovolenke.',
        goalEn: 'Ask her a question back about her holiday.',
        hint1: 'Turn it around — ask her something.',
        hint2: 'Do you … / How long … / Where …',
        answer: {
          rules: [
            { requires: [['do you', 'are you', 'can you', 'have you', 'how long', 'what', 'where', 'when', 'why', 'which', 'how']] },
          ],
          modelAnswer: 'Do you like it here?',
          altModels: ['Where are you staying?', 'How long is the flight from Poland?'],
        },
        reply: 'Yes, we love it! The food here is amazing.',
      },
      {
        id: 'bt-5',
        npc: 'Do you want to go to the beach later?',
        goalSk: 'Prijmi alebo slušne odmietni.',
        goalEn: 'Accept, or say no politely.',
        hint1: 'Yes or no — but be friendly about it.',
        hint2: "I'd like … / Sorry, I …",
        answer: {
          rules: [
            { requires: [['yes', 'sure', 'okay', 'sounds good', 'i would like', 'that would be', 'why not']] },
            { requires: [['no thank', 'sorry', 'i can not', 'maybe tomorrow', 'not today']] },
          ],
          modelAnswer: "Yes, I'd like that. What time?",
          altModels: ["Sorry, I can't today. Maybe tomorrow?"],
        },
        reply: 'Great — see you at four!',
      },
      {
        id: 'bt-6',
        npc: 'It was really nice to meet you!',
        goalSk: 'Poďakuj sa jej a rozlúč sa.',
        goalEn: 'Thank her and say goodbye.',
        hint1: 'Thank her first, then say goodbye.',
        hint2: 'Thank you. See …',
        answer: {
          rules: [{ requires: [['thank you', 'thanks']] }],
          modelAnswer: 'Thank you. See you later!',
          altModels: ['Thanks! Nice to meet you too. Bye!'],
        },
        reply: 'Bye! Have a lovely afternoon.',
      },
    ],
  },
  {
    id: 'boss-bazaar',
    title: 'The Bazaar',
    emoji: '🏺',
    intro: 'Colour, noise and spice. A shopkeeper waves you over to his stall.',
    introSk: 'Farby, hluk a korenie. Predavač ťa volá k svojmu stánku.',
    turns: [
      {
        id: 'bb-1',
        npc: 'Hello, my friend! Come, look — very nice scarves!',
        goalSk: 'Povedz slušne, že sa len pozeráš.',
        goalEn: 'Say politely that you are just looking.',
        hint1: 'Be friendly, but do not commit.',
        hint2: "I'm just …",
        answer: {
          rules: [
            { requires: [['just looking', 'only looking', 'i am looking', 'no thank', 'thank you']] },
          ],
          modelAnswer: "Thank you, I'm just looking.",
          altModels: ['No, thank you.'],
        },
        reply: 'Of course, take your time!',
      },
      {
        id: 'bb-2',
        npc: 'This one is beautiful. Do you like it?',
        goalSk: 'Povedz, že sa ti páči, a opýtaj sa na cenu.',
        goalEn: 'Say you like it, and ask the price.',
        hint1: 'Give an opinion, then ask about money.',
        hint2: 'Yes, I like it. How …',
        answer: {
          rules: [{ requires: [['how much']] }],
          modelAnswer: 'Yes, I like it. How much is it?',
          altModels: ["It's beautiful. How much does it cost?"],
        },
        reply: 'For you, my friend — 300 pounds.',
      },
      {
        id: 'bb-3',
        npc: '300 pounds. Very good price!',
        goalSk: 'Povedz, že je to veľa, a skús zjednať nižšiu cenu.',
        goalEn: 'Say it is too expensive, and ask for a lower price.',
        hint1: 'Say the problem, then make an offer.',
        hint2: "That's too …",
        answer: {
          rules: [
            { requires: [['too expensive', 'too much', 'expensive', 'cheaper', 'less', 'discount', 'lower']] },
            { requires: [['can you do', 'how about', 'what about', 'i can pay', 'i will pay']] },
          ],
          modelAnswer: "That's too expensive. Can you do 200?",
          altModels: ['It is too much for me. Is 150 okay?'],
        },
        reply: 'Okay, okay — 200 for you, my friend.',
      },
      {
        id: 'bb-4',
        npc: '200. That is my final price!',
        goalSk: 'Súhlas a povedz, že si to berieš.',
        goalEn: 'Agree, and say you will take it.',
        hint1: 'Accept the deal.',
        hint2: "Okay, I'll …",
        answer: {
          rules: [
            { requires: [['i will take it', 'i take it', 'okay i will', 'yes i will take', 'deal', 'i would like it', 'i will buy', 'okay thank you']] },
          ],
          modelAnswer: "Okay, I'll take it.",
          altModels: ['Deal! I would like it, please.'],
        },
        reply: 'Excellent! Thank you very much.',
      },
      {
        id: 'bb-5',
        npc: 'How would you like to pay?',
        goalSk: 'Opýtaj sa, či môžeš platiť kartou.',
        goalEn: 'Ask if you can pay by card.',
        hint1: 'Ask about a way of paying.',
        hint2: 'Can I pay …',
        answer: {
          rules: [{ requires: [['card', 'cash']] }],
          modelAnswer: 'Can I pay by card?',
          altModels: ['Do you take card?'],
        },
        reply: 'Card is fine. One moment, please.',
      },
      {
        id: 'bb-6',
        npc: 'Here is your bag. Thank you!',
        goalSk: 'Poďakuj sa a rozlúč sa.',
        goalEn: 'Thank them and say goodbye.',
        hint1: 'Thank them, then a goodbye.',
        hint2: 'Thank you. Good…',
        answer: {
          rules: [{ requires: [['thank you', 'thanks']] }],
          modelAnswer: 'Thank you very much. Goodbye!',
          altModels: ['Thanks! Have a good day.'],
        },
        reply: 'Goodbye — come again!',
      },
    ],
  },
]

export const BOSS_TURNS_REQUIRED = 4
export const BOSS_STRUCTURES_REQUIRED = 4

/** Stage 11 — free recall with everything else hidden. */
export const RETRIEVAL_STARTERS: RetrievalStarter[] = [
  {
    id: 'ret-1',
    starter: "I'M …",
    briefSk: 'Povedz niečo o sebe.',
    mustStartWith: ['i am'],
    examples: ["I'm from Slovakia.", "I'm here on holiday.", "I'm very tired."],
  },
  {
    id: 'ret-2',
    starter: "I DON'T …",
    briefSk: 'Povedz, čo nerobíš alebo čomu nerozumieš.',
    mustStartWith: ['i do not'],
    examples: ["I don't understand.", "I don't eat meat.", "I don't speak English very well."],
  },
  {
    id: 'ret-3',
    starter: 'CAN YOU …',
    briefSk: 'Popros niekoho o niečo.',
    mustStartWith: ['can you', 'could you'],
    examples: ['Can you help me?', 'Can you repeat that, please?', 'Can you speak more slowly?'],
  },
  {
    id: 'ret-4',
    starter: "I'D LIKE …",
    briefSk: 'Objednaj si alebo popros o niečo.',
    mustStartWith: ['i would like'],
    examples: ["I'd like a coffee, please.", "I'd like a room for two nights."],
  },
  {
    id: 'ret-5',
    starter: 'WHERE IS …',
    briefSk: 'Opýtaj sa, kde je nejaké miesto.',
    mustStartWith: ['where is', 'where are'],
    examples: ['Where is the toilet?', 'Where is the beach?', 'Where is my room?'],
  },
]

/** Minimum words after the starter, so "I'm." does not count as a sentence. */
export const RETRIEVAL_MIN_EXTRA_WORDS = 1
