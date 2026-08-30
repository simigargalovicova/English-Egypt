import { useRef, useState } from 'react'
import type { OpenAnswer, SkillTier } from '../types'
import { findSlips, matchAnswer, type MatchQuality } from '../lib/normalize'
import { listenOnce, recognitionSupported } from '../lib/speech'
import { useProgress } from '../state/progressContext'
import { Feedback } from './Feedback'
import { SpeakButton } from './SpeakButton'

export interface AnswerOutcome {
  correct: boolean
  text: string
  hintsUsed: number
  revealedModel: boolean
  selfCorrected: boolean
  attempts: number
  /** 0..1 quality of the item, used for stage mastery. */
  score: number
}

interface Props {
  /** Changing this resets the component for the next item. */
  itemKey: string
  spec: OpenAnswer
  tier: SkillTier
  /** Escalating hints. The model answer is always offered as the last step. */
  hints?: string[]
  /** Item-specific teaching line shown when the answer is wrong. */
  rule?: string
  placeholder?: string
  multiline?: boolean
  submitLabel?: string
  continueLabel?: string
  /** Extra praise line shown on a correct answer. */
  praise?: string
  /** In scenario stages a wrong answer still moves the conversation on. */
  allowSkipAfter?: number
  onComplete: (outcome: AnswerOutcome) => void
}

const PRAISE = [
  'Exactly. Say it aloud once.',
  'Natural English. Nice.',
  'That works — a real person would understand you.',
  'Good. Say it once more, faster.',
]

/** Stable per-item praise line: same item, same words, no re-render churn. */
function praiseFor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return PRAISE[hash % PRAISE.length]
}

export function TextAnswer({
  itemKey,
  spec,
  tier,
  hints = [],
  rule,
  placeholder = 'Type your answer in English…',
  multiline = false,
  submitLabel = 'Check',
  continueLabel = 'Continue',
  praise,
  allowSkipAfter = 2,
  onComplete,
}: Props) {
  const { award, bonus, noteHint, state, setMic } = useProgress()
  const [text, setText] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [quality, setQuality] = useState<MatchQuality | null>(null)
  const [hintLevel, setHintLevel] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [outcome, setOutcome] = useState<AnswerOutcome | null>(null)
  const [listening, setListening] = useState(false)
  const [micNote, setMicNote] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null)
  // Callers pass a React `key` alongside itemKey, so a new item remounts this
  // component and every field below starts clean — no reset effect needed.
  const praiseLine = praise ?? praiseFor(itemKey)

  const resolved = outcome !== null
  const allHints = [...hints, `Model answer: ${spec.modelAnswer}`]
  const canHint = hintLevel < allHints.length && !resolved
  const slips = quality === 'correct' ? findSlips(text) : []

  function scoreFor(correct: boolean): number {
    if (!correct) return 0
    if (revealed) return 0.4
    if (hintLevel > 0) return 0.7
    return 1
  }

  /** Records the result and shows Continue; the parent advances on Continue. */
  function finish(correct: boolean, finalText: string, attemptCount: number) {
    setOutcome({
      correct,
      text: finalText,
      hintsUsed: hintLevel,
      revealedModel: revealed,
      selfCorrected: correct && attemptCount > 1 && !revealed,
      attempts: attemptCount,
      score: scoreFor(correct),
    })
  }

  function check() {
    if (!text.trim() || resolved) return
    const result = matchAnswer(text, spec)
    setQuality(result.quality)
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    if (result.quality === 'correct') {
      award(tier, true)
      if (nextAttempts > 1 && !revealed) bonus(3, 'Self-corrected!')
      finish(true, text, nextAttempts)
      return
    }
    // A near miss is a spelling wobble, not a failure — no streak reset.
    if (result.quality !== 'close') {
      award(tier, false)
    }
  }

  function revealAnswer() {
    setRevealed(true)
    setHintLevel(allHints.length)
    noteHint()
    setQuality('wrong')
  }

  function useHint() {
    if (!canHint) return
    const next = hintLevel + 1
    setHintLevel(next)
    noteHint()
    if (next === allHints.length) setRevealed(true)
  }

  function toggleMic() {
    if (listening) return
    setMicNote(null)
    const handle = listenOnce(
      (transcript) => setText(transcript),
      (error) => {
        setListening(false)
        if (error) setMicNote(error)
      },
    )
    if (!handle) {
      setMicNote('Speech input is not available in this browser. Please type instead.')
      return
    }
    setListening(true)
  }

  const showMic = recognitionSupported()
  const wrongEnough = quality === 'wrong' && attempts >= allowSkipAfter && !resolved

  const InputTag = multiline ? 'textarea' : 'input'

  return (
    <div className="stack stack--tight">
      <div className="field">
        <label className="visually-hidden" htmlFor={`answer-${itemKey}`}>
          Your answer in English
        </label>
        <InputTag
          id={`answer-${itemKey}`}
          ref={inputRef as never}
          className={`input${quality === 'correct' ? ' input--correct' : ''}${
            quality === 'wrong' ? ' input--wrong' : ''
          }`}
          value={text}
          placeholder={placeholder}
          disabled={resolved}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setText(e.target.value)
            if (quality && quality !== 'correct') setQuality(null)
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !(multiline && e.shiftKey)) {
              e.preventDefault()
              if (outcome) onComplete(outcome)
              else check()
            }
          }}
        />
      </div>

      {!resolved && (
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={check} disabled={!text.trim()}>
            {submitLabel}
          </button>
          {canHint && (
            <button type="button" className="btn btn--ghost" onClick={useHint}>
              {hintLevel === 0 ? '💡 Hint' : hintLevel + 1 === allHints.length ? '💡 Show answer' : '💡 Another hint'}
            </button>
          )}
          {showMic && state.micEnabled && (
            <button
              type="button"
              className="speak-btn mic-btn"
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label="Answer with your voice"
            >
              <span aria-hidden="true">🎤</span>
              <span>{listening ? 'Listening…' : 'Speak'}</span>
            </button>
          )}
          {showMic && !state.micEnabled && (
            <button type="button" className="btn btn--quiet" onClick={() => setMic(true)}>
              🎤 Use microphone
            </button>
          )}
        </div>
      )}

      {micNote && (
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
          {micNote}
        </p>
      )}

      {hintLevel > 0 &&
        allHints.slice(0, hintLevel).map((hint, i) => (
          <div className="hint-box" key={i}>
            {hint}
          </div>
        ))}

      {quality === 'correct' && (
        <Feedback tone="correct" title={praiseLine}>
          {slips.length > 0 && (
            <p>
              One small thing for next time: {slips[0].note}
            </p>
          )}
          <p>
            <SpeakButton text={text.trim() || spec.modelAnswer} label="Hear it" mini />
          </p>
        </Feedback>
      )}

      {quality === 'close' && (
        <Feedback tone="close" title="So close — check the spelling.">
          <p>The words are right. Look at the letters and try again.</p>
        </Feedback>
      )}

      {quality === 'wrong' && !revealed && (
        <Feedback tone="wrong" title="Not quite — here is the pattern.">
          <p>{rule ?? patternHintFor(text, spec)}</p>
          {wrongEnough && <p className="muted">Still stuck? Use “Show answer” — it costs a little, not a lot.</p>}
        </Feedback>
      )}

      {revealed && !resolved && (
        <Feedback tone="info" title="Here is one good answer.">
          <p>
            <span className="model-answer">{spec.modelAnswer}</span>{' '}
            <SpeakButton text={spec.modelAnswer} label="Hear it" mini />
          </p>
          {spec.altModels?.length ? <p className="muted">Also fine: {spec.altModels.join(' / ')}</p> : null}
          <p>Type it once yourself, then continue.</p>
        </Feedback>
      )}

      {revealed && !resolved && (
        <button
          type="button"
          className="btn btn--sun btn--block"
          onClick={() => finish(false, text, Math.max(1, attempts))}
        >
          Got it — continue
        </button>
      )}

      {outcome && (
        <button type="button" className="btn btn--primary btn--block" onClick={() => onComplete(outcome)}>
          {continueLabel}
        </button>
      )}

      {!resolved && !revealed && attempts > 0 && quality === 'wrong' && (
        <button type="button" className="btn btn--quiet" onClick={revealAnswer}>
          Show me the answer
        </button>
      )}
    </div>
  )
}

/** Falls back to a structural hint when an item has no bespoke rule. */
function patternHintFor(text: string, spec: OpenAnswer): string {
  const slips = findSlips(text)
  if (slips.length > 0) return slips[0].note
  const model = spec.modelAnswer.trim()
  const firstWords = model.split(' ').slice(0, 2).join(' ')
  return `Think about how the sentence starts — try beginning with “${firstWords}…”.`
}
