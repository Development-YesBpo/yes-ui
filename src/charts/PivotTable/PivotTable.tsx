import React from 'react'
import { TableAdvanced } from '../../components/TableAdvanced/TableAdvanced'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import type { TableColumn } from '../../components/Table/Table'

/**
 * Sentinel row ID used to identify the totals row in getRowId.
 * Consumers can use this constant to style or skip the totals row.
 */
export const TOTAL_ROW_ID = '__pivot-total__'

/** Internal row shape — any field map with an optional totals marker. */
type PivotRow = Record<string, unknown> & { __pivot_total?: boolean }

export interface PivotTableProps extends BaseProps {
  /** Data rows — each row is a plain object keyed by field name. */
  data: PivotRow[]
  /** Field shown as the leftmost row-label column (e.g. "agente"). */
  rowField: string
  /** Header label for the rowField column. Defaults to the field name. */
  rowHeader?: string
  /** Numeric value fields shown as right-aligned columns. */
  valueFields: string[]
  /** Header labels for valueFields, in the same order. Defaults to field names. */
  valueHeaders?: string[]
  /** Show a totals row pinned at the bottom. Default false. */
  showTotals?: boolean
  /** Label for the totals row. Default "Total". */
  totalLabel?: string
  /**
   * Per-cell color callback for value cells (e.g. CSAT conditional coloring).
   * Return a CSS color string or undefined to use the default color.
   */
  conditionalColor?: (field: string, value: unknown) => string | undefined
  /** Show column sort controls. Default true. */
  sortable?: boolean
  /** Pass-through to TableAdvanced loading state. */
  isLoading?: boolean
  /** Empty state message. Default "Sin datos". */
  emptyMessage?: string
}

/**
 * Compute column sums to build the totals row.
 * Sets `__pivot_total: true` so getRowId and render functions can identify it.
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

/**
 * PivotTable — composition layer over TableAdvanced that auto-builds columns
 * from a `rowField + valueFields` API and appends an optional totals row.
 *
 * Reference: Dashboard-Comps/Widget Gallery.html → PivotTableDemo
 */
export function PivotTable({
  data,
  rowField,
  rowHeader,
  valueFields,
  valueHeaders,
  showTotals = false,
  totalLabel = 'Total',
  conditionalColor,
  sortable = true,
  isLoading = false,
  emptyMessage = 'Sin datos',
  className,
  style,
  'data-testid': testId,
}: PivotTableProps) {
  // Append totals row after data rows when requested
  const rows: PivotRow[] = showTotals
    ? [...data, computeTotals(data, rowField, valueFields, totalLabel)]
    : data

  // Build column definitions — rowField column + one per valueField
  const columns: TableColumn<PivotRow>[] = [
    {
      key: rowField,
      header: rowHeader ?? rowField,
      // Row-label column is never sorted — it is the pivot dimension
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
      sortable,
      render: (value, row) => {
        // Apply optional conditional color (e.g. CSAT threshold coloring)
        const cellColor = conditionalColor?.(field, value)
        return (
          <span
            style={{
              display: 'block',
              textAlign: 'right',
              fontFamily: 'var(--yes-font-display)',
              fontSize: 13,
              fontWeight: row.__pivot_total ? 700 : 400,
              color:
                cellColor ??
                (row.__pivot_total
                  ? 'var(--yes-color-primary)'
                  : 'var(--yes-color-text)'),
              background: row.__pivot_total
                ? 'var(--yes-color-primary-subtle)'
                : 'transparent',
              padding: 'var(--yes-space-1) 0',
            }}
          >
            {typeof value === 'number'
              ? value >= 1000
                ? `${(value / 1000).toFixed(1)}k`
                : String(value)
              : String(value ?? '')}
          </span>
        )
      },
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
          row.__pivot_total
            ? TOTAL_ROW_ID
            : String(row[rowField] ?? '')
        }
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
