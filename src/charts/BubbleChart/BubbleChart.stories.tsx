// src/charts/BubbleChart/BubbleChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { BubbleChart } from './BubbleChart'

const DATA = [
  { campaña: 'Cobranza',  volumen: 2340, csat: 78, costo: 38 },
  { campaña: 'Soporte',   volumen: 1876, csat: 88, costo: 30 },
  { campaña: 'Ventas',    volumen: 1543, csat: 92, costo: 25 },
  { campaña: 'Retención', volumen: 987,  csat: 85, costo: 20 },
  { campaña: 'Info',      volumen: 654,  csat: 71, costo: 14 },
]

const meta: Meta<typeof BubbleChart> = {
  title: 'Wave 9 — Charts/BubbleChart',
  component: BubbleChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Burbujas con tercera dimensión en el radio. Referencia: `Dashboard-Comps/Widget Gallery.html → BubbleSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'volumen',
    yField: 'csat',
    sizeField: 'costo',
    colorField: 'campaña',
    xLabel: 'Volumen',
    yLabel: 'CSAT (%)',
    ariaLabel: 'Campañas: volumen × CSAT × costo relativo',
  },
}
export default meta
type Story = StoryObj<typeof BubbleChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 540 }}>
      <BubbleChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con color por categoría (default)</h4>
        <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo" colorField="campaña"
          xLabel="Volumen" yLabel="CSAT (%)" ariaLabel="Con color por campaña" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Mono-color</h4>
        <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
          xLabel="Volumen" yLabel="CSAT (%)" ariaLabel="Mono-color" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Burbujas pequeñas (sizeRange compacto)</h4>
        <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo" colorField="campaña"
          sizeRange={[3, 15]} ariaLabel="Burbujas pequeñas" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Burbujas grandes (sizeRange amplio)</h4>
        <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo" colorField="campaña"
          sizeRange={[10, 60]} ariaLabel="Burbujas grandes" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <BubbleChart data={[]} xField="volumen" yField="csat" sizeField="costo" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 540 }}>
      <BubbleChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Campañas: volumen × CSAT × costo relativo' })
    await expect(img).toBeVisible()
  },
}
