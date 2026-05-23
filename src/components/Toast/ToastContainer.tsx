import { Toast } from './Toast'
import type { ToastItem } from './useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notificaciones"
      style={{
        position: 'fixed',
        bottom: 'var(--yes-space-6)',
        right: 'var(--yes-space-6)',
        zIndex: 'var(--yes-z-toast)' as unknown as number,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--yes-size-toast-gap)',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            id={t.id}
            variant={t.variant}
            title={t.title}
            {...(t.description !== undefined ? { description: t.description } : {})}
            {...(t.duration !== undefined ? { duration: t.duration } : {})}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  )
}
