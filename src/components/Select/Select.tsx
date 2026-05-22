import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'

export interface SelectOption {
  value: string
  label: string
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

const baseSelectStyle: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
  background: 'var(--yes-color-surface)',
  border: '1px solid var(--yes-color-border-strong)',
  borderRadius: 'var(--yes-radius-field)',
  padding: '0 var(--yes-size-select-pr) 0 var(--yes-space-3)',
  width: '100%',
  outline: 'none',
  appearance: 'none' as React.CSSProperties['appearance'],
  cursor: 'pointer',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right var(--yes-space-3) center',
  backgroundSize: '16px',
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

interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof FieldProps | 'size'> {
  options: SelectOption[]
  placeholder?: string
  size?: Size
}

export function Select({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  options,
  placeholder,
  size = 'md',
  className,
  style,
  'data-testid': testId,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const selectStyle: React.CSSProperties = {
    ...baseSelectStyle,
    height: sizeHeight[size],
    ...(error ? {
      borderColor: 'var(--yes-color-border-error)',
      boxShadow: '0 0 0 3px var(--yes-color-focus-ring-error)',
    } : {}),
    ...(disabled ? {
      backgroundColor: 'var(--yes-color-surface-disabled)',
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
        style={labelStyle}
      >
        {label}
      </label>
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          style={selectStyle}
          defaultValue={placeholder ? '' : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
