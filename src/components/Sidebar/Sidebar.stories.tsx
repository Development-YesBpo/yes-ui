import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import {
  MessageSquare,
  Megaphone,
  Users,
  BarChart2,
  Settings,
  Home,
  Globe,
  Phone,
  Mail,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import type { SidebarProps } from './Sidebar'

const APPCENTER_NAV: SidebarProps['navItems'] = [
  { key: 'conversaciones', label: 'Conversaciones', icon: MessageSquare, badge: 12, group: 'Principal' },
  { key: 'campanas', label: 'Campañas', icon: Megaphone },
  { key: 'agentes', label: 'Agentes', icon: Users },
  { key: 'reportes', label: 'Reportes', icon: BarChart2 },
  { key: 'configuracion', label: 'Configuración', icon: Settings, group: 'Sistema' },
]

const PUY_NAV: SidebarProps['navItems'] = [
  { key: 'inicio', label: 'Inicio', icon: Home, group: 'Principal' },
  { key: 'sms', label: 'SMS', icon: MessageSquare, badge: 5 },
  { key: 'voz', label: 'Voz', icon: Phone },
  { key: 'correo', label: 'Correo', icon: Mail },
  { key: 'web', label: 'Web', icon: Globe },
  { key: 'reportes', label: 'Reportes', icon: BarChart2, group: 'Análisis' },
  { key: 'configuracion', label: 'Configuración', icon: Settings, group: 'Sistema' },
]

const ANDREA: SidebarProps['user'] = {
  name: 'Andrea López',
  role: 'Coordinadora',
}

const meta: Meta<typeof Sidebar> = {
  title: 'Wave 4 — Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Barra lateral de navegación del producto. Fondo azul #142860. Gestiona el estado de colapso externamente. El filtrado por rol se hace fuera del componente. Referencia: `design-system-reference/preview/components-nav.html` + `ui_kits/appcenter/Components.jsx` → AppSidebar.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Sidebar>

function ControlledSidebar(props: Partial<SidebarProps> & { initialCollapsed?: boolean }) {
  const { initialCollapsed = false, ...rest } = props
  const [active, setActive] = useState('conversaciones')
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        product="AppCenter"
        navItems={APPCENTER_NAV}
        activeKey={active}
        onNavigate={setActive}
        user={ANDREA}
        onLogout={() => alert('Cerrando sesión…')}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        {...rest}
      />
      <main style={{ flex: 1, background: '#F3F4F6', padding: 24 }}>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#6B7280' }}>
          Vista activa: <strong style={{ color: '#111827' }}>{active}</strong>
        </p>
      </main>
    </div>
  )
}

export const AppCenter: Story = {
  render: () => <ControlledSidebar />,
}

export const Collapsed: Story = {
  render: () => <ControlledSidebar initialCollapsed />,
}

export const PUY: Story = {
  render: () => {
    const [active, setActive] = useState('sms')
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          product="PUY"
          navItems={PUY_NAV}
          activeKey={active}
          onNavigate={setActive}
          user={{ name: 'Carlos Mejía', role: 'Supervisor' }}
          onLogout={() => {}}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <main style={{ flex: 1, background: '#F3F4F6', padding: 24 }}>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#6B7280' }}>
            Vista activa: <strong style={{ color: '#111827' }}>{active}</strong>
          </p>
        </main>
      </div>
    )
  },
}

export const WithAvatar: Story = {
  render: () => (
    <ControlledSidebar
      user={{
        name: 'María García',
        role: 'Agente',
        avatarSrc: 'https://i.pravatar.cc/28?img=47',
      }}
    />
  ),
}

export const NoToggle: Story = {
  name: 'Sin botón de colapso',
  render: () => {
    const [active, setActive] = useState('conversaciones')
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          product="AppCenter"
          navItems={APPCENTER_NAV}
          activeKey={active}
          onNavigate={setActive}
          user={ANDREA}
          onLogout={() => {}}
        />
        <main style={{ flex: 1, background: '#F3F4F6', padding: 24 }} />
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => <ControlledSidebar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const campanas = canvas.getByRole('button', { name: /campañas/i })
    await userEvent.click(campanas)
    await expect(campanas).toHaveAttribute('aria-current', 'page')
  },
}
