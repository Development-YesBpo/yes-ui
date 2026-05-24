import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toolbar } from './Toolbar'

const meta: Meta<typeof Toolbar> = {
  title: 'Wave 6a — Data Containers/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barra de búsqueda, filtros activos y acciones a la derecha. Compone `SearchInput` (Wave 2), `Chip` (Wave 1). Referencia: `design-system-reference/preview/components-table.html` y `components-table-advanced.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toolbar>

export const Default: Story = {
  render: () => {
    const [q, setQ] = useState('')
    return <Toolbar value={q} onChange={setQ} />
  },
}

export const WithFilters: Story = {
  render: () => {
    const [q, setQ] = useState('')
    const [filters, setFilters] = useState([
      { key: 'estado', label: 'Estado: Activo' },
      { key: 'canal', label: 'Canal: WhatsApp' },
    ])
    return (
      <Toolbar
        value={q}
        onChange={setQ}
        onFilterClick={() => {
          // visual demo only
        }}
        filterCount={filters.length}
        activeFilters={filters}
        onDismissFilter={(key) => setFilters((prev) => prev.filter((f) => f.key !== key))}
      />
    )
  },
}

export const WithActions: Story = {
  render: () => {
    const [q, setQ] = useState('')
    return (
      <Toolbar
        value={q}
        onChange={setQ}
        onFilterClick={() => {
          // visual demo only
        }}
        actions={
          <>
            <button
              type="button"
              style={{
                height: 30,
                padding: '0 12px',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                background: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Exportar
            </button>
            <button
              type="button"
              style={{
                height: 30,
                padding: '0 12px',
                border: 'none',
                borderRadius: 6,
                background: '#2B52A0',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Nuevo
            </button>
          </>
        }
      />
    )
  },
}
