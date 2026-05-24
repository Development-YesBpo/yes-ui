import type { Meta, StoryObj } from '@storybook/react'
import { Pencil, Copy, Clock, Trash2 } from 'lucide-react'
import { ActionMenu } from './ActionMenu'

const meta: Meta<typeof ActionMenu> = {
  title: 'Wave 7 — Meta Actions/ActionMenu',
  component: ActionMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Menú contextual disparado por botón ⋯. Reference: `design-system-reference/preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ActionMenu>

export const Default: Story = {
  args: {
    items: [
      { label: 'Editar', icon: Pencil, onClick: () => {} },
      { label: 'Duplicar', icon: Copy, onClick: () => {} },
      { label: 'Ver historial', icon: Clock, onClick: () => {}, section: 'Más acciones' },
      { label: 'Eliminar', icon: Trash2, onClick: () => {}, danger: true },
    ],
  },
}

export const WithSections: Story = {
  args: {
    items: [
      { label: 'Editar contacto', onClick: () => {} },
      { label: 'Asignar agente', onClick: () => {} },
      { label: 'Exportar datos', onClick: () => {}, section: 'Exportar' },
      { label: 'Eliminar registro', onClick: () => {}, danger: true },
    ],
  },
}

export const NoDanger: Story = {
  args: {
    items: [
      { label: 'Ver detalle', onClick: () => {} },
      { label: 'Copiar enlace', onClick: () => {} },
      { label: 'Compartir', onClick: () => {} },
    ],
  },
}
