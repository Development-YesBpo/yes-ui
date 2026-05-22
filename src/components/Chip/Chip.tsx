import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import React from 'react'

interface ChipProps extends BaseProps {
  children: React.ReactNode
  onDismiss?: () => void
}

export function Chip({ children, onDismiss, className, style, 'data-testid': testId }: ChipProps) {
  return (
    <span className={cn(className)} style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--yes-font-sans)', fontSize:'var(--yes-text-xs)', fontWeight:600, padding:'3px 10px', borderRadius:'var(--yes-radius-badge)', border:'1px solid var(--yes-color-primary-border)', background:'var(--yes-color-badge-blue)', color:'var(--yes-color-primary)', whiteSpace:'nowrap', lineHeight:1.4, ...style }} data-testid={testId}>
      {children}
      {onDismiss && (
        <button type="button" aria-label="Eliminar filtro" onClick={onDismiss} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', padding:0, marginLeft:1, cursor:'pointer', color:'var(--yes-color-chip-dismiss)', fontSize:14, lineHeight:1 }}>×</button>
      )}
    </span>
  )
}
