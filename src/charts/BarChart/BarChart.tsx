// src/charts/BarChart/BarChart.tsx
import React from 'react'
import { Column } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme, svgRenderer } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps } from '../chartTypes'

export interface BarChartProps extends BaseChartProps {
  /** Category field (x axis). */
  xField: string
  /** Numeric value field (y axis). */
  yField: string
  /** Field used to color bars by category. */
  colorByField?: string
  /** Group bars side-by-side (vs stack). Default false. */
  grouped?: boolean
}

export function BarChart({
  data,
  xField,
  yField,
  colorByField,
  grouped = false,
  ariaLabel,
  height = 148,
  colors,
  showGrid = true,
  showLegend = false,
  showValues = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: BarChartProps) {
  const isEmpty = !loading && data.length === 0
  const srTable = {
    headers: colorByField && colorByField !== xField ? [xField, colorByField, yField] : [xField, yField],
    rows: data.map((d) =>
      colorByField && colorByField !== xField
        ? [d[xField] as string | number, d[colorByField] as string | number, d[yField] as string | number]
        : [d[xField] as string | number, d[yField] as string | number],
    ),
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
      <Column
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={colorByField}
        group={grouped ? true : undefined}
        autoFit
        height={height}
        renderer={svgRenderer}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        label={showValues ? { text: yField, textBaseline: 'bottom' } : false}
        axis={{ y: { gridStroke: showGrid ? undefined : 'transparent', labelFormatter: valueFormatter } }}
      />
    </ChartFrame>
  )
}
