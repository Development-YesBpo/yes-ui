import type { Meta, StoryObj } from '@storybook/react'
import { Activity } from 'lucide-react'
import { KPICard } from './KPICard'

const meta: Meta<typeof KPICard> = {
  title: 'Wave 6a — Data Containers/KPICard',
  component: KPICard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Métrica de dashboard con label, valor grande, y delta con icono de tendencia. Referencia: `design-system-reference/preview/components-cards.html` (KPI) y `ui_kits/dashboard/DashComponents.jsx → KpiCard`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof KPICard>

export const Default: Story = {
  args: { label: 'Contactos hoy', value: '1.248' },
}

export const WithDelta: Story = {
  args: { label: 'Ventas', value: '$920k', delta: '+12%', deltaLabel: 'vs. ayer' },
}

export const NegativeDelta: Story = {
  args: { label: 'Tasa de error', value: '4.2%', delta: '-0.8%', deltaLabel: 'vs. ayer' },
}

export const WithIcon: Story = {
  args: {
    label: 'Uptime',
    value: '99.9%',
    icon: Activity,
    delta: '+0.1%',
    deltaLabel: 'vs. semana pasada',
  },
}

export const KPIRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <KPICard label="Contactos" value="1.248" delta="+18%" deltaLabel="vs. ayer" />
      <KPICard label="Conversiones" value="234" delta="-3%" deltaLabel="vs. ayer" />
      <KPICard label="Uptime" value="99.9%" color="#2B52A0" />
    </div>
  ),
}
