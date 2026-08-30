import { useMemo, useState } from 'react'
import { RETRIEVAL_MIN_EXTRA_WORDS, RETRIEVAL_STARTERS } from '../data/finalboss'
import { CHUNK_PHRASES } from '../data/chunks'
import { getStage } from '../data/stages'
import { normalize } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { Feedback } from '../components/Feedback'
import { SpeakButton } from '../components/SpeakButton'
import { StageShell, type DotState } from '../components/StageShell'

const stage = getStage('retrieval')
const SURVIVAL_TARGET = 5

type Check = 'ok' | 'wrong-start' | 'too-short' | 'empty'

/** Everything else is hidden: the learner writes from memory, then chooses. */
export function Stage11Retrieval({ onExit, onFinish }: { onExit: () => void; onFinish: () => void }) {
  const { completeStage, award, setRetrieval, setSurvival, state } = useProgress()
  useStageAttempt('retrieval')
  const [phase, setPhase] = useState<'write' | 'pick' | 'done'>('write')
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [check, setCheck] = useState<Check | null>(null)
  const [written, setWritten] = useState<string[]>([])
  const [showExamples, setShowExamples] = useState(false)
  const [picked, setPicked] = useState<string[]>([])

  const starter = RETRIEVAL_STARTERS[index]

  const dots: DotState[] = RETRIEVAL_STARTERS.map((_, i) => {
    if (i < written.length) return 'done'
    if (i === index) return 'current'
    return 'todo'
  })

  const pool = useMemo(
    () => [...written, ...CHUNK_PHRASES.map((p) => p.english)],
    [written],
  )

  function validate(value: string): Check {
    const n = normalize(value)
    if (!n) return 'empty'
    const opener = starter.mustStartWith.find((s) => n.startsWith(normalize(s)))
    if (!opener) return 'wrong-start'
    const rest = n.slice(normalize(opener).length).trim()
    if (rest.split(' ').filter(Boolean).length < RETRIEVAL_MIN_EXTRA_WORDS) return 'too-short'
    return 'ok'
  }

  function submit() {
    const verdict = validate(text)
    setCheck(verdict)
    if (verdict !== 'ok') return

    const sentence = text.trim()
    award('recall', true)
    setRetrieval(starter.id, sentence)
    const next = [...written, sentence]
    setWritten(next)
    setText('')
    setCheck(null)
    setShowExamples(false)

    if (index + 1 >= RETRIEVAL_STARTERS.length) {
      setPhase('pick')
    } else {
      setIndex(index + 1)
    }
  }

  function togglePick(sentence: string) {
    setPicked((prev) =>
      prev.includes(sentence)
        ? prev.filter((s) => s !== sentence)
        : prev.length >= SURVIVAL_TARGET
          ? prev
          : [...prev, sentence],
    )
  }

  function savePicks() {
    setSurvival(picked)
    completeStage('retrieval', 1)
    setPhase('done')
  }

  if (phase === 'done') {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <div className="survival-card">
          <p className="eyebrow">
            Saved to this device
          </p>
          <h2>My Egypt Survival English</h2>
          {state.survivalSentences.map((sentence) => (
            <div className="survival-item" key={sentence}>
              <span className="survival-item__text">{sentence}</span>
              <SpeakButton text={sentence} label="Hear it" mini />
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={onFinish}>
          See my full summary →
        </button>
        <button type="button" className="btn btn--quiet" onClick={onExit}>
          Back to the map
        </button>
      </StageShell>
    )
  }

  if (phase === 'pick') {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <div className="card card--tinted">
          <p className="eyebrow">Last step</p>
          <h2 style={{ marginBottom: '0.3rem' }}>Choose your five survival sentences</h2>
          <p className="muted" style={{ margin: 0 }}>
            Which five would actually save you tomorrow? Pick from your own sentences and the phrases
            from the lesson.
          </p>
          <p style={{ margin: '0.7rem 0 0', fontWeight: 700 }}>
            {picked.length} / {SURVIVAL_TARGET} chosen
          </p>
        </div>

        <div className="pick-list">
          {pool.map((sentence, i) => {
            const on = picked.includes(sentence)
            const isMine = i < written.length
            return (
              <button
                key={`${sentence}-${i}`}
                type="button"
                className={`pick${on ? ' pick--on' : ''}`}
                aria-pressed={on}
                disabled={!on && picked.length >= SURVIVAL_TARGET}
                onClick={() => togglePick(sentence)}
              >
                <span className="pick__box" aria-hidden="true">
                  {on ? '✓' : ''}
                </span>
                <span style={{ flex: 1 }}>
                  {sentence}
                  {isMine && (
                    <span className="pill" style={{ marginLeft: '0.4rem', fontSize: '0.7rem' }}>
                      yours
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={picked.length !== SURVIVAL_TARGET}
          onClick={savePicks}
        >
          {picked.length === SURVIVAL_TARGET
            ? 'Save my survival card'
            : `Choose ${SURVIVAL_TARGET - picked.length} more`}
        </button>
      </StageShell>
    )
  }

  return (
    <StageShell stage={stage} onExit={onExit} dots={dots}>
      <div className="card card--tinted">
        <p style={{ margin: 0, fontSize: '0.93rem' }}>
          🙈 Everything is hidden now. Write <strong>your own</strong> sentence — something that is
          true for you.
        </p>
      </div>

      <div className="prompt-card">
        <p className="eyebrow">
          Starter {index + 1} of {RETRIEVAL_STARTERS.length}
        </p>
        <p className="prompt-big" style={{ marginBottom: '0.2rem' }}>
          {starter.starter}
        </p>
        <p className="sk" style={{ margin: 0 }}>
          {starter.briefSk}
        </p>
      </div>

      <div className="stack stack--tight">
        <label className="visually-hidden" htmlFor={`ret-${starter.id}`}>
          Your own sentence
        </label>
        <input
          id={`ret-${starter.id}`}
          className={`input${check === 'ok' ? ' input--correct' : check && check !== 'empty' ? ' input--wrong' : ''}`}
          value={text}
          placeholder={`${starter.starter.replace(' …', ' ')}…`}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setText(e.target.value)
            setCheck(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
        />

        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={submit} disabled={!text.trim()}>
            Save my sentence
          </button>
          {!showExamples && (
            <button type="button" className="btn btn--ghost" onClick={() => setShowExamples(true)}>
              💡 Show examples
            </button>
          )}
        </div>

        {showExamples && (
          <div className="hint-box">
            <strong>Examples — but write your own:</strong>
            <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.1rem' }}>
              {starter.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {check === 'wrong-start' && (
          <Feedback tone="wrong" title={`Start your sentence with “${starter.starter.replace(' …', '')}”.`}>
            <p>
              The point of this exercise is that exact opening. Try again: {starter.starter.replace(' …', '')}
              …
            </p>
          </Feedback>
        )}

        {check === 'too-short' && (
          <Feedback tone="close" title="Add a few more words.">
            <p>Make it a whole sentence somebody could actually understand.</p>
          </Feedback>
        )}
      </div>

      {written.length > 0 && (
        <div className="card">
          <p className="eyebrow">Your sentences so far</p>
          {written.map((sentence) => (
            <p key={sentence} style={{ margin: '0.25rem 0' }}>
              ✅ {sentence} <SpeakButton text={sentence} label="Hear it" mini />
            </p>
          ))}
        </div>
      )}
    </StageShell>
  )
}
