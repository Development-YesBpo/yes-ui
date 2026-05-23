import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import type { ToastVariant } from './useToast'

const ICONS: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const ACCENT_COLORS: Record<ToastVariant, string> = {
  success: 'var(--yes-color-success)',
  error:   'var(--yes-color-danger)',
  warning: 'var(--yes-color-warning)',
  info:    'var(--yes-color-info)',
}

interface ToastProps extends BaseProps {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
  onDismiss: (id: string) => void
}

export function Toast({
  id,
  variant,
  title,
  description,
  duration = 4000,
  onDismiss,
  className,
  style,
  'data-testid': testId,
}: ToastProps) {
  const IconComponent = ICONS[variant]
  const accentColor = ACCENT_COLORS[variant]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(className)}
      style={{
        display: 'flex',
        gap: 'var(--yes-space-3)',
        alignItems: 'center',
        padding: 'var(--yes-space-3) var(--yes-space-4)',
        borderRadius: 'var(--yes-radius-card)',
        boxShadow: 'var(--yes-shadow-lg)',
        fontSize: 'var(--yes-text-sm)',
        maxWidth: 'var(--yes-size-toast-max-width)',
        width: '100%',
        position: 'relative',
        background: 'var(--yes-color-toast-bg)',
        color: 'var(--yes-color-toast-fg)',
        borderLeft: `3px solid ${accentColor}`,
        ...style,
      }}
      data-testid={testId}
    >
      <IconComponent
        size={16}
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 16,
          height: 16,
          color: accentColor,
        }}
      />

      <div style={{ flex: 1, fontWeight: 'var(--yes-weight-medium)' as React.CSSProperties['fontWeight'] }}>
        <span>{title}</span>
        {description && (
          <p style={{ margin: '2px 0 0 0', fontSize: 'var(--yes-text-xs)', opacity: 0.8 }}>
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--yes-color-toast-close)',
          borderRadius: 'var(--yes-radius-sm)',
          flexShrink: 0,
        }}
        onClick={() => onDismiss(id)}
        aria-label="Cerrar notificación"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
