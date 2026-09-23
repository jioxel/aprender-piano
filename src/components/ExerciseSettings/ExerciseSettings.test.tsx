import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import {
  buildOctave,
  getEnabledClefs,
  getSelectedNotesByHand,
  setEnabledClefs,
  setSelectedNotesForHand,
} from '../../music/exerciseSettings'
import { ExerciseSettings } from './ExerciseSettings'

afterEach(() => {
  setSelectedNotesForHand('right', buildOctave(4))
  setSelectedNotesForHand('left', buildOctave(3))
  setEnabledClefs(['treble', 'bass'])
})

describe('ExerciseSettings clef selection', () => {
  it('starts with both clefs enabled', () => {
    render(<ExerciseSettings />)

    expect(screen.getByRole('checkbox', { name: 'Clave de Sol' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Clave de Fa' })).toBeChecked()
  })

  it('unchecking a clef disables it', async () => {
    const user = userEvent.setup()
    render(<ExerciseSettings />)

    await user.click(screen.getByRole('checkbox', { name: 'Clave de Fa' }))

    expect(getEnabledClefs()).toEqual(['treble'])
  })

  it('disables the checkbox for the only remaining enabled clef, so at least one stays practicable', () => {
    setEnabledClefs(['treble'])
    render(<ExerciseSettings />)

    expect(screen.getByRole('checkbox', { name: 'Clave de Sol' })).toBeDisabled()
  })
})

describe('ExerciseSettings note selection', () => {
  it('renders a checkbox per available note, checked to match the current selection', () => {
    render(<ExerciseSettings />)

    expect(screen.getByRole('checkbox', { name: 'Mano derecha: Do4' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Mano derecha: Do5' })).not.toBeChecked()
  })

  it('checking an individual note in a new octave adds it without removing the rest', async () => {
    const user = userEvent.setup()
    render(<ExerciseSettings />)

    await user.click(screen.getByRole('checkbox', { name: 'Mano derecha: Do5' }))

    expect(getSelectedNotesByHand().right).toContainEqual({ letter: 'C', octave: 5 })
    expect(getSelectedNotesByHand().right).toContainEqual({ letter: 'C', octave: 4 })
  })

  it('the octave checkbox is checked when the whole octave is selected, and selects it all on click', async () => {
    const user = userEvent.setup()
    setSelectedNotesForHand('right', [{ letter: 'C', octave: 4 }])
    render(<ExerciseSettings />)

    const octaveCheckbox = screen.getByRole('checkbox', { name: 'Mano derecha: toda la octava 4' })
    expect(octaveCheckbox).not.toBeChecked()

    await user.click(octaveCheckbox)

    expect(getSelectedNotesByHand().right).toEqual(buildOctave(4))
  })
})
