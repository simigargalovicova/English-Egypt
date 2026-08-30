import { createContext, useContext } from 'react'
import type { BadgeDef, BaselineEntry, ProgressState, SkillTier, StageId } from '../types'

/** XP per interaction type, from the lesson design. */
export const XP_BY_TIER: Record<SkillTier, number> = {
  recognition: 2,
  reconstruction: 4,
  recall: 6,
  scenario: 8,
  selfCorrection: 3,
}

export interface XpEvent {
  id: number
  amount: number
  label: string
}

export interface ProgressContextValue {
  state: ProgressState
  /** Records one answer: awards XP, advances or breaks the streak. */
  award: (tier: SkillTier, correct: boolean, label?: string) => void
  bonus: (xp: number, label: string) => void
  noteHint: () => void
  attemptStage: (stage: StageId) => void
  completeStage: (stage: StageId, score: number) => void
  earnBadge: (id: string) => void
  setBaseline: (entries: BaselineEntry[]) => void
  setFinalCheck: (entries: BaselineEntry[]) => void
  setSurvival: (sentences: string[]) => void
  setRetrieval: (id: string, sentence: string) => void
  setTeacherMode: (value: boolean) => void
  setSound: (value: boolean) => void
  setMic: (value: boolean) => void
  resetAll: () => void
  isUnlocked: (stage: StageId) => boolean
  isComplete: (stage: StageId) => boolean
  stageScore: (stage: StageId) => number
  masteryPercent: number
  nextStage: StageId | null
  xpEvents: XpEvent[]
  badgeQueue: BadgeDef[]
  dismissBadge: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
