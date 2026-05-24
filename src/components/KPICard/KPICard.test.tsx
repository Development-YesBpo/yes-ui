import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrendingUp } from 'lucide-react'
import { KPICard } from './KPICard'

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Contactos hoy" value="1.248" />)
    expect(screen.getByText('Contactos hoy')).toBeInTheDocument()
    expect(screen.getByText('1.248')).toBeInTheDocument()
  })

  it('renders delta when provided', () => {
    render(<KPICard label="Ventas" value="$920k" delta="+12%" deltaLabel="vs. ayer" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs. ayer')).toBeInTheDocument()
  })

  it('does not render delta section when delta omitted', () => {
    const { container } = render(<KPICard label="Total" value="0" />)
    expect(container.querySelector('[data-section="delta"]')).toBeNull()
  })

  it('renders icon when provided', () => {
    render(<KPICard label="Total" value="100" icon={TrendingUp} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('applies color prop to value', () => {
    const { container } = render(<KPICard label="Total" value="100" color="#2B52A0" />)
    expect(container.querySelector('[data-section="value"]')).toHaveStyle({ color: '#2B52A0' })
  })

  it('has correct data-testid', () => {
    render(<KPICard label="Test" value="0" data-testid="kpi-test" />)
    expect(screen.getByTestId('kpi-test')).toBeInTheDocument()
  })
})
