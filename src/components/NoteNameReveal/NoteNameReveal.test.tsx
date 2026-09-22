import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoteNameReveal } from './NoteNameReveal'

describe('NoteNameReveal', () => {
  it('shows both the Spanish and English note names', () => {
    render(<NoteNameReveal note={{ letter: 'F', octave: 3 }} />)
    expect(screen.getByText('Fa3')).toBeInTheDocument()
    expect(screen.getByText('F3')).toBeInTheDocument()
  })
})
