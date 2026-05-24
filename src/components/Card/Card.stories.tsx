import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Wave 6a — Data Containers/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Contenedor de superficie con header, body y footer opcionales. Referencia: `design-system-reference/preview/components-cards.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { children: 'Contenido de la tarjeta.' },
}

export const WithHeader: Story = {
  args: {
    header: 'Título de tarjeta',
    children: 'Cuerpo de la tarjeta con información relevante.',
  },
}

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Configuración',
    children: 'Contenido principal con descripción detallada del estado actual.',
    footer: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button">Cancelar</button>
        <button type="button">Guardar</button>
      </div>
    ),
  },
}

export const Interactive: Story = {
  args: {
    header: 'Tarjeta interactiva',
    children: 'Haz clic para seleccionar esta tarjeta.',
    interactive: true,
    onClick: () => {
      // visual demo only
    },
  },
}
