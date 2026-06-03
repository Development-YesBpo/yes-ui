// src/charts/DonutChart/DonutChart.tsx
import React from 'react'
import { Pie } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseChartProps, ChartDatum } from '../chartTypes'

/**
 * Props for DonutChart.
 * Omits `showGrid` and `valueFormatter` — not applicable to pie/donut charts.
 */
export interface DonutChartProps extends Omit<BaseChartProps, 'showGrid' | 'valueFormatter'> {
  /** Numeric field that determines each slice's angle. */
  angleField: string
  /** Category field for slice color and label. */
  colorField: string
  /** Inner radius ratio (0–1). Default 0.55 — yields the classic donut shape. */
  innerRadius?: number
  /** Optional label shown in the center hole (e.g. "MOTIVOS"). */
  centerLabel?: string
  /** Optional value shown large in the center hole (e.g. "100%"). */
  centerValue?: string
}

/**
 * DonutChart — pie con centro hueco, ideal para mostrar un KPI o etiqueta central.
 * Wraps AntV `Pie` with `innerRadius` inside ChartFrame for a11y + loading/empty states.
 *
 * Reference: Dashboard-Comps/Widget Gallery.html → DonutSVG
 */
export function DonutChart({
  data,
  angleField,
  colorField,
  innerRadius = 0.55,
  centerLabel,
  centerValue,
  ariaLabel,
  height = 200,
  colors,
  showLegend = true,
  showValues = false,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: DonutChartProps) {
  const isEmpty = !loading && data.length === 0

  // srTable: colorField (category) first, then angleField (value)
  const srTable = {
    headers: [colorField, angleField],
    rows: data.map((d: ChartDatum) => [
      d[colorField] as string | number,
      d[angleField] as string | number,
    ]),
  }

  // Build statistic config for center label/value when provided.
  // `statistic` may not be in AntV v2 Pie typings — cast this prop only.
  const statisticConfig =
    centerLabel !== undefined || centerValue !== undefined
      ? {
          title: centerLabel !== undefined
            ? { content: centerLabel, style: { fontSize: '11px', color: chartTokens.axisLabelColor } }
            : false,
          content: centerValue !== undefined
            ? { content: centerValue, style: { fontSize: '20px', fontWeight: 700 } }
            : false,
        }
      : undefined

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
        innerRadius={innerRadius}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'right' } } : false}
        label={showValues ? { text: colorField, position: 'outside' } : false}
        {...(statisticConfig !== undefined
          ? ({ statistic: statisticConfig } as Record<string, unknown>)
          : {})}
      />
    </ChartFrame>
  )
}
