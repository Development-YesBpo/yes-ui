import type { Meta, StoryObj } from '@storybook/react'
import { AgentStatusIndicator } from './AgentStatusIndicator'

const meta: Meta<typeof AgentStatusIndicator> = {
  title: 'Wave 8 — Communication/AgentStatusIndicator',
  component: AgentStatusIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Indicador de disponibilidad del agente: punto de color + etiqueta. Reference: `ui_kits/appcenter/Components.jsx` → StatusBadge.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof AgentStatusIndicator>

export const Default: Story = {
  args: { status: 'disponible' },
}

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AgentStatusIndicator status="disponible" />
      <AgentStatusIndicator status="ocupado" />
      <AgentStatusIndicator status="en-llamada" />
      <AgentStatusIndicator status="descanso" />
      <AgentStatusIndicator status="desconectado" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AgentStatusIndicator status="disponible" size="sm" />
      <AgentStatusIndicator status="disponible" size="md" />
    </div>
  ),
}

export const DotOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <AgentStatusIndicator status="disponible" showLabel={false} />
      <AgentStatusIndicator status="ocupado" showLabel={false} />
      <AgentStatusIndicator status="en-llamada" showLabel={false} />
      <AgentStatusIndicator status="descanso" showLabel={false} />
      <AgentStatusIndicator status="desconectado" showLabel={false} />
    </div>
  ),
}

export const InAgentRow: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        width: 260,
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {(['disponible', 'ocupado', 'en-llamada', 'descanso', 'desconectado'] as const).map(
        (status) => (
          <div
            key={status}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid #F3F4F6',
            }}
          >
            <span style={{ fontSize: 13, color: '#111827', fontFamily: 'Manrope, sans-serif' }}>
              Agente {status}
            </span>
            <AgentStatusIndicator status={status} size="sm" />
          </div>
        )
      )}
    </div>
  ),
}
