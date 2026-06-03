// src/charts/HeatmapChart/HeatmapChart.tsx
import React from 'react'
import { Heatmap } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseChartProps } from '../chartTypes'

export interface HeatmapChartProps
  extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'showLegend' | 'valueFormatter'> {
  /** Category field for columns (e.g. hours of day). */
  xField: string
  /** Category field for rows (e.g. days of week). */
  yField: string
  /** Numeric intensity field — determines cell color. */
  colorField: string
  /** Color ramp from low to high intensity. Defaults to brand navy ramp. */
  colorScale?: string[]
}

export function HeatmapChart({
  data,
  xField,
  yField,
  colorField,
  colorScale,
  ariaLabel,
  height = 200,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: HeatmapChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, yField, colorField],
    rows: data.map((d) => [
      d[xField] as string | number,
      d[yField] as string | number,
      d[colorField] as string | number,
    ]),
  }

  const ramp = colorScale ?? [...chartTokens.heatmapRamp]

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
      <Heatmap
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={colorField}
        autoFit
        height={height}
        theme={antvTheme}
        legend={false}
        {...({ style: { inset: 1, radius: 2 } } as Record<string, unknown>)}
        {...({ scale: { color: { range: ramp } } } as Record<string, unknown>)}
        {...({ axis: {
          x: { tickCount: 6 },
          y: { tickCount: 7 },
        } } as Record<string, unknown>)}
      />
    </ChartFrame>
  )
}
