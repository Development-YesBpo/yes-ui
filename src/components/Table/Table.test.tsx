import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Table } from './Table'
import type { TableColumn } from './Table'

const COLUMNS: TableColumn<{ id: string; name: string; status: string }>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'status', header: 'Estado' },
]

const DATA = [
  { id: '1', name: 'Carlos Rodríguez', status: 'Activo' },
  { id: '2', name: 'María Gómez', status: 'Pendiente' },
  { id: '3', name: 'Andrés Martínez', status: 'Inactivo' },
]

const getRowId = (row: (typeof DATA)[0]) => row.id

describe('Table', () => {
  // ── Rendering ──────────────────────────────────────────────
  it('renders all column headers', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
  })

  it('renders all data rows', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
    expect(screen.getByText('María Gómez')).toBeInTheDocument()
    expect(screen.getByText('Andrés Martínez')).toBeInTheDocument()
  })

  it('uses getRowId as data-row-id attribute on each row', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(document.querySelector('[data-row-id="1"]')).toBeInTheDocument()
    expect(document.querySelector('[data-row-id="2"]')).toBeInTheDocument()
    expect(document.querySelector('[data-row-id="3"]')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(
      <Table columns={COLUMNS} data={DATA} getRowId={getRowId} data-testid="my-table" />
    )
    expect(screen.getByTestId('my-table')).toBeInTheDocument()
  })

  // ── Loading state ─────────────────────────────────────────
  it('shows 5 skeleton rows when isLoading is true', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} isLoading />)
    const skeletons = document.querySelectorAll('[data-skeleton-row]')
    expect(skeletons).toHaveLength(5)
  })

  it('hides data rows when isLoading is true', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} isLoading />)
    expect(screen.queryByText('Carlos Rodríguez')).not.toBeInTheDocument()
  })

  // ── Empty state ───────────────────────────────────────────
  it('shows EmptyState when data is empty', () => {
    render(
      <Table
        columns={COLUMNS}
        data={[]}
        getRowId={getRowId}
        emptyMessage="Sin resultados"
      />
    )
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
  })

  it('does not show EmptyState when data has rows', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        emptyMessage="Sin resultados"
      />
    )
    expect(screen.queryByText('Sin resultados')).not.toBeInTheDocument()
  })

  // ── Selectable ────────────────────────────────────────────
  it('renders checkbox column when selectable is true', () => {
    render(
      <Table columns={COLUMNS} data={DATA} getRowId={getRowId} selectable />
    )
    const checkboxes = screen.getAllByRole('checkbox')
    // 1 header (select-all) + 3 row checkboxes
    expect(checkboxes.length).toBeGreaterThanOrEqual(4)
  })

  it('does not render checkbox column when selectable is false', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />)
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('calls onSelectionChange with correct Set when a row checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />
    )
    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1) // skip header
    await user.click(rowCheckboxes[0]!)
    expect(onSelectionChange).toHaveBeenCalledTimes(1)
    const arg = onSelectionChange.mock.calls[0]![0] as Set<string>
    expect(arg).toBeInstanceOf(Set)
    expect(arg.has('1')).toBe(true)
  })

  it('select-all selects all visible rows', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />
    )
    const [selectAll] = screen.getAllByRole('checkbox')
    await user.click(selectAll!)
    const arg = onSelectionChange.mock.calls[0]![0] as Set<string>
    expect(arg.size).toBe(3)
    expect(arg.has('1')).toBe(true)
    expect(arg.has('2')).toBe(true)
    expect(arg.has('3')).toBe(true)
  })

  it('select-all deselects all when all are already selected', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        selectable
        selectedIds={new Set(['1', '2', '3'])}
        onSelectionChange={onSelectionChange}
      />
    )
    const [selectAll] = screen.getAllByRole('checkbox')
    await user.click(selectAll!)
    const arg = onSelectionChange.mock.calls[0]![0] as Set<string>
    expect(arg.size).toBe(0)
  })

  // ── Sorting ────────────────────────────────────────────────
  it('calls onSort with the correct key when a sortable column header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        onSort={onSort}
      />
    )
    await user.click(screen.getByText('Nombre'))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('does not call onSort when a non-sortable column header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        onSort={onSort}
      />
    )
    await user.click(screen.getByText('Estado'))
    expect(onSort).not.toHaveBeenCalled()
  })

  it('shows sort direction indicator when sortKey matches column', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        sortKey="name"
        sortDirection="asc"
      />
    )
    expect(document.querySelector('[data-sort-indicator]')).toBeInTheDocument()
  })

  it('does not show sort indicator when sortKey does not match any column', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        sortKey="other"
        sortDirection="asc"
      />
    )
    expect(document.querySelector('[data-sort-indicator]')).not.toBeInTheDocument()
  })

  // ── Pagination ─────────────────────────────────────────────
  it('renders pagination when total > pageSize', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        page={1}
        pageSize={2}
        total={10}
        onPageChange={vi.fn()}
      />
    )
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('does not render pagination when total <= pageSize', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        page={1}
        pageSize={20}
        total={3}
        onPageChange={vi.fn()}
      />
    )
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={getRowId}
        page={1}
        pageSize={1}
        total={3}
        onPageChange={onPageChange}
      />
    )
    // Pagination buttons expose accessible name via aria-label "Página N"
    const page2 = screen.getByRole('button', { name: 'Página 2' })
    await user.click(page2)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  // ── Custom render ─────────────────────────────────────────
  it('calls column render function with value, row, and index', () => {
    const renderFn = vi.fn().mockReturnValue(<span>custom</span>)
    const cols: TableColumn<(typeof DATA)[0]>[] = [
      { key: 'name', header: 'Nombre', render: renderFn },
    ]
    render(<Table columns={cols} data={[DATA[0]!]} getRowId={getRowId} />)
    expect(renderFn).toHaveBeenCalledWith(DATA[0]!.name, DATA[0]!, 0)
    expect(screen.getByText('custom')).toBeInTheDocument()
  })
})
