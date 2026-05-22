import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Wave 1 — Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar de iniciales con color determinístico. Reference: `ui_kits/appcenter/Components.jsx` → `Avatar`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: { name: 'Carlos Rodríguez', size: 'md' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Carlos Rodríguez" size="sm" />
      <Avatar name="Carlos Rodríguez" size="md" />
      <Avatar name="Carlos Rodríguez" size="lg" />
    </div>
  ),
}

export const MultipleNames: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['Carlos Rodríguez', 'María Gómez', 'Andrés Martínez', 'Laura Cifuentes', 'Pedro Sánchez'].map(n => (
        <Avatar key={n} name={n} size="md" />
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  args: { name: 'Carlos Rodríguez', src: 'https://i.pravatar.cc/150?img=3', alt: 'Foto de Carlos', size: 'lg' },
}
