import { describe, it, expect } from 'vitest'
import { chartTokens } from './chartTokens'

describe('chartTokens', () => {
  it('exposes an 8-color categorical series palette', () => {
    expect(chartTokens.series).toHaveLength(8)
    expect(chartTokens.series[0]).toBe('#2B52A0') // brand blue
    expect(chartTokens.series[1]).toBe('#8CBC39') // brand green
  })

  it('exposes axis, grid and waterfall semantic colors', () => {
    expect(chartTokens.gridColor).toBe('#E5E7EB')
    expect(chartTokens.axisLabelColor).toBe('#6B7280')
    expect(chartTokens.waterfall.positive).toBe('#16A34A')
    expect(chartTokens.waterfall.negative).toBe('#DC2626')
    expect(chartTokens.waterfall.total).toBe('#142860')
  })

  it('exposes a heatmap ramp from light to navy', () => {
    expect(chartTokens.heatmapRamp.length).toBeGreaterThanOrEqual(3)
    expect(chartTokens.heatmapRamp[0]).toBe('#EEF3FA')
  })
})
