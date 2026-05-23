import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders without crashing', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('defaults to 100% width and 16px height', () => {
    render(<Skeleton data-testid="sk" />)
    const el = screen.getByTestId('sk')
    expect(el).toHaveStyle({ width: '100%', height: '16px' })
  })

  it('accepts custom width as string', () => {
    render(<Skeleton width="200px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ width: '200px' })
  })

  it('accepts custom width as number (converts to px)', () => {
    render(<Skeleton width={120} data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ width: '120px' })
  })

  it('accepts custom height as string', () => {
    render(<Skeleton height="48px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ height: '48px' })
  })

  it('accepts custom height as number', () => {
    render(<Skeleton height={32} data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ height: '32px' })
  })

  it('accepts custom borderRadius', () => {
    render(<Skeleton borderRadius="9999px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ borderRadius: '9999px' })
  })

  it('applies custom className', () => {
    render(<Skeleton className="extra" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveClass('extra')
  })

  it('has aria-hidden to exclude from screen readers', () => {
    render(<Skeleton data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true')
  })
})
