import { useEffect, useRef } from 'react'
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

interface CheckboxProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | keyof BaseProps> {
  label: string
  indeterminate?: boolean
  hint?: string
  error?: string
  id?: string
}

const hintStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-field-hint-text)',
  color: 'var(--yes-color-field-hint)',
  lineHeight: 1.4,
  display: 'block',
  paddingLeft: 'calc(16px + var(--yes-space-2))',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-field-hint-text)',
  color: 'var(--yes-color-field-error)',
  lineHeight: 1.4,
  display: 'block',
  paddingLeft: 'calc(16px + var(--yes-space-2))',
}

export function Checkbox({
  label,
  indeterminate = false,
  disabled = false,
  hint,
  error,
  id: idProp,
  name,
  className,
  style,
  'data-testid': testId,
  ...rest
}: CheckboxProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div
      className={cn(className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--yes-size-field-gap)', ...style }}
      data-testid={testId}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--yes-space-2)' }}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          style={{
            width: 'var(--yes-size-checkbox)',
            height: 'var(--yes-size-checkbox)',
            flexShrink: 0,
            accentColor: 'var(--yes-color-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
          {...rest}
        />
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--yes-font-sans)',
            fontSize: 'var(--yes-text-sm)',
            fontWeight: 'var(--yes-weight-medium)' as React.CSSProperties['fontWeight'],
            color: disabled ? 'var(--yes-color-text-disabled)' : 'var(--yes-color-field-label)',
            lineHeight: 1.4,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </label>
      </div>
      {error && (
        <span id={errorId} style={errorStyle} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} style={hintStyle}>
          {hint}
        </span>
      )}
    </div>
  )
}
