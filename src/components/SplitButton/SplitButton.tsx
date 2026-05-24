import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SplitButtonItem {
  label: string
  onClick: () => void
  danger?: boolean
}

export interface SplitButtonProps {
  label: string
  onMainClick: () => void
  items: SplitButtonItem[]
  disabled?: boolean
  'data-testid'?: string
}

// ── Style injection ────────────────────────────────────────────
// Hover and disabled-state visual variants require selectors that
// React's inline `style` prop cannot express. One guarded <style>
// block per document keeps the dist build free of a CSS-modules
// loader requirement.
let splitButtonStylesInjected = false
function injectSplitButtonStyles() {
  if (splitButtonStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-split-button', '')
  el.textContent = `
    [data-yes-sb-main]:hover:not(:disabled),
    [data-yes-sb-arrow]:hover:not(:disabled) {
      opacity: 0.92;
    }
    [data-yes-sb-item]:hover {
      background: var(--yes-color-surface-subtle);
    }
  `
  document.head.appendChild(el)
  splitButtonStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const WRAP_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
}

const BTN_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 'var(--yes-radius-md)',
  overflow: 'hidden',
  boxShadow: 'var(--yes-shadow-xs)',
}

const MAIN_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-split-h)',
  padding: '0 var(--yes-space-4)',
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-color-on-primary)',
  border: 'none',
  borderRight: '1px solid var(--yes-color-split-divider)',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 100ms',
}

const ARROW_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-split-h)',
  width: 'var(--yes-size-split-arrow)',
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-color-on-primary)',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 100ms',
  padding: 0,
}

const DISABLED_OVERLAY: React.CSSProperties = {
  opacity: 0.45,
  cursor: 'not-allowed',
}

const DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  right: 0,
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-lg)',
  boxShadow: 'var(--yes-shadow-lg)',
  width: 200,
  padding: 'var(--yes-space-1) 0',
  zIndex: 'var(--yes-z-dropdown)' as unknown as number,
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: 'var(--yes-space-sd-py) var(--yes-space-seg-px)',
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

export function SplitButton({
  label,
  onMainClick,
  items,
  disabled,
  ...rest
}: SplitButtonProps) {
  injectSplitButtonStyles()
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

  const mainStyle: React.CSSProperties = {
    ...MAIN_STYLE,
    ...(disabled ? DISABLED_OVERLAY : null),
  }
  const arrowStyle: React.CSSProperties = {
    ...ARROW_STYLE,
    ...(disabled ? DISABLED_OVERLAY : null),
  }

  return (
    <div style={WRAP_STYLE} ref={wrapRef} {...rest}>
      <div style={BTN_STYLE}>
        <button
          type="button"
          data-yes-sb-main=""
          style={mainStyle}
          onClick={onMainClick}
          disabled={disabled}
        >
          {label}
        </button>
        <button
          type="button"
          data-yes-sb-arrow=""
          style={arrowStyle}
          aria-label="Abrir opciones"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
        >
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </div>
      {open && (
        <div style={DROPDOWN_STYLE} role="menu">
          {items.map((item, i) => {
            const computedItemStyle: React.CSSProperties = {
              ...ITEM_STYLE,
              ...(item.danger ? ITEM_DANGER_STYLE : null),
            }
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                data-yes-sb-item=""
                data-danger={item.danger ? 'true' : undefined}
                style={computedItemStyle}
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
