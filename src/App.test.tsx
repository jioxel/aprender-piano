import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App navigation', () => {
  it('navigates from levels to games to the note-reading game', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /Nivel 1/i }))
    expect(await screen.findByRole('link', { name: /Lectura de notas/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Lectura de notas/i }))
    expect(await screen.findByRole('heading', { name: /Lectura de notas/i })).toBeInTheDocument()
  })
})
