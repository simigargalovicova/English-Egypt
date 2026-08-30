import { useState } from 'react'
import { SURGERY_ITEMS, SURGERY_REQUIRED } from '../data/surgery'
import { getStage } from '../data/stages'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { SentenceBuilder } from '../components/SentenceBuilder'
import { TextAnswer } from '../components/TextAnswer'
import { MasteryMeter } from '../components/MasteryMeter'
import { SpeakButton } from '../components/SpeakButton'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('surgery')

const ENGINE_RULE: Record<string, string> = {
  BE: 'Same engine: ARE. Put ARE first and swap I → you.',
  DO: 'Same engine: DO. Questions with normal verbs start with DO you…',
  CAN: 'Same engine: CAN. Put CAN first — and use the plain verb after it.',
}

/**
 * Stage 3 — each sentence is turned into a negative (with word tiles) and a
 * question (typed from memory). An item counts only when both halves work.
 */
export function Stage3Surgery({ onExit }: { onExit: () => void }) {
  const { completeStage, award } = useProgress()
  useStageAttempt('surgery')
  const [index, setIndex] = useState(0)
  const [part, setPart] = useState<'negative' | 'question'>('negative')
  const [negOk, setNegOk] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  const item = SURGERY_ITEMS[index]
  const correctCount = results.filter(Boolean).length

  const dots: DotState[] = SURGERY_ITEMS.map((_, i) => {
    if (i < results.length) return results[i] ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function finishItem(questionOk: boolean) {
    const next = [...results, negOk && questionOk]
    setResults(next)
    setNegOk(false)
    setPart('negative')

    if (index + 1 >= SURGERY_ITEMS.length) {
      const got = next.filter(Boolean).length
      if (got >= SURGERY_REQUIRED) completeStage('surgery', got / SURGERY_ITEMS.length)
      setDone(true)
    } else {
      setIndex(index + 1)
    }
  }

  function restart() {
    setIndex(0)
    setPart('negative')
    setNegOk(false)
    setResults([])
    setDone(false)
  }

  if (done) {
    const got = results.filter(Boolean).length
    const passed = got >= SURGERY_REQUIRED
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed={passed}
          score={got}
          max={SURGERY_ITEMS.length}
          threshold={SURGERY_REQUIRED}
          message={
            passed
              ? 'You can now flip any sentence into a negative or a question without changing the engine. That is most of spoken grammar.'
              : `You need ${SURGERY_REQUIRED} of ${SURGERY_ITEMS.length} items fully correct — both the negative and the question. Run it again; the second pass is always faster.`
          }
          onRetry={passed ? undefined : restart}
          retryLabel="Run the six again"
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
      aside={<MasteryMeter value={correctCount} max={SURGERY_ITEMS.length} threshold={SURGERY_REQUIRED} />}
    >
      <div className="prompt-card">
        <p className="eyebrow">The sentence on the table</p>
        <p className="prompt-big" style={{ marginBottom: '0.3rem' }}>
          {item.base}
        </p>
        <p className="sk" style={{ margin: 0 }}>
          {item.baseSk} <SpeakButton text={item.base} label="Hear it" mini />
        </p>
        <div className="pill-row" style={{ marginTop: '0.7rem' }}>
          <span className="pill pill--on">Engine: {item.engine}</span>
          <span className={`pill${part === 'negative' ? ' pill--on' : ''}`}>1 · Negative</span>
          <span className={`pill${part === 'question' ? ' pill--on' : ''}`}>2 · Question</span>
        </div>
      </div>

      {part === 'negative' ? (
        <SentenceBuilder
          key={`${item.id}-neg`}
          tiles={item.negativeTiles}
          answer={item.negative.modelAnswer}
          slovak="Make it NEGATIVE — tap the words in order."
          explanation={ENGINE_RULE[item.engine]}
          onComplete={(ok) => {
            award('reconstruction', ok)
            setNegOk(ok)
            setPart('question')
          }}
        />
      ) : (
        <div className="stack stack--tight">
          <div className="goal-banner">
            <span aria-hidden="true">❓</span>
            <span>
              <span className="goal-banner__label">Now the question</span>
              Ask the same thing about the other person — type it yourself.
            </span>
          </div>
          <TextAnswer
            key={`${item.id}-q`}
            itemKey={`${item.id}-q`}
            spec={item.question}
            tier="recall"
            rule={ENGINE_RULE[item.engine]}
            hints={['Which word goes first?', `Start with “${item.question.modelAnswer.split(' ')[0]}…”`]}
            placeholder="Type the question…"
            onComplete={(outcome) => finishItem(outcome.correct)}
          />
        </div>
      )}
    </StageShell>
  )
}
