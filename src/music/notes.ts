import type { Clef, Hand, Note, NoteEvent, NoteLetter } from './types'

const NOTE_LETTERS: NoteLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

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

const NOTE_LETTER_ES: Record<NoteLetter, string> = {
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

function buildOctave(octave: number): Note[] {
  return NOTE_LETTERS.map((letter) => ({ letter, octave }))
}

/** One octave per hand, as requested: right hand around middle C going up, left hand the octave below. */
export const RIGHT_HAND_NOTES: Note[] = buildOctave(4)
export const LEFT_HAND_NOTES: Note[] = buildOctave(3)

export const NOTES_BY_HAND: Record<Hand, Note[]> = {
  right: RIGHT_HAND_NOTES,
  left: LEFT_HAND_NOTES,
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function getRandomNoteEvent(): NoteEvent {
  const clef = pickRandom<Clef>(['treble', 'bass'])
  const hand = HAND_BY_CLEF[clef]
  const note = pickRandom(NOTES_BY_HAND[hand])
  return { note, clef, hand }
}
