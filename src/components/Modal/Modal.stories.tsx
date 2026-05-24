import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta: Meta<typeof Modal> = {
  title: 'Wave 5 — Overlay/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Diálogo modal centrado con overlay. Cierra con Escape, clic en overlay o botón ×. Reference: `design-system-reference/preview/components-modals.html`',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button tone="primary" onClick={() => setOpen(true)}>Abrir modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Eliminar registro"
          footer={
            <>
              <Button tone="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button tone="danger" onClick={() => setOpen(false)}>Eliminar</Button>
            </>
          }
        >
          <p>
            Vas a eliminar el contacto <strong>Carlos Rodríguez</strong>. Esta acción no se
            puede deshacer y borrará todas las gestiones asociadas.
          </p>
        </Modal>
      </>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} tone="secondary" onClick={() => setSize(s)}>
            Abrir {s.toUpperCase()} ({s === 'sm' ? '400px' : s === 'md' ? '600px' : '800px'})
          </Button>
        ))}
        <Modal
          open={size !== null}
          onClose={() => setSize(null)}
          title={`Modal tamaño ${size?.toUpperCase() ?? ''}`}
          size={size ?? 'md'}
          footer={
            <Button tone="secondary" onClick={() => setSize(null)}>Cerrar</Button>
          }
        >
          <p>Contenido del modal con tamaño <strong>{size}</strong>.</p>
        </Modal>
      </div>
    )
  },
}

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button tone="danger" onClick={() => setOpen(true)}>Eliminar campaña</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Eliminar campaña"
          size="sm"
          footer={
            <>
              <Button tone="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button tone="danger" onClick={() => setOpen(false)}>
                Sí, eliminar
              </Button>
            </>
          }
        >
          <p>
            Esta acción es <strong>irreversible</strong>. Se eliminarán todos los contactos
            y registros de gestión asociados a esta campaña.
          </p>
        </Modal>
      </>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button tone="primary" onClick={() => setOpen(true)} data-testid="open-btn">
          Abrir modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal interactivo"
          data-testid="modal"
        >
          <p data-testid="modal-body">Contenido del modal de prueba.</p>
        </Modal>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open modal
    const openBtn = canvas.getByTestId('open-btn')
    await userEvent.click(openBtn)

    // Modal is visible (portal renders to body, so query via document)
    await expect(await within(document.body).findByTestId('modal-body')).toBeVisible()

    // Press Escape — modal closes
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByTestId('modal-body')).not.toBeInTheDocument()
  },
}
