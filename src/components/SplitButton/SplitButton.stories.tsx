import type { Meta, StoryObj } from '@storybook/react'
import { SplitButton } from './SplitButton'

const meta: Meta<typeof SplitButton> = {
  title: 'Wave 7 — Meta Actions/SplitButton',
  component: SplitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Botón primario con dropdown de variantes. Reference: `design-system-reference/preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SplitButton>

const saveItems = [
  { label: 'Guardar y cerrar', onClick: () => {} },
  { label: 'Guardar y crear nuevo', onClick: () => {} },
  { label: 'Guardar copia', onClick: () => {} },
  { label: 'Descartar cambios', onClick: () => {}, danger: true },
]

export const Default: Story = {
  args: {
    label: 'Guardar cambios',
    onMainClick: () => {},
    items: saveItems,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Guardar cambios',
    onMainClick: () => {},
    items: saveItems,
    disabled: true,
  },
}
