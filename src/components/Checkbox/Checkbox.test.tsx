import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders a labeled checkbox', () => {
    render(<Checkbox label="Seleccionar fila" />)
    expect(screen.getByLabelText('Seleccionar fila')).toBeInTheDocument()
  })

  it('renders as an input[type=checkbox]', () => {
    render(<Checkbox label="Opción" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('type', 'checkbox')
  })

  it('is unchecked by default', () => {
    render(<Checkbox label="Opción" />)
    expect(screen.getByLabelText('Opción')).not.toBeChecked()
  })

  it('renders checked when defaultChecked is set', () => {
    render(<Checkbox label="Opción" defaultChecked />)
    expect(screen.getByLabelText('Opción')).toBeChecked()
  })

  it('renders checked when checked prop is true', () => {
    render(<Checkbox label="Opción" checked onChange={() => {}} />)
    expect(screen.getByLabelText('Opción')).toBeChecked()
  })

  it('is unchecked when checked prop is false', () => {
    render(<Checkbox label="Opción" checked={false} onChange={() => {}} />)
    expect(screen.getByLabelText('Opción')).not.toBeChecked()
  })

  it('sets indeterminate via ref when indeterminate prop is true', () => {
    render(<Checkbox label="Seleccionar todo" indeterminate />)
    const cb = screen.getByLabelText('Seleccionar todo') as HTMLInputElement
    expect(cb.indeterminate).toBe(true)
  })

  it('clears indeterminate when indeterminate prop is false', () => {
    const { rerender } = render(<Checkbox label="Opción" indeterminate />)
    rerender(<Checkbox label="Opción" indeterminate={false} />)
    const cb = screen.getByLabelText('Opción') as HTMLInputElement
    expect(cb.indeterminate).toBe(false)
  })

  it('disables the checkbox when disabled prop is set', () => {
    render(<Checkbox label="Opción" disabled />)
    expect(screen.getByLabelText('Opción')).toBeDisabled()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" onChange={onChange} />)
    await user.click(screen.getByLabelText('Opción'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" disabled onChange={onChange} />)
    await user.click(screen.getByLabelText('Opción'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" onChange={onChange} />)
    screen.getByLabelText('Opción').focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders hint text', () => {
    render(<Checkbox label="Acepto términos" hint="Lee los términos antes de aceptar" />)
    expect(screen.getByText('Lee los términos antes de aceptar')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Checkbox label="Acepto términos" error="Debes aceptar los términos" />)
    expect(screen.getByText('Debes aceptar los términos')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Checkbox label="Opción" error="Error" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards name to the input element', () => {
    render(<Checkbox label="Opción" name="acepto" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('name', 'acepto')
  })

  it('passes data-testid to root element', () => {
    render(<Checkbox label="Opción" data-testid="cb-acepto" />)
    expect(screen.getByTestId('cb-acepto')).toBeInTheDocument()
  })
})
