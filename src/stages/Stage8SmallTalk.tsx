import { useState } from 'react'
import {
  EXPANDED_WORD_COUNT,
  SMALL_TALK_EXPANDED_REQUIRED,
  SMALL_TALK_ITEMS,
} from '../data/smalltalk'
import { getStage } from '../data/stages'
import { wordCount } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { TextAnswer } from '../components/TextAnswer'
import { Feedback } from '../components/Feedback'
import { SpeakButton } from '../components/SpeakButton'
import { StageShell, type DotState } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('smalltalk')

interface Answered {
  text: string
  correct: boolean
  expanded: boolean
}

/**
 * Stage 8 — short answers are accepted, but the learner is nudged to add one
 * more detail, which is what turns an answer into a conversation.
 */
export function Stage8SmallTalk({ onExit }: { onExit: () => void }) {
  const { completeStage, bonus, earnBadge } = useProgress()
  useStageAttempt('smalltalk')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answered[]>([])
  const [pending, setPending] = useState<{ text: string; correct: boolean } | null>(null)
  const [extra, setExtra] = useState('')
  const [done, setDone] = useState(false)

  const item = SMALL_TALK_ITEMS[index]
  const expandedCount = answers.filter((a) => a.expanded).length

  const dots: DotState[] = SMALL_TALK_ITEMS.map((_, i) => {
    if (i < answers.length) return answers[i].expanded ? 'done' : answers[i].correct ? 'current' : 'wrong'
    if (i === index) return 'current'
    return 'todo'
  })

  function store(text: string, correct: boolean, expanded: boolean) {
    const next = [...answers, { text, correct, expanded }]
    setAnswers(next)
    setPending(null)
    setExtra('')

    if (index + 1 >= SMALL_TALK_ITEMS.length) {
      const correctCount = next.filter((a) => a.correct).length
      const expandedTotal = next.filter((a) => a.expanded).length
      const score = (correctCount / next.length) * 0.7 + (expandedTotal / next.length) * 0.3
      completeStage('smalltalk', score)
      if (expandedTotal >= SMALL_TALK_EXPANDED_REQUIRED) earnBadge('small-talk-starter')
      setDone(true)
    } else {
      setIndex(index + 1)
    }
  }

  if (done) {
    const correctCount = answers.filter((a) => a.correct).length
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed
          score={correctCount}
          max={SMALL_TALK_ITEMS.length}
          title="You held a conversation"
          message={
            expandedCount >= SMALL_TALK_EXPANDED_REQUIRED
              ? `You added extra detail ${expandedCount} times. That is the difference between answering and talking.`
              : 'Next time, add one more piece of information to each answer — a reason, a place, or a question back.'
          }
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
        <div className="pill-row">
          <span className="pill pill--on">🌟 {expandedCount} expanded answers</span>
          <span className="pill">Target: {SMALL_TALK_EXPANDED_REQUIRED}</span>
        </div>
      }
    >
      <div className="dialogue">
        <div className="bubble bubble--npc">
          <span className="bubble__who">Anna, by the pool</span>
          {item.question} <SpeakButton text={item.question} label="Hear it" mini />
          <span className="bubble__sk">{item.questionSk}</span>
        </div>
        {pending && (
          <div className="bubble bubble--me">
            <span className="bubble__who">You</span>
            {pending.text}
          </div>
        )}
      </div>

      {!pending ? (
        <TextAnswer
          key={item.id}
          itemKey={item.id}
          spec={item.answer}
          tier="scenario"
          hints={[item.hint1, item.hint2]}
          placeholder="Answer her…"
          continueLabel="Send"
          onComplete={(outcome) => {
            const long = wordCount(outcome.text) >= EXPANDED_WORD_COUNT
            if (long || !outcome.correct) {
              if (long && outcome.correct) {
                bonus(3, 'Extra detail!')
              }
              store(outcome.text, outcome.correct, long && outcome.correct)
            } else {
              setPending({ text: outcome.text, correct: outcome.correct })
            }
          }}
        />
      ) : (
        <div className="stack stack--tight">
          <Feedback tone="info" title="Good — now stretch it.">
            <p>{item.expandPrompt}</p>
            <p className="muted">
              Example: <em>{item.answer.modelAnswer}</em>
            </p>
          </Feedback>

          <label className="visually-hidden" htmlFor={`expand-${item.id}`}>
            Add one more detail
          </label>
          <textarea
            id={`expand-${item.id}`}
            className="input"
            rows={2}
            value={extra}
            placeholder="Add one more thing…"
            spellCheck={false}
            onChange={(e) => setExtra(e.target.value)}
          />

          <div className="btn-row">
            <button
              type="button"
              className="btn btn--primary"
              disabled={!extra.trim()}
              onClick={() => {
                const combined = `${pending.text.trim()} ${extra.trim()}`.trim()
                bonus(3, 'Extra detail!')
                store(combined, pending.correct, wordCount(combined) >= EXPANDED_WORD_COUNT)
              }}
            >
              Add it
            </button>
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => store(pending.text, pending.correct, false)}
            >
              Keep it short
            </button>
          </div>
        </div>
      )}
    </StageShell>
  )
}
