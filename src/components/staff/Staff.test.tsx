import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Staff } from './Staff'

describe('Staff', () => {
  it('renders exactly 5 staff lines', () => {
    const { container } = render(<Staff clef="treble" note={{ letter: 'E', octave: 4 }} />)
    expect(container.querySelectorAll('.staff-lines line')).toHaveLength(5)
  })

  it('exposes an accessible label with the clef and note name', () => {
    render(<Staff clef="bass" note={{ letter: 'G', octave: 3 }} />)
    expect(screen.getByRole('img', { name: /Clave de Fa, nota G3/i })).toBeInTheDocument()
  })

  it('draws a ledger line for middle C in treble clef', () => {
    const { container } = render(<Staff clef="treble" note={{ letter: 'C', octave: 4 }} />)
    expect(container.querySelectorAll('.note-head line')).toHaveLength(2) // 1 ledger + 1 stem
  })
})
