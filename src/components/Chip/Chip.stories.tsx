import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Wave 1 — Atoms/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Etiqueta filtrable con texto y dismiss opcional. Referencia: `preview/components-badges.html` (sección filter chip).',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: { children: 'Estado: Activo' },
}

export const WithDismiss: Story = {
  args: { children: 'Canal: WhatsApp', onDismiss: () => {} },
}

export const FilterRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip onDismiss={() => {}}>Estado: Activo</Chip>
      <Chip onDismiss={() => {}}>Canal: WhatsApp</Chip>
      <Chip onDismiss={() => {}}>Ciudad: Bogotá</Chip>
      <Chip onDismiss={() => {}}>Campaña: Cobranza Junio</Chip>
      <Chip>Sin acción</Chip>
    </div>
  ),
}

export const Interactive: Story = {
  args: { children: 'Eliminar este filtro', onDismiss: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /eliminar filtro/i })
    await expect(btn).toBeVisible()
    await userEvent.click(btn)
  },
}
