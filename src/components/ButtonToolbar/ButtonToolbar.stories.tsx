import type { Meta, StoryObj } from '@storybook/react'
import { ButtonToolbar, ToolbarButton } from './ButtonToolbar'

const meta: Meta<typeof ButtonToolbar> = {
  title: 'Wave 7 — Meta Actions/ButtonToolbar',
  component: ButtonToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Fila compacta de botones de acción agrupados con borde compartido. Reference: `design-system-reference/preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ButtonToolbar>

export const Default: Story = {
  render: () => (
    <ButtonToolbar aria-label="Acciones de tabla">
      <ToolbarButton onClick={() => {}}>↓ Exportar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>⊟ Filtrar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>⊞ Columnas</ToolbarButton>
    </ButtonToolbar>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <ButtonToolbar aria-label="Acciones">
      <ToolbarButton onClick={() => {}}>Editar</ToolbarButton>
      <ToolbarButton onClick={() => {}} disabled>Eliminar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>Duplicar</ToolbarButton>
    </ButtonToolbar>
  ),
}
