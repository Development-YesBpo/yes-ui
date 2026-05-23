import React, { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { BaseProps } from '../../types/shared'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps extends BaseProps {
  open: boolean
  onClose: () => void
  title: string
  size?: ModalSize
  children: React.ReactNode
  footer?: React.ReactNode
}

// ── Style injection ────────────────────────────────────────────
// :hover state for the close button cannot be expressed via React inline
// styles. We inject a single guarded <style> block per document — same
// pattern as Tabs and Sidebar (Wave 4). The dist build does not require
// a CSS-modules loader.
let modalStylesInjected = false
function injectModalStyles() {
  if (modalStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-modal', '')
  el.textContent = `
    [data-yes-modal-close]:hover {
      color: var(--yes-color-text);
    }
  `
  document.head.appendChild(el)
  modalStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const OVERLAY_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'var(--yes-color-scrim)',
  zIndex: 'var(--yes-z-modal)' as unknown as number,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--yes-space-6)',
}

const PANEL_BASE_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  borderRadius: 'var(--yes-radius-modal)',
  boxShadow: 'var(--yes-shadow-xl)',
  overflow: 'hidden',
  width: '100%',
  maxHeight: 'calc(100vh - var(--yes-space-12))',
  display: 'flex',
  flexDirection: 'column',
}

const PANEL_SIZE_STYLE: Record<ModalSize, React.CSSProperties> = {
  sm: { maxWidth: 'var(--yes-size-modal-sm)' },
  md: { maxWidth: 'var(--yes-size-modal-md)' },
  lg: { maxWidth: 'var(--yes-size-modal-lg)' },
}

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--yes-space-4) var(--yes-space-5)',
  borderBottom: '1px solid var(--yes-color-border)',
  flexShrink: 0,
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 17,
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
  fontSize: 20,
  lineHeight: 1,
  padding: 0,
  width: 24,
  height: 24,
  flexShrink: 0,
  transition: 'color var(--yes-duration-fast) var(--yes-ease)',
}

const BODY_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-4) var(--yes-space-5)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text-secondary)',
  lineHeight: 1.6,
  overflowY: 'auto',
  flex: 1,
}

const FOOTER_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-space-3) var(--yes-space-5)',
  borderTop: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-bg)',
  flexShrink: 0,
}

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
  style,
  'data-testid': testId,
}: ModalProps) {
  const titleId = useId()
  const panelRef = useFocusTrap(open) as React.RefObject<HTMLDivElement>

  // Escape key closes modal
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

  injectModalStyles()

  const panelStyle: React.CSSProperties = {
    ...PANEL_BASE_STYLE,
    ...PANEL_SIZE_STYLE[size],
    ...style,
  }

  return createPortal(
    <div
      style={OVERLAY_STYLE}
      data-testid={testId ? `${testId}-overlay` : 'modal-overlay'}
      data-yes-modal-overlay=""
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('yes-modal-panel', `yes-modal-${size}`, className)}
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
        data-yes-modal-panel=""
        data-size={size}
      >
        <div style={HEADER_STYLE}>
          <h2 id={titleId} style={TITLE_STYLE}>
            {title}
          </h2>
          <button
            type="button"
            data-yes-modal-close=""
            style={CLOSE_BTN_STYLE}
            onClick={onClose}
            aria-label="Cerrar"
          >
            {'×'}
          </button>
        </div>

        <div style={BODY_STYLE}>{children}</div>

        {footer && (
          <div style={FOOTER_STYLE} data-testid="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
