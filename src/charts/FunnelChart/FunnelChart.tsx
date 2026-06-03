// src/charts/FunnelChart/FunnelChart.tsx
import React from 'react'
import { Funnel } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import type { BaseChartProps } from '../chartTypes'

/**
 * Props for FunnelChart.
 * Omits `showGrid` — not applicable to funnel charts.
 */
export interface FunnelChartProps extends Omit<BaseChartProps, 'showGrid'> {
  /** Stage name field (x axis / funnel label). */
  xField: string
  /** Count/value field (y axis / funnel width). */
  yField: string
  /**
   * Show conversion rate annotations between stages.
   * Passed to AntV `Funnel` via the annotation controller (key: 'conversionTag').
   * Default true.
   */
  showConversion?: boolean
}

/**
 * FunnelChart — embudo de conversión entre etapas.
 * Wraps AntV `Funnel` inside ChartFrame for a11y + loading/empty states.
 *
 * `conversionTag` is an annotation key processed by AntV's Controller,
 * not declared in the TypeScript types — cast via Record<string, unknown>.
 */
export function FunnelChart({
  data,
  xField,
  yField,
  showConversion = true,
  ariaLabel,
  height = 200,
  colors,
  showLegend = false,
  showValues = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: FunnelChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, yField],
    rows: data.map((d) => [d[xField] as string | number, d[yField] as string | number]),
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
       * `conversionTag` is not in FunnelConfig's TS types but is a valid runtime prop
       * handled by AntV's annotation Controller. Cast to pass it through.
       * `label` cast needed because `formatter` is not on the narrow Record<string,any>.
       */}
      <Funnel
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        label={showValues ? ({ text: yField, formatter: valueFormatter } as Record<string, unknown>) : false}
        axis={{ y: { labelFormatter: valueFormatter } }}
        {...(showConversion ? ({ conversionTag: true } as Record<string, unknown>) : {})}
      />
    </ChartFrame>
  )
}
