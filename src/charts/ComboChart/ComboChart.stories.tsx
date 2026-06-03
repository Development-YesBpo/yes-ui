// src/charts/ComboChart/ComboChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { chartTokens } from '../../tokens/chartTokens'
import { ComboChart } from './ComboChart'

const DATA = [
  { dia: 'Lun', llamadas: 892,  nivel: 87 },
  { dia: 'Mar', llamadas: 1240, nivel: 82 },
  { dia: 'Mié', llamadas: 1087, nivel: 85 },
  { dia: 'Jue', llamadas: 1345, nivel: 79 },
  { dia: 'Vie', llamadas: 1456, nivel: 76 },
  { dia: 'Sáb', llamadas: 988,  nivel: 88 },
  { dia: 'Dom', llamadas: 743,  nivel: 91 },
]

const meta: Meta<typeof ComboChart> = {
  title: 'Wave 9 — Charts/ComboChart',
  component: ComboChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Volumen + porcentaje en ejes Y duales. Referencia: `Dashboard-Comps/Widget Gallery.html → ComboSVG`.',
      },
    },
  },
  args: {
    data: DATA,
    xField: 'dia',
    barField: 'llamadas',
    lineField: 'nivel',
    barName: 'Llamadas',
    lineName: 'Nivel de servicio (%)',
    ariaLabel: 'Llamadas vs nivel de servicio por día',
  },
}
export default meta
type Story = StoryObj<typeof ComboChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <ComboChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con nombres (default)</h4>
        <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
          barName="Llamadas" lineName="Nivel de servicio (%)"
          ariaLabel="Llamadas vs nivel con nombres" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin leyenda</h4>
        <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
          showLegend={false} ariaLabel="Llamadas vs nivel sin leyenda" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Colores personalizados</h4>
        <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
          barColor={chartTokens.series[4]} lineColor={chartTokens.series[5]}
          ariaLabel="Llamadas vs nivel con colores custom" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Solo iniciales (sin nombres)</h4>
        <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
          ariaLabel="Llamadas vs nivel sin nombres" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <ComboChart data={[]} xField="dia" barField="llamadas" lineField="nivel" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <ComboChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Llamadas vs nivel de servicio por día' })
    await expect(img).toBeVisible()
  },
}
