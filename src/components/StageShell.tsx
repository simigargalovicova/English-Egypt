import type { ReactNode } from 'react'
import type { StageDef } from '../types'
import { TeacherMode } from './TeacherMode'

export type DotState = 'todo' | 'done' | 'wrong' | 'current'

interface Props {
  stage: StageDef
  onExit: () => void
  /** One dot per item, so the learner always sees how far they are. */
  dots?: DotState[]
  children: ReactNode
  aside?: ReactNode
}

export function StageShell({ stage, onExit, dots, children, aside }: Props) {
  return (
    <div className="stack">
      <button type="button" className="btn btn--quiet" onClick={onExit} style={{ alignSelf: 'flex-start' }}>
        ← Back to the map
      </button>

      <header className="stage-head">
        <div className="stage-head__icon" aria-hidden="true">
          {stage.icon}
        </div>
        <div className="stage-head__text">
          <p className="eyebrow" style={{ marginBottom: 0 }}>
            Stage {stage.num} · {stage.minutes} min
          </p>
          <h1>{stage.title}</h1>
          <p>{stage.tagline}</p>
        </div>
      </header>

      {dots && dots.length > 0 && (
        <div className="steps" aria-hidden="true">
          {dots.map((dot, i) => (
            <span key={i} className={`steps__dot steps__dot--${dot}`} />
          ))}
        </div>
      )}

      {aside}

      {children}

      <TeacherMode stage={stage} />
    </div>
  )
}
