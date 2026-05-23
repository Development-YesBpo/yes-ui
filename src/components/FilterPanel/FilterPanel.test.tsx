import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterPanel } from './FilterPanel'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onApply: vi.fn(),
  onClear: vi.fn(),
  children: <p>Contenido del panel</p>,
}

describe('FilterPanel', () => {
  it('renders children when open=true', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument()
  })

  it('renders header title "Filtros avanzados"', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Filtros avanzados')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<FilterPanel {...defaultProps} open={false} />)
    expect(screen.queryByText('Filtros avanzados')).not.toBeInTheDocument()
  })

  it('calls onClose when × close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<FilterPanel {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar filtros' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onApply when Aplicar filtros button is clicked', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<FilterPanel {...defaultProps} onApply={onApply} />)
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onClear when Limpiar button is clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<FilterPanel {...defaultProps} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('renders FilterPanel.Group with label', () => {
    render(
      <FilterPanel {...defaultProps}>
        <FilterPanel.Group label="Estado">
          <span>Activo</span>
        </FilterPanel.Group>
      </FilterPanel>
    )
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('has data-testid on root element', () => {
    render(<FilterPanel {...defaultProps} data-testid="fp" />)
    expect(screen.getByTestId('fp')).toBeInTheDocument()
  })

  it('does not use role="dialog" — it is not a modal', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
