import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { ConversationItem } from './ConversationItem'

const meta: Meta<typeof ConversationItem> = {
  title: 'Wave 8 — Communication/ConversationItem',
  component: ConversationItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Fila de conversación en la lista de contactos. Reference: `ui_kits/appcenter/App.jsx` → ConversationList.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConversationItem>

export const Default: Story = {
  args: {
    name: 'Carlos Rodríguez',
    lastMessage: '¡Claro! Envíame el detalle por favor',
    channel: 'whatsapp',
    timestamp: '2 min',
    unreadCount: 2,
  },
}

export const ConversationList: Story = {
  render: () => {
    const [activeId, setActiveId] = useState(1)
    const conversations = [
      { id: 1, name: 'Carlos Rodríguez',     channel: 'whatsapp' as const, lastMessage: '¡Claro! Envíame el detalle por favor',              timestamp: '2 min',  unreadCount: 2 },
      { id: 2, name: 'María Fernanda Gómez', channel: 'sms' as const,      lastMessage: 'Pendiente de revisión del saldo',                   timestamp: '15 min', unreadCount: 0 },
      { id: 3, name: 'Empresa ABC Ltda',     channel: 'email' as const,    lastMessage: 'Cotización aprobada, necesitamos acceso al portal', timestamp: '1 h',    unreadCount: 0 },
      { id: 4, name: 'Andrés Martínez',      channel: 'whatsapp' as const, lastMessage: 'Ok perfecto, muchas gracias',                       timestamp: '2 h',    unreadCount: 0 },
      { id: 5, name: 'Logística Norte SAS',  channel: 'voice' as const,    lastMessage: 'Llamada registrada · 3:42 min',                     timestamp: '3 h',    unreadCount: 0 },
    ]
    return (
      <div style={{ width: 280, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            lastMessage={conv.lastMessage}
            channel={conv.channel}
            timestamp={conv.timestamp}
            unreadCount={conv.unreadCount}
            isActive={activeId === conv.id}
            onClick={() => setActiveId(conv.id)}
          />
        ))}
      </div>
    )
  },
}

export const WithUnread: Story = {
  args: {
    name: 'María Gómez',
    lastMessage: 'Hola, necesito ayuda con mi pedido',
    channel: 'sms',
    timestamp: '5 min',
    unreadCount: 5,
  },
}

export const Active: Story = {
  args: {
    name: 'Empresa ABC Ltda',
    lastMessage: 'Cotización aprobada',
    channel: 'email',
    timestamp: '1 h',
    isActive: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(false)
    return (
      <div style={{ width: 280 }}>
        <ConversationItem
          name="Carlos Rodríguez"
          lastMessage="¡Claro! Envíame el detalle"
          channel="whatsapp"
          timestamp="2 min"
          unreadCount={2}
          isActive={active}
          onClick={() => setActive(true)}
          data-testid="conv-item"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = canvas.getByTestId('conv-item')
    await userEvent.click(item)
    await expect(item.className).toMatch(/active/)
  },
}
