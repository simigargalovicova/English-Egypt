import { useEffect, useRef, useState } from 'react'
import { speak, speechSupported, stopSpeaking } from '../lib/speech'
import { useProgress } from '../state/progressContext'

interface Props {
  text: string
  label?: string
  mini?: boolean
  autoPlay?: boolean
}

/** Plays a phrase aloud. Renders nothing when the browser has no speech engine. */
export function SpeakButton({ text, label = 'Listen', mini = false, autoPlay = false }: Props) {
  const { state } = useProgress()
  const [speaking, setSpeaking] = useState(false)
  const supported = speechSupported()
  const played = useRef('')

  useEffect(() => {
    if (!autoPlay || !supported || !state.soundOn) return
    if (played.current === text) return
    played.current = text
    setSpeaking(true)
    speak(text, { onEnd: () => setSpeaking(false) })
  }, [autoPlay, supported, state.soundOn, text])

  useEffect(() => () => stopSpeaking(), [])

  if (!supported) return null

  return (
    <button
      type="button"
      className={`speak-btn${mini ? ' speak-btn--mini' : ''}${speaking ? ' speak-btn--speaking' : ''}`}
      onClick={() => {
        if (speaking) {
          stopSpeaking()
          setSpeaking(false)
          return
        }
        setSpeaking(true)
        speak(text, { onEnd: () => setSpeaking(false) })
      }}
      aria-label={`${label}: ${text}`}
    >
      <span aria-hidden="true">{speaking ? '🔊' : '🔈'}</span>
      {!mini && <span>{speaking ? 'Playing…' : label}</span>}
    </button>
  )
}
