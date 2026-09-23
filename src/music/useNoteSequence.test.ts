import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useNoteSequence } from './useNoteSequence'
import type { NoteEvent } from './types'

function makeGenerator() {
  let n = 0
  return (): NoteEvent => {
    n += 1
    return { note: { letter: 'C', octave: 4 }, clef: 'treble', hand: 'right', __seq: n } as unknown as NoteEvent
  }
}

describe('useNoteSequence', () => {
  it('starts with one generated note and cannot go previous', () => {
    const { result } = renderHook(() => useNoteSequence(makeGenerator()))
    expect(result.current.current).toBeDefined()
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('generates a new note each time goNext is called at the end of history', () => {
    const { result } = renderHook(() => useNoteSequence(makeGenerator()))
    const first = result.current.current

    act(() => result.current.goNext())
    const second = result.current.current

    expect(second).not.toBe(first)
    expect(result.current.canGoPrevious).toBe(true)
  })

  it('goPrevious replays history instead of generating new notes', () => {
    const { result } = renderHook(() => useNoteSequence(makeGenerator()))
    const first = result.current.current

    act(() => result.current.goNext())
    act(() => result.current.goPrevious())

    expect(result.current.current).toBe(first)
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('does not go before the first note', () => {
    const { result } = renderHook(() => useNoteSequence(makeGenerator()))
    act(() => result.current.goPrevious())
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('going forward again after a previous step replays the same note (no duplicate generation)', () => {
    const { result } = renderHook(() => useNoteSequence(makeGenerator()))
    act(() => result.current.goNext())
    const second = result.current.current
    act(() => result.current.goPrevious())
    act(() => result.current.goNext())

    expect(result.current.current).toBe(second)
  })

  it('passes the previous note to generateNote so it can avoid repeats', () => {
    const generateNote = vi.fn(makeGenerator())
    const { result } = renderHook(() => useNoteSequence(generateNote))
    const first = result.current.current

    act(() => result.current.goNext())

    expect(generateNote).toHaveBeenLastCalledWith(first)
  })
})
