import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface WidgetProps extends BaseProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  boxShadow: 'var(--yes-shadow-sm)',
  overflow: 'hidden',
}

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderBottom: '1px solid var(--yes-color-border-faint)',
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 700,
  color: 'var(--yes-color-text)',
}

const BODY_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-3-5) var(--yes-space-4)',
}

export function Widget({
  title,
  action,
  children,
  className,
  style,
  'data-testid': testId,
}: WidgetProps) {
  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      <div style={HEADER_STYLE}>
        <span style={TITLE_STYLE}>{title}</span>
        {action !== undefined && action !== null && (
          <div data-section="action">{action}</div>
        )}
      </div>
      <div style={BODY_STYLE}>{children}</div>
    </div>
  )
}
