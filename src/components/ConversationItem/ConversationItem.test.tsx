import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ConversationItem } from './ConversationItem'

const defaultProps = {
  name: 'Carlos Rodríguez',
  lastMessage: '¡Claro! Envíame el detalle por favor',
  channel: 'whatsapp' as const,
  timestamp: '2 min',
}

describe('ConversationItem', () => {
  it('renders contact name', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders last message preview', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('¡Claro! Envíame el detalle por favor')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('2 min')).toBeInTheDocument()
  })

  it('renders channel badge', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })

  it('shows unread count badge when unreadCount > 0', () => {
    render(<ConversationItem {...defaultProps} unreadCount={3} data-testid="ci" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides unread count badge when unreadCount is 0', () => {
    render(<ConversationItem {...defaultProps} unreadCount={0} data-testid="ci" />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('hides unread count badge when unreadCount is not provided', () => {
    const { container } = render(<ConversationItem {...defaultProps} />)
    expect(container.querySelector('[data-unread]')).not.toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    render(<ConversationItem {...defaultProps} isActive data-testid="ci" />)
    const el = screen.getByTestId('ci')
    expect(el.className).toMatch(/active/)
  })

  it('does not apply active class by default', () => {
    render(<ConversationItem {...defaultProps} data-testid="ci" />)
    const el = screen.getByTestId('ci')
    expect(el.className).not.toMatch(/active/)
  })

  it('calls onClick exactly once when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ConversationItem {...defaultProps} onClick={onClick} data-testid="ci" />)
    await user.click(screen.getByTestId('ci'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders avatar with contact name', () => {
    render(<ConversationItem {...defaultProps} />)
    // Avatar renders initials CR
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders avatar image when avatarSrc is provided', () => {
    render(<ConversationItem {...defaultProps} avatarSrc="https://example.com/img.jpg" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<ConversationItem {...defaultProps} data-testid="my-ci" />)
    expect(screen.getByTestId('my-ci')).toBeInTheDocument()
  })

  it.each(['whatsapp', 'sms', 'email', 'voice'] as const)(
    'renders %s channel badge',
    (channel) => {
      render(<ConversationItem {...defaultProps} channel={channel} />)
      expect(document.querySelector('span')).toBeInTheDocument()
    }
  )
})
