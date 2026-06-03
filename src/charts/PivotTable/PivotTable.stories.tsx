// src/charts/PivotTable/PivotTable.stories.tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { PivotTable } from './PivotTable'

const DATA = [
  { agente: 'Carlos R.', cobranza: 234, soporte: 145, ventas: 89,  csat: 94.2 },
  { agente: 'Ana P.',    cobranza: 198, soporte: 167, ventas: 112, csat: 96.1 },
  { agente: 'Luis G.',   cobranza: 312, soporte: 89,  ventas: 67,  csat: 88.3 },
  { agente: 'María C.',  cobranza: 145, soporte: 234, ventas: 198, csat: 82.7 },
]

function csatColor(field: string, value: unknown): string | undefined {
  if (field !== 'csat') return undefined
  const v = Number(value)
  if (v > 90) return 'var(--yes-color-success)'
  if (v > 85) return 'var(--yes-color-warning)'
  return 'var(--yes-color-danger)'
}

const meta: Meta<typeof PivotTable> = {
  title: 'Wave 9 — Charts/PivotTable',
  component: PivotTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tabla pivote con totales y color condicional. Compone `TableAdvanced`. Referencia: `Dashboard-Comps/Widget Gallery.html → PivotTableDemo`.',
      },
    },
  },
  args: {
    data: DATA,
    rowField: 'agente',
    rowHeader: 'Agente',
    valueFields: ['cobranza', 'soporte', 'ventas', 'csat'],
    valueHeaders: ['Cobranza', 'Soporte', 'Ventas', 'CSAT avg'],
    showTotals: true,
    conditionalColor: csatColor,
  },
}
export default meta
type Story = StoryObj<typeof PivotTable>

export const Default: Story = {
  render: (args) => <PivotTable {...args} />,
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Con totales + color CSAT (default)</h4>
        <PivotTable
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'ventas', 'csat']}
          valueHeaders={['Cobranza', 'Soporte', 'Ventas', 'CSAT avg']}
          showTotals conditionalColor={csatColor}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin totales</h4>
        <PivotTable
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'ventas']}
          valueHeaders={['Cobranza', 'Soporte', 'Ventas']}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Sin ordenamiento</h4>
        <PivotTable
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'ventas']}
          sortable={false}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Total con etiqueta custom</h4>
        <PivotTable
          data={DATA}
          rowField="agente" rowHeader="Agente"
          valueFields={['cobranza', 'soporte', 'ventas']}
          showTotals totalLabel="Equipo completo"
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
        <PivotTable
          data={DATA}
          rowField="agente"
          valueFields={['cobranza', 'soporte']}
          isLoading
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', font: '600 12px Manrope, sans-serif' }}>Vacío</h4>
        <PivotTable
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
    <div data-testid="pivot-wrapper">
      <PivotTable {...args} data-testid="pivot" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pivot = canvas.getByTestId('pivot')
    await expect(pivot).toBeVisible()
    await expect(pivot).toHaveTextContent('Carlos R.')
  },
}
