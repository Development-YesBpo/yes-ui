import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Inbox } from 'lucide-react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Sin contactos" />)
    expect(screen.getByRole('heading', { name: 'Sin contactos' })).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Sin resultados" description="Intenta con otro filtro." />)
    expect(screen.getByText('Intenta con otro filtro.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<EmptyState title="Sin datos" />)
    expect(screen.queryByText(/intenta/i)).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Sin datos" icon={Inbox} data-testid="es" />)
    const root = screen.getByTestId('es')
    expect(root.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render icon section when icon omitted', () => {
    render(<EmptyState title="Sin datos" data-testid="es" />)
    const root = screen.getByTestId('es')
    expect(root.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders action button when action provided', () => {
    render(
      <EmptyState
        title="Sin contactos"
        action={{ label: 'Importar contactos', onClick: () => {} }}
      />
    )
    expect(screen.getByRole('button', { name: 'Importar contactos' })).toBeInTheDocument()
  })

  it('does not render action button when action omitted', () => {
    render(<EmptyState title="Sin datos" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls action.onClick when button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <EmptyState
        title="Sin contactos"
        action={{ label: 'Importar', onClick }}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Importar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes data-testid to root element', () => {
    render(<EmptyState title="Sin datos" data-testid="my-empty" />)
    expect(screen.getByTestId('my-empty')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<EmptyState title="Sin datos" className="extra" data-testid="my-empty" />)
    expect(screen.getByTestId('my-empty')).toHaveClass('extra')
  })
})
