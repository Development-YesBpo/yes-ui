import type { Meta, StoryObj } from '@storybook/react'
import { MessageBubble } from './MessageBubble'

const meta: Meta<typeof MessageBubble> = {
  title: 'Wave 8 — Communication/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Burbuja de mensaje de chat. Own (agente) a la derecha, Other (cliente) a la izquierda. Reference: `ui_kits/appcenter/App.jsx` → ChatPanel.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MessageBubble>

export const OwnMessage: Story = {
  args: {
    content: 'Buenas tardes, Carlos. Con gusto te ayudo. ¿Me confirmas tu número de documento?',
    sender: 'own',
    timestamp: '09:42',
  },
}

export const OtherMessage: Story = {
  args: {
    content: 'Buenas tardes, quería preguntar por el estado de mi factura del mes pasado.',
    sender: 'other',
    timestamp: '09:41',
    senderName: 'Carlos Rodríguez',
  },
}

export const FullConversation: Story = {
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: '#F9FAFB', borderRadius: 8 }}>
      <MessageBubble
        content="Buenas tardes, quería preguntar por el estado de mi factura del mes pasado."
        sender="other"
        timestamp="09:41"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="Buenas tardes, Carlos. Con gusto te ayudo. ¿Me confirmas tu número de documento?"
        sender="own"
        timestamp="09:42"
      />
      <MessageBubble
        content="Sí, es 1234567890."
        sender="other"
        timestamp="09:43"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="Perfecto, Carlos. Tu factura está procesada. Tiene un saldo pendiente de $125.000 con vencimiento el 30 de mayo."
        sender="own"
        timestamp="09:44"
      />
      <MessageBubble
        content="Entendido. ¿Puedo pagar desde la app?"
        sender="other"
        timestamp="09:45"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="¡Claro! Ingresa a Mi Cuenta > Pagos > Factura pendiente. El botón de pago estará disponible."
        sender="own"
        timestamp="09:46"
      />
      <MessageBubble
        content="¡Claro! Envíame el detalle por favor."
        sender="other"
        timestamp="09:47"
        senderName="Carlos Rodríguez"
      />
    </div>
  ),
}

export const WithAvatar: Story = {
  args: {
    content: 'Necesito hablar con un agente urgente.',
    sender: 'other',
    timestamp: '10:15',
    senderName: 'María Fernanda',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
  },
}

export const LongMessage: Story = {
  args: {
    content: 'Estimado cliente, le informamos que su solicitud de revisión de saldo ha sido procesada satisfactoriamente y el ajuste correspondiente se verá reflejado en su próximo estado de cuenta, aproximadamente en 3 días hábiles.',
    sender: 'own',
    timestamp: '11:00',
  },
}
