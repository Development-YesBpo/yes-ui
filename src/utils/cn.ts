import { clsx, type ClassValue } from 'clsx'

/**
 * Merges class names. Accepts any clsx-compatible input.
 * Use this — never string concatenation — for conditional class composition.
 *
 * @example
 * cn('btn', isActive && 'btn--active', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs)
}
