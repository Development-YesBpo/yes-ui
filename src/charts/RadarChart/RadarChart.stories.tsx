// src/charts/RadarChart/RadarChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RadarChart } from './RadarChart'

const EJES = ['TMO', 'CSAT', 'FCR', 'Adher.', 'Calidad', 'Efic.']
const AGENTE   = [85, 92, 78, 94, 88, 82]
const PROMEDIO = [75, 82, 72, 87, 80, 75]

const DATA = [
  ...EJES.map((eje, i) => ({ eje, valor: AGENTE[i],   serie: 'Agente'          })),
  ...EJES.map((eje, i) => ({ eje, valor: PROMEDIO[i], serie: 'Promedio equipo' })),
]

const SINGLE = EJES.map((eje, i) => ({ eje, valor: AGENTE[i], serie: 'Agente' }))

const meta: Meta<typeof RadarChart> = {
  title: 'Wave 9 — Charts/RadarChart',
  component: RadarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comparación multidimensional de KPIs en formato araña. Referencia: `Dashboard-Comps/Widget Gallery.html → RadarSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'eje',
    yField: 'valor',
    colorField: 'serie',
    ariaLabel: 'KPIs del agente vs promedio del equipo',
  },
}
export default meta
type Story = StoryObj<typeof RadarChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <RadarChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Dos series (default)</h4>
        <RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" ariaLabel="Dos series" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Una serie</h4>
        <RadarChart data={SINGLE} xField="eje" yField="valor" colorField="serie" ariaLabel="Una serie" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Escala 0–150</h4>
        <RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" max={150} ariaLabel="Escala 0-150" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin leyenda</h4>
        <RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" showLegend={false} ariaLabel="Sin leyenda" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <RadarChart data={[]} xField="eje" yField="valor" colorField="serie" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <RadarChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'KPIs del agente vs promedio del equipo' })
    await expect(img).toBeVisible()
  },
}
