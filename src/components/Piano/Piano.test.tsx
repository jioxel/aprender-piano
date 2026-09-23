import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Piano } from './Piano'

describe('Piano', () => {
  it('renders one octave of natural note keys, labeled in Spanish', () => {
    render(<Piano onKeyPress={vi.fn()} feedback={null} />)

    for (const label of ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('calls onKeyPress with the pressed note letter', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    render(<Piano onKeyPress={onKeyPress} feedback={null} />)

    await user.click(screen.getByRole('button', { name: 'Sol' }))

    expect(onKeyPress).toHaveBeenCalledWith('G')
  })

  it('marks the fed-back key as correct or incorrect', () => {
    const { rerender } = render(<Piano onKeyPress={vi.fn()} feedback={{ letter: 'C', correct: true }} />)
    expect(screen.getByRole('button', { name: 'Do' })).toHaveAttribute('data-feedback', 'correct')

    rerender(<Piano onKeyPress={vi.fn()} feedback={{ letter: 'C', correct: false }} />)
    expect(screen.getByRole('button', { name: 'Do' })).toHaveAttribute('data-feedback', 'incorrect')
  })

  it('leaves keys unmarked when there is no feedback', () => {
    render(<Piano onKeyPress={vi.fn()} feedback={null} />)

    expect(screen.getByRole('button', { name: 'Do' })).not.toHaveAttribute('data-feedback')
  })
})
