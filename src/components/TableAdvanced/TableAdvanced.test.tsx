import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TableAdvanced } from './TableAdvanced'
import type { TableColumn } from '../Table/Table'

type Row = { id: string; name: string; status: string; channel: string }

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'status', header: 'Estado', sortable: true },
  { key: 'channel', header: 'Canal' },
]

const DATA: Row[] = [
  { id: '1', name: 'Carlos Rodríguez', status: 'Activo', channel: 'WhatsApp' },
  { id: '2', name: 'María Gómez', status: 'Pendiente', channel: 'SMS' },
  { id: '3', name: 'Andrés Martínez', status: 'Inactivo', channel: 'Correo' },
]

const getRowId = (r: Row) => r.id

describe('TableAdvanced', () => {
  // ── Inherits Table behavior ────────────────────────────────
  it('renders all column headers', () => {
    render(<TableAdvanced columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Canal')).toBeInTheDocument()
  })

  it('renders all data rows', () => {
    render(<TableAdvanced columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
    expect(screen.getByText('María Gómez')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(
      <TableAdvanced columns={COLUMNS} data={DATA} getRowId={getRowId} data-testid="adv" />
    )
    expect(screen.getByTestId('adv')).toBeInTheDocument()
  })

  // ── Bulk action bar ────────────────────────────────────────
  it('does not render bulk bar when selectedIds is empty or not provided', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set()}
        bulkActions={[{ label: 'Exportar', onClick: vi.fn() }]}
      />
    )
    expect(screen.queryByText(/seleccionado/i)).not.toBeInTheDocument()
  })

  it('renders bulk bar with count when selectedIds has entries', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set(['1', '2'])}
        onSelectionChange={vi.fn()}
        bulkActions={[{ label: 'Exportar', onClick: vi.fn() }]}
      />
    )
    expect(screen.getByText(/2 seleccionados/i)).toBeInTheDocument()
  })

  it('calls bulk action onClick with current selectedIds when bulk button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set(['1', '3'])}
        onSelectionChange={vi.fn()}
        bulkActions={[{ label: 'Exportar', onClick }]}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Exportar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    const arg = onClick.mock.calls[0]![0] as Set<string>
    expect(arg.has('1')).toBe(true)
    expect(arg.has('3')).toBe(true)
  })

  it('clears selection when "Limpiar selección" is clicked', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set(['1', '2'])}
        onSelectionChange={onSelectionChange}
        bulkActions={[{ label: 'Exportar', onClick: vi.fn() }]}
      />
    )
    await user.click(screen.getByRole('button', { name: /limpiar/i }))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set())
  })

  it('renders danger bulk actions with danger styling', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set(['1'])}
        onSelectionChange={vi.fn()}
        bulkActions={[{ label: 'Eliminar', onClick: vi.fn(), danger: true }]}
      />
    )
    const btn = screen.getByRole('button', { name: 'Eliminar' })
    expect(btn).toBeInTheDocument()
    expect(btn.className).toMatch(/danger/i)
  })

  // ── Multi-column sort priority ─────────────────────────────
  it('shows sort priority badge (number) when sortConfig is provided', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        sortConfig={[
          { key: 'name', direction: 'asc' },
          { key: 'status', direction: 'desc' },
        ]}
      />
    )
    expect(document.querySelector('[data-sort-priority="1"]')).toBeInTheDocument()
    expect(document.querySelector('[data-sort-priority="2"]')).toBeInTheDocument()
  })

  it('does not show priority badge for columns not in sortConfig', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        sortConfig={[{ key: 'name', direction: 'asc' }]}
      />
    )
    expect(document.querySelector('[data-sort-priority="2"]')).not.toBeInTheDocument()
  })

  // ── Column resize handle ───────────────────────────────────
  it('renders resize handle in each column header', () => {
    render(<TableAdvanced columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    const handles = document.querySelectorAll('[data-resize-handle]')
    expect(handles.length).toBe(COLUMNS.length)
  })

  // ── Column manager ─────────────────────────────────────────
  it('renders Columnas button in toolbar area', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        visibleColumns={['name', 'status', 'channel']}
        onColumnVisibilityChange={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /columnas/i })).toBeInTheDocument()
  })

  it('opens column manager dropdown when Columnas button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        visibleColumns={['name', 'status', 'channel']}
        onColumnVisibilityChange={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: /columnas/i }))
    expect(screen.getByText('Columnas visibles')).toBeInTheDocument()
  })

  it('calls onColumnVisibilityChange when a column checkbox is toggled in dropdown', async () => {
    const user = userEvent.setup()
    const onColumnVisibilityChange = vi.fn()
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        visibleColumns={['name', 'status', 'channel']}
        onColumnVisibilityChange={onColumnVisibilityChange}
      />
    )
    await user.click(screen.getByRole('button', { name: /columnas/i }))
    const dropdown = screen.getByRole('dialog')
    const estadoCheckbox = within(dropdown).getByLabelText('Estado')
    await user.click(estadoCheckbox)
    expect(onColumnVisibilityChange).toHaveBeenCalledWith('status', false)
  })

  it('calls onColumnReset when Restablecer is clicked in dropdown', async () => {
    const user = userEvent.setup()
    const onColumnReset = vi.fn()
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        visibleColumns={['name', 'status']}
        onColumnVisibilityChange={vi.fn()}
        onColumnReset={onColumnReset}
      />
    )
    await user.click(screen.getByRole('button', { name: /columnas/i }))
    await user.click(screen.getByRole('button', { name: /restablecer/i }))
    expect(onColumnReset).toHaveBeenCalledTimes(1)
  })

  it('hides columns not in visibleColumns', () => {
    render(
      <TableAdvanced
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        visibleColumns={['name', 'channel']}
        onColumnVisibilityChange={vi.fn()}
      />
    )
    // The header text "Estado" should NOT appear, but the toolbar button
    // and dropdown still expose column.header strings only on demand.
    expect(screen.queryByText('Estado')).not.toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Canal')).toBeInTheDocument()
  })
})
