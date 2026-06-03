import type { Meta, StoryObj } from '@storybook/react'
import { ChartFrame } from './ChartFrame'

const meta: Meta<typeof ChartFrame> = {
  title: 'Wave 9 — Charts/ChartFrame',
  component: ChartFrame,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Envoltura compartida de todos los gráficos: role="img" + aria-label, estado de carga (Skeleton), estado vacío (EmptyState) y tabla de datos oculta para lectores de pantalla.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ChartFrame>

const Placeholder = () => (
  <div style={{ height: 148, background: 'var(--yes-color-bg)', borderRadius: 8 }} />
)

export const Default: Story = {
  render: () => (
    <ChartFrame ariaLabel="Gráfico de ejemplo">
      <Placeholder />
    </ChartFrame>
  ),
}
export const Loading: Story = {
  render: () => (
    <ChartFrame ariaLabel="Cargando" loading>
      <Placeholder />
    </ChartFrame>
  ),
}
export const Empty: Story = {
  render: () => (
    <ChartFrame ariaLabel="Sin datos" isEmpty emptyTitle="Sin datos para mostrar">
      <Placeholder />
    </ChartFrame>
  ),
}
