// src/charts/HorizontalBarChart/HorizontalBarChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { HorizontalBarChart } from './HorizontalBarChart'

const AGENTS = [
  { agent: 'Felipe C.',  value: 402 },
  { agent: 'María C.',   value: 306 },
  { agent: 'Diego B.',   value: 252 },
  { agent: 'Valentina',  value: 228 },
  { agent: 'Isabella',   value: 204 },
  { agent: 'Carlos R.',  value: 192 },
  { agent: 'Laura M.',   value: 178 },
  { agent: 'Sofía P.',   value: 156 },
  { agent: 'Andrés G.',  value: 122 },
]

const meta: Meta<typeof HorizontalBarChart> = {
  title: 'Wave 9 — Charts/HorizontalBarChart',
  component: HorizontalBarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barras horizontales para rankings (etiquetas largas). Referencia: `Dashboard-Comps/Widget Gallery.html → HBarSVG`.',
      },
    },
  },
  args: {
    data: AGENTS,
    xField: 'value',
    yField: 'agent',
    sort: 'desc',
    maxItems: 6,
    ariaLabel: 'Ranking de agentes',
  },
}
export default meta
type Story = StoryObj<typeof HorizontalBarChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <HorizontalBarChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Top 6 descendente (default)</h4>
        <HorizontalBarChart data={AGENTS} xField="value" yField="agent" sort="desc" maxItems={6} ariaLabel="Top 6 agentes" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Top 5 ascendente</h4>
        <HorizontalBarChart data={AGENTS} xField="value" yField="agent" sort="asc" maxItems={5} ariaLabel="Bottom 5 agentes" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin orden, todos</h4>
        <HorizontalBarChart data={AGENTS.slice(0, 5)} xField="value" yField="agent" ariaLabel="Agentes sin orden" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin valores, sin grilla</h4>
        <HorizontalBarChart data={AGENTS} xField="value" yField="agent" sort="desc" maxItems={6} showValues={false} showGrid={false} ariaLabel="Ranking minimal" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <HorizontalBarChart data={[]} xField="value" yField="agent" loading ariaLabel="Cargando ranking" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <HorizontalBarChart data={[]} xField="value" yField="agent" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <HorizontalBarChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Ranking de agentes' })
    await expect(img).toBeVisible()
  },
}
