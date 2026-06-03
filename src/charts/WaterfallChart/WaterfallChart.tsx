// src/charts/WaterfallChart/WaterfallChart.tsx
import React from 'react'
import { Waterfall } from '@ant-design/plots'
import { ChartFrame } from '../ChartFrame/ChartFrame'
import { antvTheme } from '../antvTheme'
import { defaultValueFormatter } from '../chartFormat'
import { chartTokens } from '../../tokens/chartTokens'
import type { BaseChartProps } from '../chartTypes'

// showGrid is not applicable to Waterfall — the component uses its own connector lines.
export interface WaterfallChartProps extends Omit<BaseChartProps, 'showGrid'> {
  /** Shared x-axis field (category label). */
  xField: string
  /** Numeric delta field. */
  yField: string
  /** Override color for positive bars. Default chartTokens.waterfall.positive. */
  positiveColor?: string
  /** Override color for negative bars. Default chartTokens.waterfall.negative. */
  negativeColor?: string
  /** Override color for total bars. Default chartTokens.waterfall.total. */
  totalColor?: string
  /**
   * Field name on each data row that marks the row as a total bar.
   * The adaptor uses `isTotal` natively; set this if your data uses a different key.
   * Default: 'isTotal'.
   */
  totalField?: string
}

export function WaterfallChart({
  data,
  xField,
  yField,
  positiveColor,
  negativeColor,
  totalColor,
  totalField = 'isTotal',
  ariaLabel,
  height = 160,
  colors,
  showLegend = false,
  showValues = true,
  valueFormatter = defaultValueFormatter,
  loading = false,
  className,
  style,
  'data-testid': testId,
}: WaterfallChartProps) {
  const isEmpty = !loading && data.length === 0

  const srTable = {
    headers: [xField, yField],
    rows: data.map((d) => [d[xField] as string | number, d[yField] as string | number]),
  }

  const pColor = positiveColor ?? chartTokens.waterfall.positive
  const nColor = negativeColor ?? chartTokens.waterfall.negative
  const tColor = totalColor ?? chartTokens.waterfall.total

  /**
   * AntV v2 Waterfall does not expose `risingFill`/`fallingFill`/`totalFill`
   * props in its TypeScript types. Colors are applied via a `style` callback
   * on the mark, checking whether the row is a total or positive/negative delta.
   * The `style` prop accepts `(datum) => CSSProperties`-like object per the G2 spec.
   */
  const styleCallback = (datum: Record<string, unknown>) => {
    if (datum[totalField]) return { fill: tColor }
    const val = datum[yField] as number
    return { fill: val >= 0 ? pColor : nColor }
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
      <Waterfall
        data={data as Array<Record<string, unknown>>}
        xField={xField}
        yField={yField}
        autoFit
        height={height}
        theme={colors ? { ...antvTheme, category10: colors } : antvTheme}
        legend={showLegend ? { color: { position: 'top' } } : false}
        label={showValues ? ({ text: yField, formatter: valueFormatter } as Record<string, unknown>) : false}
        {...({ style: styleCallback } as Record<string, unknown>)}
        axis={{ y: { labelFormatter: valueFormatter } }}
      />
    </ChartFrame>
  )
}
