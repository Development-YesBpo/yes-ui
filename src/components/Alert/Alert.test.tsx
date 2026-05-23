import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders title', () => {
    render(<Alert variant="success" title="Operación completada" />)
    expect(screen.getByText('Operación completada')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Alert variant="info" title="Info" description="Más detalles aquí" />)
    expect(screen.getByText('Más detalles aquí')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    const { container } = render(<Alert variant="success" title="Solo título" />)
    // Only the title <p> should exist — no description <p>
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'renders %s variant without crashing',
    (variant) => {
      render(<Alert variant={variant} title="Prueba" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    }
  )

  it('has role="alert" for screen readers', () => {
    render(<Alert variant="warning" title="Advertencia" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders dismiss button when onDismiss provided', () => {
    const onDismiss = vi.fn()
    render(<Alert variant="success" title="Éxito" onDismiss={onDismiss} />)
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('does not render dismiss button when onDismiss omitted', () => {
    render(<Alert variant="success" title="Éxito" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert variant="error" title="Error" onDismiss={onDismiss} />)
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('passes data-testid to root element', () => {
    render(<Alert variant="info" title="Info" data-testid="my-alert" />)
    expect(screen.getByTestId('my-alert')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Alert variant="warning" title="Advertencia" className="extra" />)
    expect(screen.getByRole('alert')).toHaveClass('extra')
  })
})
