import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Wave 2 — Form Controls/Textarea',
  component: Textarea,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Área de texto multilínea con el mismo sistema de etiqueta/error/hint que Input. Reference: `design-system-reference/preview/components-inputs.html`.',
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
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    label: 'Observaciones de gestión',
    placeholder: 'Escribe aquí las notas de la llamada…',
    hint: 'Máximo 500 caracteres',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Textarea label="Normal" placeholder="Escribe aquí…" hint="Texto de ayuda" />
      <Textarea
        label="Con error"
        value="Texto muy largo que supera el límite"
        error="El texto supera el límite permitido"
        onChange={() => {}}
      />
      <Textarea label="Deshabilitado" value="Texto de solo lectura" disabled onChange={() => {}} />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Observaciones de gestión',
    placeholder: 'Escribe aquí…',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ta = canvas.getByLabelText('Observaciones de gestión')
    await userEvent.type(ta, 'Notas de la llamada')
    await expect(ta).toHaveValue('Notas de la llamada')
  },
}
