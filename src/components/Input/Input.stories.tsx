import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Wave 2 — Form Controls/Input',
  component: Input,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de texto con etiqueta, estado de error, hint y soporte de tamaños sm/md/lg. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Nombre del cliente',
    placeholder: 'Ej. María González',
    hint: 'Nombre completo según registro',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Normal" placeholder="Escribe aquí" hint="Texto de ayuda" />
      <Input label="Con error" value="carlos@ejemp" error="Correo electrónico no válido" onChange={() => {}} />
      <Input label="Deshabilitado" value="Valor fijo" disabled onChange={() => {}} />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Tamaño sm" size="sm" placeholder="Pequeño" />
      <Input label="Tamaño md" size="md" placeholder="Mediano (por defecto)" />
      <Input label="Tamaño lg" size="lg" placeholder="Grande" />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Correo electrónico',
    type: 'email',
    value: 'carlos@ejemp',
    error: 'Correo electrónico no válido',
    onChange: () => {},
  },
}

export const Interactive: Story = {
  args: {
    label: 'Buscar cliente',
    placeholder: 'Escribe para buscar',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Buscar cliente')
    await userEvent.type(input, 'Carlos')
    await expect(input).toHaveValue('Carlos')
  },
}
