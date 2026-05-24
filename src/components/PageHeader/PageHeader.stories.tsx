import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'
import { Button } from '../Button'

const meta: Meta<typeof PageHeader> = {
  title: 'Wave 7 — Meta Actions/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Encabezado estándar de página con migas de pan, título, subtítulo y acciones. Reference: `design-system-reference/preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'Contactos',
    subtitle: '248 registros · Actualizado hace 2 min',
    breadcrumbs: [
      { label: 'Inicio', href: '#' },
      { label: 'Contactos', href: '#' },
      { label: 'Carlos Rodríguez' },
    ],
    actions: (
      <>
        <Button tone="secondary" size="sm">Exportar</Button>
        <Button tone="secondary" size="sm">Filtrar</Button>
        <Button tone="primary" size="sm">+ Nuevo contacto</Button>
      </>
    ),
  },
}

export const TitleOnly: Story = {
  args: { title: 'Gestión de campañas' },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Reportes',
    subtitle: 'Últimos 30 días',
  },
}

export const NoBreadcrumb: Story = {
  args: {
    title: 'Panel principal',
    subtitle: '5 agentes en línea',
    actions: <Button tone="primary" size="sm">+ Nuevo</Button>,
  },
}
