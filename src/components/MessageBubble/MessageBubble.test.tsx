import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MessageBubble } from './MessageBubble'

describe('MessageBubble', () => {
  it('renders message content', () => {
    render(<MessageBubble content="Hola, ¿cómo estás?" sender="own" timestamp="09:41" />)
    expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" />)
    expect(screen.getByText('09:41')).toBeInTheDocument()
  })

  it('applies own class for sender="own"', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="mb" />)
    expect(screen.getByTestId('mb').className).toMatch(/own/)
  })

  it('applies other class for sender="other"', () => {
    render(<MessageBubble content="Hola" sender="other" timestamp="09:41" data-testid="mb" />)
    expect(screen.getByTestId('mb').className).toMatch(/other/)
  })

  it('aligns own bubble to the right', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="mb" />)
    const el = screen.getByTestId('mb')
    expect(el.className).toMatch(/own/)
  })

  it('aligns other bubble to the left', () => {
    render(<MessageBubble content="Hola" sender="other" timestamp="09:41" data-testid="mb" />)
    const el = screen.getByTestId('mb')
    expect(el.className).toMatch(/other/)
  })

  it('shows avatar for sender="other" when senderName is provided', () => {
    render(
      <MessageBubble
        content="Hola"
        sender="other"
        timestamp="09:41"
        senderName="Carlos"
        senderAvatar="https://example.com/img.jpg"
      />
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('does not show avatar for sender="own"', () => {
    render(
      <MessageBubble content="Hola" sender="own" timestamp="09:41" senderName="Agente" />
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows sender name above bubble for sender="other"', () => {
    render(
      <MessageBubble content="Hola" sender="other" timestamp="09:41" senderName="Carlos Rodríguez" />
    )
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('does not show sender name for sender="own"', () => {
    render(
      <MessageBubble content="Hola" sender="own" timestamp="09:41" senderName="Agente" />
    )
    // senderName is only shown for 'other' sender
    expect(screen.queryByText('Agente')).not.toBeInTheDocument()
  })

  it('passes data-testid to root wrapper', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="my-mb" />)
    expect(screen.getByTestId('my-mb')).toBeInTheDocument()
  })

  it('applies custom className to root wrapper', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" className="custom" data-testid="mb" />)
    expect(screen.getByTestId('mb')).toHaveClass('custom')
  })
})
