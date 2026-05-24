import React from 'react'

export interface SegmentOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
}

// ── Style maps ─────────────────────────────────────────────────
const GROUP_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-md)',
  background: 'var(--yes-color-surface-subtle)',
  overflow: 'hidden',
}

const BTN_BASE_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-seg-h)',
  padding: '0 var(--yes-space-seg-px)',
  border: 'none',
  background: 'transparent',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-text-subtle)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
  transition: 'background 100ms, color 100ms',
}

const BTN_ACTIVE_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  color: 'var(--yes-color-primary)',
  boxShadow: 'var(--yes-shadow-xs)',
}

const ICON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
}

export function SegmentedControl({
  options,
  value,
  onChange,
  style,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      style={{ ...GROUP_STYLE, ...style }}
      role="group"
      aria-label="Selector de vista"
      {...rest}
    >
      {options.map((opt, i) => {
        const isActive = opt.value === value
        const isLast = i === options.length - 1
        const btnStyle: React.CSSProperties = {
          ...BTN_BASE_STYLE,
          ...(isActive ? BTN_ACTIVE_STYLE : null),
          borderRight: isLast ? 'none' : '1px solid var(--yes-color-border)',
        }
        return (
          <button
            key={opt.value}
            type="button"
            style={btnStyle}
            aria-pressed={isActive}
            onClick={() => {
              if (!isActive) onChange(opt.value)
            }}
          >
            {opt.icon && <span style={ICON_STYLE}>{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
