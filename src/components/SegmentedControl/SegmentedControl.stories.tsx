import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Wave 7 — Meta Actions/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Selector de opción única agrupado. Reference: `design-system-reference/preview/components-meta-actions.html` — GroupButton / Segmented control.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SegmentedControl>

const viewOptions = [
  { value: 'list', label: '☰ Lista' },
  { value: 'card', label: '⊞ Tarjeta' },
  { value: 'table', label: '⊟ Tabla' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('list')
    return <SegmentedControl options={viewOptions} value={value} onChange={setValue} />
  },
}

export const AllOptions: Story = {
  render: () => {
    const [value, setValue] = useState('card')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={viewOptions} value={value} onChange={setValue} />
        <SegmentedControl
          options={[
            { value: 'day', label: 'Día' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mes' },
            { value: 'year', label: 'Año' },
          ]}
          value="week"
          onChange={() => {}}
        />
      </div>
    )
  },
}
