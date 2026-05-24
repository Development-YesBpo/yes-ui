import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Toast } from './Toast'
import { ToastContainer } from './ToastContainer'
import { useToast } from './useToast'

const meta: Meta<typeof Toast> = {
  title: 'Wave 3 — Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Notificación flotante transitoria. Se apila en la esquina inferior derecha. Auto-cierre a los 4 segundos. Reference: `preview/components-alerts.html` — sección Toast.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <Toast
        id="demo"
        variant="success"
        title="Registro guardado correctamente"
        onDismiss={() => {}}
        duration={99999}
      />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
      <Toast id="s" variant="success" title="Registro guardado" onDismiss={() => {}} duration={99999} />
      <Toast id="e" variant="error" title="Error al eliminar el contacto" onDismiss={() => {}} duration={99999} />
      <Toast id="w" variant="warning" title="Cuota casi agotada" onDismiss={() => {}} duration={99999} />
      <Toast id="i" variant="info" title="Sincronización en progreso" onDismiss={() => {}} duration={99999} />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
      <Toast
        id="s"
        variant="success"
        title="Campaña enviada"
        description="3.400 contactos recibirán el mensaje en los próximos minutos."
        onDismiss={() => {}}
        duration={99999}
      />
    </div>
  ),
}

function ToastDemo() {
  const { toasts, toast, dismiss } = useToast()
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" onClick={() => toast({ variant: 'success', title: 'Éxito', description: 'Operación completada.' })}>
          Éxito
        </button>
        <button type="button" onClick={() => toast({ variant: 'error', title: 'Error', description: 'Algo salió mal.' })}>
          Error
        </button>
        <button type="button" onClick={() => toast({ variant: 'warning', title: 'Advertencia' })}>
          Advertencia
        </button>
        <button type="button" onClick={() => toast({ variant: 'info', title: 'Información' })}>
          Info
        </button>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export const LiveDemo: Story = {
  render: () => <ToastDemo />,
  parameters: { layout: 'fullscreen' },
}

export const Interactive: Story = {
  args: {
    id: 'test-toast',
    variant: 'success',
    title: 'Registro guardado',
    onDismiss: () => {},
    duration: 99999,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toast = canvas.getByRole('status')
    await expect(toast).toBeVisible()
    const btn = canvas.getByRole('button', { name: /cerrar/i })
    await userEvent.click(btn)
  },
}
