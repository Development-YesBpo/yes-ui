import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="Contactos" />)
    expect(screen.getByRole('heading', { name: 'Contactos' })).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Contactos" subtitle="248 registros" />)
    expect(screen.getByText('248 registros')).toBeInTheDocument()
  })

  it('does not render subtitle when omitted', () => {
    const { queryByTestId } = render(<PageHeader title="Contactos" />)
    expect(queryByTestId('ph-subtitle')).toBeNull()
  })

  it('renders breadcrumb links', () => {
    render(
      <PageHeader
        title="Contactos"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Contactos', href: '/contactos' },
          { label: 'Carlos Rodríguez' },
        ]}
      />
    )
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contactos' })).toHaveAttribute('href', '/contactos')
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders last breadcrumb as plain text (no href)', () => {
    render(
      <PageHeader
        title="Detalle"
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Detalle' }]}
      />
    )
    const spans = screen.queryAllByRole('link', { name: 'Detalle' })
    expect(spans).toHaveLength(0)
  })

  it('renders actions slot', () => {
    render(
      <PageHeader
        title="Contactos"
        actions={<button>+ Nuevo contacto</button>}
      />
    )
    expect(screen.getByRole('button', { name: '+ Nuevo contacto' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<PageHeader title="T" data-testid="ph-root" />)
    expect(screen.getByTestId('ph-root')).toBeInTheDocument()
  })
})
