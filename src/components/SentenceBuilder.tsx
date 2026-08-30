import { useMemo, useState } from 'react'
import { matchExact, shuffle } from '../lib/normalize'
import { Feedback } from './Feedback'
import { SpeakButton } from './SpeakButton'

/** Parents pass a React `key` per item, so each build starts empty. */
interface Props {
  tiles: string[]
  answer: string
  /** Slovak meaning, shown as the task. */
  slovak?: string
  explanation: string
  onComplete: (correct: boolean) => void
}

/**
 * Tap-to-build word ordering. Tapping a tray tile places it; tapping a placed
 * tile takes it back, so the exercise can always be reset and retried.
 */
export function SentenceBuilder({ tiles, answer, slovak, explanation, onComplete }: Props) {
  const scrambled = useMemo(() => {
    // Guarantee the shuffle is not accidentally the answer already.
    const target = tiles.join(' ')
    let next = shuffle(tiles)
    for (let i = 0; i < 6 && next.join(' ') === target; i++) next = shuffle(tiles)
    return next.map((word, index) => ({ id: `${index}-${word}`, word }))
  }, [tiles])

  const [placed, setPlaced] = useState<string[]>([])
  const [checked, setChecked] = useState<null | 'correct' | 'close' | 'wrong'>(null)
  const [misses, setMisses] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const built = placed
    .map((id) => scrambled.find((t) => t.id === id)?.word ?? '')
    .join(' ')
    .replace(/\s+([?.!,])/g, '$1')

  function check() {
    const result = matchExact(built, answer)
    const quality = result.quality === 'empty' ? 'wrong' : result.quality
    setChecked(quality)
    if (quality !== 'correct') setMisses((n) => n + 1)
  }

  const locked = checked === 'correct' || revealed

  return (
    <div className="stack stack--tight">
      {slovak && (
        <div className="prompt-card">
          <p className="eyebrow">Build this sentence</p>
          <p className="prompt-big">{slovak}</p>
        </div>
      )}

      <div className={`tile-tray${placed.length ? ' tile-tray--filled' : ''}`} aria-live="polite">
        {placed.length === 0 && <span className="tile-tray__hint">Tap the words below in the right order…</span>}
        {placed.map((id) => {
          const tile = scrambled.find((t) => t.id === id)
          if (!tile) return null
          return (
            <button
              key={id}
              type="button"
              className="tile tile--placed"
              disabled={locked}
              onClick={() => {
                setPlaced((prev) => prev.filter((p) => p !== id))
                setChecked(null)
              }}
              aria-label={`Remove ${tile.word}`}
            >
              {tile.word}
            </button>
          )
        })}
      </div>

      <div className="tile-tray" style={{ border: 'none', background: 'transparent', padding: 0 }}>
        {scrambled.map((tile) => (
          <button
            key={tile.id}
            type="button"
            className={`tile${placed.includes(tile.id) ? ' tile--used' : ''}`}
            disabled={locked || placed.includes(tile.id)}
            onClick={() => {
              setPlaced((prev) => [...prev, tile.id])
              setChecked(null)
            }}
          >
            {tile.word}
          </button>
        ))}
      </div>

      {!locked && (
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={check} disabled={placed.length === 0}>
            Check
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setPlaced([])
              setChecked(null)
            }}
            disabled={placed.length === 0}
          >
            ↺ Reset
          </button>
        </div>
      )}

      {checked === 'correct' && (
        <Feedback tone="correct" title="Exactly. Say it aloud once.">
          <p>{explanation}</p>
          <p>
            <span className="model-answer">{answer}</span> <SpeakButton text={answer} label="Hear it" mini />
          </p>
        </Feedback>
      )}

      {checked === 'close' && (
        <Feedback tone="close" title="Almost — one word is out of place.">
          <p>Read it aloud. Where does it sound wrong?</p>
        </Feedback>
      )}

      {checked === 'wrong' && !revealed && (
        <Feedback tone="wrong" title="Not yet — try a different order.">
          <p>{explanation}</p>
        </Feedback>
      )}

      {revealed && (
        <Feedback tone="info" title="Here is the sentence.">
          <p>
            <span className="model-answer">{answer}</span> <SpeakButton text={answer} label="Hear it" mini />
          </p>
          <p>{explanation}</p>
        </Feedback>
      )}

      {!locked && misses >= 2 && (
        <button type="button" className="btn btn--quiet" onClick={() => setRevealed(true)}>
          Show me the sentence
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
