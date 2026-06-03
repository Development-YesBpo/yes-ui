// src/charts/LineChart/LineChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { LineChart } from './LineChart'

const DAILY = [
  { day: 'L-15', value: 820 },
  { day: 'L-14', value: 943 },
  { day: 'L-13', value: 788 },
  { day: 'L-12', value: 1102 },
  { day: 'L-11', value: 956 },
  { day: 'L-10', value: 1187 },
  { day: 'Hoy', value: 1284 },
]

const MULTI = [
  { day: 'L-6', canal: 'Teléfono', value: 510 },
  { day: 'L-6', canal: 'WhatsApp', value: 230 },
  { day: 'L-5', canal: 'Teléfono', value: 698 },
  { day: 'L-5', canal: 'WhatsApp', value: 310 },
  { day: 'L-4', canal: 'Teléfono', value: 615 },
  { day: 'L-4', canal: 'WhatsApp', value: 270 },
  { day: 'L-3', canal: 'Teléfono', value: 740 },
  { day: 'L-3', canal: 'WhatsApp', value: 360 },
  { day: 'L-2', canal: 'Teléfono', value: 802 },
  { day: 'L-2', canal: 'WhatsApp', value: 410 },
  { day: 'L-1', canal: 'Teléfono', value: 766 },
  { day: 'L-1', canal: 'WhatsApp', value: 388 },
  { day: 'Hoy', canal: 'Teléfono', value: 884 },
  { day: 'Hoy', canal: 'WhatsApp', value: 442 },
]

const meta: Meta<typeof LineChart> = {
  title: 'Wave 9 — Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Serie temporal renderizada con `@ant-design/plots` (`Line`). Referencia: `Dashboard-Comps/Widget Gallery.html → LineSVG`.',
      },
    },
  },
  args: {
    data: DAILY,
    xField: 'day',
    yField: 'value',
    ariaLabel: 'Conversaciones por día',
  },
}
export default meta
type Story = StoryObj<typeof LineChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <LineChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Suave + área</h4>
        <LineChart
          data={DAILY}
          xField="day"
          yField="value"
          curve="smooth"
          area
          ariaLabel="Conversaciones — suave con área"
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Lineal</h4>
        <LineChart
          data={DAILY}
          xField="day"
          yField="value"
          curve="linear"
          ariaLabel="Conversaciones — segmentos lineales"
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Multi-serie</h4>
        <LineChart
          data={MULTI}
          xField="day"
          yField="value"
          seriesField="canal"
          showLegend
          ariaLabel="Volumen por canal"
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin grilla, con valores</h4>
        <LineChart
          data={DAILY}
          xField="day"
          yField="value"
          showGrid={false}
          showValues
          ariaLabel="Conversaciones — sin grilla con valores"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <LineChart data={[]} xField="day" yField="value" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <LineChart data={[]} xField="day" yField="value" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <LineChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Conversaciones por día' })
    await expect(img).toBeVisible()
  },
}
