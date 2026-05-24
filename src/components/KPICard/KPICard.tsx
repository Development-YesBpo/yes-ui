import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface KPICardProps extends BaseProps {
  label: string
  value: string | number
  delta?: string
  deltaLabel?: string
  icon?: LucideIcon
  color?: string
}

function isPositiveDelta(delta: string): boolean {
  if (delta.startsWith('+')) return true
  if (delta.startsWith('-')) return false
  const parsed = parseFloat(delta)
  return !Number.isNaN(parsed) && parsed > 0
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  boxShadow: 'var(--yes-shadow-sm)',
  padding: 'var(--yes-space-4) var(--yes-space-4-5)',
  flex: 1,
}

const LABEL_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1-5)',
  marginBottom: 'var(--yes-space-1-5)',
}

const ICON_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-text-subtle)',
  flexShrink: 0,
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--yes-color-text-subtle)',
}

const VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-display)',
  fontSize: 32,
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  lineHeight: 1,
}

const DELTA_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
  marginTop: 'var(--yes-space-2)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
}

const DELTA_LABEL_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-text-muted)',
  fontWeight: 400,
}

export function KPICard({
  label,
  value,
  delta,
  deltaLabel,
  icon: IconComp,
  color,
  className,
  style,
  'data-testid': testId,
}: KPICardProps) {
  const positive = delta ? isPositiveDelta(delta) : null

  const valueStyle: React.CSSProperties = color
    ? { ...VALUE_STYLE, color }
    : VALUE_STYLE

  const deltaStyle: React.CSSProperties = {
    ...DELTA_STYLE,
    color: positive ? 'var(--yes-color-kpi-up)' : 'var(--yes-color-kpi-down)',
  }

  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      <div style={LABEL_ROW_STYLE}>
        {IconComp && <IconComp size={14} style={ICON_STYLE} aria-hidden />}
        <span style={LABEL_STYLE}>{label}</span>
      </div>
      <div data-section="value" style={valueStyle}>
        {value}
      </div>
      {delta && (
        <div data-section="delta" style={deltaStyle}>
          {positive ? (
            <TrendingUp size={13} aria-hidden />
          ) : (
            <TrendingDown size={13} aria-hidden />
          )}
          <span>{delta}</span>
          {deltaLabel && <span style={DELTA_LABEL_STYLE}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}
