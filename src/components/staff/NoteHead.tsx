import { getLedgerSteps, getStemDirection } from '../../music/staffLayout'
import { NOTE_X, stepToY } from './staffGeometry'

const LEDGER_HALF_WIDTH = 16
const NOTEHEAD_RX = 8
const NOTEHEAD_RY = 6
const STEM_HEIGHT = 42

interface NoteHeadProps {
  step: number
}

export function NoteHead({ step }: NoteHeadProps) {
  const y = stepToY(step)
  const ledgerSteps = getLedgerSteps(step)
  const stemDirection = getStemDirection(step)
  const stemX = stemDirection === 'up' ? NOTE_X + NOTEHEAD_RX - 1 : NOTE_X - NOTEHEAD_RX + 1
  const stemY2 = stemDirection === 'up' ? y - STEM_HEIGHT : y + STEM_HEIGHT

  return (
    <g className="note-head">
      {ledgerSteps.map((ledgerStep) => (
        <line
          key={ledgerStep}
          x1={NOTE_X - LEDGER_HALF_WIDTH}
          x2={NOTE_X + LEDGER_HALF_WIDTH}
          y1={stepToY(ledgerStep)}
          y2={stepToY(ledgerStep)}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}
      <line x1={stemX} x2={stemX} y1={y} y2={stemY2} stroke="currentColor" strokeWidth={1.5} />
      <ellipse
        cx={NOTE_X}
        cy={y}
        rx={NOTEHEAD_RX}
        ry={NOTEHEAD_RY}
        transform={`rotate(-18 ${NOTE_X} ${y})`}
        fill="currentColor"
      />
    </g>
  )
}
