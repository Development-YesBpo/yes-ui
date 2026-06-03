/** Compact number formatter: >=1000 → "1.3k", else the plain integer. */
export function defaultValueFormatter(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
}
