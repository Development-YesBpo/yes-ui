import React from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import type { BaseProps } from '../../types/shared'

export type MessageSender = 'own' | 'other'

export interface MessageBubbleProps extends BaseProps {
  content: string
  sender: MessageSender
  timestamp: string
  senderName?: string
  senderAvatar?: string
}

// ── Style maps ─────────────────────────────────────────────────
const WRAPPER_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 6,
  maxWidth: '100%',
}

const WRAPPER_OWN: React.CSSProperties = {
  flexDirection: 'row-reverse',
  marginLeft: 'auto',
}

const WRAPPER_OTHER: React.CSSProperties = {
  flexDirection: 'row',
  marginRight: 'auto',
}

const BUBBLE_GROUP_BASE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '75%',
  minWidth: 0,
}

const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,
}

const SENDER_NAME_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-2xs)',
  color: 'var(--yes-color-text-muted)',
  marginBottom: 3,
  paddingLeft: 2,
}

const BUBBLE_BASE: React.CSSProperties = {
  padding: 'var(--yes-size-bubble-py) var(--yes-size-bubble-px)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  lineHeight: 1.45,
  wordBreak: 'break-word',
}

const BUBBLE_OWN: React.CSSProperties = {
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-color-primary-fg)',
  borderRadius: '12px 4px 12px 12px',
}

const BUBBLE_OTHER: React.CSSProperties = {
  background: 'var(--yes-color-bubble-other-bg)',
  color: 'var(--yes-color-text)',
  borderRadius: '4px 12px 12px 12px',
}

const TIMESTAMP_BASE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-2xs)',
  textAlign: 'right',
  marginTop: 4,
}

const TIMESTAMP_OWN: React.CSSProperties = {
  color: 'var(--yes-color-bubble-own-time)',
}

const TIMESTAMP_OTHER: React.CSSProperties = {
  color: 'var(--yes-color-text-subtle)',
}

export function MessageBubble({
  content,
  sender,
  timestamp,
  senderName,
  senderAvatar,
  className,
  style,
  'data-testid': testId,
}: MessageBubbleProps) {
  const isOwn = sender === 'own'

  const wrapperStyle: React.CSSProperties = {
    ...WRAPPER_BASE,
    ...(isOwn ? WRAPPER_OWN : WRAPPER_OTHER),
    ...style,
  }
  const groupStyle: React.CSSProperties = {
    ...BUBBLE_GROUP_BASE,
    alignItems: isOwn ? 'flex-end' : 'flex-start',
  }
  const bubbleStyle: React.CSSProperties = {
    ...BUBBLE_BASE,
    ...(isOwn ? BUBBLE_OWN : BUBBLE_OTHER),
  }
  const timestampStyle: React.CSSProperties = {
    ...TIMESTAMP_BASE,
    ...(isOwn ? TIMESTAMP_OWN : TIMESTAMP_OTHER),
  }

  return (
    <div
      className={cn('yes-mb', isOwn ? 'own' : 'other', className)}
      style={wrapperStyle}
      data-testid={testId}
    >
      {!isOwn && senderName && (
        <Avatar
          name={senderName}
          src={senderAvatar}
          size={20}
          style={AVATAR_STYLE}
        />
      )}
      <div style={groupStyle}>
        {!isOwn && senderName && (
          <span style={SENDER_NAME_STYLE}>{senderName}</span>
        )}
        <div style={bubbleStyle}>{content}</div>
        <span style={timestampStyle}>{timestamp}</span>
      </div>
    </div>
  )
}
