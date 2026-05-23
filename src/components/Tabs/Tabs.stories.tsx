import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Tabs } from './Tabs'

const CONVERSACIONES = [
  { id: 'mis', label: 'Mis conversaciones' },
  { id: 'sin', label: 'Sin asignar', count: 12 },
  { id: 'todas', label: 'Todas' },
  { id: 'arch', label: 'Archivadas', count: 3 },
]

const meta: Meta<typeof Tabs> = {
  title: 'Wave 4 — Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Navegación por pestañas. Dos variantes: underline (borde inferior) y contained (panel con fondo). Referencia: `design-system-reference/preview/components-nav.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Tabs>

function ControlledTabs(props: Partial<React.ComponentProps<typeof Tabs>>) {
  const [active, setActive] = useState('mis')
  return (
    <Tabs
      items={CONVERSACIONES}
      activeId={active}
      onChange={setActive}
      {...props}
    />
  )
}

export const Underline: Story = {
  render: () => <ControlledTabs variant="underline" />,
}

export const Contained: Story = {
  render: () => <ControlledTabs variant="contained" />,
}

export const BothVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontFamily: 'Manrope, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Underline</p>
        <ControlledTabs variant="underline" />
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontFamily: 'Manrope, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contained</p>
        <ControlledTabs variant="contained" />
      </div>
    </div>
  ),
}

export const WithCounts: Story = {
  render: () => (
    <ControlledTabs
      items={[
        { id: 'activas', label: 'Activas', count: 47 },
        { id: 'espera', label: 'En espera', count: 8 },
        { id: 'cerradas', label: 'Cerradas' },
      ]}
    />
  ),
}

export const Interactive: Story = {
  render: () => <ControlledTabs variant="underline" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sinAsignar = canvas.getByRole('tab', { name: /sin asignar/i })
    await userEvent.click(sinAsignar)
    await expect(sinAsignar).toHaveAttribute('aria-selected', 'true')
  },
}
