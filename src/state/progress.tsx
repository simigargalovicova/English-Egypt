import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import type { BadgeDef, BaselineEntry, ProgressState, SkillTier, StageId } from '../types'
import {
  ProgressContext,
  XP_BY_TIER,
  type ProgressContextValue,
  type XpEvent,
} from './progressContext'
import { STAGES, STAGE_ORDER, getBadge } from '../data/stages'
import { clearProgress, createInitialProgress, loadProgress, saveProgress } from '../lib/storage'

type Action =
  | { type: 'award'; tier: SkillTier; correct: boolean }
  | { type: 'bonus'; xp: number }
  | { type: 'hintUsed' }
  | { type: 'completeStage'; stage: StageId; score: number }
  | { type: 'attemptStage'; stage: StageId }
  | { type: 'badge'; id: string }
  | { type: 'baseline'; entries: BaselineEntry[] }
  | { type: 'finalCheck'; entries: BaselineEntry[] }
  | { type: 'survival'; sentences: string[] }
  | { type: 'retrieval'; id: string; sentence: string }
  | { type: 'setTeacherMode'; value: boolean }
  | { type: 'setSound'; value: boolean }
  | { type: 'setMic'; value: boolean }
  | { type: 'reset' }
  | { type: 'hydrate'; state: ProgressState }

function withStage(state: ProgressState, stage: StageId) {
  return state.stages[stage] ?? { score: 0, completed: false, attempts: 0 }
}

function reducer(state: ProgressState, action: Action): ProgressState {
  switch (action.type) {
    case 'award': {
      const gained = action.correct ? XP_BY_TIER[action.tier] : 0
      const streak = action.correct ? state.streak + 1 : 0
      return {
        ...state,
        xp: state.xp + gained,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        correctCount: state.correctCount + (action.correct ? 1 : 0),
        answerCount: state.answerCount + 1,
        startedAt: state.startedAt ?? Date.now(),
      }
    }
    case 'bonus':
      return { ...state, xp: state.xp + action.xp }
    case 'hintUsed':
      return { ...state, hintsUsed: state.hintsUsed + 1 }
    case 'attemptStage': {
      const current = withStage(state, action.stage)
      return {
        ...state,
        startedAt: state.startedAt ?? Date.now(),
        stages: {
          ...state.stages,
          [action.stage]: { ...current, attempts: current.attempts + 1 },
        },
      }
    }
    case 'completeStage': {
      const current = withStage(state, action.stage)
      return {
        ...state,
        stages: {
          ...state.stages,
          [action.stage]: {
            ...current,
            completed: true,
            score: Math.max(current.score, action.score),
          },
        },
      }
    }
    case 'badge':
      return state.badges.includes(action.id)
        ? state
        : { ...state, badges: [...state.badges, action.id] }
    case 'baseline':
      return { ...state, baseline: action.entries }
    case 'finalCheck':
      return { ...state, finalCheck: action.entries }
    case 'survival':
      return { ...state, survivalSentences: action.sentences }
    case 'retrieval':
      return {
        ...state,
        retrievalSentences: { ...state.retrievalSentences, [action.id]: action.sentence },
      }
    case 'setTeacherMode':
      return { ...state, teacherMode: action.value }
    case 'setSound':
      return { ...state, soundOn: action.value }
    case 'setMic':
      return { ...state, micEnabled: action.value }
    case 'reset':
      return createInitialProgress()
    case 'hydrate':
      return action.state
    default:
      return state
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadProgress)
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([])
  const [badgeQueue, setBadgeQueue] = useState<BadgeDef[]>([])
  const eventId = useRef(0)

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const pushXpEvent = useCallback((amount: number, label: string) => {
    if (amount <= 0) return
    eventId.current += 1
    const event = { id: eventId.current, amount, label }
    setXpEvents((prev) => [...prev, event])
    window.setTimeout(() => {
      setXpEvents((prev) => prev.filter((e) => e.id !== event.id))
    }, 1600)
  }, [])

  const earnBadge = useCallback(
    (id: string) => {
      const badge = getBadge(id)
      if (!badge) return
      // The reducer ignores duplicates; the popup queue must too.
      setBadgeQueue((prev) => {
        if (prev.some((b) => b.id === id)) return prev
        return [...prev, badge]
      })
      dispatch({ type: 'badge', id })
    },
    [],
  )

  const earnedBadgesRef = useRef(state.badges)
  useEffect(() => {
    earnedBadgesRef.current = state.badges
  }, [state.badges])

  const award = useCallback(
    (tier: SkillTier, correct: boolean, label = 'Correct') => {
      dispatch({ type: 'award', tier, correct })
      if (correct) pushXpEvent(XP_BY_TIER[tier], label)
    },
    [pushXpEvent],
  )

  const bonus = useCallback(
    (xp: number, label: string) => {
      dispatch({ type: 'bonus', xp })
      pushXpEvent(xp, label)
    },
    [pushXpEvent],
  )

  // Streak badge is awarded by watching the streak rather than at each call site.
  useEffect(() => {
    if (state.streak >= 10 && !earnedBadgesRef.current.includes('streak-10')) {
      earnBadge('streak-10')
    }
  }, [state.streak, earnBadge])

  const isComplete = useCallback(
    (stage: StageId) => Boolean(state.stages[stage]?.completed),
    [state.stages],
  )

  /** A stage unlocks when the previous one on the map is complete. */
  const isUnlocked = useCallback(
    (stage: StageId) => {
      const index = STAGE_ORDER.indexOf(stage)
      if (index <= 0) return true
      return Boolean(state.stages[STAGE_ORDER[index - 1]]?.completed)
    },
    [state.stages],
  )

  const stageScore = useCallback(
    (stage: StageId) => state.stages[stage]?.score ?? 0,
    [state.stages],
  )

  const masteryPercent = useMemo(() => {
    const total = STAGES.reduce((sum, stage) => sum + (state.stages[stage.id]?.score ?? 0), 0)
    return Math.round((total / STAGES.length) * 100)
  }, [state.stages])

  const nextStage = useMemo(() => {
    return STAGE_ORDER.find((id) => !state.stages[id]?.completed) ?? null
  }, [state.stages])

  // Finishing every stage earns the explorer badge.
  useEffect(() => {
    const allDone = STAGE_ORDER.every((id) => state.stages[id]?.completed)
    if (allDone && !earnedBadgesRef.current.includes('egypt-explorer')) {
      earnBadge('egypt-explorer')
    }
  }, [state.stages, earnBadge])

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      award,
      bonus,
      noteHint: () => dispatch({ type: 'hintUsed' }),
      attemptStage: (stage) => dispatch({ type: 'attemptStage', stage }),
      completeStage: (stage, score) => dispatch({ type: 'completeStage', stage, score }),
      earnBadge,
      setBaseline: (entries) => dispatch({ type: 'baseline', entries }),
      setFinalCheck: (entries) => dispatch({ type: 'finalCheck', entries }),
      setSurvival: (sentences) => dispatch({ type: 'survival', sentences }),
      setRetrieval: (id, sentence) => dispatch({ type: 'retrieval', id, sentence }),
      setTeacherMode: (v) => dispatch({ type: 'setTeacherMode', value: v }),
      setSound: (v) => dispatch({ type: 'setSound', value: v }),
      setMic: (v) => dispatch({ type: 'setMic', value: v }),
      resetAll: () => {
        clearProgress()
        setBadgeQueue([])
        setXpEvents([])
        dispatch({ type: 'reset' })
      },
      isUnlocked,
      isComplete,
      stageScore,
      masteryPercent,
      nextStage,
      xpEvents,
      badgeQueue,
      dismissBadge: () => setBadgeQueue((prev) => prev.slice(1)),
    }),
    [
      state,
      award,
      bonus,
      earnBadge,
      isUnlocked,
      isComplete,
      stageScore,
      masteryPercent,
      nextStage,
      xpEvents,
      badgeQueue,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

