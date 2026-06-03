import React from 'react'
import { TableAdvanced } from '../../components/TableAdvanced/TableAdvanced'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import type { TableColumn } from '../../components/Table/Table'
import { TOTAL_ROW_ID } from '../PivotTable/PivotTable'

/** Internal row shape — any field map with an optional totals marker. */
type PivotRow = Record<string, unknown> & { __pivot_total?: boolean }

/**
 * Compute column sums to build the totals row.
 * Defined locally to keep PivotTableLite independent from PivotTable internals.
 * Sets `__pivot_total: true` for identification in getRowId and render functions.
 */
function computeTotals(
  data: PivotRow[],
  rowField: string,
  valueFields: string[],
  label: string,
): PivotRow {
  const row: PivotRow = { [rowField]: label, __pivot_total: true }
  for (const f of valueFields) {
    row[f] = data.reduce((sum, d) => {
      const v = d[f]
      return sum + (typeof v === 'number' ? v : 0)
    }, 0)
  }
  return row
}

export interface PivotTableLiteProps extends BaseProps {
  /** Data rows. */
  data: PivotRow[]
  /** Row dimension field (leftmost column). */
  rowField: string
  /** Header label for rowField. Defaults to field name. */
  rowHeader?: string
  /** Numeric value fields (max 4 recommended for compact views). */
  valueFields: string[]
  /** Header labels for valueFields. Defaults to field names. */
  valueHeaders?: string[]
  /** Show a totals row at the bottom. Default false. */
  showTotals?: boolean
  /** Label for the totals row. Default "Total". */
  totalLabel?: string
  /** Limit visible data rows (before totals). Useful for embed contexts. */
  maxRows?: number
  /** Loading state. Default false. */
  isLoading?: boolean
  /** Empty state message. Default "Sin datos". */
  emptyMessage?: string
}

/**
 * PivotTableLite — compact pivot table without sorting or column management.
 * Ideal for embeds and summary widgets. Composes TableAdvanced.
 *
 * All columns are always `sortable: false`. Use `maxRows` to cap visible rows.
 * For the full-featured version with sorting and conditional color use `PivotTable`.
 *
 * Reference: Dashboard-Comps/Widget Gallery.html → PivotTableDemo (lite=true)
 */
export function PivotTableLite({
  data,
  rowField,
  rowHeader,
  valueFields,
  valueHeaders,
  showTotals = false,
  totalLabel = 'Total',
  maxRows,
  isLoading = false,
  emptyMessage = 'Sin datos',
  className,
  style,
  'data-testid': testId,
}: PivotTableLiteProps) {
  // Slice data before appending totals when maxRows is specified
  const sliced = typeof maxRows === 'number' ? data.slice(0, maxRows) : data

  const rows: PivotRow[] = showTotals
    ? [...sliced, computeTotals(sliced, rowField, valueFields, totalLabel)]
    : sliced

  // All columns are sortable: false — Lite variant has no sorting controls
  const columns: TableColumn<PivotRow>[] = [
    {
      key: rowField,
      header: rowHeader ?? rowField,
      sortable: false,
      render: (value, row) => (
        <span
          style={{
            fontFamily: 'var(--yes-font-sans)',
            fontWeight: row.__pivot_total ? 700 : 400,
            color: row.__pivot_total
              ? 'var(--yes-color-primary)'
              : 'var(--yes-color-text)',
          }}
        >
          {String(value ?? '')}
        </span>
      ),
    },
    ...valueFields.map((field, i): TableColumn<PivotRow> => ({
      key: field,
      header: valueHeaders?.[i] ?? field,
      sortable: false,
      render: (value, row) => (
        <span
          style={{
            display: 'block',
            textAlign: 'right',
            fontFamily: 'var(--yes-font-display)',
            fontSize: 12,
            fontWeight: row.__pivot_total ? 700 : 400,
            color: row.__pivot_total
              ? 'var(--yes-color-primary)'
              : 'var(--yes-color-text)',
          }}
        >
          {typeof value === 'number'
            ? value >= 1000
              ? `${(value / 1000).toFixed(1)}k`
              : String(value)
            : String(value ?? '')}
        </span>
      ),
    })),
  ]

  return (
    <div
      className={cn(className)}
      style={style}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <TableAdvanced
        columns={columns}
        data={rows}
        getRowId={(row) =>
          row.__pivot_total ? TOTAL_ROW_ID : String(row[rowField] ?? '')
        }
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
