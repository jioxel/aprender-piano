import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildOctave, getNotePool, setEnabledClefs, setSelectedNotesForHand } from './exerciseSettings'
import { getRandomNoteEvent, HAND_BY_CLEF, noteName, noteNameEs, noteToDiatonicIndex } from './notes'

afterEach(() => {
  setSelectedNotesForHand('right', buildOctave(4))
  setSelectedNotesForHand('left', buildOctave(3))
  setEnabledClefs(['treble', 'bass'])
})

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

describe('getRandomNoteEvent', () => {
  it('pairs treble clef with the right hand and bass clef with the left hand', () => {
    for (let i = 0; i < 50; i += 1) {
      const event = getRandomNoteEvent()
      expect(event.hand).toBe(HAND_BY_CLEF[event.clef])
    }
  })

  it('only produces notes within the hand-appropriate configured octaves', () => {
    for (let i = 0; i < 50; i += 1) {
      const event = getRandomNoteEvent()
      expect(getNotePool(event.hand)).toContainEqual(event.note)
    }
  })

  it('draws from every note selected for a hand, even a hand-picked subset', () => {
    setSelectedNotesForHand('left', [
      { letter: 'C', octave: 2 },
      { letter: 'G', octave: 4 },
    ])

    const notesSeen = new Set<string>()
    for (let i = 0; i < 200; i += 1) {
      const event = getRandomNoteEvent()
      if (event.hand === 'left') notesSeen.add(`${event.note.letter}${event.note.octave}`)
    }

    expect(notesSeen).toEqual(new Set(['C2', 'G4']))
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

  it('only produces the enabled clef when just one is enabled', () => {
    setEnabledClefs(['bass'])

    for (let i = 0; i < 50; i += 1) {
      expect(getRandomNoteEvent().clef).toBe('bass')
    }
  })

  it('never immediately repeats the previous note for the same hand', () => {
    for (let i = 0; i < 100; i += 1) {
      const previous = getRandomNoteEvent()
      const next = getRandomNoteEvent(previous)
      if (next.hand === previous.hand) {
        expect(next.note).not.toEqual(previous.note)
      }
    }
  })
})
