import { useId as useReactId } from 'react'

/**
 * SSR-safe stable ID generation.
 * Wraps React 18's useId. Accepts an optional prefix for readability.
 * Never uses Math.random() — IDs are deterministic across server and client.
 */
export function useId(prefix?: string): string {
  const id = useReactId()
  return prefix ? `${prefix}-${id}` : id
}
