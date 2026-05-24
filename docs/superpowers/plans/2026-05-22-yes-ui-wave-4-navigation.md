# @yes/ui Wave 4 — Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 2 Wave 4 Navigation components — Tabs and Sidebar — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Tabs is built first because it is simpler; Sidebar is the most complex component in Waves 1–4 and imports `Icon` and `Avatar` from Wave 1. Every component follows the SPEC → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Wave 1 dependencies:**
- `Icon` — import from `'../Icon/Icon'`
- `Avatar` — import from `'../Avatar/Avatar'`

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add --yes-color-tabs-* tokens (Task 1)

src/components/
├── Tabs/
│   ├── Tabs.tsx
│   ├── Tabs.module.css
│   ├── Tabs.test.tsx
│   ├── Tabs.stories.tsx
│   ├── Tabs.mdx
│   └── index.ts
└── Sidebar/
    ├── Sidebar.tsx
    ├── Sidebar.module.css
    ├── Sidebar.test.tsx
    ├── Sidebar.stories.tsx
    ├── Sidebar.mdx
    └── index.ts

src/index.ts                         ← uncomment export per component
```

---

## Task 1: Tabs

**Reference:** `design-system-reference/preview/components-nav.html` (tabs section)
**Approach:** Controlled component — parent owns `activeId`. Two variants: `underline` (default, bottom-border indicator on active tab, transparent bg) and `contained` (panel with background, active tab has white/elevated surface). SSR-safe — no `window`/`document` access.

**Files:**
- Modify: `src/tokens/semantic.css` (add tabs tokens)
- Create: `src/components/Tabs/Tabs.tsx`
- Create: `src/components/Tabs/Tabs.module.css`
- Create: `src/components/Tabs/Tabs.test.tsx`
- Create: `src/components/Tabs/Tabs.stories.tsx`
- Create: `src/components/Tabs/Tabs.mdx`
- Create: `src/components/Tabs/index.ts`
- Modify: `src/index.ts`

---

- [ ] **Step 1: Add missing tokens to `src/tokens/semantic.css`**

Append inside the `:root` block, after the existing `--yes-color-sidebar-*` group:

```css
/* ── Tabs ─────────────────────────────────────────────────────── */
--yes-color-tabs-border:          var(--yes-color-border);          /* #E5E7EB */
--yes-color-tabs-indicator:       var(--yes-color-primary);         /* #2B52A0 */
--yes-color-tabs-label-idle:      var(--yes-color-text-muted);      /* #6B7280 */
--yes-color-tabs-label-active:    var(--yes-color-primary);         /* #2B52A0 */
--yes-color-tabs-contained-bg:    var(--yes-color-border);          /* #E5E7EB panel track */
--yes-color-tabs-contained-tab:   var(--yes-color-surface);         /* #FFFFFF active tab */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Tabs/Tabs.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tabs } from './Tabs'

const ITEMS = [
  { id: 'mis', label: 'Mis conversaciones' },
  { id: 'sin', label: 'Sin asignar' },
  { id: 'todas', label: 'Todas' },
  { id: 'arch', label: 'Archivadas', count: 3 },
]

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Mis conversaciones' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sin asignar' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Todas' })).toBeInTheDocument()
  })

  it('renders count badge when provided', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('active tab has aria-selected="true"', () => {
    render(<Tabs items={ITEMS} activeId="sin" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Sin asignar' })).toHaveAttribute('aria-selected', 'true')
  })

  it('inactive tabs have aria-selected="false"', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Todas' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange exactly once with correct id when tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Todas' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('todas')
  })

  it('does not call onChange when already-active tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Mis conversaciones' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders tablist with correct role', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders underline variant by default', () => {
    const { container } = render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'underline')
  })

  it('renders contained variant when specified', () => {
    const { container } = render(
      <Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} variant="contained" />
    )
    expect(container.firstChild).toHaveAttribute('data-variant', 'contained')
  })

  it('keyboard Enter activates tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    const tab = screen.getByRole('tab', { name: 'Sin asignar' })
    tab.focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('sin')
  })

  it('keyboard Space activates tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    const tab = screen.getByRole('tab', { name: 'Todas' })
    tab.focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith('todas')
  })

  it('passes data-testid to root element', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} data-testid="my-tabs" />)
    expect(screen.getByTestId('my-tabs')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — must be RED**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/Tabs/Tabs.test.tsx
```

Expected: `FAIL` — `Cannot find module './Tabs'`. Paste full output as evidence.

- [ ] **Step 4: Implement `Tabs.module.css`**

Create `src/components/Tabs/Tabs.module.css`:

```css
/* ── Tabs root ────────────────────────────────────────────────── */
.tabs {
  display: flex;
  gap: 0;
  position: relative;
}

/* ── Underline variant ────────────────────────────────────────── */
.underline {
  border-bottom: 2px solid var(--yes-color-tabs-border);
}

.underline .tab {
  padding: 8px 16px;
  font-family: var(--yes-font-sans);
  font-size: 13px;
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-tabs-label-idle);
  cursor: pointer;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 120ms, border-color 120ms;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.underline .tab:hover {
  color: var(--yes-color-tabs-label-active);
}

.underline .tab[aria-selected='true'] {
  color: var(--yes-color-tabs-label-active);
  border-bottom-color: var(--yes-color-tabs-indicator);
  font-weight: var(--yes-weight-semibold);
}

/* ── Contained variant ────────────────────────────────────────── */
.contained {
  background: var(--yes-color-tabs-contained-bg);
  border-radius: var(--yes-radius-btn);
  padding: 3px;
  gap: 2px;
}

.contained .tab {
  padding: 6px 14px;
  font-family: var(--yes-font-sans);
  font-size: 13px;
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-tabs-label-idle);
  cursor: pointer;
  border: none;
  background: transparent;
  border-radius: calc(var(--yes-radius-btn) - 2px);
  transition: color 120ms, background 120ms, box-shadow 120ms;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.contained .tab:hover {
  color: var(--yes-color-text);
}

.contained .tab[aria-selected='true'] {
  background: var(--yes-color-tabs-contained-tab);
  color: var(--yes-color-text);
  box-shadow: var(--yes-shadow-sm);
}

/* ── Count badge ──────────────────────────────────────────────── */
.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--yes-radius-badge);
  font-size: 11px;
  font-weight: var(--yes-weight-semibold);
  background: var(--yes-color-border);
  color: var(--yes-color-text-muted);
  line-height: 1;
}

.tab[aria-selected='true'] .count {
  background: var(--yes-color-primary);
  color: var(--yes-color-surface);
}
```

- [ ] **Step 5: Implement `Tabs.tsx`**

Create `src/components/Tabs/Tabs.tsx`:

```tsx
import type { BaseProps } from '../../types/shared'
import { cn } from '../../utils/cn'
import styles from './Tabs.module.css'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps extends BaseProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  variant?: 'underline' | 'contained'
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  className,
  style,
  'data-testid': testId,
}: TabsProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (id !== activeId) onChange(id)
    }
  }

  return (
    <div
      role="tablist"
      className={cn(styles.tabs, styles[variant], className)}
      style={style}
      data-testid={testId}
      data-variant={variant}
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            className={styles.tab}
            onClick={() => { if (!isActive) onChange(item.id) }}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={styles.count} aria-label={`${item.count} elementos`}>
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
```

Create `src/components/Tabs/index.ts`:

```typescript
export { Tabs } from './Tabs'
export type { TabsProps, TabItem } from './Tabs'
```

- [ ] **Step 6: Run tests — must be GREEN**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/Tabs/Tabs.test.tsx
```

Expected: all 11 tests passing. Paste full output as evidence before proceeding.

- [ ] **Step 7: Write stories**

Create `src/components/Tabs/Tabs.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Tabs } from './Tabs'

const CONVERSACIONES = [
  { id: 'mis', label: 'Mis conversaciones' },
  { id: 'sin', label: 'Sin asignar', count: 12 },
  { id: 'todas', label: 'Todas' },
  { id: 'arch', label: 'Archivadas', count: 3 },
]

const meta: Meta<typeof Tabs> = {
  title: 'Wave 4 — Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Navegación por pestañas. Dos variantes: underline (borde inferior) y contained (panel con fondo). Referencia: `design-system-reference/preview/components-nav.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Tabs>

function ControlledTabs(props: Partial<React.ComponentProps<typeof Tabs>>) {
  const [active, setActive] = useState('mis')
  return (
    <Tabs
      items={CONVERSACIONES}
      activeId={active}
      onChange={setActive}
      {...props}
    />
  )
}

export const Underline: Story = {
  render: () => <ControlledTabs variant="underline" />,
}

export const Contained: Story = {
  render: () => <ControlledTabs variant="contained" />,
}

export const BothVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontFamily: 'Manrope, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Underline</p>
        <ControlledTabs variant="underline" />
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 8, fontFamily: 'Manrope, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contained</p>
        <ControlledTabs variant="contained" />
      </div>
    </div>
  ),
}

export const WithCounts: Story = {
  render: () => (
    <ControlledTabs
      items={[
        { id: 'activas', label: 'Activas', count: 47 },
        { id: 'espera', label: 'En espera', count: 8 },
        { id: 'cerradas', label: 'Cerradas' },
      ]}
    />
  ),
}

export const Interactive: Story = {
  render: () => <ControlledTabs variant="underline" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sinAsignar = canvas.getByRole('tab', { name: /sin asignar/i })
    await userEvent.click(sinAsignar)
    await expect(sinAsignar).toHaveAttribute('aria-selected', 'true')
  },
}
```

- [ ] **Step 8: VISUAL GATE — human checkpoint**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm dev
```

Open Storybook → `Wave 4 — Navigation / Tabs / BothVariants`.
Open `design-system-reference/preview/components-nav.html` in browser at 700px.

Verify underline variant:
- Tab border-bottom `#E5E7EB` baseline track visible
- Active tab: `color: #2B52A0`, bottom indicator `2px solid #2B52A0`
- Idle tabs: `color: #6B7280`
- Font: Manrope, 13px, semibold

Verify contained variant:
- Track background matches `--yes-color-border` (#E5E7EB)
- Active tab: white elevated surface, shadow visible
- Radius: consistent with `--yes-radius-btn` (6px)

Count badges: blue background on active tab, gray on idle.

**Sign off before proceeding to Step 9.**

- [ ] **Step 9: Write MDX docs**

Create `src/components/Tabs/Tabs.mdx`:

```mdx
import { Meta, Controls, Canvas } from '@storybook/blocks'
import * as TabsStories from './Tabs.stories'

<Meta of={TabsStories} />

# Tabs

Navegación por pestañas controlada. El padre gestiona `activeId` — `Tabs` no tiene estado interno.

**Referencia:** `design-system-reference/preview/components-nav.html` (sección tabs)

## Cuándo usar

- `underline` — contexto de página completa (debajo de un título de sección). Variante predeterminada.
- `contained` — dentro de un card o panel donde el fondo necesita distinción visual.

## Accesibilidad

- `role="tablist"` en el contenedor.
- `role="tab"` + `aria-selected` en cada pestaña.
- Teclado: `Tab` navega entre pestañas; `Enter` / `Space` activa la pestaña enfocada.

## Props

<Controls />

## Personalización de tokens

```css
/* Ejemplo: cambiar el color del indicador a verde marca */
[data-yes-tabs] {
  --yes-color-tabs-indicator: var(--yes-color-brand-accent);
  --yes-color-tabs-label-active: var(--yes-color-brand-accent);
}
```
```

- [ ] **Step 10: Export from `src/index.ts`**

Uncomment or add:

```typescript
export { Tabs } from './components/Tabs'
export type { TabsProps, TabItem } from './components/Tabs'
```

- [ ] **Step 11: Build and verify export**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm build
node -e "
const { Tabs } = require('./dist/index.cjs');
if (!Tabs) { console.error('MISSING: Tabs'); process.exit(1); }
console.log('Tabs export OK');
"
```

Expected: `Tabs export OK`

- [ ] **Step 12: Commit**

```bash
git add src/components/Tabs/ src/tokens/semantic.css src/index.ts
git commit -m "feat(tabs): componente Tabs con variantes underline y contained"
```

---

## Task 2: Sidebar

**Reference:** `design-system-reference/preview/components-nav.html` (sidebar section)
**UI Kit reference:** `design-system-reference/ui_kits/appcenter/Components.jsx` → `AppSidebar`
**Approach:** Controlled component. Collapsed state is owned by parent (`collapsed` prop + `onToggleCollapse` callback). Role filtering is done by the parent — Sidebar receives only the items the caller wants rendered. SSR-safe — no `window`/`document` at module level.

**Dependencies:** `Icon` from `'../Icon/Icon'`, `Avatar` from `'../Avatar/Avatar'` (both Wave 1 exports).

**Files:**
- Create: `src/components/Sidebar/Sidebar.tsx`
- Create: `src/components/Sidebar/Sidebar.module.css`
- Create: `src/components/Sidebar/Sidebar.test.tsx`
- Create: `src/components/Sidebar/Sidebar.stories.tsx`
- Create: `src/components/Sidebar/Sidebar.mdx`
- Create: `src/components/Sidebar/index.ts`
- Modify: `src/index.ts`

---

- [ ] **Step 1: Write failing tests**

Create `src/components/Sidebar/Sidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  MessageSquare,
  Megaphone,
  Users,
  BarChart2,
  Settings,
  LogOut,
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
```

- [ ] **Step 2: Run tests — must be RED**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/Sidebar/Sidebar.test.tsx
```

Expected: `FAIL` — `Cannot find module './Sidebar'`. Paste full output as evidence.

- [ ] **Step 3: Implement `Sidebar.module.css`**

Create `src/components/Sidebar/Sidebar.module.css`:

```css
/* ── Root ─────────────────────────────────────────────────────── */
.sidebar {
  display: flex;
  flex-direction: column;
  width: var(--yes-size-sidebar-width);
  min-height: 100vh;
  background: var(--yes-color-sidebar-bg);
  flex-shrink: 0;
  overflow: hidden;
  transition: width 200ms ease;
}

.collapsed {
  width: var(--yes-size-sidebar-width-collapsed);
}

/* ── Logo area ────────────────────────────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--yes-color-sidebar-border);
  flex-shrink: 0;
}

.logoText {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}

.logoHeading {
  font-family: var(--yes-font-heading);
  font-size: 17px;
  font-weight: 700;
  color: var(--yes-color-sidebar-fg-active);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.logoHeading span {
  color: var(--yes-color-brand-accent);
}

.logoSub {
  font-family: var(--yes-font-sans);
  font-size: 10px;
  color: var(--yes-color-sidebar-fg);
  letter-spacing: 0.04em;
  white-space: nowrap;
  opacity: 0.6;
  transition: opacity 150ms;
}

.collapsed .logoSub {
  opacity: 0;
  pointer-events: none;
}

/* ── Toggle button ────────────────────────────────────────────── */
.toggleBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--yes-color-sidebar-fg);
  cursor: pointer;
  border-radius: var(--yes-radius-btn);
  flex-shrink: 0;
  transition: background 120ms, color 120ms;
}

.toggleBtn:hover {
  background: var(--yes-color-sidebar-item-hover);
  color: var(--yes-color-sidebar-fg-active);
}

/* ── Nav body ─────────────────────────────────────────────────── */
.navBody {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
}

/* ── Group label ──────────────────────────────────────────────── */
.groupLabel {
  font-family: var(--yes-font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--yes-color-sidebar-fg);
  opacity: 0.4;
  padding: 4px 8px 6px;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 150ms, max-height 150ms;
  max-height: 32px;
}

.collapsed .groupLabel {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  pointer-events: none;
}

/* ── Nav item ─────────────────────────────────────────────────── */
.navItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--yes-radius-btn);
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--yes-color-sidebar-fg);
  font-family: var(--yes-font-sans);
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 120ms, color 120ms;
  white-space: nowrap;
  overflow: hidden;
  margin-bottom: 2px;
}

.navItem:hover {
  background: var(--yes-color-sidebar-item-hover);
  color: var(--yes-color-sidebar-fg-active);
}

.navItem[aria-current='page'] {
  background: var(--yes-color-sidebar-item-active);
  color: var(--yes-color-sidebar-fg-active);
  font-weight: 600;
}

/* ── Nav item icon ────────────────────────────────────────────── */
.navIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

/* ── Nav item label ───────────────────────────────────────────── */
.navLabel {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 150ms;
}

.collapsed .navLabel {
  opacity: 0;
  pointer-events: none;
  width: 0;
}

/* ── Nav badge ────────────────────────────────────────────────── */
.navBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--yes-radius-badge);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  flex-shrink: 0;
  background: var(--yes-color-sidebar-badge-idle);
  color: var(--yes-color-sidebar-fg);
  transition: opacity 150ms, background 120ms, color 120ms;
}

.navItem[aria-current='page'] .navBadge {
  background: var(--yes-color-sidebar-badge-active);
  color: var(--yes-color-surface);
}

.collapsed .navBadge {
  opacity: 0;
  pointer-events: none;
}

/* ── Footer ───────────────────────────────────────────────────── */
.footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border-top: 1px solid var(--yes-color-sidebar-border);
  flex-shrink: 0;
  overflow: hidden;
}

.userInfo {
  flex: 1;
  overflow: hidden;
  transition: opacity 150ms;
}

.collapsed .userInfo {
  opacity: 0;
  pointer-events: none;
  width: 0;
}

.userName {
  font-family: var(--yes-font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--yes-color-sidebar-fg-active);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.userRole {
  font-family: var(--yes-font-sans);
  font-size: 10px;
  color: var(--yes-color-sidebar-fg);
  opacity: 0.5;
  white-space: nowrap;
}

.logoutBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--yes-color-sidebar-fg);
  opacity: 0.4;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--yes-radius-btn);
  flex-shrink: 0;
  transition: opacity 120ms, background 120ms;
}

.logoutBtn:hover {
  opacity: 1;
  background: var(--yes-color-sidebar-item-hover);
}
```

- [ ] **Step 4: Implement `Sidebar.tsx`**

Create `src/components/Sidebar/Sidebar.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Icon } from '../Icon/Icon'
import { Avatar } from '../Avatar/Avatar'
import type { BaseProps } from '../../types/shared'
import { cn } from '../../utils/cn'
import styles from './Sidebar.module.css'

export interface NavItem {
  key: string
  label: string
  icon: LucideIcon
  badge?: number
  group?: string
}

export interface SidebarUser {
  name: string
  role: string
  avatarSrc?: string
}

export interface SidebarProps extends BaseProps {
  product: string
  navItems: NavItem[]
  activeKey: string
  onNavigate: (key: string) => void
  user: SidebarUser
  onLogout: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  product,
  navItems,
  activeKey,
  onNavigate,
  user,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  className,
  style,
  'data-testid': testId,
}: SidebarProps) {
  // Build ordered list with group labels injected
  const groups: Array<{ groupLabel?: string; item: NavItem }> = []
  const seenGroups = new Set<string>()

  for (const item of navItems) {
    if (item.group && !seenGroups.has(item.group)) {
      seenGroups.add(item.group)
      groups.push({ groupLabel: item.group, item })
    } else {
      groups.push({ item })
    }
  }

  return (
    <nav
      className={cn(styles.sidebar, collapsed && styles.collapsed, className)}
      style={style}
      data-testid={testId}
      aria-label="Navegación principal"
    >
      {/* ── Logo ── */}
      <div className={styles.logo}>
        <div className={styles.logoText}>
          <span className={styles.logoHeading}>
            YES <span>BPO</span>
          </span>
          <span
            className={styles.logoSub}
            aria-hidden={collapsed ? 'true' : undefined}
          >
            {product}
          </span>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <Icon
              icon={collapsed ? ChevronRight : ChevronLeft}
              size={14}
              aria-hidden
            />
          </button>
        )}
      </div>

      {/* ── Nav body ── */}
      <div className={styles.navBody}>
        {groups.map(({ groupLabel, item }) => {
          const isActive = item.key === activeKey
          return (
            <div key={item.key}>
              {groupLabel && (
                <div
                  className={styles.groupLabel}
                  aria-hidden={collapsed ? 'true' : undefined}
                >
                  {groupLabel}
                </div>
              )}
              <button
                type="button"
                className={styles.navItem}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <span className={styles.navIcon}>
                  <Icon icon={item.icon} size={16} aria-hidden />
                </span>
                <span
                  className={styles.navLabel}
                  aria-hidden={collapsed ? 'true' : undefined}
                >
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    className={styles.navBadge}
                    aria-hidden={collapsed ? 'true' : undefined}
                    data-badge-active={isActive}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <Avatar
          name={user.name}
          src={user.avatarSrc}
          size={28}
        />
        <div
          className={styles.userInfo}
          aria-hidden={collapsed ? 'true' : undefined}
        >
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userRole}>{user.role}</div>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <Icon icon={LogOut} size={14} aria-hidden />
        </button>
      </div>
    </nav>
  )
}
```

Create `src/components/Sidebar/index.ts`:

```typescript
export { Sidebar } from './Sidebar'
export type { SidebarProps, NavItem, SidebarUser } from './Sidebar'
```

- [ ] **Step 5: Run tests — must be GREEN**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/Sidebar/Sidebar.test.tsx
```

Expected: all ~30 tests passing. Paste full output as evidence before proceeding.

- [ ] **Step 6: Write stories**

Create `src/components/Sidebar/Sidebar.stories.tsx`:

```tsx
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
  tags: ['autodocs'],
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
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm dev
```

Open Storybook → `Wave 4 — Navigation / Sidebar / AppCenter`.
Open `design-system-reference/preview/components-nav.html` in browser at 700px.

Verify expanded sidebar:
- Background: `#142860` (blue-900) — matches `--yes-color-sidebar-bg`
- Width: 220px
- Logo: "YES" white, "BPO" green (#8CBC39), product name muted below
- Group labels: 9px, uppercase, very muted (rgba white ~35%)
- Nav items: 13px Manrope, rgba(255,255,255,0.65)
- Active item: rgba white 12% background, white text, font-weight 600
- Active badge: green (#8CBC39 via `--yes-color-sidebar-badge-active`)
- Idle badge: `--yes-color-sidebar-badge-idle` (blue-700)
- Footer: Avatar + name + role + logout icon, separated by top border

Verify collapsed sidebar (switch to Collapsed story):
- Width: 56px
- Labels hidden, icons centered
- Group labels hidden (no layout shift)
- Avatar still shows in footer

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Sidebar/Sidebar.mdx`:

```mdx
import { Meta, Controls, Canvas } from '@storybook/blocks'
import * as SidebarStories from './Sidebar.stories'

<Meta of={SidebarStories} />

# Sidebar

Barra de navegación lateral de producto YES BPO. Fondo azul oscuro (#142860). Gestiona el estado de colapso de forma controlada — el padre provee `collapsed` y `onToggleCollapse`.

**Referencia visual:** `design-system-reference/preview/components-nav.html`
**Referencia de implementación:** `design-system-reference/ui_kits/appcenter/Components.jsx` → `AppSidebar`

## Cuándo usar

Cada producto YES BPO (AppCenter, PUY, Dashboard) tiene su propia instancia de Sidebar.
El producto se identifica con la prop `product`. El filtrado de ítems por rol se hace
**fuera** del componente — pasa solo los ítems que el usuario tiene permiso de ver.

## Accesibilidad

- `role="navigation"` con `aria-label="Navegación principal"`.
- Ítems de nav son `<button>` con `aria-current="page"` en el ítem activo.
- Modo colapsado: labels con `aria-hidden="true"` — el ícono lleva el título del botón para lectores de pantalla.
- Botón de cerrar sesión con `aria-label="Cerrar sesión"`.

## Props

<Controls />

## Personalización de tokens

```css
/* Ejemplo: cambiar el color de fondo del sidebar por producto */
[data-yes-sidebar] {
  --yes-color-sidebar-bg: #1a1a2e;
}
```

## Migración desde implementación anterior

Reemplazar `AppSidebar` de `ui_kits/appcenter/Components.jsx`:

```tsx
// Antes — prototipo inline
<AppSidebar navItems={items} activeView={view} onNavigate={setView} user={user} />

// Ahora — librería
import { Sidebar } from '@yes/ui'
<Sidebar
  product="AppCenter"
  navItems={items}
  activeKey={view}
  onNavigate={setView}
  user={user}
  onLogout={handleLogout}
/>
```

Diferencias clave:
- `activeView` → `activeKey`
- `onNavigate` misma firma
- `onLogout` ahora es prop requerida
- Colapso: `collapsed` + `onToggleCollapse` (antes era estado interno en el prototipo)
```

- [ ] **Step 9: Export from `src/index.ts`**

Uncomment or add:

```typescript
export { Sidebar } from './components/Sidebar'
export type { SidebarProps, NavItem, SidebarUser } from './components/Sidebar'
```

- [ ] **Step 10: Build and verify export**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm build
node -e "
const { Sidebar } = require('./dist/index.cjs');
if (!Sidebar) { console.error('MISSING: Sidebar'); process.exit(1); }
console.log('Sidebar export OK');
"
```

Expected: `Sidebar export OK`

- [ ] **Step 11: Commit**

```bash
git add src/components/Sidebar/ src/index.ts
git commit -m "feat(sidebar): componente Sidebar con modo colapsado y navegación por teclado"
```

---

## Task 3: Wave 4 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test
```

Expected: Tabs and Sidebar test files passing, all prior wave tests still green, 0 failures.
Paste the complete vitest output as evidence before marking done.

- [ ] **Step 2: Full build and dist check**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm build && pnpm check-dist
```

Expected:
```
✓ dist/index.js
✓ dist/index.cjs
✓ dist/index.d.ts
✓ dist/tokens/primitives.css
✓ dist/tokens/semantic.css
✓ dist/tokens/themes/light.css
✓ dist/tokens/themes/dark.css
All dist files present.
```

- [ ] **Step 3: Verify all Wave 4 exports are present**

```bash
node -e "
const { Tabs, Sidebar } = require('./dist/index.cjs');
const missing = ['Tabs','Sidebar'].filter(n => !eval(n));
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 4 exports present');
"
```

Expected: `All Wave 4 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm dev
```

Open each story group in order:
- Wave 4 — Navigation / Tabs / BothVariants
- Wave 4 — Navigation / Tabs / WithCounts
- Wave 4 — Navigation / Sidebar / AppCenter
- Wave 4 — Navigation / Sidebar / Collapsed
- Wave 4 — Navigation / Sidebar / PUY
- Wave 4 — Navigation / Sidebar / WithAvatar

Verify no console errors. Collapsed ↔ expanded toggle animates smoothly at 200ms. Active badge turns green.

- [ ] **Step 5: Tag Wave 4 release**

Update `version` in `package.json` from current to next minor (e.g. `0.4.0`) and commit:

```bash
git add package.json
git commit -m "chore(release): v0.4.0 — Wave 4 Navigation (Tabs, Sidebar)"
```

---

## Self-review notes

**Tabs:**
- Controlled only — no internal `useState`. If caller forgets to wire `onChange`, tabs appear frozen. This is intentional (single source of truth).
- `contained` variant uses `--yes-color-border` as the track; the active tab lifts with `box-shadow: var(--yes-shadow-sm)`. If shadow is too strong in dark themes, override the token.
- Count badge must be `aria-label`'d so screen readers announce "12 elementos", not bare "12".

**Sidebar:**
- `Icon` and `Avatar` are hard imports from Wave 1. If Wave 1 is not shipped, Sidebar will not build. Verify both exports exist in `dist/` before running this plan.
- Collapsed mode uses CSS `opacity: 0` + `pointer-events: none` for labels (not `display: none`), so the transition animates smoothly. Group labels additionally collapse `max-height` to avoid blank space.
- `onToggleCollapse` is optional — omitting it removes the chevron toggle button entirely. Use when the app controls collapse state from outside (e.g., a top-level layout component).
- Role filtering: if a future `navItems` array is empty, the nav body is empty but the component still renders without crashing. Add an `EmptyState` inside nav body in the consuming app if needed.
- Keyboard: `Tab` cycles through all `<button>` elements naturally. Arrow-key roving focus (ARIA pattern for `role="menu"`) is intentionally NOT implemented here — Sidebar nav uses `role="navigation"` with individual buttons, which is the simpler and more widely supported pattern for persistent nav.
