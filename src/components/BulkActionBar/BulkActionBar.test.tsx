import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BulkActionBar } from './BulkActionBar'

describe('BulkActionBar', () => {
  const actions = [
    { label: 'Asignar campaña', onClick: vi.fn() },
    { label: 'Eliminar', onClick: vi.fn(), danger: true },
  ]

  it('renders count text', () => {
    render(<BulkActionBar count={12} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByText(/12 seleccionados/)).toBeInTheDocument()
  })

  it('renders all action buttons', () => {
    render(<BulkActionBar count={3} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Asignar campaña' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })

  it('calls action onClick exactly once', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <BulkActionBar count={3} actions={[{ label: 'Acción', onClick }]} onClear={vi.fn()} />
    )
    await user.click(screen.getByRole('button', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies danger style to danger actions', () => {
    render(<BulkActionBar count={1} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Eliminar' })).toHaveAttribute(
      'data-danger',
      'true'
    )
  })

  it('renders Limpiar selección button', () => {
    render(<BulkActionBar count={1} actions={[]} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: /limpiar selección/i })).toBeInTheDocument()
  })

  it('calls onClear exactly once', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<BulkActionBar count={1} actions={[]} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: /limpiar selección/i }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('does not render when count is 0', () => {
    const { container } = render(<BulkActionBar count={0} actions={actions} onClear={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('has correct data-testid', () => {
    render(<BulkActionBar count={1} actions={[]} onClear={vi.fn()} data-testid="bulk" />)
    expect(screen.getByTestId('bulk')).toBeInTheDocument()
  })
})
