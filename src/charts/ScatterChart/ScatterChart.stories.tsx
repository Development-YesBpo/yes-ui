// src/charts/ScatterChart/ScatterChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { ScatterChart } from './ScatterChart'

const DATA = [
  { tmo: 3.2, csat: 94, equipo: 'Cobranza' }, { tmo: 2.8, csat: 96, equipo: 'Ventas'   },
  { tmo: 4.5, csat: 88, equipo: 'Soporte'  }, { tmo: 5.1, csat: 82, equipo: 'Cobranza' },
  { tmo: 6.3, csat: 75, equipo: 'Soporte'  }, { tmo: 3.9, csat: 91, equipo: 'Ventas'   },
  { tmo: 4.2, csat: 89, equipo: 'Cobranza' }, { tmo: 7.1, csat: 71, equipo: 'Soporte'  },
  { tmo: 3.6, csat: 93, equipo: 'Ventas'   }, { tmo: 5.8, csat: 79, equipo: 'Cobranza' },
  { tmo: 2.9, csat: 95, equipo: 'Ventas'   }, { tmo: 4.8, csat: 86, equipo: 'Soporte'  },
]

const meta: Meta<typeof ScatterChart> = {
  title: 'Wave 9 — Charts/ScatterChart',
  component: ScatterChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dispersión de puntos. Referencia: `Dashboard-Comps/Widget Gallery.html → ScatterSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'tmo',
    yField: 'csat',
    xLabel: 'TMO (min)',
    yLabel: 'CSAT (%)',
    ariaLabel: 'TMO vs CSAT por agente',
  },
}
export default meta
type Story = StoryObj<typeof ScatterChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <ScatterChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con ejes etiquetados (default)</h4>
        <ScatterChart data={DATA} xField="tmo" yField="csat" xLabel="TMO (min)" yLabel="CSAT (%)" ariaLabel="Con etiquetas" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Coloreado por equipo</h4>
        <ScatterChart data={DATA} xField="tmo" yField="csat" colorField="equipo" showLegend
          xLabel="TMO (min)" yLabel="CSAT (%)" ariaLabel="Coloreado por equipo" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin etiquetas explícitas</h4>
        <ScatterChart data={DATA} xField="tmo" yField="csat" ariaLabel="Ejes con nombres de campo" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con leyenda + color</h4>
        <ScatterChart data={DATA} xField="tmo" yField="csat" colorField="equipo" showLegend ariaLabel="Con leyenda" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <ScatterChart data={DATA} xField="tmo" yField="csat" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <ScatterChart data={[]} xField="tmo" yField="csat" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <ScatterChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'TMO vs CSAT por agente' })
    await expect(img).toBeVisible()
  },
}
