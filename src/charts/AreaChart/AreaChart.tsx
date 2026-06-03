// src/charts/AreaChart/AreaChart.tsx
import React from 'react'
import { Area } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme, svgRenderer } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps } from '../chartTypes'

export interface AreaChartProps extends BaseChartProps {
  xField: string
  yField: string
  /** Field that splits data into stacked series. */
  seriesField?: string
  /** Stack series. Default true. */
  stacked?: boolean
}

export function AreaChart({
  data,
  xField,
  yField,
  seriesField,
  stacked = true,
  ariaLabel,
  height = 148,
  colors,
  showGrid = true,
  showLegend = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: AreaChartProps) {
  const isEmpty = !loading && data.length === 0
  const srTable = {
    headers: seriesField ? [xField, seriesField, yField] : [xField, yField],
    rows: data.map((d) =>
      seriesField
        ? [d[xField] as string | number, d[seriesField] as string | number, d[yField] as string | number]
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
      <Area
        {...({
          data: data as Array<Record<string, unknown>>,
          xField,
          yField,
          colorField: seriesField,
          stack: stacked,
          autoFit: true,
          height,
          renderer: svgRenderer,
          theme: colors ? { ...antvTheme, category10: colors } : antvTheme,
          legend: showLegend ? { color: { position: 'top' } } : false,
          axis: { y: { gridStroke: showGrid ? undefined : 'transparent', labelFormatter: valueFormatter } },
        } as Record<string, unknown>)}
      />
    </ChartFrame>
  )
}
