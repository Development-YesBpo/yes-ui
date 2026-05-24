import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Widget } from './Widget'

describe('Widget', () => {
  it('renders title', () => {
    render(
      <Widget title="Resumen semanal">
        <p>contenido</p>
      </Widget>
    )
    expect(screen.getByText('Resumen semanal')).toBeInTheDocument()
  })

  it('renders children in body', () => {
    render(
      <Widget title="Test">
        <span data-testid="body">cuerpo</span>
      </Widget>
    )
    expect(screen.getByTestId('body')).toBeInTheDocument()
  })

  it('renders action button when action provided', () => {
    render(
      <Widget title="Test" action={<button type="button">Ver todo</button>}>
        <p>x</p>
      </Widget>
    )
    expect(screen.getByRole('button', { name: 'Ver todo' })).toBeInTheDocument()
  })

  it('does not render action area when action omitted', () => {
    const { container } = render(
      <Widget title="Test">
        <p>x</p>
      </Widget>
    )
    expect(container.querySelector('[data-section="action"]')).toBeNull()
  })

  it('applies style prop to root', () => {
    const { container } = render(
      <Widget title="Test" style={{ width: 300 }}>
        <p>x</p>
      </Widget>
    )
    expect(container.firstChild).toHaveStyle({ width: '300px' })
  })
})
