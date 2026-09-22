import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders the label and reflects the checked state', () => {
    render(<Switch id="s1" checked={false} onChange={vi.fn()} label="Mostrar nombre" />)
    const input = screen.getByRole('switch', { name: 'Mostrar nombre' })
    expect(input).not.toBeChecked()
  })

  it('calls onChange with the new value when toggled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch id="s2" checked={false} onChange={onChange} label="Mostrar nombre" />)

    await user.click(screen.getByRole('switch', { name: 'Mostrar nombre' }))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
