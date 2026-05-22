import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders a switch role element', () => {
    render(<Toggle label="Notificaciones" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders the label text', () => {
    render(<Toggle label="Recibir alertas en tiempo real" />)
    expect(screen.getByText('Recibir alertas en tiempo real')).toBeInTheDocument()
  })

  it('is off by default', () => {
    render(<Toggle label="Activar" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('is on when defaultChecked is true', () => {
    render(<Toggle label="Activar" defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects controlled checked state', () => {
    render(<Toggle label="Activar" checked onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" disabled onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    screen.getByRole('switch').focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('activates on Enter key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    screen.getByRole('switch').focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Toggle label="Activar" disabled />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true')
  })

  it('toggles from off to on on click (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Toggle label="Activar" />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await user.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards name to the underlying hidden input', () => {
    render(<Toggle label="Activar" name="notificaciones" />)
    expect(document.querySelector('input[name="notificaciones"]')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<Toggle label="Activar" data-testid="tgl-notif" />)
    expect(screen.getByTestId('tgl-notif')).toBeInTheDocument()
  })
})
