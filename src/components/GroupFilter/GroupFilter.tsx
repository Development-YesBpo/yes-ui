import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface GroupFilterProps extends BaseProps {
  onApply: () => void
  onClear: () => void
  children: React.ReactNode
}

// ── Style injection ────────────────────────────────────────────
let groupFilterStylesInjected = false
function injectGroupFilterStyles() {
  if (groupFilterStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-groupfilter', '')
  el.textContent = `
    [data-yes-gf-apply]:hover { opacity: 0.9; }
    [data-yes-gf-clear]:hover {
      background: var(--yes-color-bg);
      color: var(--yes-color-text);
    }
  `
  document.head.appendChild(el)
  groupFilterStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  overflow: 'hidden',
}

const CONTROLS_STYLE: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
}

const FOOTER_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderTop: '1px solid var(--yes-color-border-faint)',
  background: 'var(--yes-color-surface-sunken)',
}

const BTN_CLEAR_STYLE: React.CSSProperties = {
  flex: 1,
  height: 'var(--yes-size-height-md)',
  borderRadius: 'var(--yes-radius-btn)',
  border: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-text-muted)',
  cursor: 'pointer',
  transition: 'background 150ms, color 150ms',
}

const BTN_APPLY_STYLE: React.CSSProperties = {
  flex: 2,
  height: 'var(--yes-size-height-md)',
  borderRadius: 'var(--yes-radius-btn)',
  border: 'none',
  background: 'var(--yes-color-primary)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-primitive-white)',
  cursor: 'pointer',
  transition: 'opacity 150ms',
}

export function GroupFilter({
  onApply,
  onClear,
  children,
  className,
  style,
  'data-testid': testId,
}: GroupFilterProps) {
  injectGroupFilterStyles()

  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      <div style={CONTROLS_STYLE}>{children}</div>
      <div style={FOOTER_STYLE}>
        <button
          type="button"
          data-yes-gf-clear=""
          style={BTN_CLEAR_STYLE}
          onClick={onClear}
        >
          Limpiar
        </button>
        <button
          type="button"
          data-yes-gf-apply=""
          style={BTN_APPLY_STYLE}
          onClick={onApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}
