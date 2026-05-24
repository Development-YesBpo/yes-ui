import React from 'react'

export interface ColumnDef {
  key: string
  label: string
  visible: boolean
  locked?: boolean
}

export interface ColumnManagerProps {
  columns: ColumnDef[]
  onVisibilityChange: (key: string, visible: boolean) => void
  onApply: () => void
  onReset: () => void
  'data-testid'?: string
}

// ── Style injection ────────────────────────────────────────────
// Row hover requires a class selector. One guarded <style> block per
// document keeps the dist build free of a CSS-modules loader.
let columnManagerStylesInjected = false
function injectColumnManagerStyles() {
  if (columnManagerStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-column-manager', '')
  el.textContent = `
    [data-yes-cm-row]:hover:not([data-locked='true']) {
      background: var(--yes-color-surface-subtle);
    }
  `
  document.head.appendChild(el)
  columnManagerStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const PANEL_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-xl)',
  boxShadow: 'var(--yes-shadow-xl)',
  width: 'var(--yes-size-cm-w)',
  overflow: 'hidden',
}

const HEADER_STYLE: React.CSSProperties = {
  padding: '10px 14px 8px',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-size-cm-text)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--yes-color-text-muted)',
  borderBottom: '1px solid var(--yes-color-surface-subtle)',
}

const LIST_STYLE: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
}

const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-cm-py) 14px',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text-default)',
  cursor: 'pointer',
  transition: 'background 100ms',
}

const ROW_LOCKED_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-text-muted)',
  cursor: 'default',
}

const CHECKBOX_STYLE: React.CSSProperties = {
  accentColor: 'var(--yes-color-primary)',
  width: 14,
  height: 14,
  cursor: 'pointer',
  flexShrink: 0,
}

const CHECKBOX_LOCKED_STYLE: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
}

const LABEL_STYLE: React.CSSProperties = {
  flex: 1,
  cursor: 'inherit',
}

const DRAG_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-border)',
  fontSize: 'var(--yes-text-sm)',
  marginLeft: 'auto',
  cursor: 'grab',
  flexShrink: 0,
}

const FOOTER_STYLE: React.CSSProperties = {
  borderTop: '1px solid var(--yes-color-surface-subtle)',
  padding: 'var(--yes-space-2) 14px',
  display: 'flex',
  justifyContent: 'space-between',
}

const RESET_BTN_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
  color: 'var(--yes-color-text-subtle)',
}

const APPLY_BTN_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
  color: 'var(--yes-color-primary)',
}

export function ColumnManager({
  columns,
  onVisibilityChange,
  onApply,
  onReset,
  ...rest
}: ColumnManagerProps) {
  injectColumnManagerStyles()
  return (
    <div style={PANEL_STYLE} {...rest}>
      <div style={HEADER_STYLE}>Columnas visibles</div>
      <ul style={LIST_STYLE}>
        {columns.map((col) => {
          const rowStyle: React.CSSProperties = {
            ...ROW_STYLE,
            ...(col.locked ? ROW_LOCKED_STYLE : null),
          }
          const checkboxStyle: React.CSSProperties = {
            ...CHECKBOX_STYLE,
            ...(col.locked ? CHECKBOX_LOCKED_STYLE : null),
          }
          return (
            <li
              key={col.key}
              data-yes-cm-row=""
              data-locked={col.locked ? 'true' : undefined}
              style={rowStyle}
            >
              <input
                type="checkbox"
                id={`cm-col-${col.key}`}
                checked={col.visible}
                disabled={col.locked}
                aria-label={col.label}
                onChange={(e) => onVisibilityChange(col.key, e.target.checked)}
                style={checkboxStyle}
              />
              <label htmlFor={`cm-col-${col.key}`} style={LABEL_STYLE}>
                {col.label}
              </label>
              {!col.locked && (
                <span style={DRAG_STYLE} aria-hidden="true">
                  ⠿
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <div style={FOOTER_STYLE}>
        <button type="button" style={RESET_BTN_STYLE} onClick={onReset}>
          Restablecer
        </button>
        <button type="button" style={APPLY_BTN_STYLE} onClick={onApply}>
          Aplicar
        </button>
      </div>
    </div>
  )
}
