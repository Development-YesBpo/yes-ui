// src/charts/HeatmapChart/HeatmapChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { HeatmapChart } from './HeatmapChart'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '0h', '2h', '4h']
const RAW = [
  [12, 8,  15, 45,  78,  92,  88,  65, 43, 28, 18, 9],
  [10, 7,  12, 52,  85,  96,  91,  72, 48, 32, 21, 11],
  [11, 9,  14, 48,  80,  89,  85,  68, 45, 30, 19, 10],
  [13, 8,  16, 55,  88,  98,  94,  75, 51, 35, 23, 12],
  [14, 10, 18, 60,  92, 100,  96,  78, 54, 38, 25, 14],
  [5,  3,  8,  22,  45,  62,  58,  48, 35, 24, 15, 7],
  [3,  2,  5,  15,  32,  48,  44,  36, 25, 18, 11, 5],
]
const DATA = DAYS.flatMap((dia, di) =>
  HOURS.map((hora, hi) => ({ hora, dia, llamadas: RAW[di][hi] })),
)

const meta: Meta<typeof HeatmapChart> = {
  title: 'Wave 9 — Charts/HeatmapChart',
  component: HeatmapChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Mapa de calor por dos dimensiones. Referencia: `Dashboard-Comps/Widget Gallery.html → HeatmapSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'hora',
    yField: 'dia',
    colorField: 'llamadas',
    height: 220,
    ariaLabel: 'Volumen de llamadas por hora y día',
  },
}
export default meta
type Story = StoryObj<typeof HeatmapChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <HeatmapChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Rampa azul YES (default)</h4>
        <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" height={200} ariaLabel="Rampa por defecto" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Rampa cálida</h4>
        <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
          colorScale={['#FFF7ED', '#FED7AA', '#F97316', '#9A3412']}
          height={200} ariaLabel="Rampa cálida" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Rampa verde brand</h4>
        <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
          colorScale={['#F4F8E8', '#C5DC8A', '#8CBC39', '#3B5A1E']}
          height={200} ariaLabel="Rampa verde brand" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <HeatmapChart data={[]} xField="hora" yField="dia" colorField="llamadas" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <HeatmapChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Volumen de llamadas por hora y día' })
    await expect(img).toBeVisible()
  },
}
