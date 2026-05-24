import React from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

// ── Style injection ────────────────────────────────────────────
// Breadcrumb link hover requires a descendant selector that React's
// inline `style` prop cannot express. One guarded <style> block per
// document keeps the dist build free of a CSS-modules loader.
let pageHeaderStylesInjected = false
function injectPageHeaderStyles() {
  if (pageHeaderStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-page-header', '')
  el.textContent = `
    [data-yes-ph-crumb-link]:hover {
      text-decoration: underline;
    }
  `
  document.head.appendChild(el)
  pageHeaderStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-md)',
  padding: '0 var(--yes-space-5)',
  boxShadow: 'var(--yes-shadow-sm)',
}

const BREADCRUMB_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  padding: 'var(--yes-space-ph-top) 0 0',
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
}

const SEP_STYLE: React.CSSProperties = {
  margin: '0 var(--yes-space-1)',
  color: 'var(--yes-color-text-muted)',
}

const LINK_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-primary)',
  textDecoration: 'none',
}

const TEXT_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-text-muted)',
}

const MAIN_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--yes-space-2) 0 var(--yes-space-ph-bottom)',
}

const LEFT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-display)',
  fontSize: 'var(--yes-text-page-title)',
  fontWeight: 700,
  color: 'var(--yes-color-text-default)',
  lineHeight: 1,
  margin: 0,
}

const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-body)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
  margin: 0,
}

const ACTIONS_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--yes-space-2)',
  alignItems: 'center',
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  style,
  ...rest
}: PageHeaderProps) {
  injectPageHeaderStyles()

  return (
    <div style={{ ...ROOT_STYLE, ...style }} {...rest}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={BREADCRUMB_STYLE} aria-label="Ruta de navegación">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={SEP_STYLE}>{' › '}</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  style={LINK_STYLE}
                  data-yes-ph-crumb-link=""
                >
                  {crumb.label}
                </a>
              ) : (
                <span style={TEXT_STYLE}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div style={MAIN_STYLE}>
        <div style={LEFT_STYLE}>
          <h1 style={TITLE_STYLE}>{title}</h1>
          {subtitle && (
            <p style={SUBTITLE_STYLE} data-testid="ph-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={ACTIONS_STYLE}>{actions}</div>}
      </div>
    </div>
  )
}
