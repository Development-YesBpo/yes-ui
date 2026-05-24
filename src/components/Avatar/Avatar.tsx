import { cn } from '../../utils/cn'
import type { BaseProps, Size } from '../../types/shared'

const AVATAR_COLORS = [
  '#2B52A0', '#16A34A', '#D97706', '#7C3AED',
  '#0891B2', '#BE185D', '#0F766E', '#DC2626',
]

function avatarColor(name: string): string {
  let h = 0
  for (const ch of name) h = ((h << 5) - h) + ch.charCodeAt(0)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

const SIZE_TOKENS: Record<Size, string> = {
  sm: 'var(--yes-size-avatar-sm)',
  md: 'var(--yes-size-avatar-md)',
  lg: 'var(--yes-size-avatar-lg)',
}

const FONT_SIZE_TOKENS: Record<Size, string> = {
  sm: 'calc(var(--yes-size-avatar-sm) * 0.36)',
  md: 'calc(var(--yes-size-avatar-md) * 0.36)',
  lg: 'calc(var(--yes-size-avatar-lg) * 0.36)',
}

interface AvatarProps extends BaseProps {
  name: string
  size?: Size | number   // 'sm'|'md'|'lg' = 24|32|40 px; or raw pixels for product-specific sizes
  src?: string | undefined  // explicit "accepts undefined" under exactOptionalPropertyTypes: true
  alt?: string
}

export function Avatar({
  name,
  size = 'md',
  src,
  alt,
  className,
  style,
  'data-testid': testId,
}: AvatarProps) {
  const isNum = typeof size === 'number'
  const sizeVar = isNum ? `${size}px` : SIZE_TOKENS[size as Size]
  const fontSizeVar = isNum ? `${Math.round(size * 0.36)}px` : FONT_SIZE_TOKENS[size as Size]

  return (
    <div
      className={cn(className)}
      style={{
        backgroundColor: src ? undefined : avatarColor(name),
        width: sizeVar,
        height: sizeVar,
        borderRadius: '50%',
        color: 'var(--yes-primitive-white, #fff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: 'var(--yes-font-sans)',
        fontWeight: 'var(--yes-weight-bold, 700)',
        letterSpacing: 'var(--yes-tracking-tight)',
        overflow: 'hidden',
        userSelect: 'none',
        fontSize: fontSizeVar,
        ...style,
      }}
      data-testid={testId}
      aria-label={!src ? name : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials(name)
      )}
    </div>
  )
}
