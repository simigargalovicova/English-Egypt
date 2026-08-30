import type { StageId } from '../types'
import { LOCATIONS, STAGES, STAGE_ORDER } from '../data/stages'
import { useProgress } from '../state/progressContext'
import { Mascot } from './Mascot'

interface Props {
  onOpenStage: (id: StageId) => void
  onOpenSummary: () => void
}

export function AdventureMap({ onOpenStage, onOpenSummary }: Props) {
  const { state, isUnlocked, isComplete, stageScore, nextStage, masteryPercent } = useProgress()
  const doneCount = STAGE_ORDER.filter(isComplete).length
  const allDone = doneCount === STAGE_ORDER.length
  const currentStage = nextStage ? STAGES.find((s) => s.id === nextStage) : null

  return (
    <div className="stack">
      <section className="hero">
        <Mascot className="hero__mascot" size={80} />
        <p className="eyebrow">
          {doneCount === 0 ? 'Welcome aboard' : `${doneCount} of ${STAGE_ORDER.length} missions done`}
        </p>
        <h1>Egypt English Adventure</h1>
        <p>
          {allDone
            ? 'You made it all the way to the oasis. Open your Survival English card any time.'
            : `Next stop: ${currentStage?.title ?? 'your first mission'}. About one hour of real speaking practice.`}
        </p>
        <div className="hero__meta">
          <span className="hero__pill">⭐ {state.xp} XP</span>
          <span className="hero__pill">📈 {masteryPercent}% mastery</span>
          <span className="hero__pill">🏅 {state.badges.length}/8 badges</span>
        </div>
      </section>

      <nav className="map" aria-label="Lesson map">
        {LOCATIONS.map((location) => {
          const stages = STAGES.filter((s) => s.locationId === location.id)
          const locationDone = stages.every((s) => isComplete(s.id))
          const locationCurrent = stages.some((s) => s.id === nextStage)
          const locationLocked = stages.every((s) => !isUnlocked(s.id))
          const legClass = [
            'leg',
            locationDone ? 'leg--done' : '',
            locationCurrent ? 'leg--current' : '',
            locationLocked ? 'leg--locked' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <section className={legClass} key={location.id}>
              <span className="leg__pin" aria-hidden="true">
                {locationDone ? '✓' : location.emoji}
              </span>
              <div className="leg__head">
                <span className="leg__name">{location.name}</span>
                <span className="leg__sk">{location.slovakName}</span>
              </div>
              <p className="leg__blurb">{location.blurb}</p>

              <div className="leg__stages">
                {stages.map((stage) => {
                  const unlocked = isUnlocked(stage.id)
                  const done = isComplete(stage.id)
                  const isNext = stage.id === nextStage
                  const score = stageScore(stage.id)
                  const cls = [
                    'mission',
                    done ? 'mission--done' : '',
                    isNext ? 'mission--next' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      className={cls}
                      disabled={!unlocked}
                      onClick={() => onOpenStage(stage.id)}
                      aria-label={
                        unlocked
                          ? `${stage.title}. ${done ? 'Completed' : 'Not finished yet'}. ${stage.minutes} minutes.`
                          : `${stage.title}. Locked — finish the previous mission first.`
                      }
                    >
                      <span className="mission__icon" aria-hidden="true">
                        {unlocked ? stage.icon : '🔒'}
                      </span>
                      <span className="mission__body">
                        <span className="mission__title">{stage.title}</span>
                        <span className="mission__tag">
                          {unlocked ? stage.tagline : 'Finish the mission before this one to unlock.'}
                        </span>
                      </span>
                      <span className="mission__aside">
                        {done ? (
                          <span className="mission__score">{Math.round(score * 100)}%</span>
                        ) : (
                          <span>{stage.minutes}′</span>
                        )}
                        {isNext && <span aria-hidden="true">▶</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </nav>

      {doneCount > 0 && (
        <button type="button" className="btn btn--ghost btn--block" onClick={onOpenSummary}>
          📜 My Egypt Survival English
        </button>
      )}
    </div>
  )
}
