import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders a labeled search input', () => {
    render(<SearchInput label="Buscar contacto" />)
    expect(screen.getByLabelText('Buscar contacto')).toBeInTheDocument()
  })

  it('renders input with type=search', () => {
    render(<SearchInput label="Buscar" />)
    expect(screen.getByLabelText('Buscar')).toHaveAttribute('type', 'search')
  })

  it('renders a search icon', () => {
    render(<SearchInput label="Buscar" />)
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput label="Buscar" value="" onClear={() => {}} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument()
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchInput label="Buscar" value="Carlos" onClear={() => {}} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchInput label="Buscar" value="Carlos" onClear={onClear} onChange={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput label="Buscar" onChange={onChange} />)
    await user.type(screen.getByLabelText('Buscar'), 'test')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders hint text', () => {
    render(<SearchInput label="Buscar" hint="Nombre, teléfono o ID" />)
    expect(screen.getByText('Nombre, teléfono o ID')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<SearchInput label="Buscar" error="Búsqueda inválida" />)
    expect(screen.getByText('Búsqueda inválida')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<SearchInput label="Buscar" error="Error" />)
    expect(screen.getByLabelText('Buscar')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the input when disabled prop is set', () => {
    render(<SearchInput label="Buscar" disabled />)
    expect(screen.getByLabelText('Buscar')).toBeDisabled()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<SearchInput label="Buscar" size={size} />)
      expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
    }
  )

  it('passes data-testid to root element', () => {
    render(<SearchInput label="Buscar" data-testid="search-field" />)
    expect(screen.getByTestId('search-field')).toBeInTheDocument()
  })

  it('forwards placeholder to the input', () => {
    render(<SearchInput label="Buscar" placeholder="Nombre, teléfono o ID…" />)
    expect(screen.getByPlaceholderText('Nombre, teléfono o ID…')).toBeInTheDocument()
  })

  it('does not show clear button when disabled even with value', () => {
    render(<SearchInput label="Buscar" value="Carlos" disabled onClear={() => {}} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument()
  })
})
