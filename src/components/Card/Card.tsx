import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface CardProps extends BaseProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

// ── Style injection ────────────────────────────────────────────
// :hover and :focus-visible cannot be expressed via React's inline `style` prop.
// One guarded <style> block per document keeps the dist build free of a
// CSS-modules loader requirement.
let cardStylesInjected = false
function injectCardStyles() {
  if (cardStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-card', '')
  el.textContent = `
    [data-yes-card-root][data-interactive='true'] {
      cursor: pointer;
      transition: box-shadow 150ms, border-color 150ms;
    }
    [data-yes-card-root][data-interactive='true']:hover {
      box-shadow: var(--yes-shadow-md);
      border-color: var(--yes-color-border-strong);
    }
    [data-yes-card-root][data-interactive='true']:focus-visible {
      outline: 2px solid var(--yes-color-primary);
      outline-offset: 2px;
    }
  `
  document.head.appendChild(el)
  cardStylesInjected = true
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
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderBottom: '1px solid var(--yes-color-border-faint)',
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 700,
  color: 'var(--yes-color-text)',
}

const BODY_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-3-5) var(--yes-space-4)',
}

const FOOTER_STYLE: React.CSSProperties = {
  padding: 'var(--yes-space-3) var(--yes-space-4)',
  borderTop: '1px solid var(--yes-color-border-faint)',
  background: 'var(--yes-color-surface-sunken)',
}

export function Card({
  children,
  header,
  footer,
  interactive,
  onClick,
  onKeyDown,
  className,
  style,
  'data-testid': testId,
}: CardProps) {
  injectCardStyles()

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
    onKeyDown?.(e)
  }

  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
      data-yes-card-root=""
      data-interactive={interactive ? 'true' : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {header !== undefined && header !== null && (
        <div data-section="header" style={HEADER_STYLE}>
          {header}
        </div>
      )}
      <div style={BODY_STYLE}>{children}</div>
      {footer !== undefined && footer !== null && (
        <div data-section="footer" style={FOOTER_STYLE}>
          {footer}
        </div>
      )}
    </div>
  )
}
