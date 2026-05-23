import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { FilterPanel } from './FilterPanel'
import { Checkbox } from '../Checkbox'

const meta: Meta<typeof FilterPanel> = {
  title: 'Wave 5 — Overlay/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Panel flotante de filtros avanzados. Agrupa checkboxes, selects, y sliders por categoría. Reference: `design-system-reference/preview/components-meta-filters.html`',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [applied, setApplied] = useState(false)
    return (
      <div style={{ position: 'relative', minHeight: 500, padding: 16 }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ marginBottom: 8, padding: '6px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontFamily: 'Manrope, sans-serif', fontWeight: 600, cursor: 'pointer' }}
        >
          {applied ? 'Filtros aplicados ✓' : 'Filtros avanzados'}
        </button>
        <FilterPanel
          open={open}
          onClose={() => setOpen(false)}
          onApply={() => { setApplied(true); setOpen(false) }}
          onClear={() => setApplied(false)}
          style={{ top: 48, left: 0 }}
        >
          <FilterPanel.Group label="Estado">
            <Checkbox label="Activo" defaultChecked />
            <Checkbox label="Pendiente" />
            <Checkbox label="Fallido" />
            <Checkbox label="Completado" />
          </FilterPanel.Group>

          <FilterPanel.Group label="Canal">
            <Checkbox label="WhatsApp" defaultChecked />
            <Checkbox label="SMS" defaultChecked />
            <Checkbox label="Correo" />
            <Checkbox label="Voz" />
          </FilterPanel.Group>

          <FilterPanel.Group label="Valor de deuda">
            <div style={{ padding: '0 2px' }}>
              <input type="range" min={0} max={100} defaultValue={70} style={{ width: '100%', accentColor: 'var(--yes-color-primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--yes-color-text-muted)', marginTop: 2 }}>
                <span>$0</span>
                <span>hasta $70.000.000</span>
              </div>
            </div>
          </FilterPanel.Group>
        </FilterPanel>
      </div>
    )
  },
}

export const AllGroups: Story = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <FilterPanel
        open
        onClose={() => {}}
        onApply={() => {}}
        onClear={() => {}}
        style={{ position: 'static' }}
      >
        <FilterPanel.Group label="Estado">
          <Checkbox label="Activo" defaultChecked />
          <Checkbox label="Pendiente" />
          <Checkbox label="Fallido" />
          <Checkbox label="Completado" />
        </FilterPanel.Group>

        <FilterPanel.Group label="Canal">
          <Checkbox label="WhatsApp" defaultChecked />
          <Checkbox label="SMS" defaultChecked />
          <Checkbox label="Correo" />
          <Checkbox label="Voz" />
        </FilterPanel.Group>

        <FilterPanel.Group label="Campaña">
          <select style={{ width: '100%', height: 30, borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, padding: '0 8px', fontFamily: 'Manrope, sans-serif' }}>
            <option>Cobranza Junio 2026</option>
            <option>Retención Q2</option>
          </select>
        </FilterPanel.Group>

        <FilterPanel.Group label="Última gestión">
          <select style={{ width: '100%', height: 30, borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, padding: '0 8px', fontFamily: 'Manrope, sans-serif' }}>
            <option>En los últimos 7 días</option>
            <option>En los últimos 30 días</option>
          </select>
        </FilterPanel.Group>

        <FilterPanel.Group label="Valor de deuda">
          <div style={{ padding: '0 2px' }}>
            <input type="range" min={0} max={100} defaultValue={70} style={{ width: '100%', accentColor: 'var(--yes-color-primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--yes-color-text-muted)', marginTop: 2 }}>
              <span>$0</span>
              <span>hasta $70.000.000</span>
            </div>
          </div>
        </FilterPanel.Group>
      </FilterPanel>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastAction, setLastAction] = useState<string | null>(null)
    return (
      <div style={{ position: 'relative', minHeight: 400 }}>
        <button
          type="button"
          data-testid="open-fp-btn"
          onClick={() => setOpen(true)}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontFamily: 'Manrope, sans-serif', fontWeight: 600, cursor: 'pointer' }}
        >
          Filtros avanzados
        </button>
        {lastAction && (
          <p data-testid="last-action" style={{ marginTop: 8, fontSize: 13 }}>
            Última acción: {lastAction}
          </p>
        )}
        <FilterPanel
          open={open}
          onClose={() => setOpen(false)}
          onApply={() => { setLastAction('aplicar'); setOpen(false) }}
          onClear={() => setLastAction('limpiar')}
          data-testid="filter-panel"
          style={{ top: 48, left: 0 }}
        >
          <FilterPanel.Group label="Estado">
            <Checkbox label="Activo" defaultChecked />
            <Checkbox label="Pendiente" />
          </FilterPanel.Group>
        </FilterPanel>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open panel
    await userEvent.click(canvas.getByTestId('open-fp-btn'))
    await expect(canvas.getByTestId('filter-panel')).toBeVisible()

    // Click Aplicar
    await userEvent.click(canvas.getByRole('button', { name: 'Aplicar filtros' }))
    await expect(canvas.getByTestId('last-action')).toHaveTextContent('aplicar')

    // Reopen and click Limpiar
    await userEvent.click(canvas.getByTestId('open-fp-btn'))
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar' }))
    await expect(canvas.getByTestId('last-action')).toHaveTextContent('limpiar')
  },
}
