import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Wave 1 — Atoms/Button',
  component: Button,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón de acción principal. Reference: `preview/components-buttons.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Guardar cambios', tone: 'primary', size: 'md' },
}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button tone="primary">Guardar cambios</Button>
      <Button tone="secondary">Cancelar</Button>
      <Button tone="ghost">Exportar</Button>
      <Button tone="green">Enviar campaña</Button>
      <Button tone="danger">Eliminar registro</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Acción pequeña</Button>
      <Button size="md">Acción media</Button>
      <Button size="lg">Acción grande</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button isLoading>Procesando…</Button>
      <Button disabled>Deshabilitado</Button>
    </div>
  ),
}

export const Interactive: Story = {
  args: { children: 'Clic aquí', tone: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: 'Clic aquí' })
    await userEvent.click(btn)
    await expect(btn).toBeVisible()
  },
}
