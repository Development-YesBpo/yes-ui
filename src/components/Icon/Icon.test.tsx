import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { X } from 'lucide-react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders an svg element', () => {
    render(<Icon icon={X} aria-label="Cerrar" />)
    expect(screen.getByRole('img', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('applies aria-hidden when no aria-label provided', () => {
    const { container } = render(<Icon icon={X} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('passes data-testid to the svg', () => {
    render(<Icon icon={X} aria-label="test" data-testid="my-icon" />)
    expect(screen.getByTestId('my-icon')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    render(<Icon icon={X} size={24} aria-label="test" />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('applies custom className', () => {
    render(<Icon icon={X} aria-label="test" className="custom" />)
    expect(screen.getByRole('img')).toHaveClass('custom')
  })
})
