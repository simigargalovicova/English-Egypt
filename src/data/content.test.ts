import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { OpenAnswer } from '../types.ts'
import { detectStructures, matchAnswer } from '../lib/normalize.ts'
import { COLD_START_ITEMS } from './coldstart.ts'
import { ENGINE_ITEMS, ENGINE_REPAIR_ITEMS } from './engine.ts'
import { SURGERY_ITEMS } from './surgery.ts'
import { CHUNK_PHRASES } from './chunks.ts'
import { FREE_ITEMS, REORDER_ITEMS, SCAFFOLD_ITEMS } from './build.ts'
import { HOTEL_BRANCHES } from './hotel.ts'
import { RESTAURANT_EVENTS, RESTAURANT_TURNS } from './restaurant.ts'
import { SMALL_TALK_ITEMS } from './smalltalk.ts'
import { ERROR_ITEMS } from './errors.ts'
import { BOSS_SCENARIOS, BOSS_STRUCTURES_REQUIRED, RETRIEVAL_STARTERS } from './finalboss.ts'
import { STAGES } from './stages.ts'

/** Every answer we tell the learner is right must pass our own matcher. */
function assertSelfConsistent(label: string, spec: OpenAnswer) {
  const candidates = [spec.modelAnswer, ...(spec.altModels ?? []), ...(spec.acceptedAnswers ?? [])]
  for (const candidate of candidates) {
    assert.equal(matchAnswer(candidate, spec).quality, 'correct', `${label}: "${candidate}" was not accepted`)
  }
}

test('every model and alternative answer passes its own validator', () => {
  for (const item of SURGERY_ITEMS) {
    assertSelfConsistent(`${item.id} negative`, item.negative)
    assertSelfConsistent(`${item.id} question`, item.question)
  }
  for (const p of CHUNK_PHRASES) assertSelfConsistent(p.id, p.recall)
  for (const f of FREE_ITEMS) assertSelfConsistent(f.id, f.answer)
  for (const b of HOTEL_BRANCHES) for (const t of b.turns) assertSelfConsistent(t.id, t.answer)
  for (const t of [...RESTAURANT_TURNS, ...RESTAURANT_EVENTS]) assertSelfConsistent(t.id, t.answer)
  for (const s of SMALL_TALK_ITEMS) assertSelfConsistent(s.id, s.answer)
  for (const e of ERROR_ITEMS) assertSelfConsistent(e.id, e.answer)
  for (const sc of BOSS_SCENARIOS) for (const t of sc.turns) assertSelfConsistent(t.id, t.answer)
})

test('the broken sentences in Error Detective are never accepted as correct', () => {
  for (const item of ERROR_ITEMS) {
    assert.notEqual(matchAnswer(item.wrong, item.answer).quality, 'correct', item.id)
  }
})

test('every reorder item can actually be built from its tiles', () => {
  for (const item of REORDER_ITEMS) {
    const tiles = [...item.tiles].map((t) => t.toLowerCase()).sort()
    const answer = item.answer
      .toLowerCase()
      .replace(/[.,!?]/g, '')
      .split(/\s+/)
      .sort()
    assert.deepEqual(tiles, answer, `${item.id}: tiles do not spell the answer`)
  }
})

test('every scaffold blank has at least one accepted filling', () => {
  for (const item of SCAFFOLD_ITEMS) {
    assert.equal(item.scaffold.split('_').length - 1, item.blanks.length, `${item.id}: gap count mismatch`)
    for (const options of item.blanks) assert.ok(options.length > 0, item.id)
  }
})

test('each Final Boss scenario is winnable on its own model answers', () => {
  for (const scenario of BOSS_SCENARIOS) {
    const models = new Set(scenario.turns.flatMap((t) => detectStructures(t.answer.modelAnswer)))
    assert.ok(
      models.size >= BOSS_STRUCTURES_REQUIRED,
      `${scenario.id}: model answers only produce ${models.size} structures`,
    )
  }
})

test('content volume matches the lesson plan', () => {
  assert.equal(STAGES.length, 11)
  assert.equal(COLD_START_ITEMS.length, 6)
  assert.equal(ENGINE_ITEMS.length, 12)
  assert.ok(ENGINE_REPAIR_ITEMS.length >= 5)
  assert.equal(SURGERY_ITEMS.length, 6)
  assert.equal(CHUNK_PHRASES.length, 16)
  assert.ok(REORDER_ITEMS.length >= 5)
  assert.ok(SCAFFOLD_ITEMS.length >= 5)
  assert.ok(FREE_ITEMS.length >= 5)
  assert.equal(HOTEL_BRANCHES.length, 4)
  assert.equal(RESTAURANT_TURNS.length, 6)
  assert.equal(RESTAURANT_EVENTS.length, 3)
  assert.equal(SMALL_TALK_ITEMS.length, 6)
  assert.equal(ERROR_ITEMS.length, 10)
  assert.equal(BOSS_SCENARIOS.length, 4)
  for (const s of BOSS_SCENARIOS) assert.equal(s.turns.length, 6, s.id)
  assert.equal(RETRIEVAL_STARTERS.length, 5)
})

test('every content id is unique', () => {
  const ids = [
    ...COLD_START_ITEMS.map((i) => i.id),
    ...ENGINE_ITEMS.map((i) => i.id),
    ...ENGINE_REPAIR_ITEMS.map((i) => i.id),
    ...SURGERY_ITEMS.map((i) => i.id),
    ...CHUNK_PHRASES.map((i) => i.id),
    ...REORDER_ITEMS.map((i) => i.id),
    ...SCAFFOLD_ITEMS.map((i) => i.id),
    ...FREE_ITEMS.map((i) => i.id),
    ...HOTEL_BRANCHES.flatMap((b) => [b.id, ...b.turns.map((t) => t.id)]),
    ...RESTAURANT_TURNS.map((t) => t.id),
    ...RESTAURANT_EVENTS.map((t) => t.id),
    ...SMALL_TALK_ITEMS.map((i) => i.id),
    ...ERROR_ITEMS.map((i) => i.id),
    ...BOSS_SCENARIOS.flatMap((s) => [s.id, ...s.turns.map((t) => t.id)]),
    ...RETRIEVAL_STARTERS.map((i) => i.id),
  ]
  assert.equal(new Set(ids).size, ids.length, 'duplicate content id')
})
