import { useState, useCallback } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

interface ToastInput {
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

const MAX_TOASTS = 3

let counter = 0
function nextId(): string {
  counter += 1
  return `toast-${counter}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((input: ToastInput) => {
    const item: ToastItem = { ...input, id: nextId() }
    setToasts((prev) => {
      const next = [...prev, item]
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
