import { useEffect, useState } from 'react'
import { useProgress } from '../state/progressContext'

/** Floating "+6 XP" pops, driven by the progress provider's event queue. */
export function XpLayer() {
  const { xpEvents } = useProgress()
  if (xpEvents.length === 0) return null
  return (
    <div className="xp-layer" aria-hidden="true">
      {xpEvents.map((event) => (
        <div className="xp-toast" key={event.id}>
          +{event.amount} XP · {event.label}
        </div>
      ))}
    </div>
  )
}

/** One badge at a time, dismissed by the learner. */
export function BadgePopup() {
  const { badgeQueue, dismissBadge } = useProgress()
  const badge = badgeQueue[0]

  useEffect(() => {
    if (!badge) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismissBadge()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [badge, dismissBadge])

  if (!badge) return null

  return (
    <>
      <Confetti />
      <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="badge-title">
        <div className="badge-pop">
          <div className="badge-pop__medal" aria-hidden="true">
            {badge.emoji}
          </div>
          <p className="eyebrow">Badge unlocked</p>
          <h2 id="badge-title">{badge.name}</h2>
          <p className="sk">{badge.slovakName}</p>
          <p className="muted">{badge.description}</p>
          <button type="button" className="btn btn--sun btn--block" onClick={dismissBadge} autoFocus>
            Nice!
          </button>
        </div>
      </div>
    </>
  )
}

const CONFETTI_COLORS = ['#35c0d1', '#ffc15e', '#ef6b4e', '#48b183', '#7a4bab']

interface Bit {
  id: number
  left: number
  drift: string
  delay: number
  color: string
}

/** Scatter is chosen once per burst, outside render, so it never re-rolls. */
function makeBits(pieces: number): Bit[] {
  return Array.from({ length: pieces }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    drift: `${(Math.random() - 0.5) * 160}px`,
    delay: Math.random() * 0.5,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }))
}

export function Confetti({ pieces = 34 }: { pieces?: number }) {
  const [bits] = useState(() => makeBits(pieces))

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="confetti__bit"
          style={{
            left: `${bit.left}%`,
            background: bit.color,
            animationDelay: `${bit.delay}s`,
            ['--drift' as string]: bit.drift,
          }}
        />
      ))}
    </div>
  )
}
