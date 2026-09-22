import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ArrowNav } from './ArrowNav'

describe('ArrowNav', () => {
  it('calls onNext and onPrevious when clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    const onPrevious = vi.fn()

    render(<ArrowNav onNext={onNext} onPrevious={onPrevious} />)

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    await user.click(screen.getByRole('button', { name: 'Anterior' }))

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrevious).toHaveBeenCalledTimes(1)
  })

  it('disables the previous button when canGoPrevious is false', () => {
    render(<ArrowNav onNext={vi.fn()} onPrevious={vi.fn()} canGoPrevious={false} />)
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled()
  })
})
