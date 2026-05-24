import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import { Badge } from '../Badge/Badge'
import type { BaseProps } from '../../types/shared'

export type PanelStatusVariant =
  | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'blue'
export type PanelTab = 'info' | 'historial' | 'notas'

export interface PanelContactField {
  label: string
  value: string
}

export interface PanelHistoryItem {
  date: string
  action: string
}

export interface PanelContact {
  name: string
  role?: string
  status: PanelStatusVariant
  avatarSrc?: string
  fields: PanelContactField[]
}

export interface PanelRichProps extends BaseProps {
  contact: PanelContact
  history?: PanelHistoryItem[]
  onSaveNote?: (note: string) => void
}

const TAB_LABELS: Record<PanelTab, string> = {
  info:      'Info',
  historial: 'Historial',
  notas:     'Notas',
}

const STATUS_LABELS: Record<PanelStatusVariant, string> = {
  success: 'Activo',
  error:   'Fallido',
  warning: 'Pendiente',
  info:    'En proceso',
  neutral: 'Pausado',
  blue:    'Completado',
}

// ── Style injection ────────────────────────────────────────────
// Tab / save-button hover and textarea :focus require selectors
// that React's inline `style` prop cannot express. One guarded
// <style> block per document keeps the dist build free of a
// CSS-modules loader.
let panelRichStylesInjected = false
function injectPanelRichStyles() {
  if (panelRichStylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-yes-panel-rich', '')
  el.textContent = `
    [data-yes-pr-tab]:hover {
      color: var(--yes-color-text);
    }
    [data-yes-pr-savebtn]:hover {
      background: var(--yes-color-primary-hover);
    }
    [data-yes-pr-textarea]:focus {
      border-color: var(--yes-color-primary);
    }
  `
  document.head.appendChild(el)
  panelRichStylesInjected = true
}

// ── Static style maps ──────────────────────────────────────────
const PANEL_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-panel-rich)',
  flexShrink: 0,
  borderLeft: '1px solid var(--yes-color-border)',
  background: 'var(--yes-color-surface)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const HEADER_STYLE: React.CSSProperties = {
  padding: '14px var(--yes-space-4)',
  borderBottom: '1px solid var(--yes-color-bg)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  flexShrink: 0,
}

const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-42)',
  height: 'var(--yes-size-avatar-42)',
  fontSize: 'calc(var(--yes-size-avatar-42) * 0.36)',
  flexShrink: 0,
}

const HEADER_INFO_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const CONTACT_NAME_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-heading)',
  fontSize: 'var(--yes-text-panel-name)',
  fontWeight: 700,
  color: 'var(--yes-color-text)',
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const CONTACT_ROLE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  color: 'var(--yes-color-text-muted)',
  marginTop: 2,
}

const BADGES_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 5,
  flexWrap: 'wrap',
  marginTop: 4,
}

const TABS_BAR_STYLE: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid var(--yes-color-border)',
  flexShrink: 0,
}

const TAB_BASE_STYLE: React.CSSProperties = {
  flex: 1,
  padding: '9px 4px',
  textAlign: 'center',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-xs)',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--yes-color-text-muted)',
  borderTopStyle: 'none',
  borderLeftStyle: 'none',
  borderRightStyle: 'none',
  borderBottomStyle: 'solid',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  background: 'none',
  transition: 'color var(--yes-duration-base) var(--yes-ease), border-color var(--yes-duration-base) var(--yes-ease)',
}

const TAB_ACTIVE_STYLE: React.CSSProperties = {
  color: 'var(--yes-color-primary)',
  borderBottomColor: 'var(--yes-color-primary)',
}

const CONTENT_STYLE: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: 'var(--yes-space-4)',
}

const FIELD_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 0',
  borderBottom: '1px solid var(--yes-color-bg)',
}

const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-2xs)',
  fontWeight: 600,
  color: 'var(--yes-color-text-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 2,
}

const FIELD_VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
}

const TIMELINE_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
}

const TIMELINE_ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid var(--yes-color-bg)',
}

const TIMELINE_DOT_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  border: '2px solid var(--yes-color-primary)',
  background: 'var(--yes-color-surface)',
  flexShrink: 0,
  marginTop: 3,
  display: 'inline-block',
}

const TIMELINE_BODY_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const TIMELINE_DATE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-2xs)',
  color: 'var(--yes-color-text-subtle)',
  marginBottom: 2,
}

const TIMELINE_ACTION_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
}

const EMPTY_STATE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text-muted)',
  textAlign: 'center',
  padding: 'var(--yes-space-6) 0',
}

const NOTES_AREA_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--yes-space-2)',
}

const TEXTAREA_STYLE: React.CSSProperties = {
  width: '100%',
  minHeight: 100,
  padding: '8px 10px',
  border: '1px solid var(--yes-color-border)',
  borderRadius: 'var(--yes-radius-btn)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-text-sm)',
  color: 'var(--yes-color-text)',
  resize: 'vertical',
  outline: 'none',
  boxSizing: 'border-box',
}

const SAVE_BTN_STYLE: React.CSSProperties = {
  width: '100%',
  height: 'var(--yes-size-height-sm)',
  borderRadius: 'var(--yes-radius-btn)',
  border: 'none',
  background: 'var(--yes-color-primary)',
  color: 'var(--yes-color-primary-fg)',
  fontFamily: 'var(--yes-font-sans)',
  fontSize: 'var(--yes-size-btn-text-sm)',
  fontWeight: 600,
  cursor: 'pointer',
}

export function PanelRich({
  contact,
  history = [],
  onSaveNote,
  className,
  style,
  'data-testid': testId,
}: PanelRichProps) {
  injectPanelRichStyles()
  const [activeTab, setActiveTab] = useState<PanelTab>('info')
  const [note, setNote] = useState('')

  function handleSave() {
    if (onSaveNote) onSaveNote(note)
  }

  const rootStyle: React.CSSProperties = { ...PANEL_STYLE, ...style }

  return (
    <div
      className={cn('yes-panel-rich', className)}
      style={rootStyle}
      data-testid={testId}
    >
      {/* Header */}
      <div style={HEADER_STYLE}>
        <Avatar
          name={contact.name}
          {...(contact.avatarSrc ? { src: contact.avatarSrc } : {})}
          style={AVATAR_STYLE}
        />
        <div style={HEADER_INFO_STYLE}>
          <div style={CONTACT_NAME_STYLE}>{contact.name}</div>
          {contact.role && <div style={CONTACT_ROLE_STYLE}>{contact.role}</div>}
          <div style={BADGES_STYLE}>
            <Badge variant={contact.status} showDot={false}>
              {STATUS_LABELS[contact.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={TABS_BAR_STYLE} role="tablist">
        {(['info', 'historial', 'notas'] as PanelTab[]).map((tab) => {
          const isActive = activeTab === tab
          const tabStyle: React.CSSProperties = {
            ...TAB_BASE_STYLE,
            ...(isActive ? TAB_ACTIVE_STYLE : null),
          }
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              data-yes-pr-tab=""
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              style={tabStyle}
            >
              {TAB_LABELS[tab]}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div style={CONTENT_STYLE}>
        {activeTab === 'info' && (
          <div>
            {contact.fields.map((field, idx) => {
              const isLast = idx === contact.fields.length - 1
              const rowStyle: React.CSSProperties = {
                ...FIELD_ROW_STYLE,
                ...(isLast ? { borderBottom: 'none' } : null),
              }
              return (
                <div key={field.label} style={rowStyle}>
                  <span style={FIELD_LABEL_STYLE}>{field.label}</span>
                  <span style={FIELD_VALUE_STYLE}>{field.value}</span>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'historial' && (
          <div style={TIMELINE_STYLE}>
            {history.length === 0 ? (
              <p style={EMPTY_STATE_STYLE}>Sin historial de gestiones</p>
            ) : (
              history.map((item, i) => {
                const isLast = i === history.length - 1
                const itemStyle: React.CSSProperties = {
                  ...TIMELINE_ITEM_STYLE,
                  ...(isLast ? { borderBottom: 'none' } : null),
                }
                return (
                  <div key={i} style={itemStyle}>
                    <span style={TIMELINE_DOT_STYLE} aria-hidden="true" />
                    <div style={TIMELINE_BODY_STYLE}>
                      <div style={TIMELINE_DATE_STYLE}>{item.date}</div>
                      <div style={TIMELINE_ACTION_STYLE}>{item.action}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'notas' && (
          <div style={NOTES_AREA_STYLE}>
            <textarea
              data-yes-pr-textarea=""
              style={TEXTAREA_STYLE}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Escribe una nota sobre este contacto..."
              rows={5}
            />
            {onSaveNote && (
              <button
                type="button"
                data-yes-pr-savebtn=""
                style={SAVE_BTN_STYLE}
                onClick={handleSave}
                aria-label="Guardar nota"
              >
                Guardar nota
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
