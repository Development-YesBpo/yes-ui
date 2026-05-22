import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge variant="success">Activo</Badge>)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it.each(['success', 'error', 'warning', 'info', 'neutral', 'blue'] as const)(
    'renders %s variant without crashing',
    (variant) => {
      render(<Badge variant={variant}>Estado</Badge>)
      expect(screen.getByText('Estado')).toBeInTheDocument()
    }
  )

  it('renders dot by default', () => {
    render(<Badge variant="success" data-testid="badge">Activo</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge.querySelector('[data-dot]')).toBeInTheDocument()
  })

  it('hides dot when showDot is false', () => {
    render(<Badge variant="success" showDot={false} data-testid="badge">Activo</Badge>)
    expect(screen.getByTestId('badge').querySelector('[data-dot]')).not.toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<Badge variant="info" data-testid="my-badge">En proceso</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge variant="neutral" className="custom">Pausado</Badge>)
    expect(screen.getByText('Pausado').closest('span')).toHaveClass('custom')
  })
})
