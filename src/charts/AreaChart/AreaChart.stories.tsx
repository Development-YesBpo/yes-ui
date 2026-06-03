// src/charts/AreaChart/AreaChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AreaChart } from './AreaChart'

const DATA = [
  { day: 'Lun', channel: 'Teléfono', value: 510 }, { day: 'Lun', channel: 'WhatsApp', value: 230 },
  { day: 'Mar', channel: 'Teléfono', value: 698 }, { day: 'Mar', channel: 'WhatsApp', value: 310 },
  { day: 'Mié', channel: 'Teléfono', value: 615 }, { day: 'Mié', channel: 'WhatsApp', value: 270 },
]

const meta: Meta<typeof AreaChart> = {
  title: 'Wave 9 — Charts/AreaChart',
  component: AreaChart,
  parameters: { layout: 'padded', docs: { description: { component:
    'Áreas apiladas por categoría. Referencia: `Dashboard-Comps/Widget Gallery.html → AreaSVG`.' } } },
}
export default meta
type Story = StoryObj<typeof AreaChart>

export const Stacked: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <AreaChart data={DATA} xField="day" yField="value" seriesField="channel" ariaLabel="Volumen por canal" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <AreaChart data={[]} xField="day" yField="value" ariaLabel="Sin datos" />
    </div>
  ),
}
