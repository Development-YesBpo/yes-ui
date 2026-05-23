import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  MessageSquare,
  Megaphone,
  Users,
  BarChart2,
  Settings,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import type { SidebarProps } from './Sidebar'

const NAV_ITEMS: SidebarProps['navItems'] = [
  { key: 'conversaciones', label: 'Conversaciones', icon: MessageSquare, badge: 12, group: 'Principal' },
  { key: 'campanas', label: 'Campañas', icon: Megaphone },
  { key: 'agentes', label: 'Agentes', icon: Users },
  { key: 'reportes', label: 'Reportes', icon: BarChart2 },
  { key: 'configuracion', label: 'Configuración', icon: Settings, group: 'Sistema' },
]

const USER: SidebarProps['user'] = {
  name: 'Andrea López',
  role: 'Coordinadora',
}

const DEFAULT_PROPS: SidebarProps = {
  product: 'AppCenter',
  navItems: NAV_ITEMS,
  activeKey: 'conversaciones',
  onNavigate: vi.fn(),
  user: USER,
  onLogout: vi.fn(),
}

describe('Sidebar', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders without crashing', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders product name in logo area', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText('AppCenter')).toBeInTheDocument()
  })

  it('renders YES BPO brand text', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText(/YES/)).toBeInTheDocument()
    expect(screen.getByText(/BPO/)).toBeInTheDocument()
  })

  it('renders all nav item labels', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByRole('button', { name: /conversaciones/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /campañas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /agentes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reportes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /configuración/i })).toBeInTheDocument()
  })

  it('renders group labels', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Sistema')).toBeInTheDocument()
  })

  it('renders nav badge count', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders user name', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText('Andrea López')).toBeInTheDocument()
  })

  it('renders user role', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByText('Coordinadora')).toBeInTheDocument()
  })

  // ── Active state ───────────────────────────────────────────────

  it('active nav item has aria-current="page"', () => {
    render(<Sidebar {...DEFAULT_PROPS} activeKey="campanas" />)
    expect(screen.getByRole('button', { name: /campañas/i })).toHaveAttribute('aria-current', 'page')
  })

  it('inactive nav items do not have aria-current', () => {
    render(<Sidebar {...DEFAULT_PROPS} activeKey="campanas" />)
    expect(screen.getByRole('button', { name: /agentes/i })).not.toHaveAttribute('aria-current', 'page')
  })

  it('active item badge uses active badge token class', () => {
    const { container } = render(<Sidebar {...DEFAULT_PROPS} activeKey="conversaciones" />)
    const badge = container.querySelector('[data-badge-active="true"]')
    expect(badge).toBeInTheDocument()
  })

  it('inactive item badge uses idle badge class', () => {
    const { container } = render(<Sidebar {...DEFAULT_PROPS} activeKey="campanas" />)
    const badge = container.querySelector('[data-badge-active="false"]')
    expect(badge).toBeInTheDocument()
  })

  // ── Navigation ─────────────────────────────────────────────────

  it('calls onNavigate exactly once when nav item clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onNavigate={onNavigate} />)
    await user.click(screen.getByRole('button', { name: /campañas/i }))
    expect(onNavigate).toHaveBeenCalledTimes(1)
    expect(onNavigate).toHaveBeenCalledWith('campanas')
  })

  it('calls onNavigate with correct key', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onNavigate={onNavigate} />)
    await user.click(screen.getByRole('button', { name: /configuración/i }))
    expect(onNavigate).toHaveBeenCalledWith('configuracion')
  })

  it('calls onLogout exactly once when logout clicked', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onLogout={onLogout} />)
    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  // ── Keyboard navigation ────────────────────────────────────────

  it('Tab moves focus through nav items', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...DEFAULT_PROPS} />)
    const firstItem = screen.getByRole('button', { name: /conversaciones/i })
    firstItem.focus()
    await user.tab()
    expect(screen.getByRole('button', { name: /campañas/i })).toHaveFocus()
  })

  it('Enter activates focused nav item', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onNavigate={onNavigate} />)
    const agentes = screen.getByRole('button', { name: /agentes/i })
    agentes.focus()
    await user.keyboard('{Enter}')
    expect(onNavigate).toHaveBeenCalledWith('agentes')
  })

  it('Space activates focused nav item', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onNavigate={onNavigate} />)
    const reportes = screen.getByRole('button', { name: /reportes/i })
    reportes.focus()
    await user.keyboard(' ')
    expect(onNavigate).toHaveBeenCalledWith('reportes')
  })

  // ── Collapsed mode ─────────────────────────────────────────────

  it('collapsed mode hides item labels', () => {
    render(<Sidebar {...DEFAULT_PROPS} collapsed />)
    const label = screen.queryByText('Conversaciones')
    // Labels are visually hidden (aria-hidden or hidden class) in collapsed mode
    if (label) {
      expect(label).toHaveAttribute('aria-hidden', 'true')
    } else {
      expect(label).not.toBeInTheDocument()
    }
  })

  it('collapsed mode hides product subtitle', () => {
    render(<Sidebar {...DEFAULT_PROPS} collapsed />)
    const subtitle = screen.queryByText('AppCenter')
    if (subtitle) {
      expect(subtitle).toHaveAttribute('aria-hidden', 'true')
    } else {
      expect(subtitle).not.toBeInTheDocument()
    }
  })

  it('collapsed mode hides user name and role', () => {
    render(<Sidebar {...DEFAULT_PROPS} collapsed />)
    const userName = screen.queryByText('Andrea López')
    if (userName) {
      expect(userName).toHaveAttribute('aria-hidden', 'true')
    } else {
      expect(userName).not.toBeInTheDocument()
    }
  })

  it('collapsed mode still renders nav item buttons (icons only)', () => {
    render(<Sidebar {...DEFAULT_PROPS} collapsed />)
    // All nav buttons still present and focusable, but labels hidden
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(NAV_ITEMS.length)
  })

  it('calls onToggleCollapse when toggle button clicked', async () => {
    const user = userEvent.setup()
    const onToggleCollapse = vi.fn()
    render(<Sidebar {...DEFAULT_PROPS} onToggleCollapse={onToggleCollapse} />)
    await user.click(screen.getByRole('button', { name: /colapsar|expandir sidebar/i }))
    expect(onToggleCollapse).toHaveBeenCalledTimes(1)
  })

  // ── Data / a11y ────────────────────────────────────────────────

  it('passes data-testid to root nav element', () => {
    render(<Sidebar {...DEFAULT_PROPS} data-testid="main-sidebar" />)
    expect(screen.getByTestId('main-sidebar')).toBeInTheDocument()
  })

  it('nav element has aria-label', () => {
    render(<Sidebar {...DEFAULT_PROPS} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Navegación principal')
  })

  it('renders toggle button with accessible label when expanded', () => {
    render(<Sidebar {...DEFAULT_PROPS} onToggleCollapse={vi.fn()} />)
    expect(screen.getByRole('button', { name: /colapsar sidebar/i })).toBeInTheDocument()
  })

  it('renders toggle button with expanded label when collapsed', () => {
    render(<Sidebar {...DEFAULT_PROPS} collapsed onToggleCollapse={vi.fn()} />)
    expect(screen.getByRole('button', { name: /expandir sidebar/i })).toBeInTheDocument()
  })
})
