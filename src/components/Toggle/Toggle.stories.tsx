import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Wave 2 — Form Controls/Toggle',
  component: Toggle,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interruptor binario (track + knob). Implementado con role="switch" para accesibilidad. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: { label: 'Recibir alertas en tiempo real' },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle label="Desactivado (off)" checked={false} onChange={() => {}} />
      <Toggle label="Activado (on)" checked onChange={() => {}} />
      <Toggle label="Deshabilitado off" disabled />
      <Toggle label="Deshabilitado on" defaultChecked disabled />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <Toggle
        label={on ? 'Activado' : 'Desactivado'}
        checked={on}
        onChange={setOn}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sw = canvas.getByRole('switch')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  },
}
