import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Wave 3 — Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bloque de alerta semántica en línea. Reference: `preview/components-alerts.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    variant: 'success',
    title: 'Campaña enviada correctamente',
    description: 'Tu campaña fue programada para envío inmediato.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert
        variant="success"
        title="Campaña enviada correctamente"
        description="Tu campaña fue programada para envío inmediato."
      />
      <Alert
        variant="error"
        title="Error al procesar el pago"
        description="Verifica los datos de tu método de pago e intenta de nuevo."
      />
      <Alert
        variant="warning"
        title="Límite de contactos próximo"
        description="Has usado el 90 % de tu cuota mensual de contactos."
      />
      <Alert
        variant="info"
        title="Procesamiento en curso"
        description="El archivo se está cargando. Esto puede tomar unos minutos."
      />
    </div>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert variant="success" title="Registro guardado" />
      <Alert variant="error" title="No se pudo eliminar el contacto" />
    </div>
  ),
}

export const Dismissible: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert
        variant="warning"
        title="Límite de contactos próximo"
        description="Has usado el 90 % de tu cuota."
        onDismiss={() => {}}
      />
      <Alert
        variant="info"
        title="Procesamiento en curso"
        onDismiss={() => {}}
      />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    variant: 'success',
    title: 'Haz clic en × para cerrar',
    onDismiss: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dismissBtn = canvas.getByRole('button', { name: /cerrar/i })
    await expect(dismissBtn).toBeVisible()
    await userEvent.click(dismissBtn)
  },
}
