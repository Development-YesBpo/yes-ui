import React, { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

export interface ActionMenuItem {
  label: string
  icon?: React.ElementType
  onClick: () => void
  danger?: boolean
  section?: string
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  trigger?: React.ReactNode
  'data-testid'?: string
}

// ── Style injection ────────────────────────────────────────────
// Trigger and item hover require selectors that React's inline
// `style` prop cannot express. One guarded <style> block per
// document keeps the dist build free of a CSS-modules loader.
let actionMenuStylesInjected = false
function injectActionMenuStyles() {
  if (actionMenuStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-action-menu', '')
  el.textContent = `
    [data-yes-am-trigger]:hover {
      background: var(--yes-color-surface-subtle);
    }
    [data-yes-am-item]:hover {
      background: var(--yes-color-surface-subtle);
    }
  `
  document.head.appendChild(el)
  actionMenuStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const WRAP_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
}

const TRIGGER_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-am-trigger)',
  height: 'var(--yes-size-am-trigger)',
  borderRadius: 'var(--yes-radius-md)',
  border: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-surface)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--yes-color-text-subtle)',
  transition: 'background 100ms',
  padding: 0,
}

const MENU_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  right: 0,
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-lg)',
  boxShadow: 'var(--yes-shadow-xl)',
  width: 'var(--yes-size-am-w)',
  padding: 'var(--yes-space-1) 0',
  zIndex: 'var(--yes-z-dropdown)' as unknown as number,
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-2)',
  width: '100%',
  padding: 'var(--yes-space-2) 14px',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text-default)',
  cursor: 'pointer',
  transition: 'background 100ms',
}

const ITEM_DANGER_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-danger)',
}

const ITEM_ICON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--yes-color-text-muted)',
  width: 16,
  flexShrink: 0,
}

const SECTION_LABEL_STYLE: React.CSSProperties = {
  padding: '6px 14px 2px',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--yes-color-text-muted)',
}

const DIVIDER_STYLE: React.CSSProperties = {
  height: 1,
  background: 'var(--yes-color-surface-subtle)',
  margin: 'var(--yes-space-1) 0',
}

const TRIGGER_WRAPPER_STYLE: React.CSSProperties = {
  display: 'inline-block',
  cursor: 'pointer',
}

export function ActionMenu({ items, trigger, ...rest }: ActionMenuProps) {
  injectActionMenuStyles()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  // Group items by section label
  type Section = { label?: string; items: ActionMenuItem[] }
  const sections: Section[] = []
  for (const item of items) {
    const last = sections[sections.length - 1]
    if (!last || last.label !== item.section) {
      const next: Section = { items: [item] }
      if (item.section !== undefined) next.label = item.section
      sections.push(next)
    } else {
      last.items.push(item)
    }
  }

  return (
    <div style={WRAP_STYLE} ref={wrapRef} {...rest}>
      {trigger ? (
        <div
          style={TRIGGER_WRAPPER_STYLE}
          onClick={() => setOpen((o) => !o)}
        >
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          data-yes-am-trigger=""
          style={TRIGGER_STYLE}
          aria-label="Más acciones"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <MoreVertical size={16} strokeWidth={1.75} />
        </button>
      )}
      {open && (
        <div style={MENU_STYLE} role="menu">
          {sections.map((section, si) => (
            <React.Fragment key={si}>
              {section.label && (
                <div style={SECTION_LABEL_STYLE}>{section.label}</div>
              )}
              {si > 0 && !section.label && (
                <div style={DIVIDER_STYLE} aria-hidden="true" />
              )}
              {section.items.map((item, ii) => {
                const IconComp = item.icon
                const computedItemStyle: React.CSSProperties = {
                  ...ITEM_STYLE,
                  ...(item.danger ? ITEM_DANGER_STYLE : null),
                }
                return (
                  <button
                    key={ii}
                    type="button"
                    role="menuitem"
                    data-yes-am-item=""
                    data-danger={item.danger ? 'true' : undefined}
                    style={computedItemStyle}
                    onClick={() => {
                      item.onClick()
                      setOpen(false)
                    }}
                  >
                    {IconComp && (
                      <span style={ITEM_ICON_STYLE}>
                        <IconComp size={14} strokeWidth={1.75} />
                      </span>
                    )}
                    {item.label}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
