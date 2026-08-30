import type { ProgressState } from '../types'

const STORAGE_KEY = 'egypt-english-adventure:progress'
export const PROGRESS_VERSION = 1

export function createInitialProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    badges: [],
    stages: {},
    baseline: [],
    finalCheck: [],
    survivalSentences: [],
    retrievalSentences: {},
    teacherMode: false,
    soundOn: true,
    micEnabled: false,
    hintsUsed: 0,
    correctCount: 0,
    answerCount: 0,
    startedAt: null,
  }
}

/**
 * Reads saved progress. Anything unreadable or from an older schema is
 * discarded rather than half-applied, so a corrupt entry can never wedge
 * the app on load.
 */
export function loadProgress(): ProgressState {
  const fresh = createInitialProgress()
  if (typeof window === 'undefined') return fresh
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    if (!parsed || typeof parsed !== 'object') return fresh
    if (parsed.version !== PROGRESS_VERSION) return fresh
    return { ...fresh, ...parsed, version: PROGRESS_VERSION }
  } catch {
    return fresh
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode or quota exceeded — the lesson still works in memory */
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing we can do, and nothing the learner needs to see */
  }
}
