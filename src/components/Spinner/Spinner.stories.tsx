import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Wave 1 — Atoms/Spinner',
  component: Spinner,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Indicador de carga circular. Reference: `.spinner` en `preview/components-buttons.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = { args: { size: 'md' } }

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const OnDarkBackground: Story = {
  render: () => (
    <div style={{ background: '#2B52A0', padding: 16, borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Spinner size="sm" style={{ color: 'white' }} />
      <Spinner size="md" style={{ color: 'white' }} />
      <Spinner size="lg" style={{ color: 'white' }} />
    </div>
  ),
}
