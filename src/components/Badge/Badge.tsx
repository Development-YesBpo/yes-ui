import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import React from 'react'

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'blue'

const VARIANT_STYLE: Record<BadgeVariant, { bg: string; color: string; dot: string }> = {
  success: { bg: 'var(--yes-color-success-subtle)', color: 'var(--yes-color-success-fg)', dot: 'var(--yes-color-success)' },
  error:   { bg: 'var(--yes-color-danger-subtle)',  color: 'var(--yes-primitive-error-700)', dot: 'var(--yes-color-danger)' },
  warning: { bg: 'var(--yes-color-warning-subtle)', color: 'var(--yes-color-warning-fg)', dot: 'var(--yes-color-warning)' },
  info:    { bg: 'var(--yes-color-info-subtle)',    color: 'var(--yes-primitive-info-700)', dot: 'var(--yes-color-info)' },
  neutral: { bg: 'var(--yes-color-neutral)',        color: 'var(--yes-color-neutral-fg)', dot: 'var(--yes-color-text-subtle)' },
  blue:    { bg: 'var(--yes-color-badge-blue)',     color: 'var(--yes-color-badge-blue-fg)', dot: 'var(--yes-color-primary)' },
}

interface BadgeProps extends BaseProps {
  variant: BadgeVariant
  showDot?: boolean
  children: React.ReactNode
}

export function Badge({ variant, showDot = true, children, className, style, 'data-testid': testId }: BadgeProps) {
  const v = VARIANT_STYLE[variant]
  return (
    <span
      className={cn(className)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontFamily: 'var(--yes-font-sans)',
        fontSize: 'var(--yes-text-xs)',
        fontWeight: 600,
        padding: 'var(--yes-size-badge-py) var(--yes-size-badge-px)',
        borderRadius: 'var(--yes-radius-badge)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        background: v.bg,
        color: v.color,
        ...style,
      }}
      data-testid={testId}
    >
      {showDot && (
        <span
          data-dot=""
          aria-hidden="true"
          style={{
            width: 'var(--yes-size-badge-dot)',
            height: 'var(--yes-size-badge-dot)',
            borderRadius: '50%',
            background: v.dot,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
