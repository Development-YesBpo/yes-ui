// src/charts/BarChart/BarChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const CAMPS = [
  { label: 'Cobranza', value: 2340 }, { label: 'Soporte', value: 1876 },
  { label: 'Ventas', value: 1543 }, { label: 'Retención', value: 987 }, { label: 'Info', value: 654 },
]

const meta: Meta<typeof BarChart> = {
  title: 'Wave 9 — Charts/BarChart',
  component: BarChart,
  parameters: { layout: 'padded', docs: { description: { component:
    'Barras verticales por categoría. Referencia: `Dashboard-Comps/Widget Gallery.html → BarSVG`.' } } },
}
export default meta
type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <BarChart data={CAMPS} xField="label" yField="value" colorByField="label" ariaLabel="Volumen por campaña" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <BarChart data={[]} xField="label" yField="value" ariaLabel="Sin datos" />
    </div>
  ),
}
