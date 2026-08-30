import { useProgress } from '../state/progressContext'
import { STAGE_ORDER } from '../data/stages'

interface Props {
  onHome: () => void
  onSettings: () => void
}

export function ProgressHeader({ onHome, onSettings }: Props) {
  const { state, masteryPercent, setTeacherMode } = useProgress()
  const done = STAGE_ORDER.filter((id) => state.stages[id]?.completed).length
  const pct = Math.round((done / STAGE_ORDER.length) * 100)

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button type="button" className="topbar__brand" onClick={onHome} aria-label="Go to the adventure map">
          <span aria-hidden="true" style={{ fontSize: '1.35rem' }}>
            🐫
          </span>
          <span className="topbar__title">
            Egypt English
            <span>Adventure</span>
          </span>
        </button>

        <div className="topbar__stats">
          <span className="stat-chip stat-chip--xp" title="Experience points">
            <span aria-hidden="true">⭐</span>
            {state.xp}
            <span className="visually-hidden">XP</span>
          </span>
          <span
            className={`stat-chip stat-chip--streak${state.streak === 0 ? ' stat-chip--muted' : ''}`}
            title="Correct answers in a row"
          >
            <span aria-hidden="true">🔥</span>
            {state.streak}
            <span className="visually-hidden">answer streak</span>
          </span>
          <span className="stat-chip stat-chip--mastery" title="Overall mastery">
            {masteryPercent}%<span className="visually-hidden"> mastery</span>
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-pressed={state.teacherMode}
            aria-label="Toggle Teacher Mode"
            title="Teacher Mode"
            onClick={() => setTeacherMode(!state.teacherMode)}
          >
            🎓
          </button>
          <button type="button" className="icon-btn" aria-label="Settings and progress" onClick={onSettings}>
            ⚙️
          </button>
        </div>
      </div>
      <div className="progress-rail">
        <div
          className="progress-rail__fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={STAGE_ORDER.length}
          aria-label="Stages completed"
        />
      </div>
    </header>
  )
}
