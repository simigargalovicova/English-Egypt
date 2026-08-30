import type { DialogueBranch } from '../types'

/**
 * Stage 6 — the learner picks an intention, not a sentence, then has to
 * produce the English themselves. Each branch runs two turns.
 */
export const HOTEL_BRANCHES: DialogueBranch[] = [
  {
    id: 'hb-pool',
    intentEn: 'Find the pool',
    intentSk: 'Nájsť bazén',
    emoji: '🏊',
    turns: [
      {
        id: 'hb-pool-1',
        npc: 'Good afternoon. Can I help you?',
        npcSk: 'Dobrý deň. Môžem vám pomôcť?',
        goalSk: 'Opýtaj sa, kde je bazén.',
        goalEn: 'Ask where the pool is.',
        hint1: 'Ask about a place.',
        hint2: 'Where is …',
        answer: {
          acceptedAnswers: ['Where is the pool', 'Where is the swimming pool'],
          rules: [{ requires: [['where is', 'where are', 'how do i get to', 'how can i get to'], ['pool']] }],
          modelAnswer: 'Where is the pool, please?',
          altModels: ['Excuse me, where is the swimming pool?'],
        },
        reply: "Of course. It's on the ground floor, behind the lobby.",
        replySk: 'Samozrejme. Je na prízemí, za halou.',
      },
      {
        id: 'hb-pool-2',
        npc: 'Is there anything else?',
        npcSk: 'Ešte niečo?',
        goalSk: 'Opýtaj sa, o koľkej bazén otvárajú.',
        goalEn: 'Ask what time the pool opens.',
        hint1: 'Ask a question about the clock.',
        hint2: 'What time …',
        answer: {
          acceptedAnswers: ['What time does the pool open', 'When does the pool open'],
          rules: [{ requires: [['what time', 'when'], ['open', 'opens']] }],
          modelAnswer: 'What time does the pool open?',
          altModels: ['When does the pool open?'],
        },
        reply: 'It opens at seven in the morning and closes at eight in the evening.',
        replySk: 'Otvára o siedmej ráno a zatvára o ôsmej večer.',
      },
    ],
  },
  {
    id: 'hb-towel',
    intentEn: 'Ask for another towel',
    intentSk: 'Poprosiť o ďalší uterák',
    emoji: '🧻',
    turns: [
      {
        id: 'hb-towel-1',
        npc: 'Good afternoon. Can I help you?',
        npcSk: 'Dobrý deň. Môžem vám pomôcť?',
        goalSk: 'Popros o ďalší uterák.',
        goalEn: 'Ask for another towel.',
        hint1: 'Make a polite request.',
        hint2: 'Can I have …',
        answer: {
          acceptedAnswers: [
            'Can I have another towel, please',
            'Could I have another towel, please',
          ],
          rules: [
            { requires: [['can i have', 'could i have', 'can i get', 'may i have', 'i would like', 'can we have'], ['towel']] },
          ],
          modelAnswer: 'Can I have another towel, please?',
          altModels: ["I'd like another towel, please."],
        },
        reply: "Certainly. What's your room number?",
        replySk: 'Samozrejme. Aké je vaše číslo izby?',
      },
      {
        id: 'hb-towel-2',
        npc: "What's your room number?",
        npcSk: 'Aké je vaše číslo izby?',
        goalSk: 'Povedz, že si na izbe 214.',
        goalEn: 'Say that you are in room 214.',
        hint1: 'A short answer is fine here.',
        hint2: "It's room …",
        answer: {
          acceptedAnswers: ['Room 214', "It's room 214", 'My room number is 214', '214'],
          rules: [{ requires: [['214', 'two one four', 'two fourteen']] }],
          modelAnswer: "It's room 214.",
          altModels: ['Room 214.'],
        },
        reply: 'Room 214 — I will send a towel up in ten minutes.',
        replySk: 'Izba 214 — uterák pošlem o desať minút.',
      },
    ],
  },
  {
    id: 'hb-wifi',
    intentEn: 'Ask about the Wi-Fi',
    intentSk: 'Opýtať sa na Wi-Fi',
    emoji: '📶',
    turns: [
      {
        id: 'hb-wifi-1',
        npc: 'Good afternoon. Can I help you?',
        npcSk: 'Dobrý deň. Môžem vám pomôcť?',
        goalSk: 'Opýtaj sa, či majú Wi-Fi.',
        goalEn: 'Ask if there is Wi-Fi.',
        hint1: 'Ask whether something exists here.',
        hint2: 'Is there … / Do you have …',
        answer: {
          acceptedAnswers: ['Is there Wi-Fi', 'Do you have Wi-Fi', 'Is there wifi here'],
          rules: [{ requires: [['wi fi', 'internet'], ['is there', 'do you have', 'have you got', 'can i use', 'where is']] }],
          modelAnswer: 'Is there Wi-Fi here?',
          altModels: ['Do you have Wi-Fi?'],
        },
        reply: 'Yes, we have free Wi-Fi. The network is called HotelNile.',
        replySk: 'Áno, máme Wi-Fi zadarmo. Sieť sa volá HotelNile.',
      },
      {
        id: 'hb-wifi-2',
        npc: 'The network is called HotelNile.',
        npcSk: 'Sieť sa volá HotelNile.',
        goalSk: 'Opýtaj sa na heslo.',
        goalEn: 'Ask for the password.',
        hint1: 'Ask for the secret word you need to connect.',
        hint2: "What's the …",
        answer: {
          acceptedAnswers: ["What's the password", 'What is the password', 'Can I have the password, please'],
          rules: [{ requires: [['password']] }],
          modelAnswer: "What's the password?",
          altModels: ['Can I have the password, please?'],
        },
        reply: 'The password is sunshine123. Enjoy your stay!',
        replySk: 'Heslo je sunshine123. Príjemný pobyt!',
      },
    ],
  },
  {
    id: 'hb-breakfast',
    intentEn: 'Ask when breakfast is',
    intentSk: 'Opýtať sa, kedy sú raňajky',
    emoji: '🥐',
    turns: [
      {
        id: 'hb-breakfast-1',
        npc: 'Good afternoon. Can I help you?',
        npcSk: 'Dobrý deň. Môžem vám pomôcť?',
        goalSk: 'Opýtaj sa, o koľkej sú raňajky.',
        goalEn: 'Ask what time breakfast is.',
        hint1: 'Ask a question about the clock.',
        hint2: 'What time …',
        answer: {
          acceptedAnswers: ['What time is breakfast', 'When is breakfast', 'What time does breakfast start'],
          rules: [{ requires: [['what time', 'when'], ['breakfast']] }],
          modelAnswer: 'What time is breakfast?',
          altModels: ['When is breakfast?'],
        },
        reply: 'Breakfast is from 7 to 10.',
        replySk: 'Raňajky sú od 7 do 10.',
      },
      {
        id: 'hb-breakfast-2',
        npc: 'Breakfast is from 7 to 10.',
        npcSk: 'Raňajky sú od 7 do 10.',
        goalSk: 'Opýtaj sa, kde je reštaurácia.',
        goalEn: 'Ask where the restaurant is.',
        hint1: 'Ask about a place.',
        hint2: 'Where is …',
        answer: {
          acceptedAnswers: ['Where is the restaurant'],
          rules: [{ requires: [['where is', 'where are', 'how do i get to'], ['restaurant', 'breakfast room']] }],
          modelAnswer: 'Where is the restaurant?',
          altModels: ['And where is the restaurant?'],
        },
        reply: "It's on the first floor, next to the pool.",
        replySk: 'Je na prvom poschodí, vedľa bazéna.',
      },
    ],
  },
]

export const HOTEL_BRANCHES_REQUIRED = 3
