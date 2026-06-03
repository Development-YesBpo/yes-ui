// src/charts/BubbleChart/BubbleChart.tsx
import React from 'react'
import { Scatter } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps } from '../chartTypes'

export interface BubbleChartProps extends Omit<BaseChartProps, 'showGrid' | 'showValues' | 'valueFormatter'> {
  /** Numeric field for the X axis (e.g. volumen de llamadas). */
  xField: string
  /** Numeric field for the Y axis (e.g. CSAT %). */
  yField: string
  /** Numeric field that maps to bubble radius (third dimension). */
  sizeField: string
  /** Category field to color bubbles by group. */
  colorField?: string
  /** [minPx, maxPx] range for bubble radius. Default [4, 40]. */
  sizeRange?: [number, number]
  /** X axis label shown below the axis. */
  xLabel?: string
  /** Y axis label shown beside the axis. */
  yLabel?: string
}

export function BubbleChart({
  data,
  xField,
  yField,
  sizeField,
  colorField,
  sizeRange = [4, 40],
  xLabel,
  yLabel,
  ariaLabel,
  height = 220,
  colors,
  showLegend = true,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: BubbleChartProps) {
  const isEmpty = !loading && data.length === 0

  const headers = colorField
    ? [xField, yField, sizeField, colorField]
    : [xField, yField, sizeField]

  const srTable = {
    headers,
    rows: data.map((d) =>
      colorField
        ? [
            d[xField] as string | number,
            d[yField] as string | number,
            d[sizeField] as string | number,
            d[colorField] as string | number,
          ]
        : [
            d[xField] as string | number,
            d[yField] as string | number,
            d[sizeField] as string | number,
          ],
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
        sizeField={sizeField}
        {...(colorField !== undefined ? { colorField } : {})}
        {...({ size: sizeRange } as Record<string, unknown>)}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        {...({ point: { style: { fillOpacity: 0.5, stroke: 'white', lineWidth: 1 } } } as Record<string, unknown>)}
        {...({ axis: {
          x: { title: xLabel ?? xField },
          y: { title: yLabel ?? yField, gridStroke: antvTheme.axis.gridStroke },
        } } as Record<string, unknown>)}
        {...({ tooltip: { title: colorField ?? sizeField } } as Record<string, unknown>)}
      />
    </ChartFrame>
  )
}
