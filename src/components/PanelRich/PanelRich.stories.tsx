import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { PanelRich } from './PanelRich'

const meta: Meta<typeof PanelRich> = {
  title: 'Wave 8 — Communication/PanelRich',
  component: PanelRich,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Panel lateral de detalle de contacto con tabs: Info, Historial, Notas. Reference: `preview/components-panel-rich.html` + `ui_kits/crm/CRMApp.jsx` → DetailPanel.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof PanelRich>

const sampleContact = {
  name: 'Carlos Rodríguez',
  role: 'Cliente Premium',
  status: 'success' as const,
  fields: [
    { label: 'Teléfono',    value: '+57 310 555 0123' },
    { label: 'Correo',      value: 'carlos@example.com' },
    { label: 'Empresa',     value: 'ABC Ltda' },
    { label: 'NIT',         value: '900.123.456-1' },
    { label: 'Ciudad',      value: 'Bogotá D.C.' },
    { label: 'Asignado a',  value: 'Ana Torres' },
  ],
}

const sampleHistory = [
  { date: '21 may 2026 · 09:42', action: 'Llamada saliente — Contactado' },
  { date: '19 may 2026 · 14:10', action: 'Mensaje WhatsApp enviado' },
  { date: '15 may 2026 · 11:00', action: 'Correo de seguimiento enviado' },
  { date: '10 may 2026 · 16:30', action: 'Llamada saliente — No contesta' },
]

export const Default: Story = {
  args: {
    contact: sampleContact,
    history: sampleHistory,
  },
}

export const InfoTab: Story = {
  args: {
    contact: sampleContact,
  },
}

export const HistorialTab: Story = {
  args: {
    contact: sampleContact,
    history: sampleHistory,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /historial/i }))
    await expect(canvas.getByText('Llamada saliente — Contactado')).toBeVisible()
  },
}

export const NotasTab: Story = {
  args: {
    contact: sampleContact,
    onSaveNote: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /notas/i }))
    const textarea = canvas.getByRole('textbox')
    await userEvent.type(textarea, 'Cliente interesado en plan empresarial')
    await expect(textarea).toHaveValue('Cliente interesado en plan empresarial')
  },
}

export const PendingStatus: Story = {
  args: {
    contact: {
      ...sampleContact,
      name: 'María Fernanda Gómez',
      role: 'Prospecto',
      status: 'warning' as const,
    },
    history: sampleHistory.slice(0, 2),
  },
}

export const EmptyHistory: Story = {
  args: {
    contact: sampleContact,
    history: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /historial/i }))
    await expect(canvas.getByText(/sin historial/i)).toBeVisible()
  },
}

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', height: 600, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ flex: 1, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
          Contenido principal (tabla, lista, etc.)
        </span>
      </div>
      <PanelRich
        contact={sampleContact}
        history={sampleHistory}
        onSaveNote={() => {}}
      />
    </div>
  ),
}
