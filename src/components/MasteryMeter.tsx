interface Props {
  value: number
  max: number
  label?: string
  /** Marks the pass line, e.g. 9 out of 12. */
  threshold?: number
}

export function MasteryMeter({ value, max, label = 'Mastery', threshold }: Props) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  const passed = threshold !== undefined && value >= threshold
  return (
    <div className="meter">
      <span className="eyebrow" style={{ margin: 0 }}>
        {label}
      </span>
      <div
        className="meter__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className="meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="meter__value">
        {value}/{max}
        {threshold !== undefined && (
          <span className="visually-hidden">
            {passed ? ' — pass mark reached' : ` — pass mark is ${threshold}`}
          </span>
        )}
      </span>
    </div>
  )
}
