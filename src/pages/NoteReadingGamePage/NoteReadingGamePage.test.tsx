import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildOctave, setEnabledClefs, setSelectedNotesForHand } from '../../music/exerciseSettings'
import { NoteReadingGamePage } from './NoteReadingGamePage'

describe('NoteReadingGamePage', () => {
  it('renders a staff and disables the previous arrow at the start', () => {
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('img', { name: /Clave de/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nota anterior' })).toBeDisabled()
  })

  it('shows a new note (or hand/clef hint) after clicking next', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )

    const nextButton = screen.getByRole('button', { name: 'Nota siguiente' })
    await user.click(nextButton)

    expect(screen.getByRole('button', { name: 'Nota anterior' })).toBeEnabled()
  })

  it('reveals the note name only when the switch is turned on', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )

    expect(screen.queryByText(/Español:/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Mostrar nombre de la nota' }))
    expect(screen.getByText(/Español:/)).toBeInTheDocument()
    expect(screen.getByText(/Inglés:/)).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Mostrar nombre de la nota' }))
    expect(screen.queryByText(/Español:/)).not.toBeInTheDocument()
  })
})

describe('NoteReadingGamePage piano practice', () => {
  beforeEach(() => {
    // Pin the exercise to a single, known note so the piano's "correct key" is predictable.
    setEnabledClefs(['treble'])
    setSelectedNotesForHand('right', [{ letter: 'C', octave: 4 }])
  })

  afterEach(() => {
    setEnabledClefs(['treble', 'bass'])
    setSelectedNotesForHand('right', buildOctave(4))
    setSelectedNotesForHand('left', buildOctave(3))
  })

  it('is hidden until the "Practicar con el piano" switch is turned on', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('group', { name: 'Teclado de piano' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Practicar con el piano' }))
    expect(screen.getByRole('group', { name: 'Teclado de piano' })).toBeInTheDocument()
  })

  it('marks the correct key and advances to the next note after a short delay', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('switch', { name: 'Practicar con el piano' }))

    fireEvent.click(screen.getByRole('button', { name: 'Do' }))
    expect(screen.getByRole('button', { name: 'Do' })).toHaveAttribute('data-feedback', 'correct')
    expect(screen.getByRole('button', { name: 'Nota anterior' })).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(screen.getByRole('button', { name: 'Nota anterior' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Do' })).not.toHaveAttribute('data-feedback')

    vi.useRealTimers()
  })

  it('marks a wrong key as incorrect without advancing', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <NoteReadingGamePage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('switch', { name: 'Practicar con el piano' }))

    fireEvent.click(screen.getByRole('button', { name: 'Re' }))
    expect(screen.getByRole('button', { name: 'Re' })).toHaveAttribute('data-feedback', 'incorrect')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(screen.getByRole('button', { name: 'Nota anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Re' })).not.toHaveAttribute('data-feedback')

    vi.useRealTimers()
  })
})
