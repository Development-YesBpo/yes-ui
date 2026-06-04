import type React from 'react'

/** Semantic color tone — maps to --yes-color-{tone} token family. */
export type Tone =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'

/** Component size — maps to --yes-size-{size} token family. */
export type Size = 'sm' | 'md' | 'lg'

/** Badge/status semantic variant. */
export type StatusVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral'

/**
 * Base props shared by every interactive component.
 * All components extend this — never invent new prop names for these concepts.
 */
export interface BaseProps {
  /** Additional class name appended to the root element. Never overrides internal structure. */
  className?: string
  /** Inline style — only for dynamic token overrides, not structural styling. */
  style?: React.CSSProperties
  /** Test identifier passed to data-testid on the root element. */
  'data-testid'?: string
}

/**
 * Props shared by all form field components (Input, Select, Textarea, etc.).
 * Enforces accessible labeling — label is required; use hideLabel to visually hide it.
 */
export interface FieldProps extends BaseProps {
  /** Visible (or screen-reader-only) label. Required for accessibility. */
  label: string
  /** Visually hides the label while keeping it in the DOM for screen readers. */
  hideLabel?: boolean
  /** HTML name attribute — used for form submission. */
  name?: string
  /** Disables the field. Sets aria-disabled and prevents interaction. */
  disabled?: boolean
  /** Marks the field as required. */
  required?: boolean
  /** Error message. When set, field renders in error state and message appears below. */
  error?: string
  /** Hint text rendered below the field for additional guidance. */
  hint?: string
  /** Associates the field with a form element. */
  form?: string
  /** Stable ID — generated via useId if not provided. */
  id?: string
}

/**
 * Helper type for polymorphic components that support the `as` prop.
 * Use PolymorphicProps<'button', MyOwnProps> to get the full prop set.
 */
export type PolymorphicProps<
  TElement extends React.ElementType,
  TProps = Record<string, never>,
> = TProps &
  Omit<React.ComponentPropsWithRef<TElement>, keyof TProps> & {
    as?: TElement
  }
