import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface FilterPanelProps extends BaseProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  onClear: () => void
  children: React.ReactNode
}

interface FilterPanelGroupProps {
  label: string
  children: React.ReactNode
  className?: string
}

// ── Style injection ────────────────────────────────────────────
// :hover styles cannot be expressed via React inline styles. We inject
// a single guarded <style> block per document — same pattern as Modal /
// Tabs / Sidebar (Wave 4).
let filterPanelStylesInjected = false
function injectFilterPanelStyles() {
  if (filterPanelStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-filter-panel', '')
  el.textContent = `
    [data-yes-fp-close]:hover { color: var(--yes-color-text); }
    [data-yes-fp-clear]:hover { border-color: var(--yes-color-text-muted); }
    [data-yes-fp-apply]:hover { background: var(--yes-color-primary-hover); }
  `
  document.head.appendChild(el)
  filterPanelStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const PANEL_STYLE: React.CSSProperties = {
  position: 'absolute',
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card)',
  boxShadow: 'var(--yes-shadow-lg)',
  width: 'var(--yes-size-filter-panel-width)',
  overflow: 'hidden',
  zIndex: 'var(--yes-z-dropdown)' as unknown as number,
}

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderBottom: '1px solid var(--yes-color-border)',
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--yes-color-text)',
}

const CLOSE_BTN_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  borderRadius: 'var(--yes-radius-sm)',
  border: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-bg)',
  cursor: 'pointer',
  color: 'var(--yes-color-text-subtle)',
  fontSize: 16,
  lineHeight: 1,
  transition: 'color var(--yes-duration-fast) var(--yes-ease)',
  padding: 0,
}

const BODY_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--yes-space-3)',
}

const FOOTER_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderTop: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-bg)',
}

const CLEAR_BTN_STYLE: React.CSSProperties = {
  flex: 1,
  height: 34,
  borderRadius: 'var(--yes-radius-btn)',
  border: '1px solid var(--yes-color-border-strong)',
  background: 'transparent',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-text-muted)',
  cursor: 'pointer',
  transition: 'border-color var(--yes-duration-fast) var(--yes-ease)',
}

const APPLY_BTN_STYLE: React.CSSProperties = {
  flex: 2,
  height: 34,
  borderRadius: 'var(--yes-radius-btn)',
  border: 'none',
  background: 'var(--yes-color-primary)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-surface)',
  cursor: 'pointer',
  transition: 'background var(--yes-duration-fast) var(--yes-ease)',
}

const GROUP_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const GROUP_LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--yes-color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}

const GROUP_CONTENT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--yes-space-1)',
}

function FilterPanelGroup({ label, children, className }: FilterPanelGroupProps) {
  return (
    <div className={cn(className)} style={GROUP_STYLE}>
      <div style={GROUP_LABEL_STYLE}>{label}</div>
      <div style={GROUP_CONTENT_STYLE}>{children}</div>
    </div>
  )
}

export function FilterPanel({
  open,
  onClose,
  onApply,
  onClear,
  children,
  className,
  style,
  'data-testid': testId,
}: FilterPanelProps) {
  if (!open) return null

  injectFilterPanelStyles()

  const panelStyle: React.CSSProperties = {
    ...PANEL_STYLE,
    ...style,
  }

  return (
    <div
      className={cn(className)}
      style={panelStyle}
      data-testid={testId}
      data-yes-fp-root=""
    >
      <div style={HEADER_STYLE}>
        <span style={TITLE_STYLE}>Filtros avanzados</span>
        <button
          type="button"
          data-yes-fp-close=""
          style={CLOSE_BTN_STYLE}
          onClick={onClose}
          aria-label="Cerrar filtros"
        >
          {'×'}
        </button>
      </div>

      <div style={BODY_STYLE}>{children}</div>

      <div style={FOOTER_STYLE}>
        <button
          type="button"
          data-yes-fp-clear=""
          style={CLEAR_BTN_STYLE}
          onClick={onClear}
          aria-label="Limpiar"
        >
          Limpiar
        </button>
        <button
          type="button"
          data-yes-fp-apply=""
          style={APPLY_BTN_STYLE}
          onClick={onApply}
          aria-label="Aplicar filtros"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}

FilterPanel.Group = FilterPanelGroup
