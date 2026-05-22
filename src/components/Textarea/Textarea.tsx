import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps } from '../../types/shared'

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

interface TextareaProps extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof FieldProps> {
  placeholder?: string
}

export function Textarea({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  className,
  style,
  'data-testid': testId,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const textareaStyle: React.CSSProperties = {
    fontFamily: 'var(--yes-font-sans)',
    fontSize: 'var(--yes-text-sm)',
    color: 'var(--yes-color-text)',
    background: 'var(--yes-color-surface)',
    border: '1px solid var(--yes-color-border-strong)',
    borderRadius: 'var(--yes-radius-field)',
    padding: 'var(--yes-size-textarea-py) var(--yes-space-3)',
    height: 'var(--yes-size-textarea-h)',
    width: '100%',
    outline: 'none',
    resize: 'vertical' as React.CSSProperties['resize'],
    lineHeight: 1.5,
    boxSizing: 'border-box',
    ...(error ? {
      borderColor: 'var(--yes-color-border-error)',
      boxShadow: '0 0 0 3px var(--yes-color-focus-ring-error)',
    } : {}),
    ...(disabled ? {
      background: 'var(--yes-color-surface-disabled)',
      color: 'var(--yes-color-text-disabled)',
      borderColor: 'var(--yes-color-border-disabled)',
      cursor: 'not-allowed',
      resize: 'none',
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
        style={hideLabel ? { ...labelStyle, ...srOnlyStyle } : labelStyle}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        style={textareaStyle}
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
