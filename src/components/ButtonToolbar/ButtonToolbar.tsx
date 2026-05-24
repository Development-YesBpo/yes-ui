import React from 'react'

// ── Style injection ────────────────────────────────────────────
// Hover (without disabled) and `:last-child no border-right` rules
// cannot be expressed via React's inline `style` prop. One guarded
// <style> block per document keeps the dist build free of a
// CSS-modules loader requirement.
let buttonToolbarStylesInjected = false
function injectButtonToolbarStyles() {
  if (buttonToolbarStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-button-toolbar', '')
  el.textContent = `
    [data-yes-tb-btn]:hover:not(:disabled) {
      background: var(--yes-color-surface-subtle);
    }
    [data-yes-tb-root] [data-yes-tb-btn]:last-child {
      border-right: none;
    }
  `
  document.head.appendChild(el)
  buttonToolbarStylesInjected = true
}

// ── ToolbarButton ───────────────────────────────────────────────
export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

const BTN_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-seg-h)',
  padding: '0 var(--yes-space-tb-px)',
  border: 'none',
  borderRight: '1px solid var(--yes-color-border)',
  background: 'transparent',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-text-default)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
  whiteSpace: 'nowrap',
  transition: 'background 100ms',
}

const BTN_ICON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
}

export function ToolbarButton({
  icon,
  children,
  disabled,
  style,
  ...rest
}: ToolbarButtonProps) {
  injectButtonToolbarStyles()
  const computedStyle: React.CSSProperties = {
    ...BTN_STYLE,
    ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : null),
    ...style,
  }
  return (
    <button
      type="button"
      data-yes-tb-btn=""
      style={computedStyle}
      disabled={disabled}
      {...rest}
    >
      {icon && <span style={BTN_ICON_STYLE}>{icon}</span>}
      {children}
    </button>
  )
}

// ── ButtonToolbar ───────────────────────────────────────────────
export interface ButtonToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TOOLBAR_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-md)',
  background: 'var(--yes-color-surface)',
  overflow: 'hidden',
}

export function ButtonToolbar({ children, style, ...rest }: ButtonToolbarProps) {
  injectButtonToolbarStyles()
  return (
    <div
      role="toolbar"
      data-yes-tb-root=""
      style={{ ...TOOLBAR_STYLE, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
