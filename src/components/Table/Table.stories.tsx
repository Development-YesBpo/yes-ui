import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Table } from './Table'
import type { TableColumn } from './Table'
import { Badge } from '../Badge/Badge'
import { ChannelBadge } from '../ChannelBadge/ChannelBadge'

const meta: Meta<typeof Table> = {
  title: 'Wave 6 — Data display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla de datos con soporte de ordenamiento, selección y paginación. Referencia: `design-system-reference/preview/components-table.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Table>

// ── Shared sample data ─────────────────────────────────────────
type Contact = {
  id: string
  name: string
  phone: string
  status: 'Activo' | 'Pendiente' | 'Inactivo'
  channel: 'whatsapp' | 'sms' | 'email' | 'voice'
  lastContact: string
}

const SAMPLE_DATA: Contact[] = [
  { id: '1', name: 'Carlos Rodríguez', phone: '+57 310 842 9301', status: 'Activo', channel: 'whatsapp', lastContact: 'Hace 2 horas' },
  { id: '2', name: 'María Gómez', phone: '+57 315 123 4567', status: 'Pendiente', channel: 'sms', lastContact: 'Hace 1 día' },
  { id: '3', name: 'Andrés Martínez', phone: '+57 320 987 6543', status: 'Inactivo', channel: 'email', lastContact: 'Hace 3 días' },
  { id: '4', name: 'Laura Cifuentes', phone: '+57 301 456 7890', status: 'Activo', channel: 'voice', lastContact: 'Hace 5 horas' },
  { id: '5', name: 'Pedro Sánchez', phone: '+57 312 234 5678', status: 'Pendiente', channel: 'whatsapp', lastContact: 'Ayer' },
]

const STATUS_VARIANT: Record<Contact['status'], 'success' | 'warning' | 'neutral'> = {
  Activo: 'success',
  Pendiente: 'warning',
  Inactivo: 'neutral',
}

const FULL_COLUMNS: TableColumn<Contact>[] = [
  { key: 'name', header: 'Contacto', sortable: true },
  { key: 'phone', header: 'Teléfono' },
  {
    key: 'status',
    header: 'Estado',
    render: (val) => (
      <Badge variant={STATUS_VARIANT[val as Contact['status']]}>
        {val as string}
      </Badge>
    ),
  },
  {
    key: 'channel',
    header: 'Canal',
    render: (val) => <ChannelBadge channel={val as Contact['channel']} />,
  },
  { key: 'lastContact', header: 'Última gestión', sortable: true },
]

const SIMPLE_COLUMNS: TableColumn<Contact>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'phone', header: 'Teléfono' },
  { key: 'status', header: 'Estado' },
]

// ── Stories ────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Table
      columns={SIMPLE_COLUMNS}
      data={SAMPLE_DATA.slice(0, 3)}
      getRowId={(r) => r.id}
    />
  ),
}

export const WithData: Story = {
  render: () => (
    <Table
      columns={FULL_COLUMNS}
      data={SAMPLE_DATA}
      getRowId={(r) => r.id}
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <Table
      columns={FULL_COLUMNS}
      data={[]}
      getRowId={(r) => r.id}
      isLoading
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <Table
      columns={FULL_COLUMNS}
      data={[]}
      getRowId={(r) => r.id}
      emptyMessage="No se encontraron contactos con los filtros aplicados"
    />
  ),
}

export const Selectable: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    return (
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#6B7280' }}>
          Seleccionados: {selectedIds.size}
        </div>
        <Table
          columns={FULL_COLUMNS}
          data={SAMPLE_DATA}
          getRowId={(r) => r.id}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    )
  },
}

export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<string | undefined>('name')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    function handleSort(key: string) {
      if (key === sortKey) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    }

    return (
      <Table
        columns={FULL_COLUMNS}
        data={SAMPLE_DATA}
        getRowId={(r) => r.id}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={handleSort}
      />
    )
  },
}

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pageSize = 2
    const total = SAMPLE_DATA.length
    const start = (page - 1) * pageSize
    const pageData = SAMPLE_DATA.slice(start, start + pageSize)
    return (
      <Table
        columns={FULL_COLUMNS}
        data={pageData}
        getRowId={(r) => r.id}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    return (
      <Table
        columns={FULL_COLUMNS}
        data={SAMPLE_DATA}
        getRowId={(r) => r.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        data-testid="interactive-table"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkboxes = canvas.getAllByRole('checkbox')
    // Click first row checkbox (index 1 — skip select-all)
    await userEvent.click(checkboxes[1]!)
    await expect(checkboxes[1]).toBeChecked()
  },
}
