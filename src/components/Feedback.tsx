import type { ReactNode } from 'react'

export type FeedbackTone = 'correct' | 'close' | 'wrong' | 'info'

const ICONS: Record<FeedbackTone, string> = {
  correct: '✓',
  close: '≈',
  wrong: '✎',
  info: 'ℹ',
}

interface Props {
  tone: FeedbackTone
  title: string
  children?: ReactNode
}

/**
 * Feedback is never just "Wrong": every incorrect state names the pattern the
 * learner needs, and shows the model answer only after their own attempt.
 */
export function Feedback({ tone, title, children }: Props) {
  return (
    <div className={`feedback feedback--${tone}`} role="status" aria-live="polite">
      <span className="feedback__icon" aria-hidden="true">
        {ICONS[tone]}
      </span>
      <div className="feedback__body">
        <p className="feedback__title">{title}</p>
        {children}
      </div>
    </div>
  )
}
