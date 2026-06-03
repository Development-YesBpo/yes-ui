import React from 'react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

/** A single metric displayed inside a StatStrip. */
export interface StatStripItem {
  /** Short uppercase label below the value (e.g. "Agentes activos"). */
  label: string
  /** The metric value displayed prominently (e.g. "84", "82%", "4:23"). */
  value: string
  /** Optional unit shown smaller after the value (e.g. "min"). */
  unit?: string
}

export interface StatStripProps extends BaseProps {
  /** List of metrics to display as equal-width cells. */
  items: StatStripItem[]
}

/** Flex row, full width, border + radius around the whole strip. */
const ROOT_STYLE: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  borderRadius: 'var(--yes-radius-card)',
  overflow: 'hidden',
  border: '1px solid var(--yes-color-border)',
}

/** Each metric cell: flex 1, center-aligned, surface background. */
const CELL_BASE_STYLE: React.CSSProperties = {
  flex: 1,
  padding: 'var(--yes-space-3) var(--yes-space-3)',
  background: 'var(--yes-color-surface)',
  textAlign: 'center',
}

/** Large bold value using Barlow Semi Condensed (display font). */
const VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-display)',
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  lineHeight: 1,
}

/** Optional unit shown inline after the value, smaller and muted. */
const UNIT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 11,
  fontWeight: 400,
  color: 'var(--yes-color-text-muted)',
  marginLeft: 'var(--yes-space-1)',
}

/** Small uppercase label below the value — Manrope, subtle tone. */
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 9,
  fontWeight: 700,
  color: 'var(--yes-color-text-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: 'var(--yes-space-1)',
}

/**
 * StatStrip — compact operational metric bar.
 *
 * Pure DOM component (no AntV, no ChartFrame). Renders a horizontal row of
 * equal-width cells, each showing a large bold value and a small label.
 * Content is visible text — directly readable by assistive technology.
 *
 * Reference: Widget Gallery.html → StatStrip
 */
export function StatStrip({
  items,
  className,
  style,
  'data-testid': testId,
}: StatStripProps) {
  return (
    <div
      className={cn(className)}
      style={{ ...ROOT_STYLE, ...style }}
      data-testid={testId}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          style={{
            ...CELL_BASE_STYLE,
            borderLeft: i > 0 ? '1px solid var(--yes-color-border)' : 'none',
          }}
        >
          {/* Large metric value with optional unit */}
          <div style={VALUE_STYLE}>
            {item.value}
            {item.unit != null && (
              <span style={UNIT_STYLE}>{item.unit}</span>
            )}
          </div>
          {/* Short uppercase label */}
          <div style={LABEL_STYLE}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}
