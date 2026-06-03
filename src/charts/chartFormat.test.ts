import { describe, it, expect } from 'vitest'
import { defaultValueFormatter } from './chartFormat'

describe('defaultValueFormatter', () => {
  it('passes through values under 1000', () => {
    expect(defaultValueFormatter(0)).toBe('0')
    expect(defaultValueFormatter(742)).toBe('742')
  })
  it('compacts thousands with one decimal and a k suffix', () => {
    expect(defaultValueFormatter(1284)).toBe('1.3k')
    expect(defaultValueFormatter(12847)).toBe('12.8k')
  })
})
