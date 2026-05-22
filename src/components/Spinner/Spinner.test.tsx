import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with default testid', () => {
    render(<Spinner data-testid="spinner" />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('has role="status" for screen readers', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Cargando')
  })

  it('applies sm size class', () => {
    render(<Spinner size="sm" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/sm/)
  })

  it('applies md size by default', () => {
    render(<Spinner data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/md/)
  })

  it('applies lg size class', () => {
    render(<Spinner size="lg" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/lg/)
  })

  it('applies custom className', () => {
    render(<Spinner className="custom" data-testid="s" />)
    expect(screen.getByTestId('s')).toHaveClass('custom')
  })
})
