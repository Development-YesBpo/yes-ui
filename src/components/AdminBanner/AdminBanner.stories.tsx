import type { Meta, StoryObj } from '@storybook/react'
import { AdminBanner } from './AdminBanner'

const meta: Meta<typeof AdminBanner> = {
  title: 'Wave 7 — Meta Actions/AdminBanner',
  component: AdminBanner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Banner de estado de sistema a nivel de página. 4 variantes: amber (impersonación), blue (simulación de rol), neutral (solo lectura), red (superadmin). Reference: `design-system-reference/preview/components-admin-banner.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof AdminBanner>

export const Amber: Story = {
  args: {
    variant: 'amber',
    badge: 'Asesora CRM',
    message: 'Viendo como Laura Cifuentes · Bogotá',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    badge: 'Coordinador',
    message: 'Acceso limitado · 18 agentes visibles',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    badge: 'LECTURA',
    message: 'Sin permisos de escritura · activo hasta las 18:00',
    actionLabel: 'Volver',
    onAction: () => {},
  },
}

export const Red: Story = {
  args: {
    variant: 'red',
    badge: 'SUPERADMIN',
    message: 'Acceso irrestricto al sistema · 234 usuarios en línea',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AdminBanner variant="amber" badge="Asesora CRM" message="Viendo como Laura Cifuentes · Bogotá" actionLabel="Salir" onAction={() => {}} />
      <AdminBanner variant="blue" badge="Coordinador" message="Acceso limitado · 18 agentes visibles" actionLabel="Salir" onAction={() => {}} />
      <AdminBanner variant="neutral" badge="LECTURA" message="Sin permisos de escritura · activo hasta las 18:00" actionLabel="Volver" onAction={() => {}} />
      <AdminBanner variant="red" badge="SUPERADMIN" message="Acceso irrestricto al sistema · 234 usuarios en línea" actionLabel="Salir" onAction={() => {}} />
    </div>
  ),
}
