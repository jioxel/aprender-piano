import { getStaffStep } from '../../music/staffLayout'
import { noteName, CLEF_LABEL } from '../../music/notes'
import type { Clef, Note } from '../../music/types'
import { ClefSymbol } from './ClefSymbol'
import { NoteHead } from './NoteHead'
import { StaffLines } from './StaffLines'
import { VIEW_BOX } from './staffGeometry'
import './Staff.css'

interface StaffProps {
  clef: Clef
  note: Note
}

export function Staff({ clef, note }: StaffProps) {
  const step = getStaffStep(note, clef)

  return (
    <svg
      className="staff"
      viewBox={VIEW_BOX}
      role="img"
      aria-label={`${CLEF_LABEL[clef]}, nota ${noteName(note)}`}
    >
      <StaffLines />
      <ClefSymbol clef={clef} />
      <NoteHead step={step} />
    </svg>
  )
}
