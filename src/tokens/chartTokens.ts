/**
 * Chart palette — typed source of truth.
 *
 * Canvas/SVG renderers cannot read CSS custom properties, so AntV charts are
 * themed from these concrete values. The matching `--yes-chart-*` CSS tokens
 * in semantic.css mirror these by convention (used by DOM-rendered legends,
 * dark theme, and docs). Values originate from Dashboard-Comps Widget Gallery `C`.
 */
export const chartTokens = {
  /** Categorical series palette (multi-series + by-category coloring). */
  series: [
    '#2B52A0', // 1 brand blue
    '#8CBC39', // 2 brand green
    '#4D72BC', // 3 blue-2
    '#D97706', // 4 amber
    '#0891B2', // 5 cyan
    '#7C3AED', // 6 violet
    '#be185d', // 7 magenta
    '#0f766e', // 8 teal
  ] as const,
  /** Default single-series color. */
  primary: '#2B52A0',
  /** Grid line color (= --yes-color-border). */
  gridColor: '#E5E7EB',
  /** Axis tick label color (= --yes-color-text-muted). */
  axisLabelColor: '#6B7280',
  /** Axis title color. */
  axisTitleColor: '#374151',
  /** Surface / chart background. */
  surface: '#FFFFFF',
  /** Waterfall block colors. */
  waterfall: {
    positive: '#16A34A',
    negative: '#DC2626',
    total: '#142860',
  },
  /** Heatmap intensity ramp (light -> navy). */
  heatmapRamp: ['#EEF3FA', '#4D72BC', '#2B52A0', '#142860'] as const,
  /** Body font for chart text. */
  fontFamily: 'Manrope, sans-serif',
} as const

export type ChartTokens = typeof chartTokens
