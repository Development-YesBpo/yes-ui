// src/charts/BarChart/BarChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { BarChart } from './BarChart'

const CAMPS = [
  { label: 'Cobranza',  value: 2340 },
  { label: 'Soporte',   value: 1876 },
  { label: 'Ventas',    value: 1543 },
  { label: 'Retención', value: 987 },
  { label: 'Info',      value: 654 },
]

const GROUPED = [
  { label: 'Cobranza',  trimestre: 'Q1', value: 2340 }, { label: 'Cobranza',  trimestre: 'Q2', value: 2780 },
  { label: 'Soporte',   trimestre: 'Q1', value: 1876 }, { label: 'Soporte',   trimestre: 'Q2', value: 2010 },
  { label: 'Ventas',    trimestre: 'Q1', value: 1543 }, { label: 'Ventas',    trimestre: 'Q2', value: 1820 },
]

const meta: Meta<typeof BarChart> = {
  title: 'Wave 9 — Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barras verticales por categoría. Referencia: `Dashboard-Comps/Widget Gallery.html → BarSVG`.',
      },
    },
  },
  args: {
    data: CAMPS,
    xField: 'label',
    yField: 'value',
    colorByField: 'label',
    ariaLabel: 'Volumen por campaña',
  },
}
export default meta
type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <BarChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Por categoría (default)</h4>
        <BarChart data={CAMPS} xField="label" yField="value" colorByField="label" ariaLabel="Volumen coloreado por categoría" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Mono-color, sin valores</h4>
        <BarChart data={CAMPS} xField="label" yField="value" showValues={false} ariaLabel="Volumen mono-color sin valores" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Agrupado por trimestre</h4>
        <BarChart data={GROUPED} xField="label" yField="value" colorByField="trimestre" grouped showLegend ariaLabel="Volumen agrupado por trimestre" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin grilla</h4>
        <BarChart data={CAMPS} xField="label" yField="value" colorByField="label" showGrid={false} ariaLabel="Volumen sin grilla" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <BarChart data={[]} xField="label" yField="value" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <BarChart data={[]} xField="label" yField="value" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <BarChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Volumen por campaña' })
    await expect(img).toBeVisible()
  },
}
