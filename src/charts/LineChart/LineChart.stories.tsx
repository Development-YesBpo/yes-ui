// src/charts/LineChart/LineChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'

const DAILY = [
  { day: 'L-15', value: 820 }, { day: 'L-14', value: 943 }, { day: 'L-13', value: 788 },
  { day: 'L-12', value: 1102 }, { day: 'L-11', value: 956 }, { day: 'L-10', value: 1187 },
  { day: 'Hoy', value: 1284 },
]

const meta: Meta<typeof LineChart> = {
  title: 'Wave 9 — Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Serie temporal renderizada con `@ant-design/plots` (`Line`) y el renderer SVG. Referencia: `Dashboard-Comps/Widget Gallery.html → LineSVG`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof LineChart>

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <LineChart data={DAILY} xField="day" yField="value" ariaLabel="Conversaciones por día" />
    </div>
  ),
}
export const WithArea: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <LineChart data={DAILY} xField="day" yField="value" area ariaLabel="Conversaciones por día" />
    </div>
  ),
}
export const Loading: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <LineChart data={[]} xField="day" yField="value" loading ariaLabel="Cargando" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <LineChart data={[]} xField="day" yField="value" ariaLabel="Sin datos" />
    </div>
  ),
}
