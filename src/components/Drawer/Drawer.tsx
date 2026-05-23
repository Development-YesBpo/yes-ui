import React, { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { BaseProps } from '../../types/shared'

export type DrawerSize = 'md' | 'lg'

export interface DrawerProps extends BaseProps {
  open: boolean
  onClose: () => void
  title: string
  size?: DrawerSize
  children: React.ReactNode
  footer?: React.ReactNode
}

// ── Style injection ────────────────────────────────────────────
// :hover state for the close button cannot be expressed via React inline
// styles. We inject a single guarded <style> block per document — same
// pattern as Modal / Tabs / Sidebar.
let drawerStylesInjected = false
function injectDrawerStyles() {
  if (drawerStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-drawer', '')
  el.textContent = `
    [data-yes-drawer-close]:hover {
      color: var(--yes-color-text);
    }
  `
  document.head.appendChild(el)
  drawerStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const OVERLAY_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'var(--yes-color-scrim)',
  zIndex: 'var(--yes-z-modal)' as unknown as number,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'flex-end',
}

const PANEL_BASE_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  borderLeft: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-card) 0 0 var(--yes-radius-card)',
  boxShadow: 'var(--yes-shadow-xl)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  // open state — slide in from right
  transform: 'translateX(0)',
  transition: 'transform var(--yes-duration-base) var(--yes-ease-out)',
}

const PANEL_SIZE_STYLE: Record<DrawerSize, React.CSSProperties> = {
  md: { width: 'var(--yes-size-drawer-md)' },
  lg: { width: 'var(--yes-size-drawer-lg)' },
}

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderBottom: '1px solid var(--yes-color-border)',
  flexShrink: 0,
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  lineHeight: 1.3,
  margin: 0,
}

const CLOSE_BTN_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--yes-color-text-subtle)',
  fontSize: 18,
  lineHeight: 1,
  padding: 0,
  width: 24,
  height: 24,
  flexShrink: 0,
  transition: 'color var(--yes-duration-fast) var(--yes-ease)',
}

const BODY_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--yes-space-3)',
  overflowY: 'auto',
  flex: 1,
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
}

const FOOTER_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderTop: '1px solid var(--yes-color-border)',
  flexShrink: 0,
}

export function Drawer({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
  style,
  'data-testid': testId,
}: DrawerProps) {
  const titleId = useId()
  const panelRef = useFocusTrap(open) as React.RefObject<HTMLDivElement>

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null
  if (typeof document === 'undefined') return null

  injectDrawerStyles()

  const panelStyle: React.CSSProperties = {
    ...PANEL_BASE_STYLE,
    ...PANEL_SIZE_STYLE[size],
    ...style,
  }

  return createPortal(
    <div
      style={OVERLAY_STYLE}
      data-testid={testId ? `${testId}-overlay` : 'drawer-overlay'}
      data-yes-drawer-overlay=""
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'yes-drawer-panel',
          `yes-drawer-${size}`,
          'yes-drawer-open',
          className,
        )}
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
        data-yes-drawer-panel=""
        data-size={size}
      >
        <div style={HEADER_STYLE}>
          <h2 id={titleId} style={TITLE_STYLE}>
            {title}
          </h2>
          <button
            type="button"
            data-yes-drawer-close=""
            style={CLOSE_BTN_STYLE}
            onClick={onClose}
            aria-label="Cerrar"
          >
            {'×'}
          </button>
        </div>

        <div style={BODY_STYLE}>{children}</div>

        {footer && (
          <div style={FOOTER_STYLE} data-testid="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
