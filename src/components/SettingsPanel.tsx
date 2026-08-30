import { useState } from 'react'
import { recognitionSupported, speechSupported } from '../lib/speech'
import { useProgress } from '../state/progressContext'
import { Feedback } from './Feedback'

interface SwitchRowProps {
  id: string
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

function SwitchRow({ id, label, description, checked, disabled, onChange }: SwitchRowProps) {
  return (
    <div className="settings-row">
      <span>
        <label htmlFor={id} style={{ fontWeight: 700 }}>
          {label}
        </label>
        <br />
        <span className="muted" style={{ fontSize: '0.86rem' }}>
          {description}
        </span>
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        className="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      />
    </div>
  )
}

export function SettingsPanel({ onExit }: { onExit: () => void }) {
  const { state, setSound, setMic, setTeacherMode, resetAll } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const [wiped, setWiped] = useState(false)

  return (
    <div className="stack">
      <button type="button" className="btn btn--quiet" onClick={onExit} style={{ alignSelf: 'flex-start' }}>
        ← Back to the map
      </button>

      <h1>Settings</h1>

      <section className="card">
        <p className="eyebrow">Sound and voice</p>
        <SwitchRow
          id="set-sound"
          label="Play phrases automatically"
          description={
            speechSupported()
              ? 'New phrase cards read themselves aloud once.'
              : 'Your browser has no speech engine — the Listen buttons are hidden.'
          }
          checked={state.soundOn}
          disabled={!speechSupported()}
          onChange={setSound}
        />
        <SwitchRow
          id="set-mic"
          label="Answer with your voice"
          description={
            recognitionSupported()
              ? 'Adds a microphone button next to typed answers. Typing always still works.'
              : 'Speech recognition is not available in this browser. Typing works everywhere.'
          }
          checked={state.micEnabled}
          disabled={!recognitionSupported()}
          onChange={setMic}
        />
      </section>

      <section className="card">
        <p className="eyebrow">Teaching</p>
        <SwitchRow
          id="set-teacher"
          label="Teacher Mode"
          description="Shows notes on each mission: what to correct, what to ignore, and when to move on."
          checked={state.teacherMode}
          onChange={setTeacherMode}
        />
      </section>

      <section className="card">
        <p className="eyebrow">Progress</p>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          Everything is stored on this device only — there is no account and nothing is uploaded.
        </p>
        <div className="pill-row" style={{ marginBottom: '0.9rem' }}>
          <span className="pill">⭐ {state.xp} XP</span>
          <span className="pill">🏅 {state.badges.length} badges</span>
          <span className="pill">✍️ {state.answerCount} answers given</span>
        </div>

        {wiped && (
          <Feedback tone="info" title="Progress cleared.">
            <p>The adventure is back at the airport.</p>
          </Feedback>
        )}

        {!confirming ? (
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setConfirming(true)}>
            Reset all progress
          </button>
        ) : (
          <div className="stack stack--tight">
            <Feedback tone="wrong" title="Delete everything?">
              <p>
                XP, badges, mission scores and your survival sentences will be permanently removed
                from this device.
              </p>
            </Feedback>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--coral"
                onClick={() => {
                  resetAll()
                  setConfirming(false)
                  setWiped(true)
                }}
              >
                Yes, reset everything
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
                Keep my progress
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">About</p>
        <p style={{ margin: 0, fontSize: '0.9rem' }} className="muted">
          A one-hour travel-English lesson for an adult false beginner (A1 → early A2), built around
          speaking rather than clicking. Works offline once loaded, and needs no login.
        </p>
      </section>
    </div>
  )
}
