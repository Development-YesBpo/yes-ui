import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Contenido</Card>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(<Card header="Título">Cuerpo</Card>)
    expect(screen.getByText('Título')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Card footer={<button type="button">Acción</button>}>Cuerpo</Card>)
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument()
  })

  it('does not render header section when header omitted', () => {
    const { container } = render(<Card>Cuerpo</Card>)
    expect(container.querySelector('[data-section="header"]')).toBeNull()
  })

  it('applies interactive class when interactive prop set', () => {
    const { container } = render(<Card interactive>Cuerpo</Card>)
    expect(container.firstChild).toHaveAttribute('data-interactive', 'true')
  })

  it('fires onClick when interactive and clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card interactive onClick={onClick}>Cuerpo</Card>)
    await user.click(screen.getByText('Cuerpo'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards data-testid to root', () => {
    render(<Card data-testid="my-card">Cuerpo</Card>)
    expect(screen.getByTestId('my-card')).toBeInTheDocument()
  })
})
