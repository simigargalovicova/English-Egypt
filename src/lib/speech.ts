/**
 * Text-to-speech and optional speech recognition via the Web Speech API.
 * Both are progressive enhancements: every exercise stays fully usable by
 * typing if the browser supports neither.
 */

let cachedVoices: SpeechSynthesisVoice[] = []
let voicesRequested = false

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length) cachedVoices = voices
  if (!voicesRequested) {
    voicesRequested = true
    // Some browsers populate the list asynchronously.
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = window.speechSynthesis.getVoices()
    })
  }
  return cachedVoices
}

/** Prefers a natural British/US English voice, falling back to any English. */
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = loadVoices()
  if (!voices.length) return undefined
  const wanted = lang.toLowerCase()
  const preferredNames = ['google uk english female', 'google us english', 'samantha', 'daniel', 'karen']
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(wanted.slice(0, 2)))
  const pool = englishVoices.length ? englishVoices : voices
  for (const name of preferredNames) {
    const hit = pool.find((v) => v.name.toLowerCase() === name)
    if (hit) return hit
  }
  const exact = pool.find((v) => v.lang.toLowerCase().replace('_', '-') === wanted)
  return exact ?? pool[0]
}

export interface SpeakOptions {
  lang?: string
  rate?: number
  onEnd?: () => void
}

/** Speaks a phrase. Slower than default, which suits an A1 listener. */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!speechSupported() || !text.trim()) {
    options.onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = options.lang ?? 'en-GB'
  utterance.rate = options.rate ?? 0.88
  utterance.pitch = 1
  const voice = pickVoice(utterance.lang)
  if (voice) utterance.voice = voice
  utterance.onend = () => options.onEnd?.()
  utterance.onerror = () => options.onEnd?.()
  synth.speak(utterance)
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel()
}

/* ------------------------------------------------------------------ *
 * Speech recognition (optional)
 * ------------------------------------------------------------------ */

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: unknown) => void) | null
  onend: (() => void) | null
}

type RecognitionCtor = new () => SpeechRecognitionLike

function recognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor
    webkitSpeechRecognition?: RecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function recognitionSupported(): boolean {
  return Boolean(recognitionCtor())
}

export interface ListenHandle {
  stop(): void
}

/**
 * Listens once and reports the transcript. Returns null if unsupported so the
 * caller can hide the microphone button entirely.
 */
export function listenOnce(
  onResult: (transcript: string) => void,
  onDone: (error?: string) => void,
): ListenHandle | null {
  const Ctor = recognitionCtor()
  if (!Ctor) return null
  let finished = false
  const recognition = new Ctor()
  recognition.lang = 'en-GB'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? ''
    if (transcript) onResult(transcript)
  }
  recognition.onerror = () => {
    if (!finished) {
      finished = true
      onDone('Microphone did not catch that. You can type instead.')
    }
  }
  recognition.onend = () => {
    if (!finished) {
      finished = true
      onDone()
    }
  }
  try {
    recognition.start()
  } catch {
    return null
  }
  return {
    stop() {
      try {
        recognition.stop()
      } catch {
        /* already stopped */
      }
    },
  }
}
