import { getEnabledClefs, getNotePool } from './exerciseSettings'
import { NOTE_LETTERS } from './types'
import type { Clef, Hand, Note, NoteEvent, NoteLetter } from './types'

function letterIndex(letter: NoteLetter): number {
  return NOTE_LETTERS.indexOf(letter)
}

/** Diatonic index: consecutive integers for consecutive natural notes (C4 -> D4 is +1). */
export function noteToDiatonicIndex(note: Note): number {
  return note.octave * 7 + letterIndex(note.letter)
}

export function noteName(note: Note): string {
  return `${note.letter}${note.octave}`
}

export const NOTE_LETTER_ES: Record<NoteLetter, string> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
}

export function noteNameEs(note: Note): string {
  return `${NOTE_LETTER_ES[note.letter]}${note.octave}`
}

export const HAND_BY_CLEF: Record<Clef, Hand> = {
  treble: 'right',
  bass: 'left',
}

export const CLEF_LABEL: Record<Clef, string> = {
  treble: 'Clave de Sol',
  bass: 'Clave de Fa',
}

export const HAND_LABEL: Record<Hand, string> = {
  right: 'Mano derecha',
  left: 'Mano izquierda',
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function isSameNote(a: Note, b: Note): boolean {
  return a.letter === b.letter && a.octave === b.octave
}

/**
 * Generates a random note event. When `previous` is given and lands on the same hand,
 * the previous note is excluded from the pool so the exercise never repeats the same
 * note twice in a row.
 */
export function getRandomNoteEvent(previous?: NoteEvent): NoteEvent {
  const clef = pickRandom<Clef>(getEnabledClefs())
  const hand = HAND_BY_CLEF[clef]
  const pool = getNotePool(hand)
  const candidates =
    previous && previous.hand === hand ? pool.filter((note) => !isSameNote(note, previous.note)) : pool
  const note = pickRandom(candidates.length > 0 ? candidates : pool)
  return { note, clef, hand }
}
