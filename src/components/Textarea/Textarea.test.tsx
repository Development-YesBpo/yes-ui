import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a labeled textarea', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toBeInTheDocument()
  })

  it('renders the textarea as a textarea element', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones').tagName).toBe('TEXTAREA')
  })

  it('renders hint text', () => {
    render(<Textarea label="Observaciones" hint="Máximo 500 caracteres" />)
    expect(screen.getByText('Máximo 500 caracteres')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Textarea label="Observaciones" error="Campo requerido" />)
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Textarea label="Observaciones" error="Error" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without error', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('aria-invalid', 'false')
  })

  it('disables the textarea when disabled prop is set', () => {
    render(<Textarea label="Observaciones" disabled />)
    expect(screen.getByLabelText('Observaciones')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Textarea label="Observaciones" required />)
    expect(screen.getByLabelText('Observaciones')).toBeRequired()
  })

  it('hides label visually when hideLabel is set', () => {
    render(<Textarea label="Notas" hideLabel />)
    expect(screen.getByText('Notas')).toHaveClass('srOnly')
  })

  it('forwards name to the textarea element', () => {
    render(<Textarea label="Observaciones" name="observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('name', 'observaciones')
  })

  it('forwards placeholder to the textarea element', () => {
    render(<Textarea label="Observaciones" placeholder="Escribe aquí las notas de la llamada…" />)
    expect(screen.getByPlaceholderText('Escribe aquí las notas de la llamada…')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Observaciones" onChange={onChange} />)
    await user.type(screen.getByLabelText('Observaciones'), 'Nota')
    expect(onChange).toHaveBeenCalled()
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Observaciones" disabled onChange={onChange} />)
    await user.type(screen.getByLabelText('Observaciones'), 'X')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root element', () => {
    render(<Textarea label="Observaciones" data-testid="ta-obs" />)
    expect(screen.getByTestId('ta-obs')).toBeInTheDocument()
  })

  it('associates error with aria-describedby', () => {
    render(<Textarea label="Observaciones" error="Error" />)
    const ta = screen.getByLabelText('Observaciones')
    const errorId = ta.getAttribute('aria-describedby')
    expect(document.getElementById(errorId!)).toHaveTextContent('Error')
  })
})
