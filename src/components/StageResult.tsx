import { Confetti } from './Overlays'

interface Props {
  passed: boolean
  score: number
  max: number
  threshold?: number
  title?: string
  message: string
  /** Shown when the learner has not reached the threshold. */
  onRetry?: () => void
  retryLabel?: string
  onContinue: () => void
  continueLabel?: string
}

/**
 * A stage only completes through this screen, and only when the mastery
 * threshold has actually been met — there is no generic "mark as complete".
 */
export function StageResult({
  passed,
  score,
  max,
  threshold,
  title,
  message,
  onRetry,
  retryLabel = 'Try the repair round',
  onContinue,
  continueLabel = 'Back to the map',
}: Props) {
  return (
    <div className="stack">
      {passed && <Confetti />}
      <div className={`result-banner result-banner--${passed ? 'pass' : 'retry'}`}>
        <p className="eyebrow">
          {passed ? 'Mission complete' : 'Not yet'}
        </p>
        <h2>{title ?? (passed ? 'Well done!' : 'Almost there')}</h2>
        <p className="result-banner__score">
          {score}/{max}
        </p>
        {threshold !== undefined && (
          <p style={{ margin: 0 }}>
            Pass mark: {threshold}/{max}
          </p>
        )}
      </div>

      <div className="card">
        <p style={{ margin: 0 }}>{message}</p>
      </div>

      {!passed && onRetry && (
        <button type="button" className="btn btn--sun btn--block" onClick={onRetry}>
          {retryLabel}
        </button>
      )}

      <button
        type="button"
        className={`btn btn--block ${passed ? 'btn--primary' : 'btn--ghost'}`}
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  )
}
