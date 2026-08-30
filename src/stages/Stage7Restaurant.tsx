import { useState } from 'react'
import { RESTAURANT_EVENTS, RESTAURANT_TURNS } from '../data/restaurant'
import { getStage } from '../data/stages'
import { sample } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { DialogueScenario, type TurnRecord } from '../components/DialogueScenario'
import { StageShell } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('restaurant')

/** A fresh meal with one random surprise dropped in after the food order. */
function buildMeal() {
  const surprise = sample(RESTAURANT_EVENTS, 1)[0]
  const list = [...RESTAURANT_TURNS]
  list.splice(3, 0, surprise)
  return list
}

/**
 * Stage 7 — the scripted meal, with one unexpected problem dropped in after
 * the food order so the learner has to react to something unplanned.
 */
export function Stage7Restaurant({ onExit }: { onExit: () => void }) {
  const { completeStage, earnBadge } = useProgress()
  useStageAttempt('restaurant')
  const [runId, setRunId] = useState(0)
  const [turns, setTurns] = useState(buildMeal)
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)

  function finish(records: TurnRecord[]) {
    const correct = records.filter((r) => r.outcome.correct).length
    setResult({ correct, total: records.length })
    const score = correct / records.length
    if (score >= 0.5) {
      completeStage('restaurant', score)
      earnBadge('restaurant-ready')
    }
  }

  if (result) {
    const passed = result.correct / result.total >= 0.5
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={result.correct}
          max={result.total}
          threshold={Math.ceil(result.total / 2)}
          title={passed ? 'Table cleared' : 'Worth one more run'}
          message={
            passed
              ? 'Drinks, food, a problem you did not expect, and the bill. That is a whole evening handled in English.'
              : 'The surprise turn is the hard one. Run the meal again — you will get a different problem to react to.'
          }
          onRetry={
            passed
              ? undefined
              : () => {
                  setResult(null)
                  setTurns(buildMeal())
                  setRunId((n) => n + 1)
                }
          }
          retryLabel="Eat there again"
          onContinue={onExit}
          continueLabel={passed ? 'Back to the map' : 'Leave for now'}
        />
      </StageShell>
    )
  }

  return (
    <StageShell stage={stage} onExit={onExit}>
      <div className="card card--tinted">
        <p style={{ margin: 0, fontSize: '0.93rem' }}>
          🍲 A waiter is coming over. Answer out loud first, then type it. One thing in this meal will
          not go to plan.
        </p>
      </div>
      <DialogueScenario
        key={`restaurant-${runId}`}
        turns={turns}
        npcName="Waiter"
        onFinish={finish}
        finishLabel="Pay and leave"
      />
    </StageShell>
  )
}
