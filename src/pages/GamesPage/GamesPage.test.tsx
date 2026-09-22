import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { GamesPage } from './GamesPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/nivel/:levelId" element={<GamesPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GamesPage', () => {
  it('lists the note-reading game for nivel-1', () => {
    renderAt('/nivel/nivel-1')
    const link = screen.getByRole('link', { name: /Lectura de notas/i })
    expect(link).toHaveAttribute('href', '/nivel/nivel-1/juego/lectura-notas')
  })

  it('shows a not-found message for an unknown level', () => {
    renderAt('/nivel/no-existe')
    expect(screen.getByText(/Nivel no encontrado/i)).toBeInTheDocument()
  })
})
