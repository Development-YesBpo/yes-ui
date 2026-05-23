import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Wave 3 — Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Marcador de posición animado para contenido en carga. Rectángulo gris con efecto shimmer. No hay archivo de referencia dedicado — sigue las proporciones de `spacing-scale.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: { width: '100%', height: 16 },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Skeleton height={16} />
      <Skeleton height={12} width="60%" />
      <Skeleton height={40} borderRadius="8px" />
      <Skeleton height={120} borderRadius="8px" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={40} height={40} borderRadius="9999px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={14} />
          <Skeleton height={12} width="70%" />
        </div>
      </div>
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ width: 320, padding: 16, border: '1px solid #E5E7EB', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Skeleton width={48} height={48} borderRadius="9999px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={14} />
          <Skeleton height={12} width="50%" />
        </div>
      </div>
      <Skeleton height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={12} width="75%" />
    </div>
  ),
}

export const TableRowSkeleton: Story = {
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
          <Skeleton width={32} height={32} borderRadius="9999px" />
          <Skeleton height={12} width={160} />
          <Skeleton height={12} width={100} />
          <Skeleton height={12} width={80} />
          <Skeleton height={20} width={60} borderRadius="9999px" />
        </div>
      ))}
    </div>
  ),
}
