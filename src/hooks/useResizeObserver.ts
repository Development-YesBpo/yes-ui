import { useEffect, useRef, useState } from 'react'
import type React from 'react'

/**
 * Observe a container's width for fluid chart sizing.
 * SSR-safe: ResizeObserver is only touched inside an effect.
 */
export function useResizeObserver<T extends HTMLElement>(): {
  ref: React.RefObject<T>
  width: number
} {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (typeof w === 'number') setWidth(w)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, width }
}
