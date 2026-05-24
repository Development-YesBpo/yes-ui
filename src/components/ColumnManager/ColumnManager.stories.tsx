import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ColumnManager } from './ColumnManager'
import type { ColumnDef } from './ColumnManager'

const meta: Meta<typeof ColumnManager> = {
  title: 'Wave 7 — Meta Actions/ColumnManager',
  component: ColumnManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Panel de control de visibilidad y orden de columnas de tabla. Reference: `design-system-reference/preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ColumnManager>

const initialColumns: ColumnDef[] = [
  { key: 'name', label: 'Contacto', visible: true, locked: true },
  { key: 'phone', label: 'Teléfono', visible: true },
  { key: 'campaign', label: 'Campaña', visible: true },
  { key: 'channel', label: 'Canal', visible: true },
  { key: 'email', label: 'Correo electrónico', visible: false },
  { key: 'lastGest', label: 'Última gestión', visible: true },
]

export const Default: Story = {
  render: () => {
    const [cols, setCols] = useState(initialColumns)
    return (
      <ColumnManager
        columns={cols}
        onVisibilityChange={(key, visible) =>
          setCols((prev) => prev.map((c) => (c.key === key ? { ...c, visible } : c)))
        }
        onApply={() => {}}
        onReset={() => setCols(initialColumns)}
      />
    )
  },
}
