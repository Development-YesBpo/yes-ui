import { cn } from '../../utils/cn'
import type { BaseProps, Size } from '../../types/shared'

// NOTE: CSS Modules are not supported by tsup/esbuild with injectStyle:true
// (esbuild does not handle CSS module default exports). Following Avatar pattern
// with inline styles using design tokens via var(--yes-*).

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: {
    width: 'var(--yes-size-spinner-sm)',
    height: 'var(--yes-size-spinner-sm)',
    borderWidth: '2px',
  },
  md: {
    width: 'var(--yes-size-spinner-md)',
    height: 'var(--yes-size-spinner-md)',
    borderWidth: '2px',
  },
  lg: {
    width: 'var(--yes-size-spinner-lg)',
    height: 'var(--yes-size-spinner-lg)',
    borderWidth: '3px',
  },
}

// Keyframe injection — runs once at module load time, guarded for SSR.
let _keyframesInjected = false
function injectKeyframes(): void {
  if (_keyframesInjected || typeof document === 'undefined') return
  _keyframesInjected = true
  const style = document.createElement('style')
  style.textContent = `@keyframes yes-spin{to{transform:rotate(360deg)}}`
  document.head.appendChild(style)
}

import React from 'react'

interface SpinnerProps extends BaseProps {
  size?: Size
}

export function Spinner({
  size = 'md',
  className,
  style,
  'data-testid': testId,
}: SpinnerProps) {
  injectKeyframes()

  return (
    <span
      role="status"
      aria-label="Cargando"
      data-testid={testId}
      data-size={size}
      className={cn(`yes-spinner yes-spinner--${size}`, className)}
      style={{
        borderRadius: '50%',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.15)',
        borderTopColor: 'currentColor',
        animation: 'yes-spin var(--yes-duration-slow,800ms) linear infinite',
        flexShrink: 0,
        display: 'inline-block',
        ...SIZE_STYLES[size],
        ...style,
      }}
    />
  )
}
