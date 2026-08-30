import { useState } from 'react'
import type { StageDef } from '../types'
import { useProgress } from '../state/progressContext'

/**
 * Collapsible notes for a teacher sitting next to the learner. Hidden entirely
 * unless Teacher Mode is switched on, so it never intrudes on the lesson.
 */
export function TeacherMode({ stage }: { stage: StageDef }) {
  const { state } = useProgress()
  const [open, setOpen] = useState(false)

  if (!state.teacherMode) return null
  const notes = stage.teacher

  return (
    <section className="teacher">
      <button
        type="button"
        className="teacher__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">🎓</span>
        Teacher notes — {stage.title}
        <span className="teacher__chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="teacher__body">
          <h4>Objective</h4>
          <p style={{ margin: 0 }}>{notes.objective}</p>

          <h4>Target grammar</h4>
          <div className="pill-row">
            {notes.targetGrammar.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>

          <h4>Correct this</h4>
          <ul>
            {notes.correct.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h4>Let this go</h4>
          <ul>
            {notes.ignore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h4>Prompts you can use</h4>
          <ul>
            {notes.prompts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h4>When to move on</h4>
          <p style={{ margin: 0 }}>{notes.moveOn}</p>

          <div className="teacher__rule">
            <strong>Correction rule.</strong> If the meaning is clear, let the learner finish. Then
            recast one error only. — “I from Slovakia.” → “Good: <em>I’m</em> from Slovakia. Say it
            once more.”
          </div>
        </div>
      )}
    </section>
  )
}
