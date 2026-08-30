import { useState } from 'react'
import { ERRORS_REQUIRED, ERROR_ITEMS } from '../data/errors'
import { getStage } from '../data/stages'
import { shuffle } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { TextAnswer } from '../components/TextAnswer'
import { MasteryMeter } from '../components/MasteryMeter'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('errors')

/** Stage 9 — typed repairs of the mistakes this learner is most likely to make. */
export function Stage9Errors({ onExit }: { onExit: () => void }) {
  const { completeStage, earnBadge } = useProgress()
  useStageAttempt('errors')
  const [items, setItems] = useState(() => shuffle(ERROR_ITEMS))
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  const item = items[index]
  const correctCount = results.filter(Boolean).length

  const dots: DotState[] = items.map((_, i) => {
    if (i < results.length) return results[i] ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function record(correct: boolean) {
    const next = [...results, correct]
    setResults(next)
    if (index + 1 >= items.length) {
      const got = next.filter(Boolean).length
      if (got >= ERRORS_REQUIRED) {
        completeStage('errors', got / items.length)
        earnBadge('grammar-detective')
      }
      setDone(true)
    } else {
      setIndex(index + 1)
    }
  }

  function restart() {
    setItems(shuffle(ERROR_ITEMS))
    setIndex(0)
    setResults([])
    setDone(false)
  }

  if (done) {
    const passed = correctCount >= ERRORS_REQUIRED
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={correctCount}
          max={items.length}
          threshold={ERRORS_REQUIRED}
          message={
            passed
              ? 'You can now spot the mistakes you used to make. Noticing them is what stops you repeating them.'
              : `You need ${ERRORS_REQUIRED} of ${items.length}. Run it again in a new order — the rules stick fast once you have seen each one twice.`
          }
          onRetry={passed ? undefined : restart}
          retryLabel="Reopen the case"
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
      aside={<MasteryMeter value={correctCount} max={items.length} threshold={ERRORS_REQUIRED} />}
    >
      <div className="prompt-card">
        <p className="eyebrow">Broken sentence {index + 1}</p>
        <p
          className="prompt-big"
          style={{ color: 'var(--coral-600)', textDecoration: 'line-through', textDecorationThickness: '2px' }}
        >
          {item.wrong}
        </p>
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
          Type the repaired sentence. Napíš vetu správne.
        </p>
      </div>

      <TextAnswer
        key={item.id}
        itemKey={item.id}
        spec={item.answer}
        tier="recall"
        rule={item.rule}
        hints={[item.rule]}
        placeholder="The correct sentence…"
        onComplete={(outcome) => record(outcome.correct)}
      />
    </StageShell>
  )
}
