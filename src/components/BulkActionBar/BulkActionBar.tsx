import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface BulkAction {
  label: string
  onClick: () => void
  danger?: boolean
}

export interface BulkActionBarProps extends BaseProps {
  count: number
  actions: BulkAction[]
  onClear: () => void
}

// ── Style injection ────────────────────────────────────────────
let bulkStylesInjected = false
function injectBulkStyles() {
  if (bulkStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-bulkbar', '')
  el.textContent = `
    [data-yes-bulk-btn]:hover { opacity: 0.85; }
    [data-yes-bulk-clear]:hover { color: var(--yes-color-text-muted); }
  `
  document.head.appendChild(el)
  bulkStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-selection-bg)',
  border: '1px solid var(--yes-color-selection-border)',
  borderRadius: 'var(--yes-radius-card)',
  padding: '0 var(--yes-space-3-5)',
  height: 'var(--yes-size-bulk-bar-height)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1-5)',
}

const COUNT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 700,
  color: 'var(--yes-color-selection-text)',
  minWidth: 100,
  whiteSpace: 'nowrap',
}

const BTN_STYLE: React.CSSProperties = {
  height: 28,
  padding: '0 var(--yes-space-2-5)',
  borderRadius: 'var(--yes-radius-btn)',
  border: '1px solid var(--yes-color-selection-border)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-selection-text)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'opacity 150ms',
}

const BTN_DANGER_STYLE: React.CSSProperties = {
  ...BTN_STYLE,
  color: 'var(--yes-color-danger)',
  borderColor: '#FECACA',
}

const DIVIDER_STYLE: React.CSSProperties = {
  width: 1,
  height: 18,
  background: 'var(--yes-color-selection-border)',
  flexShrink: 0,
}

const BTN_CLEAR_STYLE: React.CSSProperties = {
  marginLeft: 'auto',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-text-subtle)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'color 150ms',
}

export function BulkActionBar({
  count,
  actions,
  onClear,
  className,
  style,
  'data-testid': testId,
}: BulkActionBarProps) {
  injectBulkStyles()

  if (count === 0) return null

  const standard = actions.filter((a) => !a.danger)
  const dangerous = actions.filter((a) => a.danger)

  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      role="toolbar"
      aria-label="Acciones en lote"
      data-testid={testId}
    >
      <span style={COUNT_STYLE}>{count} seleccionados</span>

      {standard.map((action) => (
        <button
          key={action.label}
          type="button"
          data-yes-bulk-btn=""
          style={BTN_STYLE}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}

      {dangerous.length > 0 && <div style={DIVIDER_STYLE} aria-hidden />}

      {dangerous.map((action) => (
        <button
          key={action.label}
          type="button"
          data-yes-bulk-btn=""
          data-danger="true"
          style={BTN_DANGER_STYLE}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}

      <button
        type="button"
        data-yes-bulk-clear=""
        style={BTN_CLEAR_STYLE}
        onClick={onClear}
      >
        × Limpiar selección
      </button>
    </div>
  )
}
