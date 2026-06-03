import type { BaseProps } from '../types/shared'

/** A single chart data row. Keys are field names referenced by xField/yField/etc. */
export type ChartDatum = Record<string, string | number>

/**
 * Props shared by every chart component.
 * Field-based (xField/yField) to match AntV v2 and the DASHBOARD widget contracts.
 */
export interface BaseChartProps extends BaseProps {
  /** Data rows. */
  data: readonly ChartDatum[]
  /** Accessible text alternative for the chart. REQUIRED — charts are role="img". */
  ariaLabel: string
  /** Fixed height in px. Default 148. (Width fills the container via autoFit.) */
  height?: number
  /** Override the categorical series palette. Defaults to chartTokens.series. */
  colors?: string[]
  /** Show the cartesian grid. Default true. */
  showGrid?: boolean
  /** Show the legend. Default false. */
  showLegend?: boolean
  /** Show value labels on marks. Default false. */
  showValues?: boolean
  /** Numeric value formatter for axes/labels. Defaults to k/plain formatter. */
  valueFormatter?: (value: number) => string
  /** Render a Skeleton instead of the chart. Default false. */
  loading?: boolean
}
