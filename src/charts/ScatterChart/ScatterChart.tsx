// src/charts/ScatterChart/ScatterChart.tsx
import React from 'react'
import { Scatter } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps } from '../chartTypes'

export interface ScatterChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'valueFormatter'> {
  /** Numeric field for the X axis (e.g. TMO in minutes). */
  xField: string
  /** Numeric field for the Y axis (e.g. CSAT score). */
  yField: string
  /** Category field to color-code points by group. */
  colorField?: string
  /** X axis label shown below the axis. */
  xLabel?: string
  /** Y axis label shown beside the axis. */
  yLabel?: string
}

export function ScatterChart({
  data,
  xField,
  yField,
  colorField,
  xLabel,
  yLabel,
  ariaLabel,
  height = 200,
  colors,
  showLegend = false,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: ScatterChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: colorField ? [xField, yField, colorField] : [xField, yField],
    rows: data.map((d) =>
      colorField
        ? [d[xField] as string | number, d[yField] as string | number, d[colorField] as string | number]
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
      <Scatter
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        {...(colorField !== undefined ? { colorField } : {})}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        {...({ point: { style: { fillOpacity: 0.65, r: 5 } } } as Record<string, unknown>)}
        {...({ axis: {
          x: { title: xLabel ?? xField },
          y: { title: yLabel ?? yField, gridStroke: antvTheme.axis.gridStroke },
        } } as Record<string, unknown>)}
      />
    </ChartFrame>
  )
}
