import React from 'react'

export type AdminBannerVariant = 'amber' | 'blue' | 'neutral' | 'red'

const ICONS: Record<AdminBannerVariant, string> = {
  amber: '⚠',
  blue: '◈',
  neutral: 'ℹ',
  red: '⚡',
}

export interface AdminBannerProps {
  variant: AdminBannerVariant
  badge?: string
  message: string
  onAction: () => void
  actionLabel?: string
  'data-testid'?: string
}

// ── Variant palette ────────────────────────────────────────────
interface VariantPalette {
  bg: string
  borderColor: string
  textColor: string
  pillBg: string
  pillBorder: string
  pillText: string
  pillRadius: string
  pillLetterSpacing?: string
  hasDot: boolean
  dotColor?: string
  btnBg: string
  btnColor: string
  btnBorder: string
}

const PALETTES: Record<AdminBannerVariant, VariantPalette> = {
  amber: {
    bg: 'var(--yes-color-amber-bg)',
    borderColor: 'var(--yes-color-amber-border)',
    textColor: 'var(--yes-color-amber-pill-text)',
    pillBg: 'var(--yes-color-amber-pill-bg)',
    pillBorder: 'var(--yes-color-amber-pill-border)',
    pillText: 'var(--yes-color-amber-pill-text)',
    pillRadius: 'var(--yes-radius-full)',
    hasDot: true,
    dotColor: 'var(--yes-color-amber-border)',
    btnBg: 'var(--yes-color-amber-border)',
    btnColor: 'var(--yes-color-on-primary)',
    btnBorder: 'none',
  },
  blue: {
    bg: 'var(--yes-color-banner-blue-bg)',
    borderColor: 'var(--yes-color-primary)',
    textColor: 'var(--yes-color-primary)',
    pillBg: 'var(--yes-color-banner-blue-pill-bg)',
    pillBorder: 'var(--yes-color-banner-blue-pill-border)',
    pillText: 'var(--yes-color-primary)',
    pillRadius: 'var(--yes-radius-full)',
    hasDot: false,
    btnBg: 'var(--yes-color-primary)',
    btnColor: 'var(--yes-color-on-primary)',
    btnBorder: 'none',
  },
  neutral: {
    bg: 'var(--yes-color-surface-subtle)',
    borderColor: 'var(--yes-color-text-muted)',
    textColor: 'var(--yes-color-text-subtle)',
    pillBg: 'var(--yes-color-border)',
    pillBorder: 'var(--yes-color-border-strong)',
    pillText: 'var(--yes-color-banner-neutral-pill-text)',
    pillRadius: 'var(--yes-radius-sm)',
    pillLetterSpacing: '0.04em',
    hasDot: false,
    btnBg: 'var(--yes-color-surface)',
    btnColor: 'var(--yes-color-text-default)',
    btnBorder: '1px solid var(--yes-color-border-strong)',
  },
  red: {
    bg: 'var(--yes-color-banner-red-bg)',
    borderColor: 'var(--yes-color-danger)',
    textColor: 'var(--yes-color-banner-red-text-strong)',
    pillBg: 'var(--yes-color-banner-red-pill-bg)',
    pillBorder: 'var(--yes-color-banner-red-pill-border)',
    pillText: 'var(--yes-color-danger)',
    pillRadius: 'var(--yes-radius-sm)',
    hasDot: true,
    dotColor: 'var(--yes-color-danger)',
    btnBg: 'var(--yes-color-danger)',
    btnColor: 'var(--yes-color-on-primary)',
    btnBorder: 'none',
  },
}

// ── Static style maps ──────────────────────────────────────────
const BANNER_STYLE_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '0 14px',
  height: 'var(--yes-size-banner-h)',
  borderRadius: 'var(--yes-radius-md)',
  borderLeftWidth: 'var(--yes-size-banner-border)',
  borderLeftStyle: 'solid',
  overflow: 'hidden',
}

const ICON_STYLE: React.CSSProperties = {
  fontSize: 14,
  flexShrink: 0,
}

const PILL_STYLE_BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
  padding: '2px var(--yes-space-2)',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-size-cm-text)',
  fontWeight: 700,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  borderWidth: 1,
  borderStyle: 'solid',
}

const DOT_STYLE_BASE: React.CSSProperties = {
  width: 'var(--yes-size-banner-dot)',
  height: 'var(--yes-size-banner-dot)',
  borderRadius: '50%',
  flexShrink: 0,
}

const TEXT_STYLE_BASE: React.CSSProperties = {
  flex: 1,
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 500,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const BTN_STYLE_BASE: React.CSSProperties = {
  flexShrink: 0,
  height: 'var(--yes-size-banner-btn-h)',
  padding: '0 var(--yes-space-3)',
  borderRadius: 'var(--yes-radius-sm)',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  letterSpacing: '0.01em',
}

export function AdminBanner({
  variant,
  badge,
  message,
  onAction,
  actionLabel = 'Salir',
  ...rest
}: AdminBannerProps) {
  const p = PALETTES[variant]

  const bannerStyle: React.CSSProperties = {
    ...BANNER_STYLE_BASE,
    background: p.bg,
    borderLeftColor: p.borderColor,
    color: p.textColor,
  }
  const pillStyle: React.CSSProperties = {
    ...PILL_STYLE_BASE,
    background: p.pillBg,
    borderColor: p.pillBorder,
    color: p.pillText,
    borderRadius: p.pillRadius,
    ...(p.pillLetterSpacing ? { letterSpacing: p.pillLetterSpacing } : null),
  }
  const dotStyle: React.CSSProperties = {
    ...DOT_STYLE_BASE,
    background: p.dotColor,
  }
  const textStyle: React.CSSProperties = {
    ...TEXT_STYLE_BASE,
    color: p.textColor,
  }
  const btnStyle: React.CSSProperties = {
    ...BTN_STYLE_BASE,
    background: p.btnBg,
    color: p.btnColor,
    border: p.btnBorder,
  }

  return (
    <div
      data-variant={variant}
      data-testid="banner-root"
      role="status"
      aria-live="polite"
      style={bannerStyle}
      {...rest}
    >
      <span style={ICON_STYLE} aria-hidden="true">
        {ICONS[variant]}
      </span>
      {badge && (
        <span style={pillStyle} data-testid="banner-pill">
          {p.hasDot && <span style={dotStyle} aria-hidden="true" />}
          {badge}
        </span>
      )}
      <span style={textStyle}>{message}</span>
      <button type="button" style={btnStyle} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}
