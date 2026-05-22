import { Search, X } from 'lucide-react'
import { Icon } from '../Icon/Icon'
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

interface SearchInputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof FieldProps | 'size' | 'type'> {
  size?: Size
  placeholder?: string
  onClear?: () => void
}

export function SearchInput({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  size = 'md',
  value,
  onClear,
  className,
  style,
  'data-testid': testId,
  ...rest
}: SearchInputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const hasValue = typeof value === 'string' ? value.length > 0 : false
  const showClear = hasValue && !disabled && !!onClear

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--yes-font-sans)',
    fontSize: 'var(--yes-text-sm)',
    color: 'var(--yes-color-text)',
    background: 'var(--yes-color-surface)',
    border: '1px solid var(--yes-color-border-strong)',
    borderRadius: 'var(--yes-radius-field)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 'var(--yes-size-search-pl)',
    paddingRight: showClear ? 'calc(var(--yes-space-3) + 24px)' : 'var(--yes-space-3)',
    height: sizeHeight[size],
    width: '100%',
    outline: 'none',
    lineHeight: 1,
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
      <div style={{ position: 'relative', width: '100%' }}>
        <span style={{
          position: 'absolute',
          left: 'var(--yes-size-search-icon-left)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--yes-color-text-subtle)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Icon icon={Search} size={14} aria-hidden />
        </span>
        <input
          id={id}
          type="search"
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          style={inputStyle}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={onClear}
            style={{
              position: 'absolute',
              right: 'var(--yes-size-search-icon-left)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--yes-color-text-subtle)',
              lineHeight: 1,
            }}
          >
            <Icon icon={X} size={14} aria-hidden />
          </button>
        )}
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
