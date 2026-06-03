// src/charts/DonutChart/DonutChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { DonutChart } from './DonutChart'

const DATA = [
  { motivo: 'Consulta', pct: 38 },
  { motivo: 'Reclamo',  pct: 24 },
  { motivo: 'Soporte',  pct: 19 },
  { motivo: 'Pago',     pct: 12 },
  { motivo: 'Otro',     pct: 7  },
]

const meta: Meta<typeof DonutChart> = {
  title: 'Wave 9 — Charts/DonutChart',
  component: DonutChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pie con centro hueco. Referencia: `Dashboard-Comps/Widget Gallery.html → DonutSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    angleField: 'pct',
    colorField: 'motivo',
    centerLabel: 'MOTIVOS',
    centerValue: '100%',
    ariaLabel: 'Motivos de contacto',
  },
}
export default meta
type Story = StoryObj<typeof DonutChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <DonutChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con centro (default)</h4>
        <DonutChart data={DATA} angleField="pct" colorField="motivo"
          centerLabel="MOTIVOS" centerValue="100%" ariaLabel="Motivos con centro" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin centro</h4>
        <DonutChart data={DATA} angleField="pct" colorField="motivo" ariaLabel="Motivos sin centro" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Anillo grueso (innerRadius=0.4)</h4>
        <DonutChart data={DATA} angleField="pct" colorField="motivo" innerRadius={0.4} ariaLabel="Motivos anillo grueso" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Anillo delgado (innerRadius=0.75)</h4>
        <DonutChart data={DATA} angleField="pct" colorField="motivo" innerRadius={0.75}
          centerLabel="TOTAL" centerValue="9.847" ariaLabel="Motivos anillo delgado" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <DonutChart data={DATA} angleField="pct" colorField="motivo" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <DonutChart data={[]} angleField="pct" colorField="motivo" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <DonutChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Motivos de contacto' })
    await expect(img).toBeVisible()
  },
}
