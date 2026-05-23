import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Select } from './Select'

const options = [
  { value: 'contactado', label: 'Contactado' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'promesa', label: 'Promesa de pago' },
  { value: 'no_interesado', label: 'No interesado' },
]

const meta: Meta<typeof Select> = {
  title: 'Wave 2 — Form Controls/Select',
  component: Select,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector nativo con etiqueta accesible, flecha personalizada, estados de error y deshabilitado. Reference: `design-system-reference/preview/components-inputs.html`.',
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
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    label: 'Estado de la gestión',
    options,
    placeholder: 'Selecciona una opción',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Select label="Normal" options={options} placeholder="Selecciona" />
      <Select label="Con error" options={options} error="Selección requerida" />
      <Select label="Deshabilitado" options={options} disabled defaultValue="contactado" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Select label="Tamaño sm" options={options} size="sm" placeholder="Pequeño" />
      <Select label="Tamaño md" options={options} size="md" placeholder="Mediano" />
      <Select label="Tamaño lg" options={options} size="lg" placeholder="Grande" />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Estado de la gestión',
    options,
    placeholder: 'Selecciona',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sel = canvas.getByLabelText('Estado de la gestión')
    await userEvent.selectOptions(sel, 'promesa')
    await expect(sel).toHaveValue('promesa')
  },
}
