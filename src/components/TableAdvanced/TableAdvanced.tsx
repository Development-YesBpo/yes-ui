import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../Skeleton/Skeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import { Pagination } from '../Pagination/Pagination'
import type { TableProps } from '../Table/Table'

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

// ── Style injection ────────────────────────────────────────────
let advancedStylesInjected = false
function injectAdvancedStyles() {
  if (advancedStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-table-advanced', '')
  el.textContent = `
    .yes-table-bulk-action:hover {
      background: var(--yes-color-primary-subtle);
    }
    .yes-table-bulk-action-danger:hover {
      background: var(--yes-color-danger-subtle);
    }
    .yes-table-bulk-clear:hover {
      color: var(--yes-color-text);
    }
    .yes-table-col-manager-btn:hover {
      background: var(--yes-color-bg);
    }
    .yes-table-col-row:hover {
      background: var(--yes-color-bg);
    }
    .yes-table-col-reset-btn:hover {
      color: var(--yes-color-primary);
    }
    [data-yes-tadv-th][data-sortable='true']:hover {
      color: var(--yes-color-text);
    }
    [data-yes-tadv-th][data-sorted='true'] {
      color: var(--yes-color-primary);
    }
    [data-yes-tadv-th]:hover [data-resize-handle] {
      background: var(--yes-color-border);
    }
    [data-yes-tadv-tr]:hover [data-yes-tadv-td] {
      background: var(--yes-color-bg);
    }
    [data-yes-tadv-tr][data-selected='true'] [data-yes-tadv-td] {
      background: var(--yes-color-primary-subtle);
    }
    [data-yes-tadv-tr][data-selected='true'] [data-yes-tadv-td-checkbox] {
      border-left: var(--yes-size-table-row-selected-border) solid var(--yes-color-primary);
      padding-left: calc(var(--yes-size-px-md) - var(--yes-size-table-row-selected-border));
    }
    [data-yes-tadv-tr]:last-child [data-yes-tadv-td] {
      border-bottom: none;
    }
  `
  document.head.appendChild(el)
  advancedStylesInjected = true
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

const BULK_BAR_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px var(--yes-size-px-md)',
  background: 'var(--yes-color-primary-subtle)',
  borderBottom: '1px solid var(--yes-color-primary-border)',
  flexWrap: 'wrap',
}

const BULK_COUNT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 700,
  color: 'var(--yes-color-primary)',
  marginRight: 4,
}

const BULK_ACTION_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-table-bulk-btn-h)',
  padding: '0 10px',
  borderRadius: 'var(--yes-radius-sm)',
  border: '1px solid var(--yes-color-primary-border)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-primary)',
  cursor: 'pointer',
}

const BULK_ACTION_DANGER_STYLE: React.CSSProperties = {
  ...BULK_ACTION_STYLE,
  color: 'var(--yes-color-danger)',
  borderColor: 'var(--yes-color-danger-border)',
}

const BULK_DIVIDER_STYLE: React.CSSProperties = {
  width: 1,
  height: 18,
  background: 'var(--yes-color-table-bulk-divider)',
  margin: '0 4px',
}

const BULK_CLEAR_STYLE: React.CSSProperties = {
  marginLeft: 'auto',
  background: 'none',
  border: 'none',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-text-muted)',
  cursor: 'pointer',
}

const TOOLBAR_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px var(--yes-size-px-md)',
  borderBottom: '1px solid var(--yes-color-bg)',
  background: 'var(--yes-color-bg)',
  flexWrap: 'wrap',
}

const COL_MANAGER_WRAP_STYLE: React.CSSProperties = {
  marginLeft: 'auto',
  position: 'relative',
}

const COL_MANAGER_BTN_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  height: 32,
  padding: '0 12px',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-btn)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-text)',
  cursor: 'pointer',
}

const COL_DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 4px)',
  zIndex: 50,
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  boxShadow: 'var(--yes-shadow-md)',
  minWidth: 200,
  padding: 'var(--yes-space-3) 0',
}

const COL_DROPDOWN_HEADER_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-2) var(--yes-size-px-md)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-table-header-text)',
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  textTransform: 'uppercase',
  letterSpacing: 'var(--yes-tracking-table-header)',
  borderBottom: '1px solid var(--yes-color-bg)',
  marginBottom: 'var(--yes-space-1)',
}

const COL_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-3)',
  padding: 'var(--yes-space-2) var(--yes-size-px-md)',
  cursor: 'pointer',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
}

const COL_ROW_CHECKBOX_STYLE: React.CSSProperties = {
  accentColor: 'var(--yes-color-primary)',
  width: 14,
  height: 14,
  cursor: 'pointer',
}

const COL_DROPDOWN_FOOTER_STYLE: React.CSSProperties = {
  borderTop: '1px solid var(--yes-color-bg)',
  padding: 'var(--yes-space-2) var(--yes-size-px-md)',
  marginTop: 'var(--yes-space-1)',
}

const COL_RESET_BTN_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
  cursor: 'pointer',
  padding: 0,
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
  position: 'relative',
}

const TH_CHECKBOX_STYLE: React.CSSProperties = {
  ...TH_BASE_STYLE,
  width: 40,
}

const SORT_INDICATOR_STYLE: React.CSSProperties = {
  fontSize: 'var(--yes-size-table-header-text)',
  marginLeft: 3,
  color: 'var(--yes-color-primary)',
}

const SORT_PRIORITY_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'var(--yes-size-table-sort-priority)',
  height: 'var(--yes-size-table-sort-priority)',
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-primitive-white)',
  fontSize: 'var(--yes-size-table-sort-priority-text)',
  fontWeight: 700,
  borderRadius: '50%',
  marginLeft: 2,
  verticalAlign: 'middle',
}

const RESIZE_HANDLE_STYLE: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: '25%',
  height: '50%',
  width: 'var(--yes-size-table-resize-handle-w)',
  background: 'transparent',
  cursor: 'col-resize',
  borderRadius: 2,
  transition: 'background var(--yes-duration-fast) ease',
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
  width: 14,
  height: 14,
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
  injectAdvancedStyles()

  const [colManagerOpen, setColManagerOpen] = useState(false)
  const colManagerRef = useRef<HTMLDivElement>(null)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const bulkSelectAllRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!colManagerOpen) return
    function handleClick(e: MouseEvent) {
      if (
        colManagerRef.current &&
        !colManagerRef.current.contains(e.target as Node)
      ) {
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

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected
    if (bulkSelectAllRef.current) bulkSelectAllRef.current.indeterminate = someSelected
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
      e.stopPropagation()
      resizingRef.current = { key, startX: e.clientX, startW: currentW }

      function onMouseMove(mv: MouseEvent) {
        if (!resizingRef.current) return
        const delta = mv.clientX - resizingRef.current.startX
        const newW = Math.max(60, resizingRef.current.startW + delta)
        setColWidths((prev) => ({
          ...prev,
          [resizingRef.current!.key]: newW,
        }))
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
      className={cn(className)}
      style={{ ...WRAP_STYLE, ...style }}
      data-testid={testId}
    >
      {/* Bulk action bar */}
      {showBulkBar && (
        <div style={BULK_BAR_STYLE}>
          <input
            ref={bulkSelectAllRef}
            type="checkbox"
            style={CHECKBOX_STYLE}
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Seleccionar todos"
          />
          <span style={BULK_COUNT_STYLE}>
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
          </span>
          {bulkActions
            ?.filter((a) => !a.danger)
            .map((action) => (
              <button
                key={action.label}
                type="button"
                className="yes-table-bulk-action"
                style={BULK_ACTION_STYLE}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </button>
            ))}
          {bulkActions?.some((a) => a.danger) && (
            <div style={BULK_DIVIDER_STYLE} aria-hidden="true" />
          )}
          {bulkActions
            ?.filter((a) => a.danger)
            .map((action) => (
              <button
                key={action.label}
                type="button"
                className="yes-table-bulk-action yes-table-bulk-action-danger"
                style={BULK_ACTION_DANGER_STYLE}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </button>
            ))}
          <button
            type="button"
            className="yes-table-bulk-clear"
            style={BULK_CLEAR_STYLE}
            onClick={() => onSelectionChange?.(new Set())}
            aria-label="Limpiar selección"
          >
            × Limpiar selección
          </button>
        </div>
      )}

      {/* Toolbar with column manager */}
      {showColManager && (
        <div style={TOOLBAR_WRAP_STYLE}>
          <div style={COL_MANAGER_WRAP_STYLE} ref={colManagerRef}>
            <button
              type="button"
              className="yes-table-col-manager-btn"
              style={COL_MANAGER_BTN_STYLE}
              onClick={() => setColManagerOpen((o) => !o)}
              aria-expanded={colManagerOpen}
              aria-label="Administrar columnas"
            >
              ⊞ Columnas ▾
            </button>
            {colManagerOpen && (
              <div
                style={COL_DROPDOWN_STYLE}
                role="dialog"
                aria-label="Columnas visibles"
              >
                <div style={COL_DROPDOWN_HEADER_STYLE}>Columnas visibles</div>
                {columns.map((col) => {
                  const isVisible = visibleColumns!.includes(col.key)
                  return (
                    <label
                      key={col.key}
                      className="yes-table-col-row"
                      style={COL_ROW_STYLE}
                    >
                      <input
                        type="checkbox"
                        style={COL_ROW_CHECKBOX_STYLE}
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
                  <div style={COL_DROPDOWN_FOOTER_STYLE}>
                    <button
                      type="button"
                      className="yes-table-col-reset-btn"
                      style={COL_RESET_BTN_STYLE}
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
            {effectiveCols.map((col) => {
              const sortEntry = getSortEntry(col.key)
              const priority = getSortPriority(col.key)
              const singleSorted = !sortConfig && sortKey === col.key
              const isAnySorted = !!sortEntry || singleSorted
              const effectiveDir = sortEntry?.direction ?? sortDirection
              const colW = colWidths[col.key] ?? col.width

              const thStyle: React.CSSProperties = {
                ...TH_BASE_STYLE,
                cursor: col.sortable ? 'pointer' : 'default',
                color: isAnySorted
                  ? 'var(--yes-color-primary)'
                  : TH_BASE_STYLE.color,
                ...(colW ? { width: colW } : null),
              }

              return (
                <th
                  key={col.key}
                  data-yes-tadv-th=""
                  data-sortable={col.sortable ? 'true' : undefined}
                  data-sorted={isAnySorted ? 'true' : undefined}
                  style={thStyle}
                  onClick={
                    col.sortable && onSort ? () => onSort(col.key) : undefined
                  }
                  aria-sort={
                    isAnySorted
                      ? effectiveDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {col.header}
                  {isAnySorted && (
                    <span
                      style={SORT_INDICATOR_STYLE}
                      data-sort-indicator=""
                      aria-hidden="true"
                    >
                      {effectiveDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                  {priority !== undefined && (
                    <span
                      style={SORT_PRIORITY_STYLE}
                      data-sort-priority={priority}
                      aria-hidden="true"
                    >
                      {priority}
                    </span>
                  )}
                  <span
                    style={RESIZE_HANDLE_STYLE}
                    data-resize-handle=""
                    onMouseDown={(e) =>
                      handleResizeStart(e, col.key, colW ?? 120)
                    }
                    onClick={(e) => e.stopPropagation()}
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
                  data-yes-tadv-tr=""
                  data-skeleton-row=""
                >
                  {selectable && (
                    <td
                      data-yes-tadv-td=""
                      data-yes-tadv-td-checkbox=""
                      style={{ ...SKELETON_TD_STYLE, width: 40 }}
                    >
                      <Skeleton width={14} height={14} />
                    </td>
                  )}
                  {effectiveCols.map((col) => (
                    <td
                      key={col.key}
                      data-yes-tadv-td=""
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
                    data-yes-tadv-tr=""
                    data-selected={isSelected ? 'true' : undefined}
                  >
                    {selectable && (
                      <td
                        data-yes-tadv-td=""
                        data-yes-tadv-td-checkbox=""
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
                    {effectiveCols.map((col) => {
                      const value = (row as Record<string, unknown>)[col.key]
                      return (
                        <td
                          key={col.key}
                          data-yes-tadv-td=""
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
