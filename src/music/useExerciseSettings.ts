import { useSyncExternalStore } from 'react'
import { getEnabledClefs, getSelectedNotesByHand, subscribeToExerciseSettings } from './exerciseSettings'
import type { Clef, Hand, Note } from './types'

/** Reactive view of the current note selection per hand, kept in sync with `setSelectedNotesForHand`. */
export function useSelectedNotesByHand(): Record<Hand, Note[]> {
  return useSyncExternalStore(subscribeToExerciseSettings, getSelectedNotesByHand, getSelectedNotesByHand)
}

/** Reactive view of which clefs are enabled, kept in sync with `setEnabledClefs`. */
export function useEnabledClefs(): Clef[] {
  return useSyncExternalStore(subscribeToExerciseSettings, getEnabledClefs, getEnabledClefs)
}
