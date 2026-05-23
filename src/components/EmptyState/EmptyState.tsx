import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import { Button } from '../Button/Button'

interface EmptyStateProps extends BaseProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
  className,
  style,
  'data-testid': testId,
}: EmptyStateProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 'var(--yes-size-empty-max-w)',
        gap: 'var(--yes-space-3)',
        padding: 'var(--yes-space-8) var(--yes-space-4)',
        ...style,
      }}
      data-testid={testId}
    >
      {IconComponent && (
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--yes-color-text-subtle)',
            width: 'var(--yes-size-empty-icon)',
            height: 'var(--yes-size-empty-icon)',
            flexShrink: 0,
          }}
        >
          <IconComponent size={40} strokeWidth={1.5} />
        </div>
      )}

      <h3 style={{
        fontFamily: 'var(--yes-font-heading)',
        fontSize: 'var(--yes-text-base)',
        fontWeight: 'var(--yes-weight-semibold)' as React.CSSProperties['fontWeight'],
        color: 'var(--yes-color-text)',
        margin: 0,
        lineHeight: 'var(--yes-leading-snug)',
      }}>
        {title}
      </h3>

      {description && (
        <p style={{
          fontSize: 'var(--yes-text-sm)',
          color: 'var(--yes-color-text-muted)',
          maxWidth: 'var(--yes-size-empty-desc-w)',
          lineHeight: 'var(--yes-leading-normal)',
          margin: 0,
        }}>
          {description}
        </p>
      )}

      {action && (
        <Button tone="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
