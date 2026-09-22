import { useCallback, useState } from 'react'
import { getRandomNoteEvent } from './notes'
import type { NoteEvent } from './types'

export interface UseNoteSequenceResult {
  current: NoteEvent
  goNext: () => void
  goPrevious: () => void
  canGoPrevious: boolean
}

/**
 * Drives the note-reading exercise: "next" always reveals a fresh random note (unless we're
 * stepping forward through history we already visited via "previous"), while "previous"
 * replays earlier notes so the learner can double check one they just read.
 */
export function useNoteSequence(
  generateNote: () => NoteEvent = getRandomNoteEvent,
): UseNoteSequenceResult {
  const [history, setHistory] = useState<NoteEvent[]>(() => [generateNote()])
  const [index, setIndex] = useState(0)

  const goNext = useCallback(() => {
    setHistory((prev) => (index < prev.length - 1 ? prev : [...prev, generateNote()]))
    setIndex((i) => i + 1)
  }, [index, generateNote])

  const goPrevious = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  return {
    current: history[index],
    goNext,
    goPrevious,
    canGoPrevious: index > 0,
  }
}
