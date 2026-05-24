import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AgentStatusIndicator } from './AgentStatusIndicator'

describe('AgentStatusIndicator', () => {
  it('renders without crashing', () => {
    render(<AgentStatusIndicator status="disponible" data-testid="asi" />)
    expect(screen.getByTestId('asi')).toBeInTheDocument()
  })

  it.each(['disponible', 'ocupado', 'en-llamada', 'descanso', 'desconectado'] as const)(
    'renders %s status without crashing',
    (status) => {
      render(<AgentStatusIndicator status={status} data-testid={`asi-${status}`} />)
      expect(screen.getByTestId(`asi-${status}`)).toBeInTheDocument()
    }
  )

  it('shows label by default', () => {
    render(<AgentStatusIndicator status="disponible" />)
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('shows correct label for ocupado', () => {
    render(<AgentStatusIndicator status="ocupado" />)
    expect(screen.getByText('Ocupado')).toBeInTheDocument()
  })

  it('shows correct label for en-llamada', () => {
    render(<AgentStatusIndicator status="en-llamada" />)
    expect(screen.getByText('En llamada')).toBeInTheDocument()
  })

  it('shows correct label for descanso', () => {
    render(<AgentStatusIndicator status="descanso" />)
    expect(screen.getByText('Descanso')).toBeInTheDocument()
  })

  it('shows correct label for desconectado', () => {
    render(<AgentStatusIndicator status="desconectado" />)
    expect(screen.getByText('Desconectado')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<AgentStatusIndicator status="disponible" showLabel={false} />)
    expect(screen.queryByText('Disponible')).not.toBeInTheDocument()
  })

  it('applies sm size class', () => {
    render(<AgentStatusIndicator status="disponible" size="sm" data-testid="asi" />)
    const el = screen.getByTestId('asi')
    expect(el.className).toMatch(/sm/)
  })

  it('applies md size by default', () => {
    render(<AgentStatusIndicator status="disponible" data-testid="asi" />)
    const el = screen.getByTestId('asi')
    expect(el.className).toMatch(/md/)
  })

  it('passes data-testid to root', () => {
    render(<AgentStatusIndicator status="ocupado" data-testid="my-asi" />)
    expect(screen.getByTestId('my-asi')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AgentStatusIndicator status="disponible" className="custom" data-testid="asi" />)
    expect(screen.getByTestId('asi')).toHaveClass('custom')
  })
})
