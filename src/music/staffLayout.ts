import { noteToDiatonicIndex } from './notes'
import type { Clef, Note } from './types'

/**
 * Staff "step" = position counted in lines/spaces from the bottom line (0 = bottom line,
 * 8 = top line, each whole step alternates between a line and a space). Because every
 * natural note is one diatonic step from the next, and every staff step is one line/space
 * from the next, a note's step is simply the distance (in diatonic index) from the clef's
 * bottom-line reference note.
 */
const CLEF_BOTTOM_LINE: Record<Clef, Note> = {
  treble: { letter: 'E', octave: 4 },
  bass: { letter: 'G', octave: 2 },
}

export const STAFF_BOTTOM_STEP = 0
export const STAFF_TOP_STEP = 8
export const STAFF_MIDDLE_STEP = 4

export function getStaffStep(note: Note, clef: Clef): number {
  return noteToDiatonicIndex(note) - noteToDiatonicIndex(CLEF_BOTTOM_LINE[clef])
}

/** Ledger line step positions needed to reach (and, if on a line, include) the given step. */
export function getLedgerSteps(step: number): number[] {
  const steps: number[] = []
  if (step > STAFF_TOP_STEP) {
    for (let s = STAFF_TOP_STEP + 2; s <= step; s += 2) steps.push(s)
  } else if (step < STAFF_BOTTOM_STEP) {
    for (let s = STAFF_BOTTOM_STEP - 2; s >= step; s -= 2) steps.push(s)
  }
  return steps
}

export type StemDirection = 'up' | 'down'

export function getStemDirection(step: number): StemDirection {
  return step >= STAFF_MIDDLE_STEP ? 'down' : 'up'
}
