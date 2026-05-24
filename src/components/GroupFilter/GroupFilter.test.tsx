import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GroupFilter } from './GroupFilter'

describe('GroupFilter', () => {
  it('renders children', () => {
    render(
      <GroupFilter onApply={vi.fn()} onClear={vi.fn()}>
        <input placeholder="Buscar" />
      </GroupFilter>
    )
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument()
  })

  it('renders Aplicar and Limpiar buttons', () => {
    render(
      <GroupFilter onApply={vi.fn()} onClear={vi.fn()}>
        <span />
      </GroupFilter>
    )
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument()
  })

  it('calls onApply exactly once on Aplicar click', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(
      <GroupFilter onApply={onApply} onClear={vi.fn()}>
        <span />
      </GroupFilter>
    )
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onClear exactly once on Limpiar click', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(
      <GroupFilter onApply={vi.fn()} onClear={onClear}>
        <span />
      </GroupFilter>
    )
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('forwards data-testid to root', () => {
    render(
      <GroupFilter onApply={vi.fn()} onClear={vi.fn()} data-testid="gf">
        <span />
      </GroupFilter>
    )
    expect(screen.getByTestId('gf')).toBeInTheDocument()
  })
})
