import React from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import { ChannelBadge } from '../ChannelBadge/ChannelBadge'
import type { BaseProps } from '../../types/shared'

export type ConversationChannel = 'whatsapp' | 'sms' | 'email' | 'voice'

export interface ConversationItemProps extends BaseProps {
  name: string
  lastMessage: string
  channel: ConversationChannel
  timestamp: string
  unreadCount?: number
  isActive?: boolean
  avatarSrc?: string
  onClick?: () => void
}

// ── Style injection ────────────────────────────────────────────
// :hover requires a selector that React's inline `style` prop
// cannot express. One guarded <style> block per document keeps
// the dist build free of a CSS-modules loader.
let conversationItemStylesInjected = false
function injectConversationItemStyles() {
  if (conversationItemStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-conversation-item', '')
  el.textContent = `
    [data-yes-ci]:hover {
      background: var(--yes-color-conv-active);
    }
  `
  document.head.appendChild(el)
  conversationItemStylesInjected = true
}

// ── Static style maps ──────────────────────────────────────────
const ROOT_STYLE_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--yes-space-2)',
  padding: 'var(--yes-size-conv-py) var(--yes-size-conv-px)',
  cursor: 'pointer',
  borderBottom: '1px solid var(--yes-color-conv-border)',
  borderLeft: '3px solid transparent',
  transition: 'background var(--yes-duration-base) var(--yes-ease), border-left-color var(--yes-duration-base) var(--yes-ease)',
  minWidth: 0,
  background: 'transparent',
}

const ACTIVE_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-conv-active)',
  borderLeftColor: 'var(--yes-color-primary)',
}

const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,
}

const CONTENT_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const TOP_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 2,
}

const NAME_STYLE_BASE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 140,
}

const TIMESTAMP_STYLE: React.CSSProperties = {
  fontSize: 'var(--yes-text-2xs)',
  color: 'var(--yes-color-text-subtle)',
  flexShrink: 0,
  marginLeft: 4,
  fontFamily: 'var(--yes-font-sans)',
}

const LAST_MESSAGE_STYLE: React.CSSProperties = {
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: 5,
  fontFamily: 'var(--yes-font-sans)',
}

const BOTTOM_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}

const UNREAD_BADGE_STYLE: React.CSSProperties = {
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-color-primary-fg)',
  fontSize: 10,
  fontWeight: 700,
  width: 'var(--yes-size-unread-badge)',
  height: 'var(--yes-size-unread-badge)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  flexShrink: 0,
  fontFamily: 'var(--yes-font-sans)',
}

export function ConversationItem({
  name,
  lastMessage,
  channel,
  timestamp,
  unreadCount,
  isActive = false,
  avatarSrc,
  onClick,
  className,
  style,
  'data-testid': testId,
}: ConversationItemProps) {
  injectConversationItemStyles()
  const hasUnread = typeof unreadCount === 'number' && unreadCount > 0

  const rootStyle: React.CSSProperties = {
    ...ROOT_STYLE_BASE,
    ...(isActive ? ACTIVE_STYLE : null),
    ...style,
  }
  const nameStyle: React.CSSProperties = {
    ...NAME_STYLE_BASE,
    fontWeight: hasUnread ? 700 : 600,
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      data-yes-ci=""
      className={cn('yes-ci', isActive && 'active', className)}
      style={rootStyle}
      data-testid={testId}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      <Avatar
        name={name}
        src={avatarSrc}
        size={36}
        style={AVATAR_STYLE}
      />
      <div style={CONTENT_STYLE}>
        <div style={TOP_ROW_STYLE}>
          <span style={nameStyle}>{name}</span>
          <span style={TIMESTAMP_STYLE}>{timestamp}</span>
        </div>
        <div style={LAST_MESSAGE_STYLE}>{lastMessage}</div>
        <div style={BOTTOM_ROW_STYLE}>
          <ChannelBadge channel={channel} />
          {hasUnread && (
            <span style={UNREAD_BADGE_STYLE} data-unread="">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
