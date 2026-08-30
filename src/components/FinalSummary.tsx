import { useState } from 'react'
import type { BaselineEntry } from '../types'
import { COLD_START_ITEMS } from '../data/coldstart'
import { BADGES, STAGES, STAGE_ORDER } from '../data/stages'
import { matchAnswer } from '../lib/normalize'
import { useProgress } from '../state/progressContext'
import { Feedback } from './Feedback'
import { SpeakButton } from './SpeakButton'
import { MasteryMeter } from './MasteryMeter'

/**
 * The payoff screen: the survival card, the badges, and the same six prompts
 * from Stage 1 so the learner can see the change rather than be told about it.
 */
export function FinalSummary({ onExit }: { onExit: () => void }) {
  const { state, masteryPercent, setFinalCheck, isComplete } = useProgress()
  const [retesting, setRetesting] = useState(false)
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [entries, setEntries] = useState<BaselineEntry[]>([])

  const doneStages = STAGE_ORDER.filter(isComplete).length
  const accuracy =
    state.answerCount > 0 ? Math.round((state.correctCount / state.answerCount) * 100) : 0
  const item = COLD_START_ITEMS[index]

  function submitRetest() {
    if (!text.trim()) return
    const passed =
      matchAnswer(text, {
        acceptedAnswers: [item.modelAnswer, ...item.altModels],
        modelAnswer: item.modelAnswer,
      }).quality === 'correct'
    const next = [...entries, { itemId: item.id, answer: text.trim(), rating: 'know' as const, passed }]
    setEntries(next)
    setText('')
    if (index + 1 >= COLD_START_ITEMS.length) {
      setFinalCheck(next)
      setRetesting(false)
      setIndex(0)
    } else {
      setIndex(index + 1)
    }
  }

  if (retesting) {
    return (
      <div className="stack">
        <button type="button" className="btn btn--quiet" onClick={() => setRetesting(false)}>
          ← Cancel
        </button>
        <div className="card card--tinted">
          <p className="eyebrow">
            The same six · {index + 1} of {COLD_START_ITEMS.length}
          </p>
          <p style={{ margin: 0, fontSize: '0.92rem' }} className="muted">
            No hints this time. Just write it.
          </p>
        </div>
        <div className="prompt-card">
          <p className="prompt-card__task">{item.taskSk}</p>
          <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>
            {item.taskEn}
          </p>
        </div>
        <label className="visually-hidden" htmlFor={`retest-${item.id}`}>
          Your answer
        </label>
        <input
          id={`retest-${item.id}`}
          className="input"
          value={text}
          placeholder="Napíš po anglicky…"
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitRetest()
            }
          }}
        />
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={submitRetest}
          disabled={!text.trim()}
        >
          Next
        </button>
      </div>
    )
  }

  const baselineScore = state.baseline.filter((e) => e.passed).length
  const finalScore = state.finalCheck.filter((e) => e.passed).length

  return (
    <div className="stack">
      <button type="button" className="btn btn--quiet" onClick={onExit} style={{ alignSelf: 'flex-start' }}>
        ← Back to the map
      </button>

      {state.survivalSentences.length > 0 ? (
        <section className="survival-card">
          <p className="eyebrow">
            Saved on this device
          </p>
          <h2>My Egypt Survival English</h2>
          {state.survivalSentences.map((sentence) => (
            <div className="survival-item" key={sentence}>
              <span className="survival-item__text">{sentence}</span>
              <SpeakButton text={sentence} label="Hear it" mini />
            </div>
          ))}
        </section>
      ) : (
        <Feedback tone="info" title="Your survival card is not written yet.">
          <p>Finish the last mission, “Survival English”, to choose your five sentences.</p>
        </Feedback>
      )}

      <section className="card">
        <p className="eyebrow">Where you are</p>
        <div className="stack stack--tight">
          <MasteryMeter value={doneStages} max={STAGE_ORDER.length} label="Missions" />
          <div className="pill-row">
            <span className="pill pill--on">⭐ {state.xp} XP</span>
            <span className="pill pill--on">📈 {masteryPercent}% mastery</span>
            <span className="pill">🎯 {accuracy}% accuracy</span>
            <span className="pill">🔥 best streak {state.bestStreak}</span>
            <span className="pill">💡 {state.hintsUsed} hints used</span>
          </div>
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Badges · {state.badges.length} of {BADGES.length}</p>
        <div className="badge-grid">
          {BADGES.map((badge) => {
            const won = state.badges.includes(badge.id)
            return (
              <div
                className={`badge-cell ${won ? 'badge-cell--won' : 'badge-cell--locked'}`}
                key={badge.id}
                title={badge.description}
              >
                <span className="badge-cell__emoji" aria-hidden="true">
                  {badge.emoji}
                </span>
                {badge.name}
                <span className="visually-hidden">
                  {won ? ' — earned' : ' — not earned yet'}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Mission scores</p>
        {STAGES.map((s) => {
          const progress = state.stages[s.id]
          return (
            <div className="settings-row" key={s.id}>
              <span>
                <span aria-hidden="true">{s.icon}</span> {s.title}
              </span>
              <span style={{ fontWeight: 700, color: progress?.completed ? 'var(--palm-text)' : 'var(--ink-faint)' }}>
                {progress?.completed ? `${Math.round(progress.score * 100)}%` : 'not yet'}
              </span>
            </div>
          )
        })}
      </section>

      {state.baseline.length > 0 && (
        <section className="card">
          <p className="eyebrow">Then and now</p>
          {state.finalCheck.length === 0 ? (
            <>
              <p style={{ marginTop: 0 }}>
                At the start of the lesson you answered six prompts cold. You got{' '}
                <strong>
                  {baselineScore} of {state.baseline.length}
                </strong>{' '}
                of them right. Try the same six again — no hints.
              </p>
              <button
                type="button"
                className="btn btn--sun btn--block"
                onClick={() => {
                  setEntries([])
                  setIndex(0)
                  setRetesting(true)
                }}
              >
                Do the six again →
              </button>
            </>
          ) : (
            <>
              <p style={{ marginTop: 0, fontWeight: 700 }}>
                {baselineScore} / {state.baseline.length} at the start → {finalScore} /{' '}
                {state.finalCheck.length} now
              </p>
              <div className="compare">
                {COLD_START_ITEMS.map((coldItem, i) => {
                  const before = state.baseline.find((e) => e.itemId === coldItem.id)
                  const after = state.finalCheck.find((e) => e.itemId === coldItem.id)
                  return (
                    <div className="compare__row" key={coldItem.id}>
                      <p className="compare__label">
                        {i + 1}. {coldItem.taskEn}
                      </p>
                      <p style={{ margin: '0.2rem 0 0' }}>
                        <span className="compare__label">Before: </span>
                        <span className="compare__then">
                          {before?.answer ? `“${before.answer}”` : '— nothing —'}
                        </span>
                      </p>
                      <p style={{ margin: '0.15rem 0 0' }}>
                        <span className="compare__label">Now: </span>
                        <span className="compare__now">
                          {after?.answer ? `“${after.answer}”` : '—'} {after?.passed ? '✓' : ''}
                        </span>
                      </p>
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                className="btn btn--quiet"
                onClick={() => {
                  setEntries([])
                  setIndex(0)
                  setRetesting(true)
                }}
              >
                Try the six once more
              </button>
            </>
          )}
        </section>
      )}
    </div>
  )
}
