// src/charts/AreaChart/AreaChart.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AreaChart } from './AreaChart'

const MULTI = [
  { day: 'Lun', channel: 'Teléfono', value: 510 }, { day: 'Lun', channel: 'WhatsApp', value: 230 }, { day: 'Lun', channel: 'Chat', value: 140 },
  { day: 'Mar', channel: 'Teléfono', value: 698 }, { day: 'Mar', channel: 'WhatsApp', value: 310 }, { day: 'Mar', channel: 'Chat', value: 178 },
  { day: 'Mié', channel: 'Teléfono', value: 615 }, { day: 'Mié', channel: 'WhatsApp', value: 270 }, { day: 'Mié', channel: 'Chat', value: 160 },
  { day: 'Jue', channel: 'Teléfono', value: 730 }, { day: 'Jue', channel: 'WhatsApp', value: 340 }, { day: 'Jue', channel: 'Chat', value: 190 },
  { day: 'Vie', channel: 'Teléfono', value: 802 }, { day: 'Vie', channel: 'WhatsApp', value: 410 }, { day: 'Vie', channel: 'Chat', value: 222 },
]

const SINGLE = MULTI.filter((d) => d.channel === 'Teléfono')

const meta: Meta<typeof AreaChart> = {
  title: 'Wave 9 — Charts/AreaChart',
  component: AreaChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Áreas apiladas por categoría. Referencia: `Dashboard-Comps/Widget Gallery.html → AreaSVG`.',
      },
    },
  },
  args: {
    data: MULTI,
    xField: 'day',
    yField: 'value',
    seriesField: 'channel',
    ariaLabel: 'Volumen por canal',
  },
}
export default meta
type Story = StoryObj<typeof AreaChart>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <AreaChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Apilado (default)</h4>
        <AreaChart data={MULTI} xField="day" yField="value" seriesField="channel" ariaLabel="Volumen apilado por canal" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Superpuesto (stacked=false)</h4>
        <AreaChart data={MULTI} xField="day" yField="value" seriesField="channel" stacked={false} ariaLabel="Áreas superpuestas" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Una sola serie</h4>
        <AreaChart data={SINGLE} xField="day" yField="value" ariaLabel="Volumen Teléfono" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin grilla, con valores</h4>
        <AreaChart data={MULTI} xField="day" yField="value" seriesField="channel" showGrid={false} showValues ariaLabel="Volumen con valores" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <AreaChart data={[]} xField="day" yField="value" loading ariaLabel="Cargando" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <AreaChart data={[]} xField="day" yField="value" ariaLabel="Sin datos" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 460 }}>
      <AreaChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Volumen por canal' })
    await expect(img).toBeVisible()
  },
}
