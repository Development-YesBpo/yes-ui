import type { LucideIcon } from 'lucide-react'
import type { BaseProps } from '../../types/shared'

interface IconProps extends BaseProps {
  icon: LucideIcon
  size?: number
  strokeWidth?: number
  color?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

export function Icon({
  icon: LucideComponent,
  size = 16,
  strokeWidth = 1.75,
  color = 'currentColor',
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const hidden = ariaHidden ?? !ariaLabel

  return (
    <LucideComponent
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
      style={style}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={hidden}
      role={ariaLabel ? 'img' : undefined}
    />
  )
}
