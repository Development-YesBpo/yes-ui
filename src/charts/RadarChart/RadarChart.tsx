// src/charts/RadarChart/RadarChart.tsx
import React from 'react'
import { Radar } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import type { BaseChartProps } from '../chartTypes'

/**
 * Props for RadarChart.
 * Omits `showGrid`, `valueFormatter`, and `showValues` — not applicable to radar charts.
 * Data MUST be in long format: one row per `{axis, value, series}` combination.
 */
// showValues/showGrid/valueFormatter are not applicable to the Radar chart's polygon geometry.
export interface RadarChartProps extends Omit<BaseChartProps, 'showGrid' | 'valueFormatter' | 'showValues'> {
  /** Axis label field (e.g. "TMO", "CSAT"). */
  xField: string
  /** Numeric value field (0–100 scale recommended). */
  yField: string
  /** Series/group field for multi-series overlays. */
  colorField: string
  /** Max value for the radar axes. Default 100. */
  max?: number
}

/**
 * RadarChart — comparación de KPIs en formato araña.
 * Wraps AntV `Radar` inside ChartFrame for a11y + loading/empty states.
 *
 * `scale` and `area` are valid G2 runtime props not fully typed in plots.
 * Individual prop casts used per hard rules (no whole-object cast).
 */
export function RadarChart({
  data,
  xField,
  yField,
  colorField,
  max = 100,
  ariaLabel,
  height = 220,
  colors,
  showLegend = true,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: RadarChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, colorField, yField],
    rows: data.map((d) => [
      d[xField] as string | number,
      d[colorField] as string | number,
      d[yField] as string | number,
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
      {/*
       * `scale` is a G2 Mark-level prop not declared in RadarConfig types — cast individually.
       * `area` and `point` are in Options but their nested props need cast for style objects.
       */}
      <Radar
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        colorField={colorField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        area={{ style: { fillOpacity: 0.2 } } as Record<string, unknown>}
        point={{ sizeField: 4 } as Record<string, unknown>}
        {...({ scale: { y: { domain: [0, max] } } } as Record<string, unknown>)}
      />
    </ChartFrame>
  )
}
