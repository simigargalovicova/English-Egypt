import { useEffect, useRef, useState } from 'react'
import type { DialogueTurn, SkillTier } from '../types'
import { SpeakButton } from './SpeakButton'
import { TextAnswer, type AnswerOutcome } from './TextAnswer'

export interface TurnRecord {
  turnId: string
  text: string
  outcome: AnswerOutcome
}

/** Callers pass a React `key` per scenario, so a new run starts empty. */
interface Props {
  turns: DialogueTurn[]
  /** Final Boss hides the Slovak goal; the practice missions show it. */
  showSlovakGoal?: boolean
  npcName?: string
  tier?: SkillTier
  onTurnDone?: (turn: DialogueTurn, outcome: AnswerOutcome) => void
  onFinish: (records: TurnRecord[]) => void
  finishLabel?: string
}

/**
 * Runs a scripted conversation. The learner always types their own line; the
 * reply only arrives once they have produced something that works.
 */
export function DialogueScenario({
  turns,
  showSlovakGoal = true,
  npcName = 'Them',
  tier = 'scenario',
  onTurnDone,
  onFinish,
  finishLabel = 'Finish the mission',
}: Props) {
  const [index, setIndex] = useState(0)
  const [records, setRecords] = useState<TurnRecord[]>([])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [index])

  const done = index >= turns.length
  const turn = turns[index]

  function handle(outcome: AnswerOutcome) {
    const record: TurnRecord = { turnId: turn.id, text: outcome.text, outcome }
    const next = [...records, record]
    setRecords(next)
    onTurnDone?.(turn, outcome)
    if (index + 1 >= turns.length) {
      setIndex(turns.length)
      onFinish(next)
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div className="stack stack--tight">
      <div className="dialogue">
        {turns.slice(0, done ? turns.length : index + 1).map((t, i) => {
          const record = records[i]
          return (
            <div key={t.id} style={{ display: 'contents' }}>
              <div className="bubble bubble--npc">
                <span className="bubble__who">{npcName}</span>
                {t.npc} <SpeakButton text={t.npc} label="Hear it" mini />
                {showSlovakGoal && t.npcSk && <span className="bubble__sk">{t.npcSk}</span>}
              </div>
              {record && (
                <>
                  <div className="bubble bubble--me">
                    <span className="bubble__who">You</span>
                    {record.text.trim() || '…'}
                  </div>
                  <div className="bubble bubble--npc">
                    <span className="bubble__who">{npcName}</span>
                    {t.reply} <SpeakButton text={t.reply} label="Hear it" mini />
                    {showSlovakGoal && t.replySk && <span className="bubble__sk">{t.replySk}</span>}
                  </div>
                </>
              )}
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {!done && (
        <>
          <div className="goal-banner">
            <span aria-hidden="true">🎯</span>
            <span>
              <span className="goal-banner__label">
                Your turn {index + 1} of {turns.length}
              </span>
              {showSlovakGoal ? turn.goalSk : turn.goalEn}
            </span>
          </div>
          <TextAnswer
            key={turn.id}
            itemKey={turn.id}
            spec={turn.answer}
            tier={tier}
            hints={[turn.hint1, turn.hint2]}
            placeholder="What do you say?"
            continueLabel={index + 1 >= turns.length ? finishLabel : 'Say it →'}
            onComplete={handle}
          />
        </>
      )}
    </div>
  )
}
