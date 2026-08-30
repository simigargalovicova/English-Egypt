/** Shared domain types for Egypt English Adventure. */

export type LocationId =
  | 'airport'
  | 'hotel'
  | 'pool'
  | 'restaurant'
  | 'bazaar'
  | 'oasis'

export type StageId =
  | 'coldstart'
  | 'engine'
  | 'surgery'
  | 'chunks'
  | 'build'
  | 'hotel'
  | 'smalltalk'
  | 'restaurant'
  | 'errors'
  | 'finalboss'
  | 'retrieval'

/** How much an interaction is worth, per the lesson design. */
export type SkillTier =
  | 'recognition'
  | 'reconstruction'
  | 'recall'
  | 'scenario'
  | 'selfCorrection'

export interface TeacherNotes {
  objective: string
  targetGrammar: string[]
  correct: string[]
  ignore: string[]
  prompts: string[]
  moveOn: string
}

export interface StageDef {
  id: StageId
  /** Stage number from the lesson plan (the final retrieval challenge is 11). */
  num: number
  locationId: LocationId
  title: string
  slovakTitle: string
  tagline: string
  minutes: number
  icon: string
  teacher: TeacherNotes
}

export interface LocationDef {
  id: LocationId
  name: string
  slovakName: string
  emoji: string
  blurb: string
}

/* ------------------------------------------------------------------ *
 * Answer matching
 * ------------------------------------------------------------------ */

/**
 * An open-answer rule. The learner's normalised text passes the rule when it
 * contains at least one alternative from EVERY group in `requires`, and none
 * of the strings in `forbids`. A turn accepts if ANY of its rules pass, so a
 * wide range of natural phrasings is accepted without exact-string matching.
 */
export interface AcceptRule {
  requires: string[][]
  forbids?: string[]
}

export interface OpenAnswer {
  /** Whole-sentence answers that are accepted outright (normalised compare). */
  acceptedAnswers?: string[]
  /** Looser keyword rules for genuinely open production. */
  rules?: AcceptRule[]
  modelAnswer: string
  altModels?: string[]
}

/* ------------------------------------------------------------------ *
 * Exercise item shapes (content lives in src/data)
 * ------------------------------------------------------------------ */

export interface ColdStartItem {
  id: string
  /** Instruction in Slovak so a false beginner can start without help. */
  taskSk: string
  taskEn: string
  hint: string
  modelAnswer: string
  altModels: string[]
}

export type SelfRating = 'know' | 'almost' | 'notyet'

export interface EngineItem {
  id: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

export interface SurgeryItem {
  id: string
  base: string
  baseSk: string
  negative: OpenAnswer
  question: OpenAnswer
  engine: 'BE' | 'DO' | 'CAN'
  /** Word tiles offered for the tap-to-build negative. */
  negativeTiles: string[]
}

export interface ChunkPhrase {
  id: string
  group: string
  english: string
  slovak: string
  context: string
  contextSk: string
  /** Gap-fill used for the retrieval check at the end of each card. */
  recallPromptSk: string
  recall: OpenAnswer
}

export interface ReorderItem {
  id: string
  tiles: string[]
  answer: string
  slovak: string
  explanation: string
}

export interface ScaffoldItem {
  id: string
  slovak: string
  /** Scaffold with `_` marking each blank, e.g. "Can I _ _, please?" */
  scaffold: string
  blanks: string[][]
  modelAnswer: string
  hint: string
}

export interface FreeItem {
  id: string
  scenario: string
  scenarioSk: string
  answer: OpenAnswer
  hint1: string
  hint2: string
}

export interface DialogueTurn {
  id: string
  /** What the other person says before the learner replies. */
  npc: string
  npcSk?: string
  /** What the learner is trying to do, in Slovak. */
  goalSk: string
  goalEn: string
  answer: OpenAnswer
  hint1: string
  hint2: string
  /** The reply the learner gets once they succeed. */
  reply: string
  replySk?: string
}

export interface DialogueBranch {
  id: string
  intentEn: string
  intentSk: string
  emoji: string
  turns: DialogueTurn[]
}

export interface ErrorItem {
  id: string
  wrong: string
  answer: OpenAnswer
  rule: string
}

export interface SmallTalkItem {
  id: string
  question: string
  questionSk: string
  answer: OpenAnswer
  /** Nudge shown when the learner answers in only a word or two. */
  expandPrompt: string
  hint1: string
  hint2: string
}

export interface BossScenario {
  id: string
  title: string
  emoji: string
  intro: string
  introSk: string
  turns: DialogueTurn[]
}

export interface RetrievalStarter {
  id: string
  starter: string
  briefSk: string
  /** Regex-ish required opener tokens, checked after normalisation. */
  mustStartWith: string[]
  examples: string[]
}

export interface BadgeDef {
  id: string
  name: string
  slovakName: string
  emoji: string
  description: string
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */

export interface StageProgress {
  /** 0..1 best mastery score achieved. */
  score: number
  completed: boolean
  attempts: number
}

export interface BaselineEntry {
  itemId: string
  answer: string
  rating: SelfRating
  passed: boolean
}

export interface ProgressState {
  version: number
  xp: number
  streak: number
  bestStreak: number
  badges: string[]
  stages: Record<string, StageProgress>
  baseline: BaselineEntry[]
  finalCheck: BaselineEntry[]
  survivalSentences: string[]
  retrievalSentences: Record<string, string>
  teacherMode: boolean
  soundOn: boolean
  micEnabled: boolean
  hintsUsed: number
  correctCount: number
  answerCount: number
  startedAt: number | null
}
