import { useState } from 'react'
import { BUILD_REQUIRED_PER_LEVEL, FREE_ITEMS, REORDER_ITEMS, SCAFFOLD_ITEMS } from '../data/build'
import { getStage } from '../data/stages'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { SentenceBuilder } from '../components/SentenceBuilder'
import { ScaffoldExercise } from '../components/ScaffoldExercise'
import { TextAnswer } from '../components/TextAnswer'
import { MasteryMeter } from '../components/MasteryMeter'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('build')

type Level = 0 | 1 | 2

const LEVELS = [
  {
    key: 'A',
    title: 'Level A · Put the words in order',
    blurb: 'All the words are there. Find the shape.',
    count: REORDER_ITEMS.length,
  },
  {
    key: 'B',
    title: 'Level B · Fill the gaps',
    blurb: 'The shape is given. You supply the words.',
    count: SCAFFOLD_ITEMS.length,
  },
  {
    key: 'C',
    title: 'Level C · Say it yourself',
    blurb: 'No Slovak, no words given. Just the situation.',
    count: FREE_ITEMS.length,
  },
] as const

/** Stage 5 — support is removed one level at a time. */
export function Stage5Build({ onExit }: { onExit: () => void }) {
  const { completeStage, award } = useProgress()
  useStageAttempt('build')
  const [level, setLevel] = useState<Level>(0)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [levelScores, setLevelScores] = useState<number[]>([])
  const [phase, setPhase] = useState<'intro' | 'play' | 'levelDone' | 'stageDone'>('intro')

  const meta = LEVELS[level]
  const correctCount = results.filter(Boolean).length

  const dots: DotState[] = Array.from({ length: meta.count }, (_, i) => {
    if (i < results.length) return results[i] ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function record(correct: boolean) {
    const next = [...results, correct]
    setResults(next)
    if (index + 1 >= meta.count) {
      setPhase('levelDone')
    } else {
      setIndex(index + 1)
    }
  }

  function replayLevel() {
    setResults([])
    setIndex(0)
    setPhase('play')
  }

  function advanceLevel() {
    const got = results.filter(Boolean).length
    const scores = [...levelScores, got / meta.count]
    setLevelScores(scores)
    setResults([])
    setIndex(0)
    if (level === 2) {
      const average = scores.reduce((a, b) => a + b, 0) / scores.length
      completeStage('build', average)
      setPhase('stageDone')
    } else {
      setLevel((level + 1) as Level)
      setPhase('intro')
    }
  }

  if (phase === 'intro') {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <div className="card card--tinted animate-pop">
          <p className="eyebrow">{meta.key === 'A' ? 'Starting point' : 'Support removed'}</p>
          <h2 style={{ marginBottom: '0.3rem' }}>{meta.title}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {meta.blurb}
          </p>
          <div className="pill-row" style={{ marginTop: '0.8rem' }}>
            <span className="pill">{meta.count} items</span>
            <span className="pill">Pass mark {BUILD_REQUIRED_PER_LEVEL}</span>
          </div>
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={() => setPhase('play')}>
          Start Level {meta.key}
        </button>
      </StageShell>
    )
  }

  if (phase === 'levelDone') {
    const got = results.filter(Boolean).length
    const passed = got >= BUILD_REQUIRED_PER_LEVEL
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={got}
          max={meta.count}
          threshold={BUILD_REQUIRED_PER_LEVEL}
          title={passed ? `Level ${meta.key} cleared` : `Level ${meta.key} — one more pass`}
          message={
            passed
              ? level === 2
                ? 'That was free production with nothing on screen to lean on. That is the real skill.'
                : 'Good. The next level takes some of the help away.'
              : `You need ${BUILD_REQUIRED_PER_LEVEL} of ${meta.count}. The items come back in a new order — it is quicker the second time.`
          }
          onRetry={passed ? undefined : replayLevel}
          retryLabel={`Repeat Level ${meta.key}`}
          onContinue={passed ? advanceLevel : onExit}
          continueLabel={passed ? (level === 2 ? 'Finish the stage' : `On to Level ${LEVELS[level + 1].key} →`) : 'Leave for now'}
        />
      </StageShell>
    )
  }

  if (phase === 'stageDone') {
    const average = levelScores.reduce((a, b) => a + b, 0) / levelScores.length
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed
          score={Math.round(average * 100)}
          max={100}
          title="All three levels cleared"
          message="You went from arranging given words to producing your own sentence from a situation. Time to use it on a real person."
          onContinue={onExit}
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
        <div className="stack stack--tight">
          <div className="pill-row">
            {LEVELS.map((l, i) => (
              <span className={`pill${i === level ? ' pill--on' : ''}`} key={l.key}>
                Level {l.key}
              </span>
            ))}
          </div>
          <MasteryMeter value={correctCount} max={meta.count} threshold={BUILD_REQUIRED_PER_LEVEL} />
        </div>
      }
    >
      {level === 0 && (
        <SentenceBuilder
          key={REORDER_ITEMS[index].id}
          tiles={REORDER_ITEMS[index].tiles}
          answer={REORDER_ITEMS[index].answer}
          slovak={REORDER_ITEMS[index].slovak}
          explanation={REORDER_ITEMS[index].explanation}
          onComplete={(ok) => {
            award('reconstruction', ok)
            record(ok)
          }}
        />
      )}

      {level === 1 && (
        <ScaffoldExercise
          key={SCAFFOLD_ITEMS[index].id}
          item={SCAFFOLD_ITEMS[index]}
          onComplete={(ok) => {
            award('reconstruction', ok)
            record(ok)
          }}
        />
      )}

      {level === 2 && (
        <div className="stack stack--tight">
          <div className="goal-banner">
            <span aria-hidden="true">🎯</span>
            <span>
              <span className="goal-banner__label">The situation</span>
              {FREE_ITEMS[index].scenario}
            </span>
          </div>
          <TextAnswer
            key={FREE_ITEMS[index].id}
            itemKey={FREE_ITEMS[index].id}
            spec={FREE_ITEMS[index].answer}
            tier="recall"
            hints={[FREE_ITEMS[index].hint1, FREE_ITEMS[index].hint2]}
            placeholder="What do you say?"
            onComplete={(outcome) => record(outcome.correct)}
          />
        </div>
      )}
    </StageShell>
  )
}
