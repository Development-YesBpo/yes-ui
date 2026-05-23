import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from '../Button'

const meta: Meta<typeof Drawer> = {
  title: 'Wave 5 — Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Panel lateral deslizante desde la derecha. Cierra con Escape, clic en overlay, o botón ×. Reference: `design-system-reference/preview/components-modals.html` → panel lateral.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ padding: 24 }}>
        <Button tone="secondary" onClick={() => setOpen(true)}>Ver detalle</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Detalle del contacto"
          footer={
            <>
              <Button tone="ghost" onClick={() => setOpen(false)}>Cerrar</Button>
              <Button tone="primary" onClick={() => setOpen(false)}>Guardar cambios</Button>
            </>
          }
        >
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>NOMBRE</p>
            <p style={{ fontWeight: 500 }}>Carlos Rodríguez</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>ESTADO</p>
            <p style={{ fontWeight: 500 }}>Activo</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>CAMPAÑA</p>
            <p style={{ fontWeight: 500 }}>Cobranza Junio 2026</p>
          </div>
        </Drawer>
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [size, setSize] = useState<'md' | 'lg' | null>(null)
    return (
      <div style={{ padding: 24, display: 'flex', gap: 8 }}>
        {(['md', 'lg'] as const).map((s) => (
          <Button key={s} tone="secondary" onClick={() => setSize(s)}>
            Abrir {s.toUpperCase()} ({s === 'md' ? '480px' : '640px'})
          </Button>
        ))}
        <Drawer
          open={size !== null}
          onClose={() => setSize(null)}
          title={`Drawer ${size?.toUpperCase() ?? ''}`}
          size={size ?? 'md'}
          footer={
            <Button tone="ghost" onClick={() => setSize(null)}>Cerrar</Button>
          }
        >
          <p>Ancho del drawer: <strong>{size === 'md' ? '480px' : '640px'}</strong></p>
        </Drawer>
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: 24 }}>
        <Button
          tone="secondary"
          onClick={() => setOpen(true)}
          data-testid="open-drawer-btn"
        >
          Abrir drawer
        </Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Drawer interactivo"
          data-testid="drawer"
        >
          <p data-testid="drawer-body">Contenido del drawer de prueba.</p>
        </Drawer>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open drawer
    const openBtn = canvas.getByTestId('open-drawer-btn')
    await userEvent.click(openBtn)

    // Drawer renders into document.body via portal
    await expect(await within(document.body).findByTestId('drawer-body')).toBeVisible()

    // Press Escape — drawer closes
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByTestId('drawer-body')).not.toBeInTheDocument()
  },
}
