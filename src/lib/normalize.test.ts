import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  detectStructures,
  findSlips,
  matchAnswer,
  matchExact,
  normalize,
  normalizeLoose,
  wordCount,
} from './normalize.ts'

test('normalise strips case, punctuation and expands contractions', () => {
  assert.equal(normalize("I'm from Slovakia."), 'i am from slovakia')
  assert.equal(normalize("I don't understand!"), 'i do not understand')
  assert.equal(normalize("I can't swim"), 'i can not swim')
  assert.equal(normalize('I’d like a coffee, please'), 'i would like a coffee please')
  assert.equal(normalize('  Where   is the toilet ?? '), 'where is the toilet')
  assert.equal(normalize("Doesn't he?"), 'does not he')
})

test('politeness words are ignored on a second pass, meaning words are not', () => {
  assert.equal(normalizeLoose('Can I have another towel, please?'), 'can i have another towel')
  assert.equal(normalizeLoose('Excuse me, where is the toilet?'), 'where is the toilet')
  // "you" and "me" carry meaning and must survive.
  assert.notEqual(normalizeLoose('Can you help me'), normalizeLoose('Can I help you'))
})

const towel = {
  acceptedAnswers: ['Can I have another towel, please', 'Could I have another towel, please'],
  rules: [{ requires: [['can i have', 'could i have', 'can i get', 'i would like'], ['towel']] }],
  modelAnswer: 'Can I have another towel, please?',
}

test('several natural phrasings are accepted for one prompt', () => {
  for (const good of [
    'can i have another towel',
    'Could I have a towel, please?',
    "I'd like a towel please",
    'CAN I GET ANOTHER TOWEL!!',
  ]) {
    assert.equal(matchAnswer(good, towel).quality, 'correct', good)
  }
})

test('wrong answers are rejected and typos are reported as near misses', () => {
  assert.equal(matchAnswer('where is the pool', towel).quality, 'wrong')
  assert.equal(matchAnswer('can i have another towl', towel).quality, 'close')
  assert.equal(matchAnswer('', towel).quality, 'empty')
})

test('matchExact accepts contraction and punctuation variants only', () => {
  assert.equal(matchExact("I'd like two coffees please", "I'd like two coffees, please.").quality, 'correct')
  assert.equal(matchExact('I would like two coffees, please', "I'd like two coffees, please.").quality, 'correct')
  assert.equal(matchExact('two coffees I would like', "I'd like two coffees, please.").quality, 'wrong')
})

test('structure detection recognises the lesson targets', () => {
  assert.ok(detectStructures('Are you tired?').includes('BE'))
  assert.ok(detectStructures('Do you like coffee?').includes('DO'))
  assert.ok(detectStructures("I can't swim").includes('CAN'))
  assert.ok(detectStructures('Where is the toilet?').includes('WH_QUESTION'))
  assert.ok(detectStructures("I'd like a coffee").includes('WOULD_LIKE'))
  assert.ok(detectStructures('Yes, of course.').includes('AFFIRM'))
  assert.ok(detectStructures('Thank you very much.').includes('THANKS'))
})

test('classic false-beginner slips are caught, correct English is not', () => {
  for (const wrong of [
    'I am like Egypt',
    'Do you are from Slovakia',
    "I don't can speak Arabic",
    'I no understand',
    'Where the toilet is',
    'Can you to help me',
  ]) {
    assert.ok(findSlips(wrong).length > 0, wrong)
  }
  for (const right of ['I like Egypt', 'Can I have another towel, please?', 'Where is the toilet?']) {
    assert.equal(findSlips(right).length, 0, right)
  }
})

test('word count powers the small-talk expansion nudge', () => {
  assert.equal(wordCount('Slovakia'), 1)
  assert.ok(wordCount("I'm from Slovakia, from a town near Bratislava.") >= 7)
})
