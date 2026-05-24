import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { TableAdvanced } from './TableAdvanced'
import type { TableColumn } from '../Table/Table'
import { Badge } from '../Badge/Badge'
import { ChannelBadge } from '../ChannelBadge/ChannelBadge'

const meta: Meta<typeof TableAdvanced> = {
  title: 'Wave 6 — Data display/TableAdvanced',
  component: TableAdvanced,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla avanzada con selección en masa, multi-sort con prioridad, redimensión de columnas y gestor de columnas. Referencia: `design-system-reference/preview/components-table-advanced.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof TableAdvanced>

// ── Shared data ────────────────────────────────────────────────
type Contact = {
  id: string
  name: string
  phone: string
  campaign: string
  channel: 'whatsapp' | 'sms' | 'email' | 'voice'
  lastContact: string
  status: 'Activo' | 'Pendiente' | 'Inactivo'
  value: string
}

const DATA: Contact[] = [
  { id: '1', name: 'Carlos Rodríguez', phone: '+57 310 842 9301', campaign: 'Cobranza Junio', channel: 'whatsapp', lastContact: 'Hace 2 horas', status: 'Activo', value: '$1.250.000' },
  { id: '2', name: 'María Gómez', phone: '+57 315 123 4567', campaign: 'Renovación Q2', channel: 'sms', lastContact: 'Hace 1 día', status: 'Pendiente', value: '$680.000' },
  { id: '3', name: 'Andrés Martínez', phone: '+57 320 987 6543', campaign: 'Cobranza Junio', channel: 'email', lastContact: 'Hace 3 días', status: 'Inactivo', value: '$430.000' },
  { id: '4', name: 'Laura Cifuentes', phone: '+57 301 456 7890', campaign: 'Renovación Q2', channel: 'voice', lastContact: 'Hace 5 horas', status: 'Activo', value: '$920.000' },
  { id: '5', name: 'Pedro Sánchez', phone: '+57 312 234 5678', campaign: 'Cobranza Junio', channel: 'whatsapp', lastContact: 'Ayer', status: 'Pendiente', value: '$310.000' },
]

const STATUS_VARIANT: Record<Contact['status'], 'success' | 'warning' | 'neutral'> = {
  Activo: 'success',
  Pendiente: 'warning',
  Inactivo: 'neutral',
}

const ALL_COLUMNS: TableColumn<Contact>[] = [
  { key: 'name', header: 'Contacto', sortable: true },
  { key: 'phone', header: 'Teléfono' },
  { key: 'campaign', header: 'Campaña', sortable: true },
  {
    key: 'channel',
    header: 'Canal',
    render: (val) => <ChannelBadge channel={val as Contact['channel']} />,
  },
  { key: 'lastContact', header: 'Última gestión', sortable: true },
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
    key: 'value',
    header: 'Valor',
    render: (val) => (
      <strong style={{ color: 'var(--yes-color-text)' }}>{val as string}</strong>
    ),
  },
]

// ── Stories ────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <TableAdvanced
      columns={ALL_COLUMNS}
      data={DATA}
      getRowId={(r) => r.id}
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <TableAdvanced
      columns={ALL_COLUMNS}
      data={[]}
      getRowId={(r) => r.id}
      isLoading
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <TableAdvanced
      columns={ALL_COLUMNS}
      data={[]}
      getRowId={(r) => r.id}
      emptyMessage="No se encontraron contactos con los filtros aplicados"
    />
  ),
}

export const FullFeatured: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
      new Set(['1', '4']),
    )
    const [sortConfig, setSortConfig] = useState<
      Array<{ key: string; direction: 'asc' | 'desc' }>
    >([
      { key: 'name', direction: 'asc' },
      { key: 'lastContact', direction: 'desc' },
    ])
    const [visibleColumns, setVisibleColumns] = useState(
      ALL_COLUMNS.map((c) => c.key),
    )

    function handleSort(key: string) {
      setSortConfig((prev) => {
        const existing = prev.find((s) => s.key === key)
        if (existing) {
          return prev.map((s) =>
            s.key === key
              ? { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' }
              : s,
          )
        }
        return [...prev, { key, direction: 'asc' }]
      })
    }

    function handleColumnVisibility(key: string, visible: boolean) {
      setVisibleColumns((prev) =>
        visible ? [...prev, key] : prev.filter((k) => k !== key),
      )
    }

    return (
      <TableAdvanced
        columns={ALL_COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        sortConfig={sortConfig}
        onSort={handleSort}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibility}
        onColumnReset={() => setVisibleColumns(ALL_COLUMNS.map((c) => c.key))}
        bulkActions={[
          {
            label: 'Asignar campaña',
            onClick: (ids) =>
              window.alert(`Asignar campaña a ${ids.size} contactos`),
          },
          {
            label: 'Exportar selección',
            onClick: (ids) => window.alert(`Exportar ${ids.size} contactos`),
          },
          {
            label: 'Eliminar',
            onClick: (ids) => window.alert(`Eliminar ${ids.size} contactos`),
            danger: true,
          },
        ]}
        page={1}
        pageSize={20}
        total={248}
        onPageChange={() => {}}
      />
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    return (
      <TableAdvanced
        columns={ALL_COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={[{ label: 'Exportar', onClick: () => {} }]}
        data-testid="adv-table"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkboxes = canvas.getAllByRole('checkbox')
    // Select first row (skip header select-all at index 0)
    await userEvent.click(checkboxes[1]!)
    await expect(checkboxes[1]).toBeChecked()
    // Bulk bar should appear
    await expect(canvas.getByText(/1 seleccionado/i)).toBeVisible()
  },
}
