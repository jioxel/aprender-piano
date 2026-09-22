import { describe, expect, it } from 'vitest'
import { getLedgerSteps, getStaffStep, getStemDirection } from './staffLayout'

describe('getStaffStep', () => {
  it('places middle C (C4) two steps below the treble staff', () => {
    expect(getStaffStep({ letter: 'C', octave: 4 }, 'treble')).toBe(-2)
  })

  it('places the treble bottom line note (E4) at step 0', () => {
    expect(getStaffStep({ letter: 'E', octave: 4 }, 'treble')).toBe(0)
  })

  it('places the bass bottom line note (G2) at step 0', () => {
    expect(getStaffStep({ letter: 'G', octave: 2 }, 'bass')).toBe(0)
  })

  it('places B3 one step above the bass top line', () => {
    expect(getStaffStep({ letter: 'B', octave: 3 }, 'bass')).toBe(9)
  })
})

describe('getLedgerSteps', () => {
  it('adds a single ledger line for middle C in treble clef', () => {
    expect(getLedgerSteps(-2)).toEqual([-2])
  })

  it('adds no ledger line for a note just below the staff', () => {
    expect(getLedgerSteps(-1)).toEqual([])
  })

  it('adds no ledger line for notes within the staff', () => {
    expect(getLedgerSteps(4)).toEqual([])
  })

  it('adds no ledger line for a note just above the staff', () => {
    expect(getLedgerSteps(9)).toEqual([])
  })
})

describe('getStemDirection', () => {
  it('points the stem down at and above the middle line', () => {
    expect(getStemDirection(4)).toBe('down')
    expect(getStemDirection(8)).toBe('down')
  })

  it('points the stem up below the middle line', () => {
    expect(getStemDirection(3)).toBe('up')
    expect(getStemDirection(-2)).toBe('up')
  })
})
