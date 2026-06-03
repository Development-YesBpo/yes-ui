// src/charts/PieChart/PieChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { PieChart } from './PieChart'

const DATA = [
  { canal: 'Teléfono', valor: 4312 },
  { canal: 'WhatsApp', valor: 3156 },
  { canal: 'Chat',     valor: 1893 },
  { canal: 'Correo',   valor: 987  },
  { canal: 'Video',    valor: 499  },
]

const meta: Meta<typeof PieChart> = {
  title: 'Wave 9 — Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Distribución porcentual en sectores. Referencia: `Dashboard-Comps/Widget Gallery.html → PieSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    angleField: 'valor',
    colorField: 'canal',
    ariaLabel: 'Distribución de contactos por canal',
  },
}
export default meta
type Story = StoryObj<typeof PieChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <PieChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Leyenda derecha (default)</h4>
        <PieChart data={DATA} angleField="valor" colorField="canal" ariaLabel="Distribución derecha" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Leyenda inferior</h4>
        <PieChart data={DATA} angleField="valor" colorField="canal" legendPosition="bottom" ariaLabel="Distribución abajo" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin etiquetas</h4>
        <PieChart data={DATA} angleField="valor" colorField="canal" showValues={false} ariaLabel="Distribución sin labels" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin leyenda</h4>
        <PieChart data={DATA} angleField="valor" colorField="canal" showLegend={false} ariaLabel="Distribución sin leyenda" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <PieChart data={DATA} angleField="valor" colorField="canal" loading ariaLabel="Cargando distribución" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <PieChart data={[]} angleField="valor" colorField="canal" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <PieChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Distribución de contactos por canal' })
    await expect(img).toBeVisible()
  },
}
