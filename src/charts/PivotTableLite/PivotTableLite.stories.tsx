// src/charts/PivotTableLite/PivotTableLite.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { PivotTableLite } from './PivotTableLite'

const DATA = [
  { agente: 'Carlos R.', cobranza: 234, soporte: 145, total: 379, csat: 94.2 },
  { agente: 'Ana P.',    cobranza: 198, soporte: 167, total: 365, csat: 96.1 },
  { agente: 'Luis G.',   cobranza: 312, soporte: 89,  total: 401, csat: 88.3 },
  { agente: 'María C.',  cobranza: 145, soporte: 234, total: 379, csat: 82.7 },
  { agente: 'Sofía P.',  cobranza: 167, soporte: 198, total: 365, csat: 91.5 },
  { agente: 'Diego B.',  cobranza: 201, soporte: 132, total: 333, csat: 89.8 },
]

const meta: Meta<typeof PivotTableLite> = {
  title: 'Wave 9 — Charts/PivotTableLite',
  component: PivotTableLite,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Variante compacta de PivotTable, ideal para embeds. Referencia: `Dashboard-Comps/Widget Gallery.html → PivotTableDemo (lite=true)`.',
      },
    },
  },
  args: {
    data: DATA,
    rowField: 'agente',
    rowHeader: 'Agente',
    valueFields: ['cobranza', 'soporte', 'csat'],
    valueHeaders: ['Cobranza', 'Soporte', 'CSAT avg'],
    showTotals: true,
  },
}
export default meta
type Story = StoryObj<typeof PivotTableLite>

export const Default: Story = {
  render: (args) => <PivotTableLite {...args} />,
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con totales (default)</h4>
        <PivotTableLite
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'csat']}
          valueHeaders={['Cobranza', 'Soporte', 'CSAT avg']}
          showTotals
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin totales</h4>
        <PivotTableLite
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte']}
          valueHeaders={['Cobranza', 'Soporte']}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>maxRows=3 (top 3)</h4>
        <PivotTableLite
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte']}
          valueHeaders={['Cobranza', 'Soporte']}
          maxRows={3}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>maxRows=4 + totales</h4>
        <PivotTableLite
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'csat']}
          valueHeaders={['Cobranza', 'Soporte', 'CSAT']}
          maxRows={4} showTotals totalLabel="Top 4"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Cargando</h4>
        <PivotTableLite
          data={DATA}
          rowField="agente"
          valueFields={['cobranza', 'soporte']}
          isLoading
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <PivotTableLite
          data={[]}
          rowField="agente"
          valueFields={['cobranza', 'soporte']}
        />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <div data-testid="lite-wrapper">
      <PivotTableLite {...args} data-testid="lite" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const t = canvas.getByTestId('lite')
    await expect(t).toBeVisible()
    await expect(t).toHaveTextContent('Carlos R.')
  },
}
