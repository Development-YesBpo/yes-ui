// src/charts/LineChart/LineChart.tsx
import React from 'react'
import { Line } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme, svgRenderer } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps } from '../chartTypes'

export interface LineChartProps extends BaseChartProps {
  /** Field for the x axis (category/time). */
  xField: string
  /** Field for the y axis (numeric value). */
  yField: string
  /** Field that splits data into multiple series. */
  seriesField?: string
  /** Line shape. Default 'smooth'. */
  curve?: 'linear' | 'smooth'
  /** Fill the area below the line. Default false. */
  area?: boolean
}

export function LineChart({
  data,
  xField,
  yField,
  seriesField,
  curve = 'smooth',
  area = false,
  ariaLabel,
  height = 148,
  colors,
  showGrid = true,
  showLegend = false,
  showValues = false,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: LineChartProps) {
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
      <Line
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={seriesField}
        shapeField={curve === 'smooth' ? 'smooth' : 'line'}
        area={area ? {} : undefined}
        autoFit
        height={height}
        renderer={svgRenderer}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        label={showValues ? { text: yField } : false}
        axis={{
          y: { gridStroke: showGrid ? undefined : 'transparent', labelFormatter: valueFormatter },
        }}
      />
    </ChartFrame>
  )
}
