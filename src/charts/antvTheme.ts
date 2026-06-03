import { Renderer as SVGRenderer } from '@antv/g-svg'
import { chartTokens } from '../tokens/chartTokens'

/**
 * Brand theme object passed inline to every AntV chart via the `theme` prop.
 * Shape verified against @antv/g2 5.4.8 G2Theme (category10/color/view/axis).
 */
export const antvTheme = {
  type: 'classic' as const,
  category10: [...chartTokens.series],
  category20: [...chartTokens.series, ...chartTokens.series],
  color: chartTokens.primary,
  view: { viewFill: chartTokens.surface },
  axis: {
    labelFill: chartTokens.axisLabelColor,
    labelFontSize: 11,
    titleFill: chartTokens.axisTitleColor,
    gridStroke: chartTokens.gridColor,
    gridLineWidth: 1,
    lineStroke: chartTokens.gridColor,
    tickStroke: chartTokens.gridColor,
  },
}

export const antvThemeDark = {
  ...antvTheme,
  type: 'classicDark' as const,
  view: { viewFill: 'transparent' },
}

/**
 * Create a G2 SVG renderer instance. AntV defaults to canvas; the SVG renderer
 * yields inspectable DOM, better a11y, and exportable output. `renderer` takes
 * an IRenderer INSTANCE (not the string "svg").
 */
export function createSvgRenderer(): SVGRenderer {
  return new SVGRenderer()
}

/** Shared singleton renderer — created once, reused by every chart. */
export const svgRenderer: SVGRenderer = createSvgRenderer()
