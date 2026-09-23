import { NOTE_LETTERS } from './types'
import type { Clef, Hand, Note } from './types'

const STORAGE_KEY = 'aprender-piano:exercise-settings'

const DEFAULT_OCTAVE_BY_HAND: Record<Hand, number> = {
  right: 4,
  left: 3,
}

const DEFAULT_ENABLED_CLEFS: Clef[] = ['treble', 'bass']

/**
 * Octaves each hand may draw notes from, bounded so every note still lands inside
 * the staff SVG's fixed viewBox (see staffGeometry.ts) without redrawing it — the
 * right hand's clef reference sits higher on the keyboard than the left hand's, so
 * the safe ranges aren't symmetric.
 */
export const AVAILABLE_OCTAVES_BY_HAND: Record<Hand, number[]> = {
  right: [4, 5],
  left: [2, 3, 4],
}

export function buildOctave(octave: number): Note[] {
  return NOTE_LETTERS.map((letter) => ({ letter, octave }))
}

/** Every note a hand could possibly be configured with — the universe the settings UI offers. */
export function getAvailableNotes(hand: Hand): Note[] {
  return AVAILABLE_OCTAVES_BY_HAND[hand].flatMap(buildOctave)
}

function noteKey(note: Note): string {
  return `${note.letter}${note.octave}`
}

function defaultNotesForHand(hand: Hand): Note[] {
  return buildOctave(DEFAULT_OCTAVE_BY_HAND[hand])
}

/** Keeps only valid, non-duplicate notes for the hand; an empty result falls back to the default octave. */
function sanitizeNotes(hand: Hand, notes: Note[]): Note[] {
  const allowed = new Set(getAvailableNotes(hand).map(noteKey))
  const seen = new Set<string>()
  const cleaned = notes.filter((note) => {
    const key = noteKey(note)
    if (!allowed.has(key) || seen.has(key)) return false
    seen.add(key)
    return true
  })
  return cleaned.length > 0 ? cleaned : defaultNotesForHand(hand)
}

/** Keeps only valid, non-duplicate clefs; an empty result falls back to practicing both. */
function sanitizeClefs(clefs: Clef[]): Clef[] {
  const cleaned = [...new Set(clefs)].filter(
    (clef): clef is Clef => clef === 'treble' || clef === 'bass',
  )
  return cleaned.length > 0 ? cleaned : DEFAULT_ENABLED_CLEFS
}

interface StoredSettings {
  notesByHand: Record<Hand, Note[]>
  enabledClefs: Clef[]
}

function defaultSettings(): StoredSettings {
  return {
    notesByHand: { right: defaultNotesForHand('right'), left: defaultNotesForHand('left') },
    enabledClefs: DEFAULT_ENABLED_CLEFS,
  }
}

function readStoredSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings()
    const parsed = JSON.parse(raw) as Partial<StoredSettings>
    const fallback = defaultSettings()
    return {
      notesByHand: {
        right: sanitizeNotes('right', parsed.notesByHand?.right ?? fallback.notesByHand.right),
        left: sanitizeNotes('left', parsed.notesByHand?.left ?? fallback.notesByHand.left),
      },
      enabledClefs: sanitizeClefs(parsed.enabledClefs ?? fallback.enabledClefs),
    }
  } catch {
    return defaultSettings()
  }
}

let state: StoredSettings = readStoredSettings()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode, quota exceeded); the in-memory config still works.
  }
}

/** For `useSyncExternalStore`, so the settings UI stays in sync with runtime changes. */
export function subscribeToExerciseSettings(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Current note selection per hand, editable at runtime via `setSelectedNotesForHand`. */
export function getSelectedNotesByHand(): Record<Hand, Note[]> {
  return state.notesByHand
}

/** Replaces a hand's selected notes. Invalid/duplicate notes are dropped; an empty result falls back to the default octave. */
export function setSelectedNotesForHand(hand: Hand, notes: Note[]): void {
  state = { ...state, notesByHand: { ...state.notesByHand, [hand]: sanitizeNotes(hand, notes) } }
  persist()
  listeners.forEach((listener) => listener())
}

/** Which clefs (treble/bass) the exercise currently draws notes from. Never empty. */
export function getEnabledClefs(): Clef[] {
  return state.enabledClefs
}

/** Replaces the enabled clefs. An empty result falls back to practicing both clefs. */
export function setEnabledClefs(clefs: Clef[]): void {
  state = { ...state, enabledClefs: sanitizeClefs(clefs) }
  persist()
  listeners.forEach((listener) => listener())
}

export function getNotePool(hand: Hand): Note[] {
  return getSelectedNotesByHand()[hand]
}
