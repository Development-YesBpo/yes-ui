import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Icon } from '../Icon/Icon'
import { Avatar } from '../Avatar/Avatar'
import type { BaseProps } from '../../types/shared'
import { cn } from '../../utils/cn'

export interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  badge?: number
  group?: string
}

export interface SidebarUser {
  name: string
  role: string
  avatarSrc?: string
}

export interface SidebarProps extends BaseProps {
  product: string
  navItems: NavItem[]
  activeKey: string
  onNavigate: (key: string) => void
  user: SidebarUser
  onLogout: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

// ── Style injection ────────────────────────────────────────────
// :hover and [aria-current] selectors cannot be expressed inline.
// One guarded <style> block per document keeps the dist build free of a
// CSS-modules loader requirement.
let sidebarStylesInjected = false
function injectSidebarStyles() {
  if (sidebarStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-sidebar', '')
  el.textContent = `
    [data-yes-sidebar-item]:hover {
      background: var(--yes-color-sidebar-item-hover);
      color: var(--yes-color-sidebar-fg-active);
    }
    [data-yes-sidebar-item][aria-current='page'] {
      background: var(--yes-color-sidebar-item-active);
      color: var(--yes-color-sidebar-fg-active);
      font-weight: 600;
    }
    [data-yes-sidebar-item][aria-current='page'] [data-yes-sidebar-badge] {
      background: var(--yes-color-sidebar-badge-active);
      color: var(--yes-color-surface);
    }
    [data-yes-sidebar-toggle]:hover {
      background: var(--yes-color-sidebar-item-hover);
      color: var(--yes-color-sidebar-fg-active);
    }
    [data-yes-sidebar-logout]:hover {
      opacity: 1;
      background: var(--yes-color-sidebar-item-hover);
    }
  `
  document.head.appendChild(el)
  sidebarStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 'var(--yes-size-sidebar-width)',
  minHeight: '100vh',
  background: 'var(--yes-color-sidebar-bg)',
  flexShrink: 0,
  overflow: 'hidden',
  transition: 'width 200ms ease',
}

const COLLAPSED_ROOT: React.CSSProperties = {
  width: 'var(--yes-size-sidebar-width-collapsed)',
}

const LOGO_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 16px 12px',
  borderBottom: '1px solid var(--yes-color-sidebar-border)',
  flexShrink: 0,
}

const LOGO_TEXT_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  overflow: 'hidden',
}

const LOGO_HEADING_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--yes-color-sidebar-fg-active)',
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
}

const LOGO_HEADING_ACCENT: React.CSSProperties = {
  color: 'var(--yes-color-brand-accent)',
}

const LOGO_SUB_STYLE = (collapsed: boolean): React.CSSProperties => ({
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 10,
  color: 'var(--yes-color-sidebar-fg)',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  opacity: collapsed ? 0 : 0.6,
  pointerEvents: collapsed ? 'none' : undefined,
  transition: 'opacity 150ms',
})

const TOGGLE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  border: 'none',
  background: 'transparent',
  color: 'var(--yes-color-sidebar-fg)',
  cursor: 'pointer',
  borderRadius: 'var(--yes-radius-btn)',
  flexShrink: 0,
  transition: 'background 120ms, color 120ms',
}

const NAV_BODY_STYLE: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: 8,
}

const GROUP_LABEL_STYLE = (collapsed: boolean): React.CSSProperties => ({
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--yes-color-sidebar-fg)',
  opacity: collapsed ? 0 : 0.4,
  padding: collapsed ? '0 8px' : '4px 8px 6px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxHeight: collapsed ? 0 : 32,
  pointerEvents: collapsed ? 'none' : undefined,
  transition: 'opacity 150ms, max-height 150ms',
})

const NAV_ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 10px',
  borderRadius: 'var(--yes-radius-btn)',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'var(--yes-color-sidebar-fg)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 13,
  fontWeight: 500,
  width: '100%',
  textAlign: 'left',
  transition: 'background 120ms, color 120ms',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  marginBottom: 2,
}

const NAV_ICON_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 16,
  height: 16,
}

const NAV_LABEL_STYLE = (collapsed: boolean): React.CSSProperties => ({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  opacity: collapsed ? 0 : 1,
  pointerEvents: collapsed ? 'none' : undefined,
  width: collapsed ? 0 : undefined,
  transition: 'opacity 150ms',
})

const NAV_BADGE_STYLE = (collapsed: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 5px',
  borderRadius: 'var(--yes-radius-badge)',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1,
  flexShrink: 0,
  background: 'var(--yes-color-sidebar-badge-idle)',
  color: 'var(--yes-color-sidebar-fg)',
  opacity: collapsed ? 0 : 1,
  pointerEvents: collapsed ? 'none' : undefined,
  transition: 'opacity 150ms, background 120ms, color 120ms',
})

const FOOTER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 10px',
  borderTop: '1px solid var(--yes-color-sidebar-border)',
  flexShrink: 0,
  overflow: 'hidden',
}

const USER_INFO_STYLE = (collapsed: boolean): React.CSSProperties => ({
  flex: 1,
  overflow: 'hidden',
  opacity: collapsed ? 0 : 1,
  pointerEvents: collapsed ? 'none' : undefined,
  width: collapsed ? 0 : undefined,
  transition: 'opacity 150ms',
})

const USER_NAME_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--yes-color-sidebar-fg-active)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const USER_ROLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 10,
  color: 'var(--yes-color-sidebar-fg)',
  opacity: 0.5,
  whiteSpace: 'nowrap',
}

const LOGOUT_BTN_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  color: 'var(--yes-color-sidebar-fg)',
  opacity: 0.4,
  cursor: 'pointer',
  padding: 4,
  borderRadius: 'var(--yes-radius-btn)',
  flexShrink: 0,
  transition: 'opacity 120ms, background 120ms',
}

export function Sidebar({
  product,
  navItems,
  activeKey,
  onNavigate,
  user,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  className,
  style,
  'data-testid': testId,
}: SidebarProps) {
  injectSidebarStyles()

  // Build ordered list with group labels injected
  const entries: Array<{ groupLabel?: string; item: NavItem }> = []
  const seenGroups = new Set<string>()

  for (const item of navItems) {
    if (item.group && !seenGroups.has(item.group)) {
      seenGroups.add(item.group)
      entries.push({ groupLabel: item.group, item })
    } else {
      entries.push({ item })
    }
  }

  const rootStyle: React.CSSProperties = {
    ...ROOT_STYLE,
    ...(collapsed ? COLLAPSED_ROOT : {}),
    ...style,
  }

  return (
    <nav
      className={cn(className)}
      style={rootStyle}
      data-testid={testId}
      data-yes-sidebar-root=""
      data-collapsed={collapsed ? 'true' : 'false'}
      aria-label="Navegación principal"
    >
      {/* ── Logo ── */}
      <div style={LOGO_STYLE}>
        <div style={LOGO_TEXT_STYLE}>
          <span style={LOGO_HEADING_STYLE}>
            YES <span style={LOGO_HEADING_ACCENT}>BPO</span>
          </span>
          <span
            style={LOGO_SUB_STYLE(collapsed)}
            aria-hidden={collapsed ? 'true' : undefined}
          >
            {product}
          </span>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            data-yes-sidebar-toggle=""
            style={TOGGLE_STYLE}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <Icon
              icon={collapsed ? ChevronRight : ChevronLeft}
              size={14}
              aria-hidden
            />
          </button>
        )}
      </div>

      {/* ── Nav body ── */}
      <div style={NAV_BODY_STYLE}>
        {entries.map(({ groupLabel, item }) => {
          const isActive = item.key === activeKey
          return (
            <div key={item.key}>
              {groupLabel && (
                <div
                  style={GROUP_LABEL_STYLE(collapsed)}
                  aria-hidden={collapsed ? 'true' : undefined}
                >
                  {groupLabel}
                </div>
              )}
              <button
                type="button"
                data-yes-sidebar-item=""
                style={NAV_ITEM_STYLE}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <span style={NAV_ICON_STYLE}>
                  <Icon icon={item.icon} size={16} aria-hidden />
                </span>
                <span
                  style={NAV_LABEL_STYLE(collapsed)}
                  aria-hidden={collapsed ? 'true' : undefined}
                >
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    data-yes-sidebar-badge=""
                    data-badge-active={isActive}
                    style={NAV_BADGE_STYLE(collapsed)}
                    aria-hidden={collapsed ? 'true' : undefined}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Footer ── */}
      <div style={FOOTER_STYLE}>
        {user.avatarSrc !== undefined ? (
          <Avatar name={user.name} src={user.avatarSrc} size="sm" />
        ) : (
          <Avatar name={user.name} size="sm" />
        )}
        <div
          style={USER_INFO_STYLE(collapsed)}
          aria-hidden={collapsed ? 'true' : undefined}
        >
          <div style={USER_NAME_STYLE} aria-hidden={collapsed ? 'true' : undefined}>
            {user.name}
          </div>
          <div style={USER_ROLE_STYLE} aria-hidden={collapsed ? 'true' : undefined}>
            {user.role}
          </div>
        </div>
        <button
          type="button"
          data-yes-sidebar-logout=""
          style={LOGOUT_BTN_STYLE}
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <Icon icon={LogOut} size={14} aria-hidden />
        </button>
      </div>
    </nav>
  )
}
