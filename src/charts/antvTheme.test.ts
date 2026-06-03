import { describe, it, expect, vi } from 'vitest'

vi.mock('@antv/g-svg', () => ({
  Renderer: class FakeSVGRenderer {},
}))

import { antvTheme, antvThemeDark, createSvgRenderer } from './antvTheme'
import { chartTokens } from '../tokens/chartTokens'

describe('antvTheme', () => {
  it('extends the classic base and uses the brand series palette', () => {
    expect(antvTheme.type).toBe('classic')
    expect(antvTheme.category10).toEqual([...chartTokens.series])
    expect(antvTheme.color).toBe(chartTokens.primary)
  })
  it('maps axis + grid colors from tokens', () => {
    expect(antvTheme.axis.labelFill).toBe(chartTokens.axisLabelColor)
    expect(antvTheme.axis.gridStroke).toBe(chartTokens.gridColor)
  })
  it('dark theme overrides the view fill', () => {
    expect(antvThemeDark.type).toBe('classicDark')
  })
  it('createSvgRenderer returns a renderer instance', () => {
    expect(createSvgRenderer()).toBeInstanceOf(Object)
  })
})
