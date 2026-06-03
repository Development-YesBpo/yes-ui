import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatStrip } from './StatStrip'

const ITEMS = [
  { label: 'Agentes activos', value: '84' },
  { label: 'En cola',         value: '12' },
  { label: 'Nivel servicio',  value: '82%' },
  { label: 'Abandono',        value: '8.2%' },
  { label: 'AHT',             value: '4:23', unit: 'min' },
]

describe('StatStrip', () => {
  it('renders all item values', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('renders all item labels', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('Agentes activos')).toBeInTheDocument()
    expect(screen.getByText('En cola')).toBeInTheDocument()
    expect(screen.getByText('Nivel servicio')).toBeInTheDocument()
  })

  it('renders unit when provided', () => {
    render(<StatStrip items={ITEMS} />)
    expect(screen.getByText('min')).toBeInTheDocument()
  })

  it('forwards data-testid to the root element', () => {
    render(<StatStrip items={ITEMS} data-testid="strip" />)
    expect(screen.getByTestId('strip')).toBeInTheDocument()
  })

  it('applies className to the root element', () => {
    render(<StatStrip items={ITEMS} className="custom-class" data-testid="strip" />)
    expect(screen.getByTestId('strip')).toHaveClass('custom-class')
  })
})
