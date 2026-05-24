import type { Meta, StoryObj } from '@storybook/react'
import { GroupFilter } from './GroupFilter'

const selectStyle: React.CSSProperties = {
  height: 30,
  padding: '0 10px',
  border: '1px solid #D1D5DB',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'Manrope, sans-serif',
  color: '#111827',
  background: '#fff',
}

const inputStyle: React.CSSProperties = {
  height: 30,
  padding: '0 10px',
  border: '1px solid #D1D5DB',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'Manrope, sans-serif',
  color: '#111827',
  background: '#fff',
  width: 140,
}

const meta: Meta<typeof GroupFilter> = {
  title: 'Wave 6a — Data Containers/GroupFilter',
  component: GroupFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barra de filtros unificada con controles libres como children y footer Aplicar/Limpiar. Referencia: `design-system-reference/preview/components-meta-filters.html` (sección GroupFilter).',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof GroupFilter>

export const Default: Story = {
  render: () => (
    <GroupFilter
      onApply={() => {
        // visual demo only
      }}
      onClear={() => {
        // visual demo only
      }}
    >
      <select style={selectStyle} aria-label="Estado">
        <option>Estado: Todos</option>
        <option>Activo</option>
        <option>Pausado</option>
      </select>
      <select style={selectStyle} aria-label="Campaña">
        <option>Campaña: Todas</option>
        <option>Bogotá Q3</option>
        <option>Re-engagement</option>
      </select>
      <input type="date" style={inputStyle} aria-label="Desde" />
    </GroupFilter>
  ),
}

export const WithAllControls: Story = {
  render: () => (
    <GroupFilter
      onApply={() => {
        // visual demo only
      }}
      onClear={() => {
        // visual demo only
      }}
    >
      <input
        type="search"
        placeholder="Buscar nombre o teléfono"
        style={{ ...inputStyle, width: 220 }}
        aria-label="Buscar"
      />
      <select style={selectStyle} aria-label="Estado">
        <option>Estado: Todos</option>
        <option>Activo</option>
        <option>Pausado</option>
      </select>
      <select style={selectStyle} aria-label="Campaña">
        <option>Campaña: Todas</option>
        <option>Bogotá Q3</option>
      </select>
      <input type="date" style={inputStyle} aria-label="Desde" />
      <input type="date" style={inputStyle} aria-label="Hasta" />
    </GroupFilter>
  ),
}
