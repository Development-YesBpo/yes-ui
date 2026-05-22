import React from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from '../Spinner/Spinner'
import type { BaseProps } from '../../types/shared'

type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'green' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const TONE_STYLE: Record<ButtonTone, React.CSSProperties> = {
  primary: {
    background: 'var(--yes-color-primary)',
    color: 'var(--yes-color-primary-fg)',
    border: '1px solid var(--yes-color-primary)',
  },
  secondary: {
    background: 'var(--yes-color-secondary)',
    color: 'var(--yes-color-secondary-fg)',
    border: '1px solid var(--yes-color-secondary-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--yes-color-primary)',
    border: '1px solid var(--yes-color-primary)',
  },
  green: {
    background: 'var(--yes-color-brand-accent)',
    color: 'var(--yes-color-primary-fg)',
    border: '1px solid var(--yes-color-brand-accent)',
  },
  danger: {
    background: 'var(--yes-color-danger)',
    color: 'var(--yes-color-danger-fg)',
    border: '1px solid var(--yes-color-danger)',
  },
}

const DISABLED_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-surface-disabled)',
  color: 'var(--yes-color-text-disabled)',
  border: '1px solid var(--yes-color-border-disabled)',
  cursor: 'not-allowed',
}

const SIZE_STYLE: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: 'var(--yes-size-height-sm)',
    padding: '0 var(--yes-size-px-sm)',
    fontSize: 'var(--yes-size-btn-text-sm)',
  },
  md: {
    height: 'var(--yes-size-height-md)',
    padding: '0 var(--yes-size-px-md)',
    fontSize: 'var(--yes-size-btn-text-md)',
  },
  lg: {
    height: 'var(--yes-size-height-lg)',
    padding: '0 var(--yes-size-btn-px-lg)',
    fontSize: 'var(--yes-size-btn-text-lg)',
  },
}

interface ButtonOwnProps extends BaseProps {
  tone?: ButtonTone
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  as?: React.ElementType
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  'aria-label'?: string
}

export function Button({
  tone = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconOnly = false,
  as: Element = 'button',
  children,
  type = 'button',
  onClick,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...rest
}: ButtonOwnProps) {
  const isDisabled = disabled || isLoading

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--yes-space-btn-gap)',
    cursor: 'pointer',
    fontFamily: 'var(--yes-font-sans)',
    fontWeight: 600 as React.CSSProperties['fontWeight'],
    borderRadius: 'var(--yes-radius-btn)',
    transition: `background var(--yes-duration-base), border-color var(--yes-duration-base), color var(--yes-duration-base)`,
    whiteSpace: 'nowrap',
    lineHeight: 1,
    textDecoration: 'none',
    userSelect: 'none',
    verticalAlign: 'middle',
    ...(iconOnly
      ? { padding: 0, width: `var(--yes-size-height-${size})` }
      : SIZE_STYLE[size]),
    ...(isDisabled ? DISABLED_STYLE : TONE_STYLE[tone]),
    ...(isLoading && !disabled ? { cursor: 'wait', color: 'rgba(255,255,255,0.7)' } : {}),
    ...style,
  }

  return (
    <Element
      type={Element === 'button' ? type : undefined}
      disabled={Element === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled ? true : undefined}
      aria-busy={isLoading ? true : undefined}
      aria-label={ariaLabel}
      onClick={isDisabled ? undefined : onClick}
      data-testid={testId}
      className={cn(className)}
      style={baseStyle}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </Element>
  )
}
