import { useEffect } from 'react'
import type { StageId } from '../types'
import { useProgress } from './progressContext'

/** Counts one attempt the first time a stage screen is opened. */
export function useStageAttempt(stage: StageId): void {
  const { attemptStage } = useProgress()
  useEffect(() => {
    attemptStage(stage)
    // Deliberately runs once per mount, not on every attemptStage identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])
}
