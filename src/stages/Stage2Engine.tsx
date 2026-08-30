import { useMemo, useState } from 'react'
import type { EngineItem } from '../types'
import {
  ENGINE_ITEMS,
  ENGINE_MASTERY_REQUIRED,
  ENGINE_REPAIR_COUNT,
  ENGINE_REPAIR_REQUIRED,
  ENGINE_REPAIR_ITEMS,
} from '../data/engine'
import { getStage } from '../data/stages'
import { sample, shuffle } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { MasteryMeter } from '../components/MasteryMeter'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('engine')

type Phase = 'main' | 'explain' | 'result' | 'repair' | 'repairResult'

/** Stage 2 — twelve mixed items, then the pattern, then a repair round if needed. */
export function Stage2Engine({ onExit }: { onExit: () => void }) {
  const { award, completeStage, earnBadge } = useProgress()
  useStageAttempt('engine')
  const [round, setRound] = useState(0)
  const items = useMemo(() => shuffle(ENGINE_ITEMS), [])
  const [repairItems, setRepairItems] = useState<EngineItem[]>([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [phase, setPhase] = useState<Phase>('main')

  const active = phase === 'repair' ? repairItems : items
  const item = active[index]
  const correctCount = results.filter(Boolean).length

  const dots: DotState[] = active.map((_, i) => {
    if (i < results.length) return results[i] ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function handle(correct: boolean) {
    award('recognition', correct)
    const next = [...results, correct]
    setResults(next)

    if (index + 1 >= active.length) {
      if (phase === 'main') {
        setPhase('explain')
      } else {
        const got = next.filter(Boolean).length
        if (got >= ENGINE_REPAIR_REQUIRED) {
          completeStage('engine', got / next.length)
        }
        setPhase('repairResult')
      }
    } else {
      setIndex(index + 1)
    }
  }

  function finishMain() {
    const got = results.filter(Boolean).length
    if (got >= ENGINE_MASTERY_REQUIRED) {
      completeStage('engine', got / ENGINE_ITEMS.length)
      if (got === ENGINE_ITEMS.length) earnBadge('engine-master')
    }
    setPhase('result')
  }

  function startRepair() {
    setRepairItems(sample(ENGINE_REPAIR_ITEMS, ENGINE_REPAIR_COUNT))
    setResults([])
    setIndex(0)
    setRound(round + 1)
    setPhase('repair')
  }

  if (phase === 'explain') {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <EngineBlocks />
        <button type="button" className="btn btn--primary btn--block" onClick={finishMain}>
          See my score
        </button>
      </StageShell>
    )
  }

  if (phase === 'result') {
    const got = results.filter(Boolean).length
    const passed = got >= ENGINE_MASTERY_REQUIRED
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={got}
          max={ENGINE_ITEMS.length}
          threshold={ENGINE_MASTERY_REQUIRED}
          message={
            passed
              ? 'You can hear which engine a sentence needs. That single skill fixes most beginner mistakes.'
              : `You need ${ENGINE_MASTERY_REQUIRED} of ${ENGINE_ITEMS.length} to pass. Here is a short repair round with new sentences — five questions, no pressure.`
          }
          onRetry={passed ? undefined : startRepair}
          retryLabel="Start the repair round →"
          onContinue={onExit}
          continueLabel={passed ? 'Back to the map' : 'Leave for now'}
        />
      </StageShell>
    )
  }

  if (phase === 'repairResult') {
    const got = results.filter(Boolean).length
    const passed = got >= ENGINE_REPAIR_REQUIRED
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={got}
          max={repairItems.length}
          threshold={ENGINE_REPAIR_REQUIRED}
          message={
            passed
              ? 'That is the pattern working. ARE for who and how you are, DO for normal verbs, CAN for what you are able to do.'
              : 'Still tricky — and that is fine. Read the three blocks once more and run another repair round.'
          }
          onRetry={passed ? undefined : startRepair}
          retryLabel="Another repair round"
          onContinue={onExit}
          continueLabel={passed ? 'Back to the map' : 'Leave for now'}
        />
      </StageShell>
    )
  }

  return (
    <StageShell
      stage={stage}
      onExit={onExit}
      dots={dots}
      aside={
        <MasteryMeter
          value={correctCount}
          max={active.length}
          label={phase === 'repair' ? 'Repair round' : 'Correct'}
          threshold={phase === 'repair' ? ENGINE_REPAIR_REQUIRED : ENGINE_MASTERY_REQUIRED}
        />
      }
    >
      {phase === 'repair' && index === 0 && (
        <div className="card card--tinted">
          <p style={{ margin: 0 }}>
            <strong>Repair round.</strong> Five new sentences. You need {ENGINE_REPAIR_REQUIRED} correct.
          </p>
        </div>
      )}
      <ChoiceExercise
        key={item.id}
        prompt={item.prompt}
        options={item.options}
        answer={item.answer}
        explanation={item.explanation}
        onComplete={handle}
      />
    </StageShell>
  )
}

/** Exercise B — the block explanation, deliberately shown after the practice. */
function EngineBlocks() {
  const rows = [
    {
      engine: 'ARE',
      color: 'var(--teal-500)',
      blocks: ['ARE', 'YOU', 'tired?'],
      use: 'Who you are, how you feel, where you are.',
      examples: ['I am tired.', 'I am not tired.', 'Are you tired?'],
    },
    {
      engine: 'DO',
      color: 'var(--sun-600)',
      blocks: ['DO', 'YOU', 'like', 'coffee?'],
      use: 'Normal verbs: like, want, eat, drink, speak, need.',
      examples: ['I like coffee.', "I don't like coffee.", 'Do you like coffee?'],
    },
    {
      engine: 'CAN',
      color: 'var(--coral-600)',
      blocks: ['CAN', 'YOU', 'swim?'],
      use: 'What you are able to do — and polite requests.',
      examples: ['I can swim.', "I can't swim.", 'Can you swim?'],
    },
  ]

  return (
    <div className="stack">
      <div className="card card--tinted">
        <p className="eyebrow" style={{ marginBottom: '0.2rem' }}>
          Now the pattern
        </p>
        <h2 style={{ margin: 0 }}>Three engines, three shapes</h2>
      </div>

      {rows.map((row, rowIndex) => (
        <div
          className="card animate-pop"
          key={row.engine}
          style={{ animationDelay: `${rowIndex * 0.12}s`, borderLeft: `6px solid ${row.color}` }}
        >
          <div className="tile-tray tile-tray--filled" style={{ minHeight: 'auto' }}>
            {row.blocks.map((block, i) => (
              <span
                key={i}
                className="tile"
                style={
                  i === 0
                    ? { background: row.color, color: '#fff', boxShadow: 'none', cursor: 'default' }
                    : { cursor: 'default' }
                }
              >
                {block}
              </span>
            ))}
          </div>
          <p className="muted" style={{ margin: '0.7rem 0 0.4rem', fontSize: '0.9rem' }}>
            {row.use}
          </p>
          <div className="pill-row">
            {row.examples.map((ex) => (
              <span className="pill" key={ex}>
                {ex}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
