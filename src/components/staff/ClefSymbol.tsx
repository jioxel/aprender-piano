import { CLEF_X, stepToY } from './staffGeometry'
import type { Clef } from '../../music/types'

const CLEF_GLYPH: Record<Clef, string> = {
  treble: '\u{1D11E}',
  bass: '\u{1D122}',
}

// Anchor step + font size tuned so each glyph sits visually centered on the staff:
// the treble clef spirals around the G line (step 2), the bass clef's dots straddle the F line (step 6).
const CLEF_ANCHOR_STEP: Record<Clef, number> = {
  treble: 2,
  bass: 6,
}

// The bass clef glyph renders with a lot of built-in padding in most system fonts,
// so it needs a noticeably larger font size than the treble clef to look the same scale.
const CLEF_FONT_SIZE: Record<Clef, number> = {
  treble: 100,
  bass: 145,
}

interface ClefSymbolProps {
  clef: Clef
}

export function ClefSymbol({ clef }: ClefSymbolProps) {
  return (
    <text
      x={CLEF_X}
      y={stepToY(CLEF_ANCHOR_STEP[clef])}
      fontSize={CLEF_FONT_SIZE[clef]}
      textAnchor="middle"
      dominantBaseline="middle"
      className="clef-symbol"
      fill="currentColor"
    >
      {CLEF_GLYPH[clef]}
    </text>
  )
}
