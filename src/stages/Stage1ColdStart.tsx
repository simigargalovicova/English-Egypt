import { useState } from 'react'
import type { BaselineEntry, SelfRating } from '../types'
import { COLD_START_ITEMS } from '../data/coldstart'
import { getStage } from '../data/stages'
import { matchAnswer, normalize } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { Feedback } from '../components/Feedback'
import { SpeakButton } from '../components/SpeakButton'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const RATINGS: Array<{ id: SelfRating; label: string; sk: string }> = [
  { id: 'know', label: 'I know this', sk: 'Toto viem' },
  { id: 'almost', label: 'Almost', sk: 'Skoro' },
  { id: 'notyet', label: "I don't know yet", sk: 'Zatiaľ neviem' },
]

const stage = getStage('coldstart')

/**
 * Stage 1 — diagnosis, not teaching. Nothing is shown before the learner
 * writes, and the model answer only appears once they have committed.
 */
export function Stage1ColdStart({ onExit }: { onExit: () => void }) {
  const { award, bonus, noteHint, setBaseline, completeStage, earnBadge, state } = useProgress()
  useStageAttempt('coldstart')
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [entries, setEntries] = useState<BaselineEntry[]>([])
  const [finished, setFinished] = useState(false)

  const item = COLD_START_ITEMS[index]
  const passed = submitted ? matchAnswer(text, { acceptedAnswers: [item.modelAnswer, ...item.altModels], modelAnswer: item.modelAnswer }).quality === 'correct' : false

  const dots: DotState[] = COLD_START_ITEMS.map((_, i) => {
    if (i < entries.length) return entries[i].passed ? 'done' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function submit() {
    if (!text.trim()) return
    setSubmitted(true)
    award('recall', passedFor(text))
    if (normalize(text).length > 0) {
      bonus(2, 'Brave attempt')
      earnBadge('first-sentence')
    }
  }

  function passedFor(value: string): boolean {
    return (
      matchAnswer(value, {
        acceptedAnswers: [item.modelAnswer, ...item.altModels],
        modelAnswer: item.modelAnswer,
      }).quality === 'correct'
    )
  }

  function rate(rating: SelfRating) {
    const entry: BaselineEntry = {
      itemId: item.id,
      answer: text.trim(),
      rating,
      passed: passedFor(text),
    }
    const next = [...entries, entry]
    setEntries(next)
    setText('')
    setSubmitted(false)
    setShowHint(false)
    setShowModel(false)

    if (index + 1 >= COLD_START_ITEMS.length) {
      setBaseline(next)
      const score = next.filter((e) => e.passed).length / COLD_START_ITEMS.length
      completeStage('coldstart', score)
      setFinished(true)
    } else {
      setIndex(index + 1)
    }
  }

  if (finished) {
    const correct = entries.filter((e) => e.passed).length
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed
          score={correct}
          max={COLD_START_ITEMS.length}
          title="Baseline saved"
          message={
            correct >= 4
              ? "Strong start — you already have real English in there. We'll sharpen it and make it faster."
              : "That's exactly what we needed to know. Every one of these six comes back at the end of the lesson — you will see the difference."
          }
          onContinue={onExit}
          continueLabel="Start learning →"
        />
      </StageShell>
    )
  }

  return (
    <StageShell stage={stage} onExit={onExit} dots={dots}>
      <div className="card card--tinted">
        <p className="eyebrow">No teaching yet — just try</p>
        <p style={{ margin: 0, fontSize: '0.92rem' }} className="muted">
          Write whatever you can. Wrong answers are useful here. We compare these six at the end of
          the lesson.
        </p>
      </div>

      <div className="prompt-card">
        <p className="eyebrow">
          Task {index + 1} of {COLD_START_ITEMS.length}
        </p>
        <p className="prompt-card__task">{item.taskSk}</p>
        <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>
          {item.taskEn}
        </p>
      </div>

      {!submitted && (
        <div className="stack stack--tight">
          <label className="visually-hidden" htmlFor={`cold-${item.id}`}>
            Your answer in English
          </label>
          <textarea
            id={`cold-${item.id}`}
            className="input"
            value={text}
            rows={2}
            placeholder="Napíš po anglicky…"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={submit} disabled={!text.trim()}>
              That&apos;s my answer
            </button>
            {!showHint && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setShowHint(true)
                  noteHint()
                }}
              >
                💡 Small hint
              </button>
            )}
          </div>
          {showHint && <div className="hint-box">{item.hint}</div>}
        </div>
      )}

      {submitted && (
        <div className="stack stack--tight">
          <Feedback tone={passed ? 'correct' : 'info'} title={passed ? 'That works already.' : 'Answer saved.'}>
            <p>
              You wrote: <span className="model-answer">{text.trim()}</span>
            </p>
            {!passed && !showModel && (
              <p className="muted">
                We will not correct this yet. Rate yourself honestly and keep going.
              </p>
            )}
          </Feedback>

          {!showModel && !passed && (
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => {
                setShowModel(true)
                noteHint()
              }}
            >
              Show me one good answer
            </button>
          )}

          {(showModel || passed) && (
            <div className="hint-box">
              <strong>{item.modelAnswer}</strong> <SpeakButton text={item.modelAnswer} label="Hear it" mini />
              {item.altModels.length > 0 && (
                <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
                  Also fine: {item.altModels.join(' / ')}
                </p>
              )}
            </div>
          )}

          <div className="card">
            <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>
              How did that feel? · Ako ti to šlo?
            </p>
            <div className="rating-row">
              {RATINGS.map((r) => (
                <button key={r.id} type="button" className="rating" onClick={() => rate(r.id)}>
                  {r.label}
                  <br />
                  <span className="sk" style={{ fontSize: '0.78rem' }}>
                    {r.sk}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {state.teacherMode && (
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          Teacher: say nothing during this stage. Note which prompts produce silence.
        </p>
      )}
    </StageShell>
  )
}
