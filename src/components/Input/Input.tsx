import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-field-label-text)',
  fontWeight: 'var(--yes-weight-semibold)' as React.CSSProperties['fontWeight'],
  color: 'var(--yes-color-field-label)',
  lineHeight: 1.4,
  display: 'block',
}

const sizeHeight: Record<Size, string> = {
  sm: 'var(--yes-size-height-sm)',
  md: 'var(--yes-size-height-md)',
  lg: 'var(--yes-size-height-lg)',
}

const baseInputStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border-strong)',
  borderRadius: 'var(--yes-radius-field)',
  padding: '0 var(--yes-space-3)',
  width: '100%',
  outline: 'none',
  lineHeight: 1,
  boxSizing: 'border-box',
}

const hintStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-field-hint-text)',
  color: 'var(--yes-color-field-hint)',
  lineHeight: 1.4,
  display: 'block',
}

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-field-hint-text)',
  color: 'var(--yes-color-field-error)',
  lineHeight: 1.4,
  display: 'block',
}

interface InputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof FieldProps | 'size'> {
  size?: Size
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
}

export function Input({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  size = 'md',
  className,
  style,
  'data-testid': testId,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const inputStyle: React.CSSProperties = {
    ...baseInputStyle,
    height: sizeHeight[size],
    ...(error ? {
      borderColor: 'var(--yes-color-border-error)',
      boxShadow: '0 0 0 3px var(--yes-color-focus-ring-error)',
    } : {}),
    ...(disabled ? {
      background: 'var(--yes-color-surface-disabled)',
      color: 'var(--yes-color-text-disabled)',
      borderColor: 'var(--yes-color-border-disabled)',
      cursor: 'not-allowed',
    } : {}),
  }

  return (
    <div
      className={cn(className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--yes-size-field-gap)', width: '100%', ...style }}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={hideLabel ? 'srOnly' : undefined}
        style={hideLabel ? { ...srOnlyStyle, ...labelStyle, position: 'absolute' } : labelStyle}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        style={inputStyle}
        {...rest}
      />
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
