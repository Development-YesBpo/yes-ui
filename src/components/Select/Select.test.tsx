import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './Select'

const options = [
  { value: 'contactado', label: 'Contactado' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'promesa', label: 'Promesa de pago' },
]

describe('Select', () => {
  it('renders a labeled select', () => {
    render(<Select label="Estado" options={options} />)
    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
  })

  it('renders all option labels', () => {
    render(<Select label="Estado" options={options} />)
    expect(screen.getByRole('option', { name: 'Contactado' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'No contesta' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Promesa de pago' })).toBeInTheDocument()
  })

  it('renders a placeholder option when provided', () => {
    render(<Select label="Estado" options={options} placeholder="Selecciona una opción" />)
    expect(screen.getByRole('option', { name: 'Selecciona una opción' })).toBeInTheDocument()
  })

  it('placeholder option is disabled and selected by default', () => {
    render(<Select label="Estado" options={options} placeholder="Selecciona" />)
    const placeholder = screen.getByRole('option', { name: 'Selecciona' }) as HTMLOptionElement
    expect(placeholder.disabled).toBe(true)
    expect(placeholder.selected).toBe(true)
  })

  it('renders hint text', () => {
    render(<Select label="Estado" options={options} hint="Elige el estado actual" />)
    expect(screen.getByText('Elige el estado actual')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Select label="Estado" options={options} error="Selección requerida" />)
    expect(screen.getByText('Selección requerida')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Select label="Estado" options={options} error="Error" />)
    expect(screen.getByLabelText('Estado')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the select when disabled prop is set', () => {
    render(<Select label="Estado" options={options} disabled />)
    expect(screen.getByLabelText('Estado')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Select label="Estado" options={options} required />)
    expect(screen.getByLabelText('Estado')).toBeRequired()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<Select label="Estado" options={options} size={size} />)
      expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    }
  )

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Estado" options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByLabelText('Estado'), 'promesa')
    expect(onChange).toHaveBeenCalled()
  })

  it('passes name to the select element', () => {
    render(<Select label="Estado" options={options} name="gestion_estado" />)
    expect(screen.getByLabelText('Estado')).toHaveAttribute('name', 'gestion_estado')
  })

  it('passes data-testid to root element', () => {
    render(<Select label="Estado" options={options} data-testid="sel-estado" />)
    expect(screen.getByTestId('sel-estado')).toBeInTheDocument()
  })
})
