// src/charts/HorizontalBarChart/HorizontalBarChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalBarChart } from './HorizontalBarChart'

const AGENTS = [
  { agent: 'Felipe C.', value: 402 }, { agent: 'María C.', value: 306 }, { agent: 'Diego B.', value: 252 },
  { agent: 'Valentina', value: 228 }, { agent: 'Isabella', value: 204 }, { agent: 'Carlos R.', value: 192 },
]

const meta: Meta<typeof HorizontalBarChart> = {
  title: 'Wave 9 — Charts/HorizontalBarChart',
  component: HorizontalBarChart,
  parameters: { layout: 'padded', docs: { description: { component:
    'Barras horizontales para rankings (etiquetas largas). Referencia: `Dashboard-Comps/Widget Gallery.html → HBarSVG`.' } } },
}
export default meta
type Story = StoryObj<typeof HorizontalBarChart>

export const Ranking: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <HorizontalBarChart data={AGENTS} xField="value" yField="agent" sort="desc" maxItems={6} ariaLabel="Ranking de agentes" />
    </div>
  ),
}
export const Empty: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <HorizontalBarChart data={[]} xField="value" yField="agent" ariaLabel="Sin datos" />
    </div>
  ),
}
