import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Wave 1 — Atoms/Badge',
  component: Badge,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insignia de estado semántico. Reference: `preview/components-badges.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { variant: 'success', children: 'Activo' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="success">Activo</Badge>
      <Badge variant="error">Fallido</Badge>
      <Badge variant="warning">Pendiente</Badge>
      <Badge variant="info">En proceso</Badge>
      <Badge variant="neutral">Pausado</Badge>
      <Badge variant="blue">Completado</Badge>
    </div>
  ),
}
