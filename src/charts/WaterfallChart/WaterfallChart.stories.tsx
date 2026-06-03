// src/charts/WaterfallChart/WaterfallChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { chartTokens } from '../../tokens/chartTokens'
import { WaterfallChart } from './WaterfallChart'

const DATA = [
  { etapa: 'Base S1',      valor: 7240, isTotal: true  },
  { etapa: '+Campañas',    valor: 340,  isTotal: false },
  { etapa: '−Estacional',  valor: -180, isTotal: false },
  { etapa: '+Agentes',     valor: 520,  isTotal: false },
  { etapa: '−Incidencias', valor: -95,  isTotal: false },
  { etapa: 'S2 Total',     valor: 7825, isTotal: true  },
]

const meta: Meta<typeof WaterfallChart> = {
  title: 'Wave 9 — Charts/WaterfallChart',
  component: WaterfallChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Variación acumulada con bloques positivos, negativos y totales. Referencia: `Dashboard-Comps/Widget Gallery.html → WaterfallSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'etapa',
    yField: 'valor',
    ariaLabel: 'Variación de volumen semana a semana',
  },
}
export default meta
type Story = StoryObj<typeof WaterfallChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <WaterfallChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Tokens YES (default)</h4>
        <WaterfallChart data={DATA} xField="etapa" yField="valor" ariaLabel="Variación con tokens" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Colores personalizados</h4>
        <WaterfallChart data={DATA} xField="etapa" yField="valor"
          positiveColor={chartTokens.series[4]}
          negativeColor="#7C3AED"
          totalColor={chartTokens.series[0]}
          ariaLabel="Variación con colores custom" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin valores</h4>
        <WaterfallChart data={DATA} xField="etapa" yField="valor" showValues={false} ariaLabel="Variación sin valores" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con leyenda</h4>
        <WaterfallChart data={DATA} xField="etapa" yField="valor" showLegend ariaLabel="Variación con leyenda" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <WaterfallChart data={DATA} xField="etapa" yField="valor" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <WaterfallChart data={[]} xField="etapa" yField="valor" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <WaterfallChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Variación de volumen semana a semana' })
    await expect(img).toBeVisible()
  },
}
