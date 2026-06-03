// src/charts/HorizontalBarChart/HorizontalBarChart.tsx
import React from 'react'
import { Bar } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps, ChartDatum } from '../chartTypes'

/** Sort by a numeric field and optionally take the top-N. Pure helper. */
export function applySortAndLimit(
  rows: readonly ChartDatum[],
  field: string,
  sort?: 'asc' | 'desc',
  maxItems?: number,
): ChartDatum[] {
  let out = [...rows]
  if (sort) {
    out.sort((a, b) =>
      sort === 'desc' ? Number(b[field]) - Number(a[field]) : Number(a[field]) - Number(b[field]),
    )
  }
  if (typeof maxItems === 'number') out = out.slice(0, maxItems)
  return out
}

export interface HorizontalBarChartProps extends BaseChartProps {
  /** Numeric value field (horizontal axis). */
  xField: string
  /** Category field (vertical axis) — usually long labels like agent names. */
  yField: string
  /** Sort by xField value. */
  sort?: 'asc' | 'desc'
  /** Keep only the top-N rows after sorting. */
  maxItems?: number
}

export function HorizontalBarChart({
  data,
  xField,
  yField,
  sort,
  maxItems,
  ariaLabel,
  height = 180,
  colors,
  showGrid = true,
  showLegend = false,
  showValues = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: HorizontalBarChartProps) {
  const rows = applySortAndLimit(data, xField, sort, maxItems)
  const isEmpty = !loading && rows.length === 0
  const srTable = {
    headers: [yField, xField],
    rows: rows.map((d) => [d[yField] as string | number, d[xField] as string | number]),
  }

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      height={height}
      loading={loading}
      isEmpty={isEmpty}
      srTable={srTable}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    >
      <Bar
        data={rows as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        label={showValues ? { text: xField, position: 'right' } : false}
        axis={{ x: { labelFormatter: valueFormatter, gridStroke: showGrid ? undefined : 'transparent' } }}
      />
    </ChartFrame>
  )
}
