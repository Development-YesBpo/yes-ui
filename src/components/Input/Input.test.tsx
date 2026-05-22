import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders a labeled text input', () => {
    render(<Input label="Nombre" />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Input label="Teléfono" />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
  })

  it('renders hint text when provided', () => {
    render(<Input label="Nombre" hint="Nombre completo según registro" />)
    expect(screen.getByText('Nombre completo según registro')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(<Input label="Correo" error="Correo electrónico no válido" />)
    expect(screen.getByText('Correo electrónico no válido')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Input label="Correo" error="Error" />)
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without error', () => {
    render(<Input label="Nombre" />)
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'false')
  })

  it('associates error with aria-describedby', () => {
    render(<Input label="Correo" error="Error" />)
    const input = screen.getByLabelText('Correo')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent('Error')
  })

  it('associates hint with aria-describedby', () => {
    render(<Input label="Nombre" hint="Ayuda" />)
    const input = screen.getByLabelText('Nombre')
    const hintId = input.getAttribute('aria-describedby')
    expect(hintId).toBeTruthy()
    expect(document.getElementById(hintId!)).toHaveTextContent('Ayuda')
  })

  it('disables the input when disabled prop is set', () => {
    render(<Input label="Campo" disabled />)
    expect(screen.getByLabelText('Campo')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Input label="Campo" required />)
    expect(screen.getByLabelText('Campo')).toBeRequired()
  })

  it('hides label visually when hideLabel is set', () => {
    render(<Input label="Búsqueda" hideLabel />)
    const label = screen.getByText('Búsqueda')
    expect(label).toHaveClass('srOnly')
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<Input label="Campo" size={size} />)
      expect(screen.getByLabelText('Campo')).toBeInTheDocument()
    }
  )

  it('calls onChange with the new value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Nombre" onChange={onChange} />)
    await user.type(screen.getByLabelText('Nombre'), 'Hola')
    expect(onChange).toHaveBeenCalled()
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Nombre" disabled onChange={onChange} />)
    await user.type(screen.getByLabelText('Nombre'), 'X')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root element', () => {
    render(<Input label="Campo" data-testid="my-input" />)
    expect(screen.getByTestId('my-input')).toBeInTheDocument()
  })

  it('appends className to root wrapper', () => {
    render(<Input label="Campo" className="extra" />)
    expect(screen.getByTestId ? document.querySelector('.extra') : document.querySelector('.extra')).toBeInTheDocument()
  })

  it('forwards name to the input element', () => {
    render(<Input label="Campo" name="customer_name" />)
    expect(screen.getByLabelText('Campo')).toHaveAttribute('name', 'customer_name')
  })

  it('forwards placeholder to the input element', () => {
    render(<Input label="Campo" placeholder="Ej. María González" />)
    expect(screen.getByPlaceholderText('Ej. María González')).toBeInTheDocument()
  })
})
