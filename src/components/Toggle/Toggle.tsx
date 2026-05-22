import { useState } from 'react'
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

interface ToggleProps extends BaseProps {
  label: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string
  id?: string
  onChange?: (checked: boolean) => void
}

export function Toggle({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  name,
  onChange,
  id: idProp,
  className,
  style,
  'data-testid': testId,
}: ToggleProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isOn = isControlled ? controlledChecked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    const next = !isOn
    if (!isControlled) setInternalChecked(next)
    onChange?.(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
  }

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

  return (
    <div
      className={cn(className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--yes-space-2)', ...style }}
      data-testid={testId}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={isOn ? '1' : '0'}
          style={srOnlyStyle}
        />
      )}
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={isOn}
        aria-disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: 'var(--yes-size-toggle-w)',
          height: 'var(--yes-size-toggle-h)',
          borderRadius: 'var(--yes-radius-toggle)',
          background: isOn ? 'var(--yes-color-toggle-on)' : 'var(--yes-color-toggle-off)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          transition: 'background var(--yes-duration-base) var(--yes-ease)',
          outline: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 'var(--yes-size-toggle-knob-offset)',
            left: 'var(--yes-size-toggle-knob-offset)',
            width: 'var(--yes-size-toggle-knob)',
            height: 'var(--yes-size-toggle-knob)',
            background: 'var(--yes-color-surface)',
            borderRadius: '50%',
            boxShadow: 'var(--yes-shadow-toggle-knob)',
            transition: 'transform var(--yes-duration-base) var(--yes-ease)',
            transform: isOn
              ? 'translateX(calc(var(--yes-size-toggle-w) - var(--yes-size-toggle-knob) - 2 * var(--yes-size-toggle-knob-offset)))'
              : 'translateX(0)',
          }}
        />
      </button>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--yes-font-sans)',
          fontSize: 'var(--yes-text-sm)',
          fontWeight: 'var(--yes-weight-medium)' as React.CSSProperties['fontWeight'],
          color: disabled ? 'var(--yes-color-text-disabled)' : 'var(--yes-color-field-label)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          lineHeight: 1.4,
        }}
        onClick={handleToggle}
      >
        {label}
      </label>
    </div>
  )
}
