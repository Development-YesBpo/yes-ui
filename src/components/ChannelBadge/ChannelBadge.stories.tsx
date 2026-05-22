import type { Meta, StoryObj } from '@storybook/react'
import { ChannelBadge } from './ChannelBadge'

const meta: Meta<typeof ChannelBadge> = {
  title: 'Wave 1 — Atoms/ChannelBadge',
  component: ChannelBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insignia de canal. Reference: `preview/components-badges.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ChannelBadge>

export const Default: Story = { args: { channel: 'whatsapp' } }

export const AllChannels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <ChannelBadge channel="whatsapp" />
      <ChannelBadge channel="sms" />
      <ChannelBadge channel="email" />
      <ChannelBadge channel="voice" />
    </div>
  ),
}
