import type { Meta, StoryObj } from '@storybook/react'
import { BulkActionBar } from './BulkActionBar'

const meta: Meta<typeof BulkActionBar> = {
  title: 'Wave 6a — Data Containers/BulkActionBar',
  component: BulkActionBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barra de acciones en lote cuando hay filas seleccionadas en una tabla. Acciones destructivas (`danger: true`) se agrupan a la derecha tras un divisor. Referencia: `design-system-reference/preview/components-table-advanced.html` y `components-meta-filters.html` (BulkActionBar).',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof BulkActionBar>

export const Default: Story = {
  args: {
    count: 12,
    actions: [
      { label: 'Asignar campaña', onClick: () => {} },
      { label: 'Cambiar estado', onClick: () => {} },
      { label: 'Exportar selección', onClick: () => {} },
      { label: 'Eliminar', onClick: () => {}, danger: true },
    ],
    onClear: () => {},
  },
}

export const Hidden: Story = {
  args: { count: 0, actions: [], onClear: () => {} },
}

export const SingleAction: Story = {
  args: {
    count: 1,
    actions: [{ label: 'Eliminar', onClick: () => {}, danger: true }],
    onClear: () => {},
  },
}
