import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export type AgentStatus = 'disponible' | 'ocupado' | 'en-llamada' | 'descanso' | 'desconectado'
export type AgentIndicatorSize = 'sm' | 'md'

const LABELS: Record<AgentStatus, string> = {
  'disponible':   'Disponible',
  'ocupado':      'Ocupado',
  'en-llamada':   'En llamada',
  'descanso':     'Descanso',
  'desconectado': 'Desconectado',
}

const DOT_COLOR: Record<AgentStatus, string> = {
  'disponible':   'var(--yes-color-success)',
  'ocupado':      'var(--yes-color-warning)',
  'en-llamada':   'var(--yes-color-info)',
  'descanso':     'var(--yes-color-agent-descanso)',
  'desconectado': 'var(--yes-color-text-subtle)',
}

const ROOT_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--yes-space-btn-gap)',
  fontFamily: 'var(--yes-font-sans)',
}

const LABEL_STYLE_BASE: React.CSSProperties = {
  color: 'var(--yes-color-text)',
  fontWeight: 500,
  lineHeight: 1,
}

export interface AgentStatusIndicatorProps extends BaseProps {
  status: AgentStatus
  showLabel?: boolean
  size?: AgentIndicatorSize
}

export function AgentStatusIndicator({
  status,
  showLabel = true,
  size = 'md',
  className,
  style,
  'data-testid': testId,
}: AgentStatusIndicatorProps) {
  const dotSize = size === 'sm'
    ? 'var(--yes-size-agent-dot-sm)'
    : 'var(--yes-size-agent-dot)'
  const labelSize = size === 'sm'
    ? 'var(--yes-text-xs)'
    : 'var(--yes-text-sm)'

  const rootStyle: React.CSSProperties = { ...ROOT_STYLE, ...style }
  const dotStyle: React.CSSProperties = {
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    background: DOT_COLOR[status],
    flexShrink: 0,
    display: 'inline-block',
  }
  const labelStyle: React.CSSProperties = {
    ...LABEL_STYLE_BASE,
    fontSize: labelSize,
  }

  return (
    <span
      className={cn('yes-asi', size, status, className)}
      style={rootStyle}
      data-testid={testId}
    >
      <span aria-hidden="true" style={dotStyle} />
      {showLabel && <span style={labelStyle}>{LABELS[status]}</span>}
    </span>
  )
}
