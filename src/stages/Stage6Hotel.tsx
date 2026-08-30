import { useState } from 'react'
import { HOTEL_BRANCHES, HOTEL_BRANCHES_REQUIRED } from '../data/hotel'
import { getStage } from '../data/stages'
import { useProgress } from '../state/progressContext'
import { useStageAttempt } from '../state/useStageAttempt'
import { DialogueScenario, type TurnRecord } from '../components/DialogueScenario'
import { MasteryMeter } from '../components/MasteryMeter'
import { StageShell } from '../components/StageShell'
import { StageResult } from '../components/StageResult'

const stage = getStage('hotel')

/**
 * Stage 6 — the learner chooses an intention, not a sentence, and then has to
 * find the English themselves. Three of the four branches must succeed.
 */
export function Stage6Hotel({ onExit }: { onExit: () => void }) {
  const { completeStage, earnBadge } = useProgress()
  useStageAttempt('hotel')
  const [activeBranch, setActiveBranch] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)

  const attempted = Object.keys(scores)
  const cleared = attempted.filter((id) => scores[id] >= 0.5)
  const branch = HOTEL_BRANCHES.find((b) => b.id === activeBranch) ?? null

  function finishBranch(records: TurnRecord[]) {
    if (!branch) return
    const correct = records.filter((r) => r.outcome.correct).length
    const score = correct / records.length
    const nextScores = { ...scores, [branch.id]: score }
    setScores(nextScores)
    setActiveBranch(null)

    const clearedNow = Object.values(nextScores).filter((s) => s >= 0.5).length
    if (clearedNow >= HOTEL_BRANCHES_REQUIRED) {
      const average =
        Object.values(nextScores).reduce((a, b) => a + b, 0) / Object.values(nextScores).length
      completeStage('hotel', average)
      earnBadge('hotel-survivor')
      setDone(true)
    }
  }

  if (done) {
    return (
      <StageShell stage={stage} onExit={onExit}>
        <StageResult
          passed
          score={cleared.length}
          max={HOTEL_BRANCHES.length}
          threshold={HOTEL_BRANCHES_REQUIRED}
          title="You survived reception"
          message="You picked what you wanted, found the words yourself, and handled the reply. That is a real hotel conversation."
          onContinue={onExit}
        />
      </StageShell>
    )
  }

  if (branch) {
    return (
      <StageShell stage={stage} onExit={() => setActiveBranch(null)}>
        <div className="card card--tinted">
          <p className="eyebrow" style={{ marginBottom: '0.15rem' }}>
            Your intention
          </p>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {branch.emoji} {branch.intentEn} · <span className="sk">{branch.intentSk}</span>
          </p>
        </div>
        <DialogueScenario
          key={branch.id}
          turns={branch.turns}
          npcName="Receptionist"
          onFinish={finishBranch}
          finishLabel="Done at the desk"
        />
      </StageShell>
    )
  }

  return (
    <StageShell
      stage={stage}
      onExit={onExit}
      aside={
        <MasteryMeter
          value={cleared.length}
          max={HOTEL_BRANCHES.length}
          label="Branches cleared"
          threshold={HOTEL_BRANCHES_REQUIRED}
        />
      }
    >
      <div className="dialogue">
        <div className="bubble bubble--npc">
          <span className="bubble__who">Receptionist</span>
          Good afternoon. Can I help you?
        </div>
      </div>

      <div className="card">
        <p className="eyebrow" style={{ marginBottom: '0.6rem' }}>
          What do you want to do? · Čo chceš vybaviť?
        </p>
        <div className="pick-list">
          {HOTEL_BRANCHES.map((b) => {
            const score = scores[b.id]
            const isCleared = score !== undefined && score >= 0.5
            return (
              <button
                key={b.id}
                type="button"
                className={`pick${isCleared ? ' pick--on' : ''}`}
                onClick={() => setActiveBranch(b.id)}
              >
                <span className="pick__box" aria-hidden="true">
                  {isCleared ? '✓' : ''}
                </span>
                <span style={{ flex: 1 }}>
                  <strong>
                    {b.emoji} {b.intentEn}
                  </strong>
                  <br />
                  <span className="sk" style={{ fontSize: '0.86rem' }}>
                    {b.intentSk}
                  </span>
                </span>
                {score !== undefined && !isCleared && <span className="muted">retry</span>}
              </button>
            )
          })}
        </div>
        <p className="muted" style={{ margin: '0.9rem 0 0', fontSize: '0.88rem' }}>
          Clear {HOTEL_BRANCHES_REQUIRED} of {HOTEL_BRANCHES.length} to finish the mission. You choose
          the order.
        </p>
      </div>
    </StageShell>
  )
}
