import React from 'react'
import { cn } from '../../utils/cn'
import { SearchInput } from '../SearchInput/SearchInput'
import { Chip } from '../Chip/Chip'
import type { BaseProps } from '../../types/shared'

export interface ActiveFilter {
  key: string
  label: string
}

export interface ToolbarProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  filterCount?: number
  activeFilters?: ActiveFilter[]
  onDismissFilter?: (key: string) => void
  actions?: React.ReactNode
  searchPlaceholder?: string
}

// ── Style injection ────────────────────────────────────────────
let toolbarStylesInjected = false
function injectToolbarStyles() {
  if (toolbarStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-toolbar', '')
  el.textContent = `
    [data-yes-toolbar-filter]:hover {
      border-color: var(--yes-color-primary);
      color: var(--yes-color-primary);
    }
    [data-yes-toolbar-filter][data-active='true'] {
      border-color: var(--yes-color-primary);
      color: var(--yes-color-primary);
    }
  `
  document.head.appendChild(el)
  toolbarStylesInjected = true
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-2)',
  flexWrap: 'wrap',
  minHeight: 'var(--yes-size-toolbar-height)',
}

const SEARCH_WRAPPER_STYLE: React.CSSProperties = {
  minWidth: 240,
  flex: '1 1 240px',
  maxWidth: 360,
}

const FILTER_BTN_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
  height: 'var(--yes-size-height-sm)',
  padding: '0 var(--yes-space-3)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-btn)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  fontWeight: 600,
  color: 'var(--yes-color-text)',
  cursor: 'pointer',
  transition: 'border-color 150ms, color 150ms',
  whiteSpace: 'nowrap',
}

const FILTER_BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  borderRadius: 'var(--yes-radius-badge)',
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-primitive-white)',
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1,
}

const ACTIONS_STYLE: React.CSSProperties = {
  marginLeft: 'auto',
  display: 'flex',
  gap: 'var(--yes-space-1-5)',
  alignItems: 'center',
}

export function Toolbar({
  value,
  onChange,
  onFilterClick,
  filterCount,
  activeFilters,
  onDismissFilter,
  actions,
  searchPlaceholder = 'Buscar…',
  className,
  style,
  'data-testid': testId,
}: ToolbarProps) {
  injectToolbarStyles()
  const hasCount = typeof filterCount === 'number' && filterCount > 0

  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
      role="toolbar"
      aria-label="Barra de herramientas"
    >
      <div style={SEARCH_WRAPPER_STYLE}>
        <SearchInput
          label="Buscar"
          hideLabel
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={searchPlaceholder}
          size="sm"
        />
      </div>

      {onFilterClick && (
        <button
          type="button"
          data-yes-toolbar-filter=""
          data-active={hasCount ? 'true' : undefined}
          style={FILTER_BTN_STYLE}
          onClick={onFilterClick}
          aria-label={hasCount ? `Filtrar, ${filterCount} activos` : 'Filtrar'}
        >
          Filtrar
          {hasCount && <span style={FILTER_BADGE_STYLE}>{filterCount}</span>}
        </button>
      )}

      {activeFilters?.map((f) => (
        <Chip key={f.key} onDismiss={() => onDismissFilter?.(f.key)}>
          {f.label}
        </Chip>
      ))}

      {actions && <div style={ACTIONS_STYLE}>{actions}</div>}
    </div>
  )
}
