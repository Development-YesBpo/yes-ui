import React, { useMemo } from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

export interface PaginationProps extends BaseProps {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

// ── Style injection ────────────────────────────────────────────
// Hover and aria-current state styles cannot be expressed via React's
// inline `style` prop. One guarded <style> block per document keeps the
// dist build free of a CSS-modules loader requirement.
let paginationStylesInjected = false
function injectPaginationStyles() {
  if (paginationStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-pagination', '')
  el.textContent = `
    [data-yes-pagination-btn]:not(:disabled):not([aria-current='page']):hover {
      background: var(--yes-color-bg);
    }
    [data-yes-pagination-btn][aria-current='page'] {
      background: var(--yes-color-primary);
      color: var(--yes-primitive-white);
      border-color: var(--yes-color-primary);
    }
    [data-yes-pagination-btn]:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  `
  document.head.appendChild(el)
  paginationStylesInjected = true
}

// ── Page calculation ───────────────────────────────────────────
function getPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

// ── Style maps ─────────────────────────────────────────────────
const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-3)',
  flexWrap: 'wrap',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
}

const PAGE_SIZE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--yes-space-1)',
}

const SELECT_STYLE: React.CSSProperties = {
  height: 'var(--yes-size-pagination-btn)',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-btn)',
  padding: '0 var(--yes-space-2)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text)',
  background: 'var(--yes-color-surface)',
  cursor: 'pointer',
}

const INFO_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-text-muted)',
  whiteSpace: 'nowrap',
}

const NAV_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--yes-space-1)',
  marginLeft: 'auto',
}

const BTN_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-pagination-btn)',
  height: 'var(--yes-size-pagination-btn)',
  borderRadius: 'var(--yes-radius-btn)',
  border: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-surface)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  color: 'var(--yes-color-text)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 150ms, color 150ms',
  padding: 0,
}

const ELLIPSIS_STYLE: React.CSSProperties = {
  ...BTN_STYLE,
  border: 'none',
  background: 'none',
  cursor: 'default',
}

export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
  style,
  'data-testid': testId,
}: PaginationProps) {
  injectPaginationStyles()

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pages = useMemo(() => getPages(page, totalPages), [page, totalPages])
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Paginación"
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      {pageSizeOptions && (
        <div style={PAGE_SIZE_STYLE}>
          Mostrar{' '}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            style={SELECT_STYLE}
            aria-label="Registros por página"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>{' '}
          por página
        </div>
      )}

      <span style={INFO_STYLE}>{start}–{end} de {total}</span>

      <div style={NAV_STYLE}>
        <button
          type="button"
          data-yes-pagination-btn=""
          style={BTN_STYLE}
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          aria-label="Primera página"
        >«</button>
        <button
          type="button"
          data-yes-pagination-btn=""
          style={BTN_STYLE}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >‹</button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} style={ELLIPSIS_STYLE} aria-hidden>…</span>
          ) : (
            <button
              key={p}
              type="button"
              data-yes-pagination-btn=""
              style={BTN_STYLE}
              onClick={() => onPageChange(p as number)}
              aria-current={page === p ? 'page' : undefined}
              aria-label={`Página ${p}`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          data-yes-pagination-btn=""
          style={BTN_STYLE}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >›</button>
        <button
          type="button"
          data-yes-pagination-btn=""
          style={BTN_STYLE}
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Última página"
        >»</button>
      </div>
    </nav>
  )
}
