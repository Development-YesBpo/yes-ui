import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

// Shimmer keyframe is injected once via a <style> tag
let shimmerInjected = false
function injectShimmer() {
  if (shimmerInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = `
    @keyframes yes-shimmer {
      from { background-position: -200% 0; }
      to   { background-position:  200% 0; }
    }
  `
  document.head.appendChild(style)
  shimmerInjected = true
}

interface SkeletonProps extends BaseProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
}

function toPx(val: string | number | undefined, defaultVal: string): string {
  if (val === undefined) return defaultVal
  return typeof val === 'number' ? `${val}px` : val
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className,
  style,
  'data-testid': testId,
}: SkeletonProps) {
  if (typeof window !== 'undefined') {
    injectShimmer()
  }

  const computedStyle: React.CSSProperties = {
    display: 'block',
    backgroundColor: 'var(--yes-color-skeleton-base)',
    borderRadius: borderRadius ?? 'var(--yes-radius-sm)',
    overflow: 'hidden',
    position: 'relative',
    width:  toPx(width, '100%'),
    height: toPx(height, '16px'),
    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
    backgroundSize: '200% 100%',
    animation: 'yes-shimmer var(--yes-duration-skeleton, 1.5s) linear infinite',
    ...style,
  }

  return (
    <span
      className={cn(className)}
      style={computedStyle}
      data-testid={testId}
      aria-hidden="true"
    />
  )
}
