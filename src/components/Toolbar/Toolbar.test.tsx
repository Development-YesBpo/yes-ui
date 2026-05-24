import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toolbar } from './Toolbar'

describe('Toolbar', () => {
  it('renders search input', () => {
    render(<Toolbar value="" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('calls onChange when search input changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toolbar value="" onChange={onChange} />)
    await user.type(screen.getByRole('searchbox'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders filter button when onFilterClick provided', () => {
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument()
  })

  it('calls onFilterClick exactly once', async () => {
    const user = userEvent.setup()
    const onFilterClick = vi.fn()
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={onFilterClick} />)
    await user.click(screen.getByRole('button', { name: /filtrar/i }))
    expect(onFilterClick).toHaveBeenCalledTimes(1)
  })

  it('shows filter count badge when filterCount > 0', () => {
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={vi.fn()} filterCount={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders active filter chips', () => {
    const filters = [{ key: 'estado', label: 'Estado: Activo' }]
    render(<Toolbar value="" onChange={vi.fn()} activeFilters={filters} onDismissFilter={vi.fn()} />)
    expect(screen.getByText('Estado: Activo')).toBeInTheDocument()
  })

  it('calls onDismissFilter with correct key', async () => {
    const user = userEvent.setup()
    const onDismissFilter = vi.fn()
    const filters = [{ key: 'estado', label: 'Estado: Activo' }]
    render(<Toolbar value="" onChange={vi.fn()} activeFilters={filters} onDismissFilter={onDismissFilter} />)
    await user.click(screen.getByRole('button', { name: /eliminar filtro/i }))
    expect(onDismissFilter).toHaveBeenCalledWith('estado')
  })

  it('renders right-side actions slot', () => {
    render(<Toolbar value="" onChange={vi.fn()} actions={<button type="button">Exportar</button>} />)
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument()
  })
})
