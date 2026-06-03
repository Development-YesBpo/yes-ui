// src/charts/PieChart/PieChart.tsx
import React from 'react'
import { Pie } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps, ChartDatum } from '../chartTypes'

/**
 * Props for PieChart.
 * Omits `showGrid` and `valueFormatter` — not applicable to pie charts.
 */
export interface PieChartProps extends Omit<BaseChartProps, 'showGrid' | 'valueFormatter'> {
  /** Numeric field that determines each slice's angle (the "value"). */
  angleField: string
  /** Category field that determines each slice's color and label. */
  colorField: string
  /** Legend position. Default 'right'. */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * PieChart — distribución porcentual en sectores.
 * Wraps AntV `Pie` inside ChartFrame for a11y + loading/empty states.
 *
 * Reference: Dashboard-Comps/Widget Gallery.html → PieSVG
 */
export function PieChart({
  data,
  angleField,
  colorField,
  legendPosition = 'right',
  ariaLabel,
  height = 200,
  colors,
  showLegend = true,
  showValues = true,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: PieChartProps) {
  const isEmpty = !loading && data.length === 0

  // srTable: colorField (category) first, then angleField (value) — matches human reading order
  const srTable = {
    headers: [colorField, angleField],
    rows: data.map((d: ChartDatum) => [
      d[colorField] as string | number,
      d[angleField] as string | number,
    ]),
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
      <Pie
        data={data as Array<Record<string, unknown>>}
        angleField={angleField}
        colorField={colorField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: legendPosition } } : false}
        label={showValues ? { text: colorField, position: 'outside' } : false}
      />
    </ChartFrame>
  )
}
