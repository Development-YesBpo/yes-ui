// src/charts/StatStrip/StatStrip.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { StatStrip } from './StatStrip'

const ITEMS_CC = [
  { label: 'Agentes activos', value: '84'   },
  { label: 'En cola',         value: '12'   },
  { label: 'Nivel servicio',  value: '82%'  },
  { label: 'Abandono',        value: '8.2%' },
  { label: 'AHT',             value: '4:23', unit: 'min' },
]

const ITEMS_MINI = [
  { label: 'Conversaciones', value: '1.284' },
  { label: 'CSAT',           value: '94.2%' },
  { label: 'T. respuesta',   value: '1:24',  unit: 'min' },
  { label: 'Agentes',        value: '18'    },
]

const ITEMS_TRIO = [
  { label: 'Hoy',     value: '328' },
  { label: 'Ayer',    value: '291' },
  { label: 'Var.',    value: '+13%' },
]

const meta: Meta<typeof StatStrip> = {
  title: 'Wave 9 — Charts/StatStrip',
  component: StatStrip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Fila compacta de métricas operativas. Componente DOM puro. Referencia: `Dashboard-Comps/Widget Gallery.html → StatStrip`.',
      },
    },
  },
  args: {
    items: ITEMS_CC,
  },
}
export default meta
type Story = StoryObj<typeof StatStrip>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 640 }}>
      <StatStrip {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>5 celdas — contact center</h4>
        <StatStrip items={ITEMS_CC} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>4 celdas — dashboard resumen</h4>
        <StatStrip items={ITEMS_MINI} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>3 celdas — comparación día</h4>
        <StatStrip items={ITEMS_TRIO} />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div>
      <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin datos (items vacíos)</h4>
      <StatStrip items={[]} />
      <p style={{ margin: '8px 0 0', font: '400 11px Manrope, sans-serif', color: 'var(--yes-color-text-muted)' }}>
        StatStrip no implementa loading/empty — pasa `items` siempre con al menos 1 elemento.
      </p>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div style={{ width: 640 }} data-testid="strip-wrapper">
      <StatStrip {...args} data-testid="strip" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const strip = canvas.getByTestId('strip')
    await expect(strip).toBeVisible()
    await expect(strip).toHaveTextContent('Agentes activos')
  },
}
