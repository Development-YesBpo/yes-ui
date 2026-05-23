import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Inbox, SearchX, Users, FileText, CloudOff } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Wave 3 — Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Estado vacío con ícono, título, descripción opcional y acción opcional. Reference: `preview/components-cards.html` — sección empty state.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: Inbox,
    title: 'Sin contactos',
    description: 'Importa tu lista de contactos para comenzar a enviar campañas.',
    action: { label: 'Importar contactos', onClick: () => {} },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
      <EmptyState
        icon={Inbox}
        title="Sin contactos"
        description="Importa tu lista de contactos para comenzar."
        action={{ label: 'Importar contactos', onClick: () => {} }}
      />
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description="Intenta con otros términos de búsqueda o ajusta los filtros."
      />
      <EmptyState
        icon={CloudOff}
        title="Sin conexión"
        description="Verifica tu conexión a internet e intenta de nuevo."
        action={{ label: 'Reintentar', onClick: () => {} }}
      />
      <EmptyState
        icon={FileText}
        title="Sin reportes"
        description="Los reportes aparecerán aquí cuando ejecutes una campaña."
      />
      <EmptyState
        title="Sin datos"
      />
    </div>
  ),
}

export const WithoutIcon: Story = {
  args: {
    title: 'Sin actividad reciente',
    description: 'Las interacciones de tus contactos aparecerán aquí.',
  },
}

export const WithoutAction: Story = {
  args: {
    icon: Users,
    title: 'Sin agentes asignados',
    description: 'Este grupo no tiene agentes. Contacta a tu administrador.',
  },
}

export const Interactive: Story = {
  args: {
    icon: Inbox,
    title: 'Sin contactos',
    description: 'Importa tu lista de contactos.',
    action: { label: 'Importar contactos', onClick: () => {} },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { name: 'Sin contactos' })
    await expect(heading).toBeVisible()
    const btn = canvas.getByRole('button', { name: 'Importar contactos' })
    await expect(btn).toBeVisible()
    await userEvent.click(btn)
  },
}
