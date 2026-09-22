import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LevelsPage } from './LevelsPage'

describe('LevelsPage', () => {
  it('shows Nivel 1 as an active link', () => {
    render(
      <MemoryRouter>
        <LevelsPage />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /Nivel 1/i })
    expect(link).toHaveAttribute('href', '/nivel/nivel-1')
  })

  it('shows other levels as disabled (not links)', () => {
    render(
      <MemoryRouter>
        <LevelsPage />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link', { name: /Nivel 2/i })).not.toBeInTheDocument()
    expect(screen.getByText('Nivel 2')).toBeInTheDocument()
  })
})
