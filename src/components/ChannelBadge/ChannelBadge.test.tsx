import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChannelBadge } from './ChannelBadge'

describe('ChannelBadge', () => {
  it('renders WhatsApp label', () => {
    render(<ChannelBadge channel="whatsapp" />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })
  it('renders SMS label', () => {
    render(<ChannelBadge channel="sms" />)
    expect(screen.getByText('SMS')).toBeInTheDocument()
  })
  it('renders email label as "Correo"', () => {
    render(<ChannelBadge channel="email" />)
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })
  it('renders voice label as "Voz"', () => {
    render(<ChannelBadge channel="voice" />)
    expect(screen.getByText('Voz')).toBeInTheDocument()
  })
  it('passes data-testid to root', () => {
    render(<ChannelBadge channel="sms" data-testid="ch" />)
    expect(screen.getByTestId('ch')).toBeInTheDocument()
  })
  it('applies custom className', () => {
    render(<ChannelBadge channel="whatsapp" className="custom" />)
    expect(screen.getByText('WhatsApp')).toHaveClass('custom')
  })
  it.each(['whatsapp', 'sms', 'email', 'voice'] as const)(
    'renders %s without crashing',
    (channel) => {
      render(<ChannelBadge channel={channel} />)
      expect(document.querySelector('span')).toBeInTheDocument()
    }
  )
})
