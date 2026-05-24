# @yes/ui Wave 6b — Tables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship Table and TableAdvanced — the two most-used data display components in @yes/ui — as fully tested, Storybook-documented, visually validated exports.

**Architecture:** Table is the base — it handles all core data rendering, sorting, selection, and pagination. TableAdvanced composes Table and adds multi-column sort priority, column resize handles, and a ColumnManager dropdown. Both consume Wave 6a primitives (Pagination, Toolbar, BulkActionBar) and Wave 1/2/3 atoms. Build Table first; TableAdvanced imports and extends it.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Dependencies (must be shipped before this wave):**
- Wave 1: Badge, ChannelBadge, Spinner
- Wave 2: Checkbox
- Wave 3: Skeleton, EmptyState
- Wave 6a: Pagination, Toolbar, BulkActionBar

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add table tokens (Task 1 Step 1)

src/components/
├── Table/
│   ├── Table.tsx
│   ├── Table.module.css
│   ├── Table.test.tsx
│   ├── Table.stories.tsx
│   ├── Table.mdx
│   └── index.ts
└── TableAdvanced/
    ├── TableAdvanced.tsx
    ├── TableAdvanced.module.css
    ├── TableAdvanced.test.tsx
    ├── TableAdvanced.stories.tsx
    ├── TableAdvanced.mdx
    └── index.ts

src/index.ts                         ← uncomment exports per component
```

---

## Task 1: Table

**Reference:** `preview/components-table.html`
**UI Kit reference:** `crm/CRMApp.jsx` → `ContactsTable` + `FilterBar`

**Translation passes:**
- Table wrap: bg #fff, border `1px solid #E5E7EB`, border-radius 8px, overflow hidden → `--yes-color-border` / `--yes-radius-card` ✓
- Header: bg #F9FAFB, border-bottom `1px solid #E5E7EB` → `--yes-color-bg` / `--yes-color-border` ✓
- Header height: 38px → new token `--yes-size-table-header-h: 38px`
- Header text: font-size 11px, font-weight 700, letter-spacing 0.04em, uppercase, color #6B7280 → `--yes-color-text-muted` ✓. New tokens: `--yes-size-table-header-text: 11px`, `--yes-tracking-table-header: 0.04em`
- Header sorted: color #2B52A0 → `--yes-color-primary` ✓
- Row height: 44px → `--yes-size-height-lg` ✓ (44px)
- Row hover bg: #F9FAFB → `--yes-color-bg` ✓
- Row selected bg: #EEF3FA → `--yes-color-primary-subtle` ✓
- Row selected left border: 3px solid #2B52A0 → `--yes-color-primary` ✓. New token: `--yes-size-table-row-selected-border: 3px`
- Row border-bottom: `1px solid #F3F4F6` → `--yes-color-bg` (app background) ✓
- Cell padding: 0 16px → `--yes-size-px-md` ✓
- Row actions: opacity 0 → 1 on hover, transition 120ms → `--yes-duration-fast` (add if missing)
- Action button: 26px × 26px, border 1px solid #E5E7EB, radius 4px, color #6B7280 → new tokens: `--yes-size-table-action-btn: 26px`
- Sorted column indicator: ↑ or ↓ suffix, 10px → `--yes-size-table-header-text` (same size)
- Toolbar: bg #FAFAFA, border-bottom 1px solid #F3F4F6 → already in Toolbar component (Wave 6a)
- Pagination: already in Pagination component (Wave 6a)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Table/Table.tsx`
- Create: `src/components/Table/Table.module.css`
- Create: `src/components/Table/Table.test.tsx`
- Create: `src/components/Table/Table.stories.tsx`
- Create: `src/components/Table/Table.mdx`
- Create: `src/components/Table/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add Table tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the last existing component token block:

```css
  /* ── Table ───────────────────────────────────────────────── */
  --yes-size-table-header-h:              38px;
  --yes-size-table-header-text:           11px;
  --yes-tracking-table-header:            0.04em;
  --yes-size-table-row-selected-border:   3px;
  --yes-size-table-action-btn:            26px;
  --yes-duration-fast:                    120ms;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Table/Table.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
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
    // Pagination component from Wave 6a renders a nav or pagination wrapper
    expect(document.querySelector('[data-testid="pagination"], [role="navigation"]')).toBeInTheDocument()
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
    expect(document.querySelector('[data-testid="pagination"]')).not.toBeInTheDocument()
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
    // Click page 2 button
    const page2 = screen.getByRole('button', { name: '2' })
    await user.click(page2)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  // ── Custom render ─────────────────────────────────────────
  it('calls column render function with value, row, and index', () => {
    const render_ = vi.fn().mockReturnValue(<span>custom</span>)
    const cols: TableColumn<(typeof DATA)[0]>[] = [
      { key: 'name', header: 'Nombre', render: render_ },
    ]
    render(<Table columns={cols} data={[DATA[0]!]} getRowId={getRowId} />)
    expect(render_).toHaveBeenCalledWith(DATA[0]!.name, DATA[0]!, 0)
    expect(screen.getByText('custom')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/Table/Table.test.tsx` — "Cannot find module './Table'".

- [ ] **Step 4: Implement Table**

Create `src/components/Table/Table.module.css`:

```css
/* ── Outer wrap ──────────────────────────────────────────── */
.wrap {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  overflow: hidden;
  box-shadow: var(--yes-shadow-xs);
  display: flex;
  flex-direction: column;
}

/* ── Table element ───────────────────────────────────────── */
.table {
  width: 100%;
  border-collapse: collapse;
}

/* ── Header ──────────────────────────────────────────────── */
.thead tr {
  background: var(--yes-color-bg);
  border-bottom: 1px solid var(--yes-color-border);
}

.th {
  padding: 0 var(--yes-size-px-md);
  height: var(--yes-size-table-header-h);
  text-align: left;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-table-header-text);
  font-weight: var(--yes-weight-bold);
  letter-spacing: var(--yes-tracking-table-header);
  text-transform: uppercase;
  color: var(--yes-color-text-muted);
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
}

.thSortable {
  cursor: pointer;
}

.thSortable:hover {
  color: var(--yes-color-text);
}

.thSorted {
  color: var(--yes-color-primary);
}

.thCheckbox {
  width: 40px;
  padding: 0 var(--yes-size-px-md);
}

/* ── Sort indicator ──────────────────────────────────────── */
.sortIndicator {
  font-size: var(--yes-size-table-header-text);
  margin-left: 3px;
  color: var(--yes-color-primary);
}

/* ── Rows ────────────────────────────────────────────────── */
.td {
  padding: 0 var(--yes-size-px-md);
  height: var(--yes-size-height-lg);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  border-bottom: 1px solid var(--yes-color-bg);
  vertical-align: middle;
}

.tr:last-child .td {
  border-bottom: none;
}

.tr:hover .td {
  background: var(--yes-color-bg);
}

.tr:hover .rowActions {
  opacity: 1;
}

.trSelected .td {
  background: var(--yes-color-primary-subtle);
}

.trSelected .tdCheckbox {
  border-left: var(--yes-size-table-row-selected-border) solid var(--yes-color-primary);
  padding-left: calc(var(--yes-size-px-md) - var(--yes-size-table-row-selected-border));
}

.tdCheckbox {
  width: 40px;
  padding: 0 var(--yes-size-px-md);
}

/* ── Row actions ─────────────────────────────────────────── */
.rowActions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--yes-duration-fast) ease;
}

.actionBtn {
  width: var(--yes-size-table-action-btn);
  height: var(--yes-size-table-action-btn);
  border-radius: var(--yes-radius-sm);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
}

.actionBtn:hover {
  background: var(--yes-color-bg);
  color: var(--yes-color-text);
}

/* ── Checkbox ─────────────────────────────────────────────── */
.checkbox {
  accent-color: var(--yes-color-primary);
  width: 15px;
  height: 15px;
  cursor: pointer;
}

/* ── Loading skeleton rows ───────────────────────────────── */
.skeletonRow .td {
  padding: var(--yes-space-3) var(--yes-size-px-md);
}

/* ── Empty state ─────────────────────────────────────────── */
.emptyWrap {
  padding: var(--yes-space-16) var(--yes-size-px-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Pagination ──────────────────────────────────────────── */
.paginationWrap {
  border-top: 1px solid var(--yes-color-bg);
  background: var(--yes-color-bg);
}
```

Create `src/components/Table/Table.tsx`:

```tsx
import React from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../Skeleton/Skeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import { Pagination } from '../Pagination/Pagination'
import { Checkbox } from '../Checkbox/Checkbox'
import type { BaseProps } from '../../types/shared'
import styles from './Table.module.css'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: number
  sortable?: boolean
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

export interface TableProps<T = Record<string, unknown>> extends BaseProps {
  columns: TableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
}

const SKELETON_ROW_COUNT = 5

export function Table<T = Record<string, unknown>>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = 'Sin resultados',
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  sortKey,
  sortDirection = 'asc',
  onSort,
  page,
  pageSize,
  total,
  onPageChange,
  className,
  style,
  'data-testid': testId,
}: TableProps<T>) {
  const allIds = data.map(getRowId)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id))
  const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected

  function handleSelectAll() {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(allIds))
    }
  }

  function handleRowSelect(id: string) {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  const showPagination =
    typeof total === 'number' &&
    typeof pageSize === 'number' &&
    total > pageSize &&
    typeof page === 'number' &&
    typeof onPageChange === 'function'

  return (
    <div
      className={cn(styles.wrap, className)}
      style={style}
      data-testid={testId}
    >
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {selectable && (
              <th className={cn(styles.th, styles.thCheckbox)}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortKey === col.key
              return (
                <th
                  key={col.key}
                  className={cn(
                    styles.th,
                    col.sortable && styles.thSortable,
                    isSorted && styles.thSorted,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                  aria-sort={
                    isSorted
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {col.header}
                  {isSorted && (
                    <span
                      className={styles.sortIndicator}
                      data-sort-indicator=""
                      aria-hidden="true"
                    >
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className={cn(styles.tr, styles.skeletonRow)}
                  data-skeleton-row=""
                >
                  {selectable && (
                    <td className={cn(styles.td, styles.tdCheckbox)}>
                      <Skeleton width={15} height={15} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <Skeleton height={14} />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rowIndex) => {
                const id = getRowId(row)
                const isSelected = selectedIds.has(id)
                return (
                  <tr
                    key={id}
                    data-row-id={id}
                    className={cn(styles.tr, isSelected && styles.trSelected)}
                  >
                    {selectable && (
                      <td className={cn(styles.td, styles.tdCheckbox)}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isSelected}
                          onChange={() => handleRowSelect(id)}
                          aria-label={`Seleccionar fila ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = (row as Record<string, unknown>)[col.key]
                      return (
                        <td key={col.key} className={styles.td}>
                          {col.render
                            ? col.render(value, row, rowIndex)
                            : (value as React.ReactNode)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
        </tbody>
      </table>

      {!isLoading && data.length === 0 && (
        <div className={styles.emptyWrap}>
          <EmptyState message={emptyMessage} />
        </div>
      )}

      {showPagination && (
        <div className={styles.paginationWrap}>
          <Pagination
            page={page!}
            pageSize={pageSize!}
            total={total!}
            onPageChange={onPageChange!}
            data-testid="pagination"
          />
        </div>
      )}
    </div>
  )
}
```

Create `src/components/Table/index.ts`:

```typescript
export { Table } from './Table'
export type { TableColumn, TableProps } from './Table'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Table/Table.test.tsx` — 20+ tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Table/Table.stories.tsx`:

```tsx
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
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla de datos con soporte de ordenamiento, selección y paginación. Reference: `preview/components-table.html`.',
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
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 6 — Data display / Table / WithData`.
Open `design-system-reference/preview/components-table.html` in a browser.
Compare side-by-side:
- Header: bg #F9FAFB, uppercase 11px bold #6B7280, 38px height
- Rows: 44px height, 16px horizontal padding, bottom border #F3F4F6
- Row hover: #F9FAFB background
- Sort indicator: ↑/↓ in #2B52A0
- Checkbox column: 40px wide, accent-color primary blue

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Table/Table.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as TableStories from './Table.stories'

<Meta of={TableStories} />

# Table

Tabla de datos estándar. Soporta ordenamiento de columnas, selección de filas,
estados de carga y vacío, y paginación. Todos los valores de celda pasan
por `column.render()` para renderizado personalizado.

**Referencia:** `preview/components-table.html`
**UI Kit:** `crm/CRMApp.jsx` → `ContactsTable`

## Cuándo usar Table vs TableAdvanced

| Caso | Componente |
|------|-----------|
| Lista simple con 1 sort activo | `Table` |
| Operaciones en lote sobre registros | `TableAdvanced` |
| Multi-sort con prioridad numerada | `TableAdvanced` |
| Redimensión de columnas | `TableAdvanced` |
| Gestión de visibilidad de columnas | `TableAdvanced` |

## Uso

```tsx
import { Table } from '@yes/ui'
import type { TableColumn } from '@yes/ui'

const columns: TableColumn<Contact>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'status', header: 'Estado', render: (val) => <Badge>{val}</Badge> },
]

<Table
  columns={columns}
  data={contacts}
  getRowId={(c) => c.id}
  selectable
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  sortKey={sortKey}
  sortDirection={sortDir}
  onSort={handleSort}
  page={page}
  pageSize={20}
  total={total}
  onPageChange={setPage}
/>
```

## Accesibilidad

- `aria-sort` en encabezados de columna ordenables
- Checkbox de selección tiene `aria-label` descriptivo
- Estado de carga: filas skeleton — no se anuncia como contenido
- Estado vacío: texto de mensaje legible por lectores de pantalla

<Canvas of={TableStories.WithData} />
<Controls of={TableStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Table } from './components/Table'
export type { TableColumn, TableProps } from './components/Table'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/Table/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-6b): agregar componente Table"
```

---

## Task 2: TableAdvanced

**Reference:** `preview/components-table-advanced.html`
**UI Kit reference:** `crm/CRMApp.jsx` — full table with bulk actions and column management

**Translation passes (TableAdvanced additions over Table):**
- Bulk bar: bg #EEF3FA → `--yes-color-primary-subtle` ✓, border-bottom 1px #B3C5E6 → `--yes-color-primary-border` ✓
- Bulk count: font-size 13px, font-weight 700, color #2B52A0 → `--yes-text-sm`, `--yes-weight-bold`, `--yes-color-primary` ✓
- Bulk action button: height 28px, border 1px #B3C5E6, radius 5px, font-size 12px, font-weight 600, color #2B52A0 → new token `--yes-size-table-bulk-btn-h: 28px`
- Bulk danger button: color #DC2626, border-color #FECACA → `--yes-color-danger`, `--yes-color-danger-border` ✓
- Bulk divider: 1px × 18px, bg #D8E3F4 → new token `--yes-color-table-bulk-divider: #D8E3F4`
- Sort priority badge: 14px circle, bg #2B52A0, color white, font-size 8px, font-weight 700 → new tokens: `--yes-size-table-sort-priority: 14px`, `--yes-size-table-sort-priority-text: 8px`
- Resize handle: position absolute, right 0, top 25%, height 50%, width 3px, transparent → visible on th:hover (#E5E7EB) → `--yes-color-border` ✓. New token: `--yes-size-table-resize-handle-w: 3px`
- Column manager dropdown: bg white, border `1px solid #E5E7EB`, radius 8px, box-shadow → `--yes-color-surface` / `--yes-color-border` / `--yes-radius-card` / `--yes-shadow-md`
- Column manager header text: font-size 11px, font-weight 700, color #374151, uppercase → `--yes-size-table-header-text`, `--yes-weight-bold`, `--yes-color-text`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/TableAdvanced/TableAdvanced.tsx`
- Create: `src/components/TableAdvanced/TableAdvanced.module.css`
- Create: `src/components/TableAdvanced/TableAdvanced.test.tsx`
- Create: `src/components/TableAdvanced/TableAdvanced.stories.tsx`
- Create: `src/components/TableAdvanced/TableAdvanced.mdx`
- Create: `src/components/TableAdvanced/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add TableAdvanced tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the Table token block:

```css
  /* ── TableAdvanced ───────────────────────────────────────── */
  --yes-size-table-bulk-btn-h:        28px;
  --yes-color-table-bulk-divider:     #D8E3F4;
  --yes-size-table-sort-priority:     14px;
  --yes-size-table-sort-priority-text: 8px;
  --yes-size-table-resize-handle-w:   3px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/TableAdvanced/TableAdvanced.test.tsx`:

```tsx
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
    // Priority badge "1" for 'name', "2" for 'status'
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
    // One per column (excludes checkbox column)
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
    // Click Estado checkbox in dropdown
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
    expect(screen.queryByText('Estado')).not.toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Canal')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/TableAdvanced/TableAdvanced.test.tsx` — "Cannot find module './TableAdvanced'".

- [ ] **Step 4: Implement TableAdvanced**

Create `src/components/TableAdvanced/TableAdvanced.module.css`:

```css
/* ── Outer wrap ──────────────────────────────────────────── */
.wrap {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  overflow: hidden;
  box-shadow: var(--yes-shadow-xs);
  display: flex;
  flex-direction: column;
}

/* ── Bulk action bar ─────────────────────────────────────── */
.bulkBar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px var(--yes-size-px-md);
  background: var(--yes-color-primary-subtle);
  border-bottom: 1px solid var(--yes-color-primary-border);
  flex-wrap: wrap;
}

.bulkCount {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-primary);
  margin-right: 4px;
}

.bulkAction {
  height: var(--yes-size-table-bulk-btn-h);
  padding: 0 10px;
  border-radius: var(--yes-radius-sm);
  border: 1px solid var(--yes-color-primary-border);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-primary);
  cursor: pointer;
}

.bulkAction:hover {
  background: var(--yes-color-primary-subtle);
}

.bulkActionDanger {
  color: var(--yes-color-danger);
  border-color: var(--yes-color-danger-border);
}

.bulkActionDanger:hover {
  background: var(--yes-color-danger-subtle);
}

.bulkDivider {
  width: 1px;
  height: 18px;
  background: var(--yes-color-table-bulk-divider);
  margin: 0 4px;
}

.bulkClear {
  margin-left: auto;
  background: none;
  border: none;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text-muted);
  cursor: pointer;
}

.bulkClear:hover {
  color: var(--yes-color-text);
}

/* ── Toolbar area (for column manager) ───────────────────── */
.toolbarWrap {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px var(--yes-size-px-md);
  border-bottom: 1px solid var(--yes-color-bg);
  background: var(--yes-color-bg);
  flex-wrap: wrap;
}

.colManagerWrap {
  margin-left: auto;
  position: relative;
}

.colManagerBtn {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-btn);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text);
  cursor: pointer;
}

.colManagerBtn:hover {
  background: var(--yes-color-bg);
}

/* ── Column manager dropdown ─────────────────────────────── */
.colDropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 50;
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-md);
  min-width: 200px;
  padding: var(--yes-space-3) 0;
}

.colDropdownHeader {
  padding: var(--yes-space-2) var(--yes-size-px-md);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-table-header-text);
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text);
  text-transform: uppercase;
  letter-spacing: var(--yes-tracking-table-header);
  border-bottom: 1px solid var(--yes-color-bg);
  margin-bottom: var(--yes-space-1);
}

.colRow {
  display: flex;
  align-items: center;
  gap: var(--yes-space-3);
  padding: var(--yes-space-2) var(--yes-size-px-md);
  cursor: pointer;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
}

.colRow:hover {
  background: var(--yes-color-bg);
}

.colRowCheckbox {
  accent-color: var(--yes-color-primary);
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.colDropdownFooter {
  border-top: 1px solid var(--yes-color-bg);
  padding: var(--yes-space-2) var(--yes-size-px-md);
  margin-top: var(--yes-space-1);
}

.colResetBtn {
  background: none;
  border: none;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
  cursor: pointer;
  padding: 0;
}

.colResetBtn:hover {
  color: var(--yes-color-primary);
}

/* ── Table element ───────────────────────────────────────── */
.table {
  width: 100%;
  border-collapse: collapse;
}

.thead tr {
  background: var(--yes-color-bg);
  border-bottom: 1px solid var(--yes-color-border);
}

/* ── Advanced header cell ────────────────────────────────── */
.th {
  padding: 0 var(--yes-size-px-md);
  height: var(--yes-size-table-header-h);
  text-align: left;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-table-header-text);
  font-weight: var(--yes-weight-bold);
  letter-spacing: var(--yes-tracking-table-header);
  text-transform: uppercase;
  color: var(--yes-color-text-muted);
  white-space: nowrap;
  user-select: none;
  position: relative;
  vertical-align: middle;
}

.thSortable {
  cursor: pointer;
}

.thSortable:hover {
  color: var(--yes-color-text);
}

.thSortAsc,
.thSortDesc {
  color: var(--yes-color-primary);
}

.thCheckbox {
  width: 40px;
  padding: 0 var(--yes-size-px-md);
}

/* ── Sort indicator & priority badge ─────────────────────── */
.sortIndicator {
  font-size: var(--yes-size-table-header-text);
  margin-left: 3px;
  color: var(--yes-color-primary);
}

.sortPriority {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--yes-size-table-sort-priority);
  height: var(--yes-size-table-sort-priority);
  background: var(--yes-color-primary);
  color: var(--yes-primitive-white);
  font-size: var(--yes-size-table-sort-priority-text);
  font-weight: var(--yes-weight-bold);
  border-radius: 50%;
  margin-left: 2px;
  vertical-align: middle;
}

/* ── Resize handle ───────────────────────────────────────── */
.resizeHandle {
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: var(--yes-size-table-resize-handle-w);
  background: transparent;
  cursor: col-resize;
  border-radius: 2px;
  transition: background var(--yes-duration-fast) ease;
}

.th:hover .resizeHandle {
  background: var(--yes-color-border);
}

/* ── Rows ────────────────────────────────────────────────── */
.td {
  padding: 0 var(--yes-size-px-md);
  height: var(--yes-size-height-lg);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  border-bottom: 1px solid var(--yes-color-bg);
  vertical-align: middle;
}

.tr:last-child .td {
  border-bottom: none;
}

.tr:hover .td {
  background: var(--yes-color-bg);
}

.tr:hover .rowActions {
  opacity: 1;
}

.trSelected .td {
  background: var(--yes-color-primary-subtle);
}

.trSelected .tdCheckbox {
  border-left: var(--yes-size-table-row-selected-border) solid var(--yes-color-primary);
  padding-left: calc(var(--yes-size-px-md) - var(--yes-size-table-row-selected-border));
}

.tdCheckbox {
  width: 40px;
  padding: 0 var(--yes-size-px-md);
}

/* ── Row actions ─────────────────────────────────────────── */
.rowActions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity var(--yes-duration-fast) ease;
}

.actionBtn {
  width: var(--yes-size-table-action-btn);
  height: var(--yes-size-table-action-btn);
  border-radius: var(--yes-radius-sm);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
}

/* ── Checkbox ─────────────────────────────────────────────── */
.checkbox {
  accent-color: var(--yes-color-primary);
  width: 14px;
  height: 14px;
  cursor: pointer;
}

/* ── Loading skeletons ───────────────────────────────────── */
.skeletonRow .td {
  padding: var(--yes-space-3) var(--yes-size-px-md);
}

/* ── Empty state ─────────────────────────────────────────── */
.emptyWrap {
  padding: var(--yes-space-16) var(--yes-size-px-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Pagination ──────────────────────────────────────────── */
.paginationWrap {
  border-top: 1px solid var(--yes-color-bg);
  background: var(--yes-color-bg);
}
```

Create `src/components/TableAdvanced/TableAdvanced.tsx`:

```tsx
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../Skeleton/Skeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import { Pagination } from '../Pagination/Pagination'
import type { TableColumn, TableProps } from '../Table/Table'
import type { BaseProps } from '../../types/shared'
import styles from './TableAdvanced.module.css'

export interface TableAdvancedProps<T = Record<string, unknown>>
  extends TableProps<T> {
  sortConfig?: Array<{ key: string; direction: 'asc' | 'desc' }>
  visibleColumns?: string[]
  onColumnVisibilityChange?: (key: string, visible: boolean) => void
  onColumnReset?: () => void
  bulkActions?: Array<{
    label: string
    onClick: (ids: Set<string>) => void
    danger?: boolean
  }>
}

const SKELETON_ROW_COUNT = 5

export function TableAdvanced<T = Record<string, unknown>>({
  columns,
  data,
  getRowId,
  isLoading = false,
  emptyMessage = 'Sin resultados',
  selectable = false,
  selectedIds = new Set<string>(),
  onSelectionChange,
  sortKey,
  sortDirection = 'asc',
  onSort,
  sortConfig,
  visibleColumns,
  onColumnVisibilityChange,
  onColumnReset,
  bulkActions,
  page,
  pageSize,
  total,
  onPageChange,
  className,
  style,
  'data-testid': testId,
}: TableAdvancedProps<T>) {
  const [colManagerOpen, setColManagerOpen] = useState(false)
  const colManagerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!colManagerOpen) return
    function handleClick(e: MouseEvent) {
      if (colManagerRef.current && !colManagerRef.current.contains(e.target as Node)) {
        setColManagerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [colManagerOpen])

  const effectiveCols = visibleColumns
    ? columns.filter((c) => visibleColumns.includes(c.key))
    : columns

  const allIds = data.map(getRowId)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id))
  const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected

  function handleSelectAll() {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(allIds))
    }
  }

  function handleRowSelect(id: string) {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  // Sort config lookup helpers
  function getSortEntry(key: string) {
    return sortConfig?.find((s) => s.key === key)
  }

  function getSortPriority(key: string) {
    if (!sortConfig) return undefined
    const idx = sortConfig.findIndex((s) => s.key === key)
    return idx >= 0 ? idx + 1 : undefined
  }

  // Resize state
  const [colWidths, setColWidths] = useState<Record<string, number>>({})
  const resizingRef = useRef<{
    key: string
    startX: number
    startW: number
  } | null>(null)

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, key: string, currentW: number) => {
      e.preventDefault()
      resizingRef.current = { key, startX: e.clientX, startW: currentW }

      function onMouseMove(mv: MouseEvent) {
        if (!resizingRef.current) return
        const delta = mv.clientX - resizingRef.current.startX
        const newW = Math.max(60, resizingRef.current.startW + delta)
        setColWidths((prev) => ({ ...prev, [resizingRef.current!.key]: newW }))
      }

      function onMouseUp() {
        resizingRef.current = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [],
  )

  const showBulkBar = selectable && selectedIds.size > 0
  const showPagination =
    typeof total === 'number' &&
    typeof pageSize === 'number' &&
    total > pageSize &&
    typeof page === 'number' &&
    typeof onPageChange === 'function'

  const showColManager =
    visibleColumns !== undefined && onColumnVisibilityChange !== undefined

  return (
    <div
      className={cn(styles.wrap, className)}
      style={style}
      data-testid={testId}
    >
      {/* Bulk action bar */}
      {showBulkBar && (
        <div className={styles.bulkBar}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected
            }}
            onChange={handleSelectAll}
            aria-label="Seleccionar todos"
          />
          <span className={styles.bulkCount}>
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
          </span>
          {bulkActions
            ?.filter((a) => !a.danger)
            .map((action) => (
              <button
                key={action.label}
                type="button"
                className={styles.bulkAction}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </button>
            ))}
          {bulkActions?.some((a) => a.danger) && (
            <div className={styles.bulkDivider} aria-hidden="true" />
          )}
          {bulkActions
            ?.filter((a) => a.danger)
            .map((action) => (
              <button
                key={action.label}
                type="button"
                className={cn(styles.bulkAction, styles.bulkActionDanger)}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </button>
            ))}
          <button
            type="button"
            className={styles.bulkClear}
            onClick={() => onSelectionChange?.(new Set())}
            aria-label="Limpiar selección"
          >
            × Limpiar selección
          </button>
        </div>
      )}

      {/* Toolbar with column manager */}
      {showColManager && (
        <div className={styles.toolbarWrap}>
          <div className={styles.colManagerWrap} ref={colManagerRef}>
            <button
              type="button"
              className={styles.colManagerBtn}
              onClick={() => setColManagerOpen((o) => !o)}
              aria-expanded={colManagerOpen}
              aria-label="Administrar columnas"
            >
              ⊞ Columnas ▾
            </button>
            {colManagerOpen && (
              <div
                className={styles.colDropdown}
                role="dialog"
                aria-label="Columnas visibles"
              >
                <div className={styles.colDropdownHeader}>Columnas visibles</div>
                {columns.map((col) => {
                  const isVisible = visibleColumns!.includes(col.key)
                  return (
                    <label key={col.key} className={styles.colRow}>
                      <input
                        type="checkbox"
                        className={styles.colRowCheckbox}
                        checked={isVisible}
                        onChange={() =>
                          onColumnVisibilityChange!(col.key, !isVisible)
                        }
                        aria-label={col.header}
                      />
                      {col.header}
                    </label>
                  )
                })}
                {onColumnReset && (
                  <div className={styles.colDropdownFooter}>
                    <button
                      type="button"
                      className={styles.colResetBtn}
                      onClick={() => {
                        onColumnReset()
                        setColManagerOpen(false)
                      }}
                      aria-label="Restablecer columnas"
                    >
                      Restablecer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {selectable && (
              <th className={cn(styles.th, styles.thCheckbox)}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
            )}
            {effectiveCols.map((col) => {
              const sortEntry = getSortEntry(col.key)
              const priority = getSortPriority(col.key)
              const isSortAsc = sortEntry?.direction === 'asc'
              const isSortDesc = sortEntry?.direction === 'desc'
              // Single-sort fallback
              const singleSorted = !sortConfig && sortKey === col.key
              const singleDir = sortDirection
              const colW = colWidths[col.key] ?? col.width

              return (
                <th
                  key={col.key}
                  className={cn(
                    styles.th,
                    col.sortable && styles.thSortable,
                    (sortEntry || singleSorted) && isSortAsc && styles.thSortAsc,
                    (sortEntry || singleSorted) && isSortDesc && styles.thSortDesc,
                    singleSorted &&
                      singleDir === 'asc' &&
                      !sortEntry &&
                      styles.thSortAsc,
                    singleSorted &&
                      singleDir === 'desc' &&
                      !sortEntry &&
                      styles.thSortDesc,
                  )}
                  style={colW ? { width: colW } : undefined}
                  onClick={
                    col.sortable && onSort ? () => onSort(col.key) : undefined
                  }
                  aria-sort={
                    sortEntry
                      ? isSortAsc
                        ? 'ascending'
                        : 'descending'
                      : singleSorted
                        ? singleDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                  }
                >
                  {col.header}
                  {(sortEntry || singleSorted) && (
                    <span
                      className={styles.sortIndicator}
                      data-sort-indicator=""
                      aria-hidden="true"
                    >
                      {(sortEntry?.direction ?? singleDir) === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                  {priority !== undefined && (
                    <span
                      className={styles.sortPriority}
                      data-sort-priority={priority}
                      aria-hidden="true"
                    >
                      {priority}
                    </span>
                  )}
                  <span
                    className={styles.resizeHandle}
                    data-resize-handle=""
                    onMouseDown={(e) =>
                      handleResizeStart(e, col.key, colW ?? 120)
                    }
                    aria-hidden="true"
                  />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className={cn(styles.tr, styles.skeletonRow)}
                  data-skeleton-row=""
                >
                  {selectable && (
                    <td className={cn(styles.td, styles.tdCheckbox)}>
                      <Skeleton width={14} height={14} />
                    </td>
                  )}
                  {effectiveCols.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <Skeleton height={14} />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rowIndex) => {
                const id = getRowId(row)
                const isSelected = selectedIds.has(id)
                return (
                  <tr
                    key={id}
                    data-row-id={id}
                    className={cn(
                      styles.tr,
                      isSelected && styles.trSelected,
                    )}
                  >
                    {selectable && (
                      <td className={cn(styles.td, styles.tdCheckbox)}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isSelected}
                          onChange={() => handleRowSelect(id)}
                          aria-label={`Seleccionar fila ${id}`}
                        />
                      </td>
                    )}
                    {effectiveCols.map((col) => {
                      const value = (row as Record<string, unknown>)[col.key]
                      return (
                        <td key={col.key} className={styles.td}>
                          {col.render
                            ? col.render(value, row, rowIndex)
                            : (value as React.ReactNode)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
        </tbody>
      </table>

      {!isLoading && data.length === 0 && (
        <div className={styles.emptyWrap}>
          <EmptyState message={emptyMessage} />
        </div>
      )}

      {showPagination && (
        <div className={styles.paginationWrap}>
          <Pagination
            page={page!}
            pageSize={pageSize!}
            total={total!}
            onPageChange={onPageChange!}
            data-testid="pagination"
          />
        </div>
      )}
    </div>
  )
}
```

Create `src/components/TableAdvanced/index.ts`:

```typescript
export { TableAdvanced } from './TableAdvanced'
export type { TableAdvancedProps } from './TableAdvanced'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/TableAdvanced/TableAdvanced.test.tsx` — 17+ tests passing.
Also re-run full suite to confirm no Table regressions.

- [ ] **Step 6: Write stories**

Create `src/components/TableAdvanced/TableAdvanced.stories.tsx`:

```tsx
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
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla avanzada con selección en masa, multi-sort con prioridad, redimensión de columnas y gestor de columnas. Reference: `preview/components-table-advanced.html`.',
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
    render: (val) => <strong style={{ color: '#111827' }}>{val as string}</strong>,
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
    const [sortConfig, setSortConfig] = useState([
      { key: 'name', direction: 'asc' as const },
      { key: 'lastContact', direction: 'desc' as const },
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
        return [...prev, { key, direction: 'asc' as const }]
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
            onClick: (ids) => window.alert(`Asignar campaña a ${ids.size} contactos`),
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
        bulkActions={[
          { label: 'Exportar', onClick: vi.fn() ?? (() => {}) },
        ]}
        data-testid="adv-table"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkboxes = canvas.getAllByRole('checkbox')
    // Select first row (skip select-all at index 0)
    await userEvent.click(checkboxes[1]!)
    await expect(checkboxes[1]).toBeChecked()
    // Bulk bar should appear
    await expect(canvas.getByText(/1 seleccionado/i)).toBeVisible()
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 6 — Data display / TableAdvanced / FullFeatured`.
Open `design-system-reference/preview/components-table-advanced.html` in browser.
Compare side-by-side:
- Bulk bar: #EEF3FA bg, #B3C5E6 border-bottom, count in #2B52A0 bold
- Sort priority badge: small blue circle with number (1, 2)
- Resize handle: appears on header hover as 3px strip on right edge
- Column manager: opens on "⊞ Columnas ▾" click with checkbox list
- Selected row: #EEF3FA bg, 3px left border in #2B52A0
- Row actions: fade in on hover (opacity 0 → 1)

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/TableAdvanced/TableAdvanced.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as TableAdvancedStories from './TableAdvanced.stories'

<Meta of={TableAdvancedStories} />

# TableAdvanced

Extiende `Table` con operaciones en masa, ordenamiento multi-columna con prioridad
numerada, redimensión de columnas por arrastre, y un gestor de visibilidad de columnas.
Usar en pantallas de gestión intensiva: contactos CRM, reportes, colas de trabajo.

**Referencia:** `preview/components-table-advanced.html`
**UI Kit:** `crm/CRMApp.jsx`

## Diferencias respecto a Table

| Feature | Table | TableAdvanced |
|---------|-------|---------------|
| Selección de filas | ✓ | ✓ |
| Barra de acciones en masa | — | ✓ |
| Sort de 1 columna | ✓ | ✓ |
| Multi-sort con prioridad | — | ✓ |
| Redimensión de columnas | — | ✓ |
| Gestor de columnas | — | ✓ |

## Uso

```tsx
import { TableAdvanced } from '@yes/ui'

<TableAdvanced
  columns={columns}
  data={contacts}
  getRowId={(c) => c.id}
  selectable
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  sortConfig={[
    { key: 'name', direction: 'asc' },
    { key: 'createdAt', direction: 'desc' },
  ]}
  onSort={handleSort}
  visibleColumns={visibleCols}
  onColumnVisibilityChange={handleColVisibility}
  onColumnReset={resetCols}
  bulkActions={[
    { label: 'Exportar', onClick: (ids) => exportContacts(ids) },
    { label: 'Eliminar', onClick: (ids) => deleteContacts(ids), danger: true },
  ]}
/>
```

## Multi-sort

`sortConfig` reemplaza `sortKey`/`sortDirection` cuando se provee.
Cada entrada tiene prioridad según su posición en el array (índice 0 = prioridad 1).
El badge de prioridad aparece automáticamente en el encabezado de cada columna activa.

## Redimensión de columnas

La redimensión es local al componente (estado `colWidths`). Para persistir el ancho
entre sesiones, pasa `column.width` y guarda los cambios via `onColumnWidthChange`
(prop a implementar en el consumidor si se requiere persistencia).

<Canvas of={TableAdvancedStories.FullFeatured} />
<Controls of={TableAdvancedStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { TableAdvanced } from './components/TableAdvanced'
export type { TableAdvancedProps } from './components/TableAdvanced'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/TableAdvanced/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-6b): agregar componente TableAdvanced"
```

---

## Task 3: Wave 6b integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all test files passing, 0 failures.
Paste complete vitest output as evidence before marking done.

- [ ] **Step 2: Full build and dist check**

```bash
pnpm build && pnpm check-dist
```

Expected:
```
✓ dist/index.js
✓ dist/index.cjs
✓ dist/index.d.ts
✓ dist/tokens/primitives.css
✓ dist/tokens/semantic.css
✓ dist/tokens/themes/light.css
✓ dist/tokens/themes/dark.css
All dist files present.
```

- [ ] **Step 3: Verify Wave 6b exports are present**

```bash
node -e "
const { Table, TableAdvanced } = require('./dist/index.cjs');
const missing = ['Table','TableAdvanced'].filter(n => !eval(n));
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 6b exports present');
"
```

Expected: `All Wave 6b exports present`

- [ ] **Step 4: Final Storybook sweep**

```bash
pnpm dev
```

Open each story in order:
- Wave 6 — Data display / Table / Default
- Wave 6 — Data display / Table / WithData
- Wave 6 — Data display / Table / Loading
- Wave 6 — Data display / Table / Empty
- Wave 6 — Data display / Table / Selectable
- Wave 6 — Data display / Table / Sortable
- Wave 6 — Data display / Table / WithPagination
- Wave 6 — Data display / Table / Interactive (play() must pass)
- Wave 6 — Data display / TableAdvanced / Default
- Wave 6 — Data display / TableAdvanced / Loading
- Wave 6 — Data display / TableAdvanced / Empty
- Wave 6 — Data display / TableAdvanced / FullFeatured
- Wave 6 — Data display / TableAdvanced / Interactive (play() must pass)

Verify no console errors. Bulk bar, sort priority badges, resize handles, and column manager all render correctly.

- [ ] **Step 5: Commit integration verify**

```bash
git commit --allow-empty -m "chore(wave-6b): verificación de integración — Table y TableAdvanced"
```

---

## Self-review notes

**Spec coverage check:**
- ✅ Table — columnas, filas, getRowId, loading skeletons, empty state → Task 1
- ✅ Table — selección de filas, select-all, deselect-all → Task 1
- ✅ Table — sort en columna única, indicador ↑/↓, aria-sort → Task 1
- ✅ Table — paginación condicional, onPageChange → Task 1
- ✅ Table — render() personalizado por columna con value/row/index → Task 1
- ✅ Table — data-testid llega al root → Task 1
- ✅ TableAdvanced — hereda todo de Table → Task 2
- ✅ TableAdvanced — barra de acciones en masa con count, acciones, peligro, limpiar → Task 2
- ✅ TableAdvanced — multi-sort con sortConfig, badge de prioridad "1"/"2" → Task 2
- ✅ TableAdvanced — resize handle en cada encabezado de columna → Task 2
- ✅ TableAdvanced — gestor de columnas: botón, dropdown, toggle, restablecer → Task 2
- ✅ TableAdvanced — visibleColumns filtra columnas del render → Task 2
- ✅ Tokens nuevos: --yes-size-table-header-h, --yes-size-table-header-text, --yes-tracking-table-header, --yes-size-table-row-selected-border, --yes-size-table-action-btn, --yes-duration-fast, --yes-size-table-bulk-btn-h, --yes-color-table-bulk-divider, --yes-size-table-sort-priority, --yes-size-table-sort-priority-text, --yes-size-table-resize-handle-w → Tasks 1–2 Steps 1
- ✅ Stories: Default, WithData, Loading, Empty, Selectable, Sortable, WithPagination, FullFeatured, Interactive → Tasks 1–2

**Dependency note:** `Skeleton`, `EmptyState`, `Pagination`, `Checkbox` must be exported from `@yes/ui` before this wave executes. Confirm with `pnpm typecheck` before running tests.

**Generic constraint note:** `Table<T>` uses a generic type parameter. The stories use concrete types (`Contact`) to ensure type safety in render callbacks. The default `T = Record<string, unknown>` ensures untyped usage still compiles cleanly.

**Resize handle note:** Column resize is implemented via native DOM `mousemove`/`mouseup` listeners attached during drag — this is intentional (pointer capture pattern). State is React-managed (`colWidths`) and listeners are cleaned up on `mouseup`. No `addEventListener` at component mount — complies with the YES non-negotiable.
