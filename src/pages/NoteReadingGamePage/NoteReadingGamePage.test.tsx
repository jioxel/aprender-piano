import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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
