import React from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../../components/Skeleton/Skeleton'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import type { BaseProps } from '../../types/shared'

export interface ChartFrameProps extends BaseProps {
  /** Accessible text alternative. Applied as aria-label on the role="img" root. */
  ariaLabel: string
  /** Fixed height in px. Default 148. */
  height?: number
  /** Render a Skeleton instead of children. */
  loading?: boolean
  /** Render an EmptyState instead of children. */
  isEmpty?: boolean
  /** EmptyState title when isEmpty. Default "Sin datos". */
  emptyTitle?: string
  /** Screen-reader data table mirroring the chart. */
  srTable?: { headers: string[]; rows: Array<Array<string | number>> }
  children: React.ReactNode
}

const SR_ONLY: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function ChartFrame({
  ariaLabel,
  height = 148,
  loading = false,
  isEmpty = false,
  emptyTitle = 'Sin datos',
  srTable,
  children,
  className,
  style,
  'data-testid': testId,
}: ChartFrameProps) {
  const rootStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: height,
    ...style,
  }

  return (
    <div
      className={cn(className)}
      style={rootStyle}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {loading ? (
        <Skeleton width="100%" height={height} />
      ) : isEmpty ? (
        <EmptyState title={emptyTitle} />
      ) : (
        <>
          {children}
          {srTable && (
            <table style={SR_ONLY}>
              <thead>
                <tr>
                  {srTable.headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {srTable.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
