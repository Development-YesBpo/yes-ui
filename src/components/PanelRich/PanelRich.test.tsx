import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PanelRich } from './PanelRich'

const defaultContact = {
  name: 'Carlos Rodríguez',
  role: 'Cliente Premium',
  status: 'success' as const,
  fields: [
    { label: 'Teléfono', value: '+57 310 555 0123' },
    { label: 'Correo', value: 'carlos@example.com' },
    { label: 'Empresa', value: 'ABC Ltda' },
  ],
}

const defaultHistory = [
  { date: '21 may 2026 · 09:42', action: 'Llamada saliente — Contactado' },
  { date: '19 may 2026 · 14:10', action: 'Mensaje WhatsApp enviado' },
]

describe('PanelRich', () => {
  it('renders contact name', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders contact role when provided', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Cliente Premium')).toBeInTheDocument()
  })

  it('renders info tab by default', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('+57 310 555 0123')).toBeInTheDocument()
  })

  it('renders all info fields in info tab', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Empresa')).toBeInTheDocument()
  })

  it('renders historial tab content when historial tab is clicked', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={defaultHistory} />)
    const historialTab = screen.getByRole('tab', { name: /historial/i })
    await user.click(historialTab)
    expect(screen.getByText('Llamada saliente — Contactado')).toBeInTheDocument()
  })

  it('renders notas tab with textarea when notas tab is clicked', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} />)
    const notasTab = screen.getByRole('tab', { name: /notas/i })
    await user.click(notasTab)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('switching tabs hides previous tab content', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={defaultHistory} />)
    // Info tab is default — Teléfono visible
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    // Switch to historial
    await user.click(screen.getByRole('tab', { name: /historial/i }))
    expect(screen.queryByText('Teléfono')).not.toBeInTheDocument()
    expect(screen.getByText('Llamada saliente — Contactado')).toBeInTheDocument()
  })

  it('calls onSaveNote with the typed text when save button is clicked', async () => {
    const user = userEvent.setup()
    const onSaveNote = vi.fn()
    render(<PanelRich contact={defaultContact} onSaveNote={onSaveNote} />)
    await user.click(screen.getByRole('tab', { name: /notas/i }))
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Cliente interesado en el plan empresarial')
    await user.click(screen.getByRole('button', { name: /guardar nota/i }))
    expect(onSaveNote).toHaveBeenCalledWith('Cliente interesado en el plan empresarial')
  })

  it('does not render history items when history is empty', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={[]} />)
    await user.click(screen.getByRole('tab', { name: /historial/i }))
    expect(screen.getByText(/sin historial/i)).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<PanelRich contact={defaultContact} data-testid="panel" />)
    expect(screen.getByTestId('panel')).toBeInTheDocument()
  })

  it('renders avatar with contact initials', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders avatar image when avatarSrc is provided', () => {
    render(<PanelRich contact={{ ...defaultContact, avatarSrc: 'https://example.com/img.jpg' }} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
