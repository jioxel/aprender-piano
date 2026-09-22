export const STEP_SIZE = 10
export const STAFF_LEFT_X = 46
export const STAFF_RIGHT_X = 230
export const BOTTOM_LINE_Y = 170
export const NOTE_X = (STAFF_LEFT_X + STAFF_RIGHT_X) / 2 + 40
export const CLEF_X = STAFF_LEFT_X + 26

export function stepToY(step: number): number {
  return BOTTOM_LINE_Y - step * STEP_SIZE
}

export const VIEW_BOX = '0 0 280 220'
