// src/charts/FunnelChart/FunnelChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { FunnelChart } from './FunnelChart'

const DATA = [
  { etapa: 'Contactos recibidos',   total: 12847 },
  { etapa: 'Asignados al agente',   total: 11023 },
  { etapa: 'Resuelto 1er contacto', total: 7854  },
  { etapa: 'Cerrado satisfactorio', total: 6432  },
]

const meta: Meta<typeof FunnelChart> = {
  title: 'Wave 9 — Charts/FunnelChart',
  component: FunnelChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Embudo de conversión entre etapas. Referencia: `Dashboard-Comps/Widget Gallery.html → FunnelSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'etapa',
    yField: 'total',
    ariaLabel: 'Embudo de resolución de contactos',
  },
}
export default meta
type Story = StoryObj<typeof FunnelChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <FunnelChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con conversión (default)</h4>
        <FunnelChart data={DATA} xField="etapa" yField="total" ariaLabel="Embudo con conversión" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin conversión</h4>
        <FunnelChart data={DATA} xField="etapa" yField="total" showConversion={false} ariaLabel="Embudo sin conversión" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin valores</h4>
        <FunnelChart data={DATA} xField="etapa" yField="total" showValues={false} ariaLabel="Embudo sin valores" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con leyenda</h4>
        <FunnelChart data={DATA} xField="etapa" yField="total" showLegend ariaLabel="Embudo con leyenda" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <FunnelChart data={DATA} xField="etapa" yField="total" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <FunnelChart data={[]} xField="etapa" yField="total" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <FunnelChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Embudo de resolución de contactos' })
    await expect(img).toBeVisible()
  },
}
