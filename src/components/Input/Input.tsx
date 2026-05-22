import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'
import styles from './Input.module.css'

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

  const describedBy =
    error ? errorId : hint ? hintId : undefined

  return (
    <div
      className={cn(styles.field, className)}
      style={style}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={cn(styles.label, hideLabel && styles.srOnly)}
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
        className={cn(styles.input, styles[size], error && styles.inputError)}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
