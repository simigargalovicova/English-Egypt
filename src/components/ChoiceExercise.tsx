import { useState } from 'react'
import { Feedback } from './Feedback'
import { SpeakButton } from './SpeakButton'

/** Parents pass a React `key` per item, so each question mounts fresh. */
interface Props {
  prompt: string
  options: string[]
  answer: string
  explanation: string
  /** Full sentence to read aloud once answered, e.g. "Are you from Slovakia?" */
  spokenAnswer?: string
  onComplete: (correct: boolean) => void
}

/** Recognition-level exercise: pick the right engine word. */
export function ChoiceExercise({
  prompt,
  options,
  answer,
  explanation,
  spokenAnswer,
  onComplete,
}: Props) {
  const [picked, setPicked] = useState<string | null>(null)

  const correct = picked === answer
  const filled = picked ? prompt.replace('___', picked) : prompt

  return (
    <div className="stack">
      <div className="prompt-card">
        <p className="eyebrow">Choose the engine</p>
        <p className="prompt-big">{picked ? filled : prompt}</p>
        <div className="choices">
          {options.map((option) => {
            const isAnswer = option === answer
            const isPicked = option === picked
            let cls = 'choice'
            if (picked) {
              if (isAnswer) cls += ' choice--correct'
              else if (isPicked) cls += ' choice--wrong'
              else cls += ' choice--dim'
            }
            return (
              <button
                key={option}
                type="button"
                className={cls}
                disabled={picked !== null}
                onClick={() => setPicked(option)}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {picked && (
        <Feedback
          tone={correct ? 'correct' : 'wrong'}
          title={correct ? `Good. ${answer.toUpperCase()} is right.` : `It is ${answer.toUpperCase()} here.`}
        >
          <p>{explanation}</p>
          <p>
            <span className="model-answer">{spokenAnswer ?? prompt.replace('___', answer)}</span>{' '}
            <SpeakButton text={spokenAnswer ?? prompt.replace('___', answer)} label="Hear it" mini />
          </p>
        </Feedback>
      )}

      {picked && (
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => onComplete(correct)}
        >
          Continue
        </button>
      )}
    </div>
  )
}
