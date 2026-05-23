import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps extends BaseProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  variant?: 'underline' | 'contained'
}

// ── Style injection ────────────────────────────────────────────
// Hover and aria-selected state styles cannot be expressed via React's
// inline `style` prop. We inject a single guarded <style> block once per
// document so the dist build does not need a CSS-modules loader.
let tabsStylesInjected = false
function injectTabsStyles() {
  if (tabsStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-tabs', '')
  el.textContent = `
    [data-yes-tabs-root][data-variant='underline'] [data-yes-tabs-btn]:hover {
      color: var(--yes-color-tabs-label-active);
    }
    [data-yes-tabs-root][data-variant='underline'] [data-yes-tabs-btn][aria-selected='true'] {
      color: var(--yes-color-tabs-label-active);
      border-bottom-color: var(--yes-color-tabs-indicator);
    }
    [data-yes-tabs-root][data-variant='contained'] [data-yes-tabs-btn]:hover {
      color: var(--yes-color-text);
    }
    [data-yes-tabs-root][data-variant='contained'] [data-yes-tabs-btn][aria-selected='true'] {
      background: var(--yes-color-tabs-contained-tab);
      color: var(--yes-color-text);
      box-shadow: var(--yes-shadow-sm);
    }
    [data-yes-tabs-root] [data-yes-tabs-btn][aria-selected='true'] [data-yes-tabs-count] {
      background: var(--yes-color-primary);
      color: var(--yes-color-surface);
    }
  `
  document.head.appendChild(el)
  tabsStylesInjected = true
}

// ── Base style maps ────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 0,
  position: 'relative',
}

const UNDERLINE_ROOT: React.CSSProperties = {
  borderBottom: '2px solid var(--yes-color-tabs-border)',
}

const CONTAINED_ROOT: React.CSSProperties = {
  background: 'var(--yes-color-tabs-contained-bg)',
  borderRadius: 'var(--yes-radius-btn)',
  padding: 3,
  gap: 2,
}

const TAB_BASE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 13,
  fontWeight: 'var(--yes-weight-semibold)' as unknown as number,
  color: 'var(--yes-color-tabs-label-idle)',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  lineHeight: 1,
  transition: 'color 120ms, background 120ms, border-color 120ms, box-shadow 120ms',
}

const UNDERLINE_TAB: React.CSSProperties = {
  ...TAB_BASE,
  padding: '8px 16px',
  borderBottom: '2px solid transparent',
  marginBottom: -2,
}

const CONTAINED_TAB: React.CSSProperties = {
  ...TAB_BASE,
  padding: '6px 14px',
  borderRadius: 'calc(var(--yes-radius-btn) - 2px)',
}

const COUNT_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 5px',
  borderRadius: 'var(--yes-radius-badge)',
  fontSize: 11,
  fontWeight: 'var(--yes-weight-semibold)' as unknown as number,
  background: 'var(--yes-color-border)',
  color: 'var(--yes-color-text-muted)',
  lineHeight: 1,
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  className,
  style,
  'data-testid': testId,
}: TabsProps) {
  injectTabsStyles()

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (id !== activeId) onChange(id)
    }
  }

  const rootStyle: React.CSSProperties = {
    ...ROOT_STYLE,
    ...(variant === 'underline' ? UNDERLINE_ROOT : CONTAINED_ROOT),
    ...style,
  }

  const tabStyle = variant === 'underline' ? UNDERLINE_TAB : CONTAINED_TAB

  return (
    <div
      role="tablist"
      className={cn(className)}
      style={rootStyle}
      data-testid={testId}
      data-variant={variant}
      data-yes-tabs-root=""
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            data-yes-tabs-btn=""
            style={tabStyle}
            onClick={() => { if (!isActive) onChange(item.id) }}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                data-yes-tabs-count=""
                style={COUNT_STYLE}
                aria-label={`${item.count} elementos`}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
