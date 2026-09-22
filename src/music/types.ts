export type Clef = 'treble' | 'bass'

export type Hand = 'right' | 'left'

export type NoteLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

export interface Note {
  letter: NoteLetter
  octave: number
}

export interface NoteEvent {
  note: Note
  clef: Clef
  hand: Hand
}
