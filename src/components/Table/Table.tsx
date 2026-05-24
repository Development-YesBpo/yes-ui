import React, { useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../Skeleton/Skeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import { Pagination } from '../Pagination/Pagination'
import type { BaseProps } from '../../types/shared'

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

// ── Style injection ────────────────────────────────────────────
// Pseudo-classes (:hover, :last-child) and descendant selectors cannot be
// expressed via React's inline `style` prop. One guarded <style> block keeps
// the dist build free of a CSS-modules loader requirement.
let tableStylesInjected = false
function injectTableStyles() {
  if (tableStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-table', '')
  el.textContent = `
    [data-yes-table-th][data-sortable='true']:hover {
      color: var(--yes-color-text);
    }
    [data-yes-table-th][data-sorted='true'] {
      color: var(--yes-color-primary);
    }
    [data-yes-table-tr]:hover [data-yes-table-td] {
      background: var(--yes-color-bg);
    }
    [data-yes-table-tr][data-selected='true'] [data-yes-table-td] {
      background: var(--yes-color-primary-subtle);
    }
    [data-yes-table-tr][data-selected='true'] [data-yes-table-td-checkbox] {
      border-left: var(--yes-size-table-row-selected-border) solid var(--yes-color-primary);
      padding-left: calc(var(--yes-size-px-md) - var(--yes-size-table-row-selected-border));
    }
    [data-yes-table-tr]:last-child [data-yes-table-td] {
      border-bottom: none;
    }
  `
  document.head.appendChild(el)
  tableStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const WRAP_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  overflow: 'hidden',
  boxShadow: 'var(--yes-shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
}

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const THEAD_ROW_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-bg)',
  borderBottom: '1px solid var(--yes-color-border)',
}

const TH_BASE_STYLE: React.CSSProperties = {
  padding: '0 var(--yes-size-px-md)',
  height: 'var(--yes-size-table-header-h)',
  textAlign: 'left',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-table-header-text)',
  fontWeight: 700,
  letterSpacing: 'var(--yes-tracking-table-header)',
  textTransform: 'uppercase',
  color: 'var(--yes-color-text-muted)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  verticalAlign: 'middle',
}

const TH_CHECKBOX_STYLE: React.CSSProperties = {
  ...TH_BASE_STYLE,
  width: 40,
  padding: '0 var(--yes-size-px-md)',
}

const SORT_INDICATOR_STYLE: React.CSSProperties = {
  fontSize: 'var(--yes-size-table-header-text)',
  marginLeft: 3,
  color: 'var(--yes-color-primary)',
}

const TD_BASE_STYLE: React.CSSProperties = {
  padding: '0 var(--yes-size-px-md)',
  height: 'var(--yes-size-height-lg)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
  borderBottom: '1px solid var(--yes-color-bg)',
  verticalAlign: 'middle',
}

const TD_CHECKBOX_STYLE: React.CSSProperties = {
  ...TD_BASE_STYLE,
  width: 40,
}

const CHECKBOX_STYLE: React.CSSProperties = {
  accentColor: 'var(--yes-color-primary)',
  width: 15,
  height: 15,
  cursor: 'pointer',
}

const SKELETON_TD_STYLE: React.CSSProperties = {
  ...TD_BASE_STYLE,
  padding: 'var(--yes-space-3) var(--yes-size-px-md)',
}

const EMPTY_WRAP_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-16) var(--yes-size-px-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const PAGINATION_WRAP_STYLE: React.CSSProperties = {
  borderTop: '1px solid var(--yes-color-bg)',
  background: 'var(--yes-color-bg)',
  padding: 'var(--yes-space-3) var(--yes-size-px-md)',
}

export function Table<T = Record<string, unknown>>({
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
  page,
  pageSize,
  total,
  onPageChange,
  className,
  style,
  'data-testid': testId,
}: TableProps<T>) {
  injectTableStyles()

  const selectAllRef = useRef<HTMLInputElement>(null)
  const allIds = data.map(getRowId)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id))
  const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

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
      className={cn(className)}
      style={{ ...WRAP_STYLE, ...style }}
      data-testid={testId}
    >
      <table style={TABLE_STYLE}>
        <thead>
          <tr style={THEAD_ROW_STYLE}>
            {selectable && (
              <th style={TH_CHECKBOX_STYLE}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  style={CHECKBOX_STYLE}
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortKey === col.key
              const thStyle: React.CSSProperties = {
                ...TH_BASE_STYLE,
                cursor: col.sortable ? 'pointer' : 'default',
                color: isSorted
                  ? 'var(--yes-color-primary)'
                  : TH_BASE_STYLE.color,
                ...(col.width ? { width: col.width } : null),
              }
              return (
                <th
                  key={col.key}
                  data-yes-table-th=""
                  data-sortable={col.sortable ? 'true' : undefined}
                  data-sorted={isSorted ? 'true' : undefined}
                  style={thStyle}
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
                      style={SORT_INDICATOR_STYLE}
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
                  data-yes-table-tr=""
                  data-skeleton-row=""
                >
                  {selectable && (
                    <td
                      data-yes-table-td=""
                      data-yes-table-td-checkbox=""
                      style={{ ...SKELETON_TD_STYLE, width: 40 }}
                    >
                      <Skeleton width={15} height={15} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      data-yes-table-td=""
                      style={SKELETON_TD_STYLE}
                    >
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
                    data-yes-table-tr=""
                    data-selected={isSelected ? 'true' : undefined}
                  >
                    {selectable && (
                      <td
                        data-yes-table-td=""
                        data-yes-table-td-checkbox=""
                        style={TD_CHECKBOX_STYLE}
                      >
                        <input
                          type="checkbox"
                          style={CHECKBOX_STYLE}
                          checked={isSelected}
                          onChange={() => handleRowSelect(id)}
                          aria-label={`Seleccionar fila ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = (row as Record<string, unknown>)[col.key]
                      return (
                        <td
                          key={col.key}
                          data-yes-table-td=""
                          style={TD_BASE_STYLE}
                        >
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
        <div style={EMPTY_WRAP_STYLE}>
          <EmptyState title={emptyMessage} />
        </div>
      )}

      {showPagination && (
        <div style={PAGINATION_WRAP_STYLE}>
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
