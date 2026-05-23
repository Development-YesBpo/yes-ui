import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

const ICONS: Record<AlertVariant, LucideIcon> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const VARIANT_STYLES: Record<AlertVariant, React.CSSProperties> = {
  success: {
    background: 'var(--yes-color-success-subtle)',
    borderColor: 'var(--yes-color-success-border)',
  },
  error: {
    background: 'var(--yes-color-danger-subtle)',
    borderColor: 'var(--yes-color-danger-border)',
  },
  warning: {
    background: 'var(--yes-color-warning-subtle)',
    borderColor: 'var(--yes-color-warning-border)',
  },
  info: {
    background: 'var(--yes-color-info-subtle)',
    borderColor: 'var(--yes-color-info-border)',
  },
}

const TITLE_COLORS: Record<AlertVariant, string> = {
  success: 'var(--yes-color-success-fg)',
  error:   'var(--yes-color-danger)',
  warning: 'var(--yes-color-warning-fg)',
  info:    'var(--yes-color-alert-title-info)',
}

const DESC_COLORS: Record<AlertVariant, string> = {
  success: 'var(--yes-color-alert-desc-success)',
  error:   'var(--yes-color-alert-desc-error)',
  warning: 'var(--yes-color-alert-desc-warning)',
  info:    'var(--yes-color-alert-desc-info)',
}

const ICON_COLORS: Record<AlertVariant, string> = {
  success: 'var(--yes-color-success)',
  error:   'var(--yes-color-danger)',
  warning: 'var(--yes-color-warning)',
  info:    'var(--yes-color-info)',
}

interface AlertProps extends BaseProps {
  variant: AlertVariant
  title: string
  description?: string
  onDismiss?: () => void
}

export function Alert({
  variant,
  title,
  description,
  onDismiss,
  className,
  style,
  'data-testid': testId,
}: AlertProps) {
  const IconComponent = ICONS[variant]

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--yes-space-3)',
    alignItems: 'flex-start',
    padding: 'var(--yes-space-4)',
    borderRadius: 'var(--yes-radius-card)',
    border: '1px solid',
    borderLeftWidth: 'var(--yes-size-alert-accent)',
    position: 'relative',
    ...VARIANT_STYLES[variant],
    ...style,
  }

  return (
    <div
      role="alert"
      className={cn(className)}
      style={rootStyle}
      data-testid={testId}
    >
      <IconComponent
        size={16}
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 'var(--yes-size-alert-icon)',
          height: 'var(--yes-size-alert-icon)',
          marginTop: 2,
          color: ICON_COLORS[variant],
        }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--yes-space-1)' }}>
        <p style={{
          margin: 0,
          fontSize: 'var(--yes-text-sm)',
          fontWeight: 'var(--yes-weight-semibold)',
          lineHeight: 'var(--yes-leading-snug)',
          color: TITLE_COLORS[variant],
        }}>
          {title}
        </p>
        {description && (
          <p style={{
            margin: 0,
            fontSize: 'var(--yes-text-sm)',
            lineHeight: 'var(--yes-leading-normal)',
            color: DESC_COLORS[variant],
          }}>
            {description}
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          style={{
            position: 'absolute',
            top: 'var(--yes-space-2)',
            right: 'var(--yes-space-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            borderRadius: 'var(--yes-radius-sm)',
            color: TITLE_COLORS[variant],
          }}
          onClick={onDismiss}
          aria-label="Cerrar alerta"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
