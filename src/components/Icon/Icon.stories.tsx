import type { Meta, StoryObj } from '@storybook/react'
import { X, Check, AlertCircle, Info, ChevronRight, Plus, Search, Filter } from 'lucide-react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Wave 1 — Atoms/Icon',
  component: Icon,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ícono Lucide con defaults de YES BPO (stroke 1.75px). Reference: `ui_kits/appcenter/Components.jsx` → `Icon`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: { icon: Check, size: 20, 'aria-label': 'Confirmado' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon icon={Check} size={12} aria-label="xs" />
      <Icon icon={Check} size={16} aria-label="sm" />
      <Icon icon={Check} size={20} aria-label="md" />
      <Icon icon={Check} size={24} aria-label="lg" />
    </div>
  ),
}

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {[X, Check, AlertCircle, Info, ChevronRight, Plus, Search, Filter].map((Ic, i) => (
        <Icon key={i} icon={Ic} size={20} aria-label={`icon-${i}`} />
      ))}
    </div>
  ),
}
