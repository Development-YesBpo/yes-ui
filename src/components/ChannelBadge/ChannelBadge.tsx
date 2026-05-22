import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'

type Channel = 'whatsapp' | 'sms' | 'email' | 'voice'

const CHANNEL: Record<Channel, { label: string; bg: string; color: string; border: string }> = {
  whatsapp: { label: 'WhatsApp', bg: 'var(--yes-channel-wa-bg)',    color: 'var(--yes-channel-wa-fg)',    border: 'var(--yes-channel-wa-border)'    },
  sms:      { label: 'SMS',      bg: 'var(--yes-channel-sms-bg)',   color: 'var(--yes-channel-sms-fg)',   border: 'var(--yes-channel-sms-border)'   },
  email:    { label: 'Correo',   bg: 'var(--yes-channel-email-bg)', color: 'var(--yes-channel-email-fg)', border: 'var(--yes-channel-email-border)' },
  voice:    { label: 'Voz',      bg: 'var(--yes-channel-voice-bg)', color: 'var(--yes-channel-voice-fg)', border: 'var(--yes-channel-voice-border)' },
}

interface ChannelBadgeProps extends BaseProps {
  channel: Channel
}

export function ChannelBadge({ channel, className, style, 'data-testid': testId }: ChannelBadgeProps) {
  const c = CHANNEL[channel]
  return (
    <span
      className={cn(className)}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--yes-font-sans)',
        fontSize: 'var(--yes-size-channel-badge-text)',
        fontWeight: 700,
        padding: 'var(--yes-size-channel-badge-py) var(--yes-space-2)',
        borderRadius: 'var(--yes-radius-sm)',
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        ...style,
      }}
      data-testid={testId}
    >
      {c.label}
    </span>
  )
}
