import { useState } from 'react'
import type { Structure } from '../lib/normalize'
import type { DialogueTurn } from '../types'
import {
  BOSS_SCENARIOS,
  BOSS_STRUCTURES_REQUIRED,
  BOSS_TURNS_REQUIRED,
} from '../data/finalboss'
import { getStage } from '../data/stages'
import { detectStructures, sample } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { DialogueScenario, type TurnRecord } from '../components/DialogueScenario'
import { StageShell } from '../components/StageShell'
import { StageResult } from '../components/StageResult'
import type { AnswerOutcome } from '../components/TextAnswer'

const stage = getStage('finalboss')

const STRUCTURE_LABELS: Record<Structure, string> = {
  BE: 'BE (I am / Are you)',
  DO: "DO (Do you / I don't)",
  CAN: 'CAN (Can you / I can)',
  WOULD_LIKE: "I'd like",
  WH_QUESTION: 'Wh- question',
  POLITE: 'Polite form',
  THERE_IS: 'There is / are',
  AFFIRM: 'Accepting / refusing',
  THANKS: 'Thanking',
}

interface BossResult {
  cleanTurns: number
  total: number
  structures: Structure[]
  passed: boolean
}

/**
 * Stage 10 — one random scenario, no Slovak on screen, and hints that cost
 * something. Passing needs meaning to get through on most turns AND a spread
 * of different structures, so one memorised sentence cannot carry it.
 */
export function Stage10FinalBoss({ onExit }: { onExit: () => void }) {
  const { completeStage } = useProgress()
  useStageAttempt('finalboss')
  const [runId, setRunId] = useState(0)
  const [scenario, setScenario] = useState(() => sample(BOSS_SCENARIOS, 1)[0])
  const [started, setStarted] = useState(false)
  const [structures, setStructures] = useState<Structure[]>([])
  const [result, setResult] = useState<BossResult | null>(null)

  function onTurnDone(_turn: DialogueTurn, outcome: AnswerOutcome) {
    if (!outcome.correct) return
    const found = detectStructures(outcome.text)
    setStructures((prev) => Array.from(new Set([...prev, ...found])))
  }

  function finish(records: TurnRecord[]) {
    // A turn counts as clean when the message worked without the model answer.
    const cleanTurns = records.filter((r) => r.outcome.correct && !r.outcome.revealedModel).length
    const used = Array.from(
      new Set(records.filter((r) => r.outcome.correct).flatMap((r) => detectStructures(r.text))),
    )
    // Range matters, but getting the message across in every single turn is
    // the point of the lesson — a flawless run passes on communication alone.
    const passed =
      (cleanTurns >= BOSS_TURNS_REQUIRED && used.length >= BOSS_STRUCTURES_REQUIRED) ||
      cleanTurns === records.length
    setResult({ cleanTurns, total: records.length, structures: used, passed })
    if (passed) {
      completeStage('finalboss', cleanTurns / records.length)
    }
  }

  function drawScenario() {
    setScenario(sample(BOSS_SCENARIOS, 1)[0])
    setRunId((n) => n + 1)
  }

  function retry() {
    drawScenario()
    setStarted(false)
    setStructures([])
    setResult(null)
  }

  if (result) {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={result.passed}
          score={result.cleanTurns}
          max={result.total}
          threshold={BOSS_TURNS_REQUIRED}
          title={result.passed ? 'You handled it' : 'Close — one more run'}
          message={
            result.passed
              ? `You got your meaning across in ${result.cleanTurns} of ${result.total} turns without being shown the answer, using ${result.structures.length} different structures. That is a real conversation, not a memorised script.`
              : `You need ${BOSS_TURNS_REQUIRED} turns without the full answer and ${BOSS_STRUCTURES_REQUIRED} different structures. You had ${result.cleanTurns} clean turns and ${result.structures.length} structures. Try a different scenario — the hints are there if you need them.`
          }
          onRetry={result.passed ? undefined : retry}
          retryLabel="Draw a new scenario"
          onContinue={onExit}
          continueLabel={result.passed ? 'Back to the map' : 'Leave for now'}
        />
        <div className="card">
          <p className="eyebrow">Structures you used</p>
          <div className="pill-row">
            {(Object.keys(STRUCTURE_LABELS) as Structure[]).map((key) => (
              <span
                className={`pill${result.structures.includes(key) ? ' pill--on' : ''}`}
                key={key}
              >
                {result.structures.includes(key) ? '✓ ' : ''}
                {STRUCTURE_LABELS[key]}
              </span>
            ))}
          </div>
        </div>
      </StageShell>
    )
  }

  if (!started) {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <div className="card card--tinted animate-pop" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Your scenario — drawn at random</p>
          <p style={{ fontSize: '3rem', margin: '0.2rem 0' }} aria-hidden="true">
            {scenario.emoji}
          </p>
          <h2 style={{ marginBottom: '0.4rem' }}>{scenario.title}</h2>
          <p style={{ margin: 0 }}>{scenario.intro}</p>
          <p className="sk" style={{ marginTop: '0.4rem' }}>
            {scenario.introSk}
          </p>
        </div>

        <div className="card">
          <p className="eyebrow">To pass</p>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            <li>Get your meaning across in {BOSS_TURNS_REQUIRED} of {scenario.turns.length} turns</li>
            <li>Use at least {BOSS_STRUCTURES_REQUIRED} different structures</li>
            <li>Hints are allowed — the full answer costs you the turn</li>
          </ul>
          <p className="muted" style={{ margin: '0.7rem 0 0', fontSize: '0.88rem' }}>
            No Slovak from here. Say each line out loud before you type it.
          </p>
        </div>

        <button type="button" className="btn btn--coral btn--block" onClick={() => setStarted(true)}>
          Begin →
        </button>
        <button type="button" className="btn btn--quiet" onClick={drawScenario}>
          🎲 Give me a different scenario
        </button>
      </StageShell>
    )
  }

  return (
    <StageShell stage={stage} onExit={onExit}>
      <div className="card card--tinted">
        <p style={{ margin: 0, fontWeight: 700 }}>
          {scenario.emoji} {scenario.title}
        </p>
        <div className="pill-row" style={{ marginTop: '0.5rem' }}>
          {structures.length === 0 ? (
            <span className="pill">No structures counted yet</span>
          ) : (
            structures.map((s) => (
              <span className="pill pill--on" key={s}>
                ✓ {STRUCTURE_LABELS[s]}
              </span>
            ))
          )}
        </div>
      </div>

      <DialogueScenario
        key={`${scenario.id}-${runId}`}
        turns={scenario.turns}
        showSlovakGoal={false}
        npcName={scenario.title}
        onTurnDone={onTurnDone}
        onFinish={finish}
        finishLabel="See how you did"
      />
    </StageShell>
  )
}
