import { useState } from 'react'
import { CHUNK_PHRASES } from '../data/chunks'
import { getStage } from '../data/stages'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { SpeakButton } from '../components/SpeakButton'
import { TextAnswer } from '../components/TextAnswer'
import { MasteryMeter } from '../components/MasteryMeter'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('chunks')

/**
 * Stage 4 — one card at a time: meet the phrase, hear it, then immediately
 * produce it from the Slovak prompt with the English hidden.
 */
export function Stage4Chunks({ onExit }: { onExit: () => void }) {
  const { completeStage } = useProgress()
  useStageAttempt('chunks')
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<'card' | 'recall'>('card')
  const [results, setResults] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  const phrase = CHUNK_PHRASES[index]
  const correctCount = results.filter(Boolean).length

  const dots: DotState[] = CHUNK_PHRASES.map((_, i) => {
    if (i < results.length) return results[i] ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function next(correct: boolean) {
    const updated = [...results, correct]
    setResults(updated)
    setMode('card')
    if (index + 1 >= CHUNK_PHRASES.length) {
      completeStage('chunks', updated.filter(Boolean).length / CHUNK_PHRASES.length)
      setDone(true)
    } else {
      setIndex(index + 1)
    }
  }

  if (done) {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed
          score={correctCount}
          max={CHUNK_PHRASES.length}
          title="Sixteen phrases in your pocket"
          message="These frames cover most of what a traveller actually says. You will use them in every mission from here on."
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
      aside={<MasteryMeter value={correctCount} max={CHUNK_PHRASES.length} label="Recalled" />}
    >
      {mode === 'card' ? (
        <div className="stack">
          <article className="phrase" key={phrase.id}>
            <span className="phrase__group">{phrase.group}</span>
            <p className="phrase__en">{phrase.english}</p>
            <p className="phrase__sk">{phrase.slovak}</p>
            <SpeakButton text={phrase.english} label="Listen" autoPlay />
            <p className="phrase__context">
              {phrase.context}
              <br />
              <span className="sk">{phrase.contextSk}</span>
            </p>
          </article>

          <div className="card card--tinted">
            <p style={{ margin: 0, fontSize: '0.92rem' }}>
              Say it out loud twice. Then hide it and write it from memory.
            </p>
          </div>

          <button type="button" className="btn btn--primary btn--block" onClick={() => setMode('recall')}>
            Hide it — I&apos;ll try from memory
          </button>
        </div>
      ) : (
        <div className="stack stack--tight">
          <div className="goal-banner">
            <span aria-hidden="true">🧠</span>
            <span>
              <span className="goal-banner__label">From memory · Spamäti</span>
              {phrase.recallPromptSk}
            </span>
          </div>
          <TextAnswer
            key={phrase.id}
            itemKey={phrase.id}
            spec={phrase.recall}
            tier="recall"
            hints={[`It is a “${phrase.group}” phrase.`, `Start with “${phrase.english.split(' ').slice(0, 2).join(' ')}…”`]}
            placeholder="Write the English phrase…"
            onComplete={(outcome) => next(outcome.correct)}
          />
          <button type="button" className="btn btn--quiet" onClick={() => setMode('card')}>
            ← Show me the card again
          </button>
        </div>
      )}
    </StageShell>
  )
}
