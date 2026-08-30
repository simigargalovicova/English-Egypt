import { useState } from 'react'
import type { ScaffoldItem } from '../types'
import { normalize, normalizeLoose } from '../lib/normalize'
import { Feedback } from './Feedback'
import { SpeakButton } from './SpeakButton'

interface Props {
  item: ScaffoldItem
  onComplete: (correct: boolean) => void
}

/** Level B — the sentence shape is given, the learner fills each gap. */
export function ScaffoldExercise({ item, onComplete }: Props) {
  const [values, setValues] = useState<string[]>(() => item.blanks.map(() => ''))
  const [checked, setChecked] = useState<null | 'correct' | 'wrong'>(null)
  const [misses, setMisses] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [hinted, setHinted] = useState(false)

  const parts = item.scaffold.split('_')
  const filled = values.every((v) => v.trim().length > 0)
  const locked = checked === 'correct' || revealed

  function check() {
    const ok = values.every((value, i) => {
      const given = normalize(value)
      const loose = normalizeLoose(value)
      return item.blanks[i].some((accepted) => {
        const target = normalize(accepted)
        return given === target || loose === normalizeLoose(accepted)
      })
    })
    setChecked(ok ? 'correct' : 'wrong')
    if (!ok) setMisses((n) => n + 1)
  }

  return (
    <div className="stack stack--tight">
      <div className="prompt-card">
        <p className="eyebrow">Say this in English</p>
        <p className="prompt-big" style={{ marginBottom: 0 }}>
          {item.slovak}
        </p>
      </div>

      <div className="card">
        <p className="scaffold-line">
          {parts.map((part, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span>{part}</span>
              {i < values.length && (
                <>
                  <label className="visually-hidden" htmlFor={`${item.id}-blank-${i}`}>
                    Gap {i + 1}
                  </label>
                  <input
                    id={`${item.id}-blank-${i}`}
                    className={`input input--small${
                      checked === 'correct' ? ' input--correct' : checked === 'wrong' ? ' input--wrong' : ''
                    }`}
                    value={values[i]}
                    disabled={locked}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="…"
                    onChange={(e) => {
                      const next = [...values]
                      next[i] = e.target.value
                      setValues(next)
                      setChecked(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (filled && !locked) check()
                      }
                    }}
                  />
                </>
              )}
            </span>
          ))}
        </p>
      </div>

      {!locked && (
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={check} disabled={!filled}>
            Check
          </button>
          {!hinted && (
            <button type="button" className="btn btn--ghost" onClick={() => setHinted(true)}>
              💡 Hint
            </button>
          )}
        </div>
      )}

      {hinted && !locked && <div className="hint-box">{item.hint}</div>}

      {checked === 'correct' && (
        <Feedback tone="correct" title="Exactly. Say the whole sentence aloud.">
          <p>
            <span className="model-answer">{item.modelAnswer}</span>{' '}
            <SpeakButton text={item.modelAnswer} label="Hear it" mini />
          </p>
        </Feedback>
      )}

      {checked === 'wrong' && !revealed && (
        <Feedback tone="wrong" title="One of the gaps is not right yet.">
          <p>{item.hint}</p>
        </Feedback>
      )}

      {revealed && (
        <Feedback tone="info" title="Here is the full sentence.">
          <p>
            <span className="model-answer">{item.modelAnswer}</span>{' '}
            <SpeakButton text={item.modelAnswer} label="Hear it" mini />
          </p>
        </Feedback>
      )}

      {!locked && misses >= 2 && (
        <button type="button" className="btn btn--quiet" onClick={() => setRevealed(true)}>
          Show me the answer
        </button>
      )}

      {locked && (
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => onComplete(checked === 'correct')}
        >
          Continue
        </button>
      )}
    </div>
  )
}
