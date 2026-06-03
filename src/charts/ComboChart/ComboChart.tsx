// src/charts/ComboChart/ComboChart.tsx
import React from 'react'
import { DualAxes } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps } from '../chartTypes'

// showGrid and showValues are not applicable to DualAxes — omitted from the public API.
export interface ComboChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues'> {
  /** Shared x-axis field (category / time). */
  xField: string
  /** Field for the bar series (left Y axis). */
  barField: string
  /** Optional display name for the bar series legend. */
  barName?: string
  /** Optional color for the bar series. Defaults to antvTheme primary. */
  barColor?: string
  /** Field for the line series (right Y axis). */
  lineField: string
  /** Optional display name for the line series legend. */
  lineName?: string
  /** Optional color for the line series. Defaults to antvTheme series[1] (green). */
  lineColor?: string
}

export function ComboChart({
  data,
  xField,
  barField,
  barName,
  barColor,
  lineField,
  lineName,
  lineColor,
  ariaLabel,
  height = 160,
  colors,
  showLegend = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: ComboChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, barField, lineField],
    rows: data.map((d) => [
      d[xField] as string | number,
      d[barField] as string | number,
      d[lineField] as string | number,
    ]),
  }

  const theme = colors ? { ...antvTheme, category10: colors } : antvTheme
  const bColor = barColor ?? theme.category10[0]
  const lColor = lineColor ?? theme.category10[1]

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
      <DualAxes
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        autoFit
        height={height}
        theme={theme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        axis={{ y: { labelFormatter: valueFormatter } }}
        children={[
          {
            type: 'interval',
            yField: barField,
            ...(barName ? { name: barName } : {}),
            style: { fill: bColor, radiusTopLeft: 3, radiusTopRight: 3 },
          },
          {
            type: 'line',
            yField: lineField,
            ...(lineName ? { name: lineName } : {}),
            style: { stroke: lColor, lineWidth: 2 },
            axis: { y: { position: 'right' } },
          },
        ]}
      />
    </ChartFrame>
  )
}
