import type { Meta, StoryObj } from '@storybook/react'
import { Widget } from './Widget'

const meta: Meta<typeof Widget> = {
  title: 'Wave 6a — Data Containers/Widget',
  component: Widget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Contenedor de dashboard con título, acción opcional y body. Referencia: `design-system-reference/preview/components-cards.html` y `ui_kits/dashboard/DashComponents.jsx → Widget`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Widget>

export const Default: Story = {
  args: {
    title: 'Resumen semanal',
    style: { width: 360 },
    children: (
      <div
        style={{
          height: 120,
          background: 'linear-gradient(180deg, #EEF3FA 0%, #fff 100%)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6B7280',
          fontSize: 12,
        }}
      >
        gráfico de líneas (placeholder)
      </div>
    ),
  },
}

export const WithAction: Story = {
  args: {
    title: 'Conversaciones',
    style: { width: 360 },
    action: (
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: '#2B52A0',
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        Ver todo
      </button>
    ),
    children: <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>247 conversaciones activas, 12 en espera.</p>,
  },
}

export const ContentList: Story = {
  args: {
    title: 'Próximas campañas',
    style: { width: 360 },
    children: (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 13 }}>
        <li style={{ padding: '6px 0', borderBottom: '1px solid #F3F4F6' }}>Campaña Bogotá Q3</li>
        <li style={{ padding: '6px 0', borderBottom: '1px solid #F3F4F6' }}>Re-engagement octubre</li>
        <li style={{ padding: '6px 0' }}>Cierre fiscal 2026</li>
      </ul>
    ),
  },
}
