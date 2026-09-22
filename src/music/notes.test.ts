import { describe, expect, it, vi } from 'vitest'
import {
  getRandomNoteEvent,
  HAND_BY_CLEF,
  LEFT_HAND_NOTES,
  noteName,
  noteNameEs,
  noteToDiatonicIndex,
  RIGHT_HAND_NOTES,
} from './notes'

describe('noteNameEs', () => {
  it('translates natural note letters to Spanish solfège syllables', () => {
    expect(noteNameEs({ letter: 'C', octave: 4 })).toBe('Do4')
    expect(noteNameEs({ letter: 'F', octave: 3 })).toBe('Fa3')
    expect(noteNameEs({ letter: 'B', octave: 3 })).toBe('Si3')
  })
})

describe('noteName', () => {
  it('keeps the English letter name with its octave', () => {
    expect(noteName({ letter: 'G', octave: 4 })).toBe('G4')
  })
})

describe('noteToDiatonicIndex', () => {
  it('increases by 1 between consecutive natural notes, including across the octave boundary', () => {
    expect(noteToDiatonicIndex({ letter: 'C', octave: 4 })).toBe(
      noteToDiatonicIndex({ letter: 'B', octave: 3 }) + 1,
    )
    expect(noteToDiatonicIndex({ letter: 'D', octave: 4 })).toBe(
      noteToDiatonicIndex({ letter: 'C', octave: 4 }) + 1,
    )
  })
})

describe('note ranges', () => {
  it('has exactly one octave (7 natural notes) per hand', () => {
    expect(RIGHT_HAND_NOTES).toHaveLength(7)
    expect(LEFT_HAND_NOTES).toHaveLength(7)
  })

  it('keeps the right hand in octave 4 and the left hand in octave 3', () => {
    expect(RIGHT_HAND_NOTES.every((note) => note.octave === 4)).toBe(true)
    expect(LEFT_HAND_NOTES.every((note) => note.octave === 3)).toBe(true)
  })
})

describe('getRandomNoteEvent', () => {
  it('pairs treble clef with the right hand and bass clef with the left hand', () => {
    for (let i = 0; i < 50; i += 1) {
      const event = getRandomNoteEvent()
      expect(event.hand).toBe(HAND_BY_CLEF[event.clef])
    }
  })

  it('only produces notes within the hand-appropriate octave', () => {
    for (let i = 0; i < 50; i += 1) {
      const event = getRandomNoteEvent()
      const pool = event.hand === 'right' ? RIGHT_HAND_NOTES : LEFT_HAND_NOTES
      expect(pool).toContainEqual(event.note)
    }
  })

  it('picks randomly rather than always returning the same note', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0)
    const first = getRandomNoteEvent()
    randomSpy.mockReturnValueOnce(0.99).mockReturnValueOnce(0.99)
    const second = getRandomNoteEvent()
    randomSpy.mockRestore()

    expect(first).not.toEqual(second)
  })
})
