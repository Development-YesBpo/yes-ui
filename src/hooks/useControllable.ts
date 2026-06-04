import { useCallback, useRef, useState } from 'react'

/**
 * Bridges controlled and uncontrolled component patterns.
 * When `value` prop is provided, behaves as controlled.
 * When only `defaultValue` is provided, manages state internally.
 *
 * Prevents the "switching from controlled to uncontrolled" React warning
 * by locking the mode on mount.
 */
export function useControllable<T>(
  value: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: T,
): [T, (next: T) => void] {
  const isControlled = useRef(value !== undefined).current
  const [internalValue, setInternalValue] = useState<T>(defaultValue)

  const current = isControlled ? (value as T) : internalValue

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [current, setValue]
}
