import { STAFF_LEFT_X, STAFF_RIGHT_X, stepToY } from './staffGeometry'
import { STAFF_TOP_STEP } from '../../music/staffLayout'

export function StaffLines() {
  const lineSteps = [0, 2, 4, 6, STAFF_TOP_STEP]

  return (
    <g className="staff-lines" stroke="currentColor" strokeWidth={1.5}>
      {lineSteps.map((step) => (
        <line
          key={step}
          x1={STAFF_LEFT_X}
          x2={STAFF_RIGHT_X}
          y1={stepToY(step)}
          y2={stepToY(step)}
        />
      ))}
    </g>
  )
}
