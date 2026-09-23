import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildOctave,
  getAvailableNotes,
  getEnabledClefs,
  getNotePool,
  getSelectedNotesByHand,
  setEnabledClefs,
  setSelectedNotesForHand,
  subscribeToExerciseSettings,
} from './exerciseSettings'

afterEach(() => {
  setSelectedNotesForHand('right', buildOctave(4))
  setSelectedNotesForHand('left', buildOctave(3))
  setEnabledClefs(['treble', 'bass'])
})

describe('buildOctave', () => {
  it('returns the 7 natural notes for the given octave', () => {
    expect(buildOctave(5)).toEqual([
      { letter: 'C', octave: 5 },
      { letter: 'D', octave: 5 },
      { letter: 'E', octave: 5 },
      { letter: 'F', octave: 5 },
      { letter: 'G', octave: 5 },
      { letter: 'A', octave: 5 },
      { letter: 'B', octave: 5 },
    ])
  })
})

describe('getAvailableNotes', () => {
  it('combines every octave the hand is allowed to use', () => {
    expect(getAvailableNotes('right')).toHaveLength(14) // octaves 4 and 5
    expect(getAvailableNotes('left')).toHaveLength(21) // octaves 2, 3 and 4
  })
})

describe('getSelectedNotesByHand / setSelectedNotesForHand', () => {
  it('starts with one full octave selected per hand', () => {
    expect(getSelectedNotesByHand()).toEqual({
      right: buildOctave(4),
      left: buildOctave(3),
    })
  })

  it('lets a hand select individual notes across different octaves', () => {
    const selection = [
      { letter: 'C', octave: 2 },
      { letter: 'G', octave: 4 },
    ] as const
    setSelectedNotesForHand('left', [...selection])

    expect(getSelectedNotesByHand().left).toEqual(selection)
    expect(getNotePool('left')).toEqual(selection)
  })

  it('drops notes outside the hand-appropriate available range', () => {
    setSelectedNotesForHand('right', [
      { letter: 'C', octave: 4 },
      { letter: 'C', octave: 9 },
    ])

    expect(getSelectedNotesByHand().right).toEqual([{ letter: 'C', octave: 4 }])
  })

  it('deduplicates repeated notes', () => {
    setSelectedNotesForHand('right', [
      { letter: 'C', octave: 4 },
      { letter: 'C', octave: 4 },
    ])

    expect(getSelectedNotesByHand().right).toEqual([{ letter: 'C', octave: 4 }])
  })

  it('falls back to the default octave when every selection is removed', () => {
    setSelectedNotesForHand('right', [])

    expect(getSelectedNotesByHand().right).toEqual(buildOctave(4))
  })
})

describe('getEnabledClefs / setEnabledClefs', () => {
  it('starts with both clefs enabled', () => {
    expect(getEnabledClefs()).toEqual(['treble', 'bass'])
  })

  it('lets a single clef be enabled', () => {
    setEnabledClefs(['bass'])

    expect(getEnabledClefs()).toEqual(['bass'])
  })

  it('deduplicates and falls back to both clefs when the result would be empty', () => {
    setEnabledClefs([])

    expect(getEnabledClefs()).toEqual(['treble', 'bass'])
  })
})

describe('subscribeToExerciseSettings', () => {
  it('notifies subscribers when notes or clefs change', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToExerciseSettings(listener)

    setSelectedNotesForHand('left', [{ letter: 'C', octave: 2 }])
    setEnabledClefs(['treble'])

    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})
