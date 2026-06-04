import type React from 'react'

/**
 * Type helper for polymorphic components.
 *
 * A polymorphic component accepts an `as` prop to change its rendered element.
 * Example: <Button as="a" href="/path"> renders an <a> with button styling.
 *
 * Usage:
 *   type ButtonProps = PolymorphicComponentProps<'button', { tone?: Tone }>
 *
 * The `as` prop overrides the default element. All HTML attributes of the
 * chosen element are available and type-checked.
 */

export type AsProp<TElement extends React.ElementType> = {
  as?: TElement
}

export type PropsToOmit<
  TElement extends React.ElementType,
  P,
> = keyof (AsProp<TElement> & P)

export type PolymorphicComponentProps<
  TElement extends React.ElementType,
  TProps = Record<string, never>,
> = TProps &
  AsProp<TElement> &
  Omit<React.ComponentPropsWithoutRef<TElement>, PropsToOmit<TElement, TProps>>

export type PolymorphicRef<TElement extends React.ElementType> =
  React.ComponentPropsWithRef<TElement>['ref']

export type PolymorphicComponentPropsWithRef<
  TElement extends React.ElementType,
  TProps = Record<string, never>,
> = PolymorphicComponentProps<TElement, TProps> & {
  ref?: PolymorphicRef<TElement>
}
