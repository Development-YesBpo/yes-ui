# @yes/ui Wave 8 — Communication & Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 4 Wave 8 Communication & Layout components — AgentStatusIndicator, ConversationItem, MessageBubble, PanelRich — as fully tested, Storybook-documented, visually validated `@yes/ui` exports. This is the final wave of the v1.0.0 library.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. ConversationItem imports Avatar and ChannelBadge (Wave 1). MessageBubble imports Avatar (Wave 1). PanelRich imports Tabs (Wave 4), Avatar (Wave 1), Badge (Wave 1), and Button (Wave 1). AgentStatusIndicator has no deps. Every component follows translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add missing tokens (Tasks 1–4)

src/components/
├── AgentStatusIndicator/
│   ├── AgentStatusIndicator.tsx
│   ├── AgentStatusIndicator.module.css
│   ├── AgentStatusIndicator.test.tsx
│   ├── AgentStatusIndicator.stories.tsx
│   ├── AgentStatusIndicator.mdx
│   └── index.ts
├── ConversationItem/
│   ├── ConversationItem.tsx
│   ├── ConversationItem.module.css
│   ├── ConversationItem.test.tsx
│   ├── ConversationItem.stories.tsx
│   ├── ConversationItem.mdx
│   └── index.ts
├── MessageBubble/
│   ├── MessageBubble.tsx
│   ├── MessageBubble.module.css
│   ├── MessageBubble.test.tsx
│   ├── MessageBubble.stories.tsx
│   ├── MessageBubble.mdx
│   └── index.ts
└── PanelRich/
    ├── PanelRich.tsx
    ├── PanelRich.module.css
    ├── PanelRich.test.tsx
    ├── PanelRich.stories.tsx
    ├── PanelRich.mdx
    └── index.ts

src/index.ts                         ← uncomment export per component
```

---

## Task 1: AgentStatusIndicator

**Reference:** `ui_kits/appcenter/Components.jsx` → `StatusBadge` / AgentView section in `App.jsx`
**Translation passes:**
- dot: 8px circle → new token `--yes-size-agent-dot: 8px`
- dot-sm: 6px circle → `--yes-size-agent-dot-sm: 6px`
- label: 13px, Manrope → `--yes-text-sm` (13px ✓)
- disponible → `#16A34A` = `--yes-color-success`
- ocupado → `#D97706` = `--yes-color-warning`
- en-llamada → `#2563EB` = `--yes-color-info`
- descanso → `#7C3AED` → new token `--yes-color-agent-descanso: #7C3AED`
- desconectado → `#9CA3AF` = `--yes-color-text-subtle`
- gap between dot and label: 6px → `--yes-space-btn-gap` (6px ✓)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/AgentStatusIndicator/AgentStatusIndicator.tsx`
- Create: `src/components/AgentStatusIndicator/AgentStatusIndicator.module.css`
- Create: `src/components/AgentStatusIndicator/AgentStatusIndicator.test.tsx`
- Create: `src/components/AgentStatusIndicator/AgentStatusIndicator.stories.tsx`
- Create: `src/components/AgentStatusIndicator/AgentStatusIndicator.mdx`
- Create: `src/components/AgentStatusIndicator/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add AgentStatusIndicator tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the last existing token block:

```css
  /* ── AgentStatusIndicator ────────────────────────────────── */
  --yes-size-agent-dot:    8px;
  --yes-size-agent-dot-sm: 6px;
  --yes-color-agent-descanso: #7C3AED;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/AgentStatusIndicator/AgentStatusIndicator.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AgentStatusIndicator } from './AgentStatusIndicator'

describe('AgentStatusIndicator', () => {
  it('renders without crashing', () => {
    render(<AgentStatusIndicator status="disponible" data-testid="asi" />)
    expect(screen.getByTestId('asi')).toBeInTheDocument()
  })

  it.each(['disponible', 'ocupado', 'en-llamada', 'descanso', 'desconectado'] as const)(
    'renders %s status without crashing',
    (status) => {
      render(<AgentStatusIndicator status={status} data-testid={`asi-${status}`} />)
      expect(screen.getByTestId(`asi-${status}`)).toBeInTheDocument()
    }
  )

  it('shows label by default', () => {
    render(<AgentStatusIndicator status="disponible" />)
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('shows correct label for ocupado', () => {
    render(<AgentStatusIndicator status="ocupado" />)
    expect(screen.getByText('Ocupado')).toBeInTheDocument()
  })

  it('shows correct label for en-llamada', () => {
    render(<AgentStatusIndicator status="en-llamada" />)
    expect(screen.getByText('En llamada')).toBeInTheDocument()
  })

  it('shows correct label for descanso', () => {
    render(<AgentStatusIndicator status="descanso" />)
    expect(screen.getByText('Descanso')).toBeInTheDocument()
  })

  it('shows correct label for desconectado', () => {
    render(<AgentStatusIndicator status="desconectado" />)
    expect(screen.getByText('Desconectado')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<AgentStatusIndicator status="disponible" showLabel={false} />)
    expect(screen.queryByText('Disponible')).not.toBeInTheDocument()
  })

  it('applies sm size class', () => {
    render(<AgentStatusIndicator status="disponible" size="sm" data-testid="asi" />)
    const el = screen.getByTestId('asi')
    expect(el.className).toMatch(/sm/)
  })

  it('applies md size by default', () => {
    render(<AgentStatusIndicator status="disponible" data-testid="asi" />)
    const el = screen.getByTestId('asi')
    expect(el.className).toMatch(/md/)
  })

  it('passes data-testid to root', () => {
    render(<AgentStatusIndicator status="ocupado" data-testid="my-asi" />)
    expect(screen.getByTestId('my-asi')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AgentStatusIndicator status="disponible" className="custom" data-testid="asi" />)
    expect(screen.getByTestId('asi')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/AgentStatusIndicator/AgentStatusIndicator.test.tsx` — "Cannot find module './AgentStatusIndicator'".

- [ ] **Step 4: Implement AgentStatusIndicator**

Create `src/components/AgentStatusIndicator/AgentStatusIndicator.module.css`:

```css
.indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--yes-space-btn-gap);
  font-family: var(--yes-font-sans);
}

.dot {
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Sizes ────────────────────────────────────────────────── */
.sm .dot {
  width: var(--yes-size-agent-dot-sm);
  height: var(--yes-size-agent-dot-sm);
}

.md .dot {
  width: var(--yes-size-agent-dot);
  height: var(--yes-size-agent-dot);
}

.sm .label {
  font-size: var(--yes-text-xs);
}

.md .label {
  font-size: var(--yes-text-sm);
}

/* ── Status colors ────────────────────────────────────────── */
.disponible .dot   { background: var(--yes-color-success); }
.ocupado .dot      { background: var(--yes-color-warning); }
.en-llamada .dot   { background: var(--yes-color-info); }
.descanso .dot     { background: var(--yes-color-agent-descanso); }
.desconectado .dot { background: var(--yes-color-text-subtle); }

.label {
  color: var(--yes-color-text);
  font-weight: var(--yes-weight-medium);
  line-height: 1;
}
```

Create `src/components/AgentStatusIndicator/AgentStatusIndicator.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './AgentStatusIndicator.module.css'

type AgentStatus = 'disponible' | 'ocupado' | 'en-llamada' | 'descanso' | 'desconectado'
type IndicatorSize = 'sm' | 'md'

const LABELS: Record<AgentStatus, string> = {
  'disponible':   'Disponible',
  'ocupado':      'Ocupado',
  'en-llamada':   'En llamada',
  'descanso':     'Descanso',
  'desconectado': 'Desconectado',
}

interface AgentStatusIndicatorProps extends BaseProps {
  status: AgentStatus
  showLabel?: boolean
  size?: IndicatorSize
}

export function AgentStatusIndicator({
  status,
  showLabel = true,
  size = 'md',
  className,
  style,
  'data-testid': testId,
}: AgentStatusIndicatorProps) {
  return (
    <span
      className={cn(styles.indicator, styles[size], styles[status], className)}
      style={style}
      data-testid={testId}
    >
      <span className={styles.dot} aria-hidden="true" />
      {showLabel && (
        <span className={styles.label}>{LABELS[status]}</span>
      )}
    </span>
  )
}
```

Create `src/components/AgentStatusIndicator/index.ts`:

```typescript
export { AgentStatusIndicator } from './AgentStatusIndicator'
export type { } from './AgentStatusIndicator'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/AgentStatusIndicator/AgentStatusIndicator.test.tsx` — 12 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/AgentStatusIndicator/AgentStatusIndicator.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AgentStatusIndicator } from './AgentStatusIndicator'

const meta: Meta<typeof AgentStatusIndicator> = {
  title: 'Wave 8 — Communication/AgentStatusIndicator',
  component: AgentStatusIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Indicador de disponibilidad del agente: punto de color + etiqueta. Reference: `ui_kits/appcenter/Components.jsx` → StatusBadge.',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 260, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
      {(['disponible', 'ocupado', 'en-llamada', 'descanso', 'desconectado'] as const).map(status => (
        <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 13, color: '#111827', fontFamily: 'Manrope, sans-serif' }}>Agente {status}</span>
          <AgentStatusIndicator status={status} size="sm" />
        </div>
      ))}
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 8 — Communication / AgentStatusIndicator / AllStatuses`.
Open `ui_kits/appcenter/App.jsx` → AgentView section — compare dot colors:
- Disponible: `#16A34A` (green)
- Ocupado: `#D97706` (amber)
- En llamada: `#2563EB` (blue)
- Descanso: `#7C3AED` (purple)
- Desconectado: `#9CA3AF` (gray)

Dot must be 8px circle. Label 13px Manrope medium weight.

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/AgentStatusIndicator/AgentStatusIndicator.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as Stories from './AgentStatusIndicator.stories'

<Meta of={Stories} />

# AgentStatusIndicator

Muestra la disponibilidad operativa de un agente: un punto de color semántico
con etiqueta opcional. Usado en listas de agentes, encabezados de sidebar y
filas de tabla del módulo AppCenter.

**Referencia:** `ui_kits/appcenter/Components.jsx` → StatusBadge / AgentView

## Uso

```tsx
import { AgentStatusIndicator } from '@yes/ui'

<AgentStatusIndicator status="disponible" />
<AgentStatusIndicator status="ocupado" showLabel={false} size="sm" />
```

## Estados

| Estado | Color | Token |
|--------|-------|-------|
| `disponible` | Verde | `--yes-color-success` |
| `ocupado` | Ámbar | `--yes-color-warning` |
| `en-llamada` | Azul | `--yes-color-info` |
| `descanso` | Púrpura | `--yes-color-agent-descanso` |
| `desconectado` | Gris | `--yes-color-text-subtle` |

<Canvas of={Stories.AllStatuses} />
<Controls of={Stories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { AgentStatusIndicator } from './components/AgentStatusIndicator'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/AgentStatusIndicator/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-8): agregar componente AgentStatusIndicator"
```

---

## Task 2: ConversationItem

**Reference:** `ui_kits/appcenter/App.jsx` → `ConversationList` render loop
**Dependencies:** Avatar (Wave 1), ChannelBadge (Wave 1)
**Translation passes:**
- padding: `11px 14px` → new tokens `--yes-size-conv-py: 11px`, `--yes-size-conv-px: 14px`
- min-height: ~64px → derived from padding + content
- contact name: 13px, weight 700 (unread) / 600 (read) → `--yes-text-sm` (13px ✓)
- last message: 12px, `#6B7280` → `--yes-text-xs` (12px ✓), `--yes-color-text-muted` ✓
- timestamp: 11px, `#9CA3AF` → new token `--yes-text-2xs: 11px`, `--yes-color-text-subtle` ✓
- unread badge: 18px circle, `#2B52A0` bg, white text, 10px font → `--yes-color-primary` ✓, new token `--yes-size-unread-badge: 18px`
- active bg: `#EEF3FA` → `--yes-color-badge-blue` ✓
- active left border: `3px solid #2B52A0` → `--yes-color-primary` ✓
- bottom border: `1px solid #F3F4F6` → `--yes-color-border-subtle` (verify in semantic.css or use `--yes-color-bg`)
- avatar size: 36px → add `--yes-size-avatar-36: 36px` (between existing md=32 and lg=40; add to semantic.css)
- channel badge position: below last message row, gap 5px
- gap between avatar and content: 8px → `--yes-space-2` (8px ✓)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/ConversationItem/ConversationItem.tsx`
- Create: `src/components/ConversationItem/ConversationItem.module.css`
- Create: `src/components/ConversationItem/ConversationItem.test.tsx`
- Create: `src/components/ConversationItem/ConversationItem.stories.tsx`
- Create: `src/components/ConversationItem/ConversationItem.mdx`
- Create: `src/components/ConversationItem/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add ConversationItem tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the AgentStatusIndicator tokens:

```css
  /* ── ConversationItem ────────────────────────────────────── */
  --yes-size-conv-py:        11px;
  --yes-size-conv-px:        14px;
  --yes-size-avatar-36:      36px;
  --yes-text-2xs:            11px;
  --yes-size-unread-badge:   18px;
  --yes-color-conv-active:   var(--yes-color-badge-blue);  /* #EEF3FA */
  --yes-color-conv-border:   var(--yes-color-bg);          /* #F3F4F6 */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/ConversationItem/ConversationItem.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ConversationItem } from './ConversationItem'

const defaultProps = {
  name: 'Carlos Rodríguez',
  lastMessage: '¡Claro! Envíame el detalle por favor',
  channel: 'whatsapp' as const,
  timestamp: '2 min',
}

describe('ConversationItem', () => {
  it('renders contact name', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders last message preview', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('¡Claro! Envíame el detalle por favor')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('2 min')).toBeInTheDocument()
  })

  it('renders channel badge', () => {
    render(<ConversationItem {...defaultProps} />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })

  it('shows unread count badge when unreadCount > 0', () => {
    render(<ConversationItem {...defaultProps} unreadCount={3} data-testid="ci" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides unread count badge when unreadCount is 0', () => {
    render(<ConversationItem {...defaultProps} unreadCount={0} data-testid="ci" />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('hides unread count badge when unreadCount is not provided', () => {
    const { container } = render(<ConversationItem {...defaultProps} />)
    expect(container.querySelector('[data-unread]')).not.toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    render(<ConversationItem {...defaultProps} isActive data-testid="ci" />)
    const el = screen.getByTestId('ci')
    expect(el.className).toMatch(/active/)
  })

  it('does not apply active class by default', () => {
    render(<ConversationItem {...defaultProps} data-testid="ci" />)
    const el = screen.getByTestId('ci')
    expect(el.className).not.toMatch(/active/)
  })

  it('calls onClick exactly once when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ConversationItem {...defaultProps} onClick={onClick} data-testid="ci" />)
    await user.click(screen.getByTestId('ci'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders avatar with contact name', () => {
    render(<ConversationItem {...defaultProps} />)
    // Avatar renders initials CR
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders avatar image when avatarSrc is provided', () => {
    render(<ConversationItem {...defaultProps} avatarSrc="https://example.com/img.jpg" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<ConversationItem {...defaultProps} data-testid="my-ci" />)
    expect(screen.getByTestId('my-ci')).toBeInTheDocument()
  })

  it.each(['whatsapp', 'sms', 'email', 'voice'] as const)(
    'renders %s channel badge',
    (channel) => {
      render(<ConversationItem {...defaultProps} channel={channel} />)
      expect(document.querySelector('span')).toBeInTheDocument()
    }
  )
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/ConversationItem/ConversationItem.test.tsx` — "Cannot find module './ConversationItem'".

- [ ] **Step 4: Implement ConversationItem**

Create `src/components/ConversationItem/ConversationItem.module.css`:

```css
.item {
  display: flex;
  align-items: flex-start;
  gap: var(--yes-space-2);
  padding: var(--yes-size-conv-py) var(--yes-size-conv-px);
  cursor: pointer;
  border-bottom: 1px solid var(--yes-color-conv-border);
  border-left: 3px solid transparent;
  transition:
    background var(--yes-duration-base) var(--yes-ease),
    border-left-color var(--yes-duration-base) var(--yes-ease);
  min-width: 0;
}

.item:hover {
  background: var(--yes-color-conv-active);
}

.active {
  background: var(--yes-color-conv-active);
  border-left-color: var(--yes-color-primary);
}

.content {
  flex: 1;
  min-width: 0;
}

.topRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.name {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.nameUnread {
  font-weight: var(--yes-weight-bold);
}

.nameRead {
  font-weight: var(--yes-weight-semibold);
}

.timestamp {
  font-size: var(--yes-text-2xs);
  color: var(--yes-color-text-subtle);
  flex-shrink: 0;
  margin-left: 4px;
  font-family: var(--yes-font-sans);
}

.lastMessage {
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  font-family: var(--yes-font-sans);
}

.bottomRow {
  display: flex;
  align-items: center;
  gap: 4px;
}

.unreadBadge {
  background: var(--yes-color-primary);
  color: var(--yes-color-primary-fg);
  font-size: 10px;
  font-weight: var(--yes-weight-bold);
  width: var(--yes-size-unread-badge);
  height: var(--yes-size-unread-badge);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  flex-shrink: 0;
  font-family: var(--yes-font-sans);
}
```

Create `src/components/ConversationItem/ConversationItem.tsx`:

```tsx
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import { ChannelBadge } from '../ChannelBadge/ChannelBadge'
import type { BaseProps } from '../../types/shared'
import styles from './ConversationItem.module.css'

type Channel = 'whatsapp' | 'sms' | 'email' | 'voice'

interface ConversationItemProps extends BaseProps {
  name: string
  lastMessage: string
  channel: Channel
  timestamp: string
  unreadCount?: number
  isActive?: boolean
  avatarSrc?: string
  onClick?: () => void
}

export function ConversationItem({
  name,
  lastMessage,
  channel,
  timestamp,
  unreadCount,
  isActive = false,
  avatarSrc,
  onClick,
  className,
  style,
  'data-testid': testId,
}: ConversationItemProps) {
  const hasUnread = typeof unreadCount === 'number' && unreadCount > 0

  return (
    <div
      className={cn(styles.item, isActive && styles.active, className)}
      style={style}
      data-testid={testId}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      <Avatar
        name={name}
        src={avatarSrc}
        style={{ width: 'var(--yes-size-avatar-36)', height: 'var(--yes-size-avatar-36)', fontSize: 'calc(var(--yes-size-avatar-36) * 0.36)' }}
      />
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={cn(styles.name, hasUnread ? styles.nameUnread : styles.nameRead)}>
            {name}
          </span>
          <span className={styles.timestamp}>{timestamp}</span>
        </div>
        <div className={styles.lastMessage}>{lastMessage}</div>
        <div className={styles.bottomRow}>
          <ChannelBadge channel={channel} />
          {hasUnread && (
            <span className={styles.unreadBadge} data-unread="">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
```

Create `src/components/ConversationItem/index.ts`:

```typescript
export { ConversationItem } from './ConversationItem'
export type { } from './ConversationItem'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/ConversationItem/ConversationItem.test.tsx` — 14 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/ConversationItem/ConversationItem.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { ConversationItem } from './ConversationItem'

const meta: Meta<typeof ConversationItem> = {
  title: 'Wave 8 — Communication/ConversationItem',
  component: ConversationItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Fila de conversación en la lista de contactos. Reference: `ui_kits/appcenter/App.jsx` → ConversationList.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConversationItem>

export const Default: Story = {
  args: {
    name: 'Carlos Rodríguez',
    lastMessage: '¡Claro! Envíame el detalle por favor',
    channel: 'whatsapp',
    timestamp: '2 min',
    unreadCount: 2,
  },
}

export const ConversationList: Story = {
  render: () => {
    const [activeId, setActiveId] = useState(1)
    const conversations = [
      { id: 1, name: 'Carlos Rodríguez',     channel: 'whatsapp' as const, lastMessage: '¡Claro! Envíame el detalle por favor',            timestamp: '2 min',  unreadCount: 2 },
      { id: 2, name: 'María Fernanda Gómez', channel: 'sms' as const,      lastMessage: 'Pendiente de revisión del saldo',                 timestamp: '15 min', unreadCount: 0 },
      { id: 3, name: 'Empresa ABC Ltda',     channel: 'email' as const,    lastMessage: 'Cotización aprobada, necesitamos acceso al portal', timestamp: '1 h',    unreadCount: 0 },
      { id: 4, name: 'Andrés Martínez',      channel: 'whatsapp' as const, lastMessage: 'Ok perfecto, muchas gracias',                     timestamp: '2 h',    unreadCount: 0 },
      { id: 5, name: 'Logística Norte SAS',  channel: 'voice' as const,    lastMessage: 'Llamada registrada · 3:42 min',                   timestamp: '3 h',    unreadCount: 0 },
    ]
    return (
      <div style={{ width: 280, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            lastMessage={conv.lastMessage}
            channel={conv.channel}
            timestamp={conv.timestamp}
            unreadCount={conv.unreadCount}
            isActive={activeId === conv.id}
            onClick={() => setActiveId(conv.id)}
          />
        ))}
      </div>
    )
  },
}

export const WithUnread: Story = {
  args: {
    name: 'María Gómez',
    lastMessage: 'Hola, necesito ayuda con mi pedido',
    channel: 'sms',
    timestamp: '5 min',
    unreadCount: 5,
  },
}

export const Active: Story = {
  args: {
    name: 'Empresa ABC Ltda',
    lastMessage: 'Cotización aprobada',
    channel: 'email',
    timestamp: '1 h',
    isActive: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(false)
    return (
      <div style={{ width: 280 }}>
        <ConversationItem
          name="Carlos Rodríguez"
          lastMessage="¡Claro! Envíame el detalle"
          channel="whatsapp"
          timestamp="2 min"
          unreadCount={2}
          isActive={active}
          onClick={() => setActive(true)}
          data-testid="conv-item"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = canvas.getByTestId('conv-item')
    await userEvent.click(item)
    await expect(item.className).toMatch(/active/)
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 8 — Communication / ConversationItem / ConversationList`.
Open `ui_kits/appcenter/App.jsx` → render the ConversationList in a browser.
Verify side-by-side:
- Row height ~64px, padding 11px 14px
- Active row: `#EEF3FA` background, `3px solid #2B52A0` left border
- Unread: bold name + blue circle badge (18px, primary blue)
- Timestamp: 11px, gray-400
- Channel badge below last message

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/ConversationItem/ConversationItem.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as Stories from './ConversationItem.stories'

<Meta of={Stories} />

# ConversationItem

Fila de conversación en el panel de lista del AppCenter. Muestra avatar, nombre,
vista previa del último mensaje, badge de canal, timestamp y contador de mensajes
no leídos.

**Referencia:** `ui_kits/appcenter/App.jsx` → ConversationList

**Dependencias:** Avatar (Wave 1), ChannelBadge (Wave 1)

## Uso

```tsx
import { ConversationItem } from '@yes/ui'

<ConversationItem
  name="Carlos Rodríguez"
  lastMessage="¡Claro! Envíame el detalle por favor"
  channel="whatsapp"
  timestamp="2 min"
  unreadCount={2}
  isActive={activeId === conv.id}
  onClick={() => setActiveId(conv.id)}
/>
```

## Estado activo

El estado activo (`isActive`) añade fondo `#EEF3FA` y borde izquierdo `3px solid
#2B52A0`. Gestionarlo externamente — el componente no mantiene estado propio.

<Canvas of={Stories.ConversationList} />
<Controls of={Stories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { ConversationItem } from './components/ConversationItem'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/ConversationItem/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-8): agregar componente ConversationItem"
```

---

## Task 3: MessageBubble

**Reference:** `ui_kits/appcenter/App.jsx` → `ChatPanel` message rendering loop
**Dependencies:** Avatar (Wave 1)
**Translation passes:**
- Own bubble (agent): bg `#2B52A0` → `--yes-color-primary`, text white → `--yes-color-primary-fg`
- Own border-radius: `12px 4px 12px 12px` (tl=12, tr=4, br=12, bl=12) — top-right is cut
- Other bubble (customer): bg `#F3F4F6` → `--yes-color-bg`, text `#111827` → `--yes-color-text`
- Other border-radius: `4px 12px 12px 12px` (tl=4, tr=12, br=12, bl=12) — top-left is cut
- Max-width: 75% of container
- Message timestamp: 11px, right-aligned, muted
  - Own: `rgba(255,255,255,0.65)` → token `--yes-color-bubble-own-time: rgba(255,255,255,0.65)`
  - Other: `#9CA3AF` → `--yes-color-text-subtle`
- Sender name (other only): 11px, `#6B7280` → `--yes-color-text-muted`, above bubble
- Avatar for other: 20px, shown left of bubble — use Avatar with style override
- Gap between bubbles: 12px
- Padding inside bubble: 10px 14px → new tokens `--yes-size-bubble-py: 10px`, `--yes-size-bubble-px: 14px`
- Font: 13px Manrope → `--yes-text-sm` (13px ✓)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/MessageBubble/MessageBubble.tsx`
- Create: `src/components/MessageBubble/MessageBubble.module.css`
- Create: `src/components/MessageBubble/MessageBubble.test.tsx`
- Create: `src/components/MessageBubble/MessageBubble.stories.tsx`
- Create: `src/components/MessageBubble/MessageBubble.mdx`
- Create: `src/components/MessageBubble/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add MessageBubble tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the ConversationItem tokens:

```css
  /* ── MessageBubble ───────────────────────────────────────── */
  --yes-size-bubble-py:          10px;
  --yes-size-bubble-px:          14px;
  --yes-color-bubble-own-time:   rgba(255, 255, 255, 0.65);
  --yes-color-bubble-other-bg:   var(--yes-color-bg);   /* #F3F4F6 */
  --yes-size-avatar-bubble:      20px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/MessageBubble/MessageBubble.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MessageBubble } from './MessageBubble'

describe('MessageBubble', () => {
  it('renders message content', () => {
    render(<MessageBubble content="Hola, ¿cómo estás?" sender="own" timestamp="09:41" />)
    expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" />)
    expect(screen.getByText('09:41')).toBeInTheDocument()
  })

  it('applies own class for sender="own"', () => {
    const { container } = render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="mb" />)
    expect(screen.getByTestId('mb').className).toMatch(/own/)
  })

  it('applies other class for sender="other"', () => {
    render(<MessageBubble content="Hola" sender="other" timestamp="09:41" data-testid="mb" />)
    expect(screen.getByTestId('mb').className).toMatch(/other/)
  })

  it('aligns own bubble to the right', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="mb" />)
    const el = screen.getByTestId('mb')
    expect(el.className).toMatch(/own/)
  })

  it('aligns other bubble to the left', () => {
    render(<MessageBubble content="Hola" sender="other" timestamp="09:41" data-testid="mb" />)
    const el = screen.getByTestId('mb')
    expect(el.className).toMatch(/other/)
  })

  it('shows avatar for sender="other" when senderName is provided', () => {
    render(
      <MessageBubble
        content="Hola"
        sender="other"
        timestamp="09:41"
        senderName="Carlos"
        senderAvatar="https://example.com/img.jpg"
      />
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('does not show avatar for sender="own"', () => {
    render(
      <MessageBubble content="Hola" sender="own" timestamp="09:41" senderName="Agente" />
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows sender name above bubble for sender="other"', () => {
    render(
      <MessageBubble content="Hola" sender="other" timestamp="09:41" senderName="Carlos Rodríguez" />
    )
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('does not show sender name for sender="own"', () => {
    render(
      <MessageBubble content="Hola" sender="own" timestamp="09:41" senderName="Agente" />
    )
    // senderName is only shown for 'other' sender
    expect(screen.queryByText('Agente')).not.toBeInTheDocument()
  })

  it('passes data-testid to root wrapper', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" data-testid="my-mb" />)
    expect(screen.getByTestId('my-mb')).toBeInTheDocument()
  })

  it('applies custom className to root wrapper', () => {
    render(<MessageBubble content="Hola" sender="own" timestamp="09:41" className="custom" data-testid="mb" />)
    expect(screen.getByTestId('mb')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/MessageBubble/MessageBubble.test.tsx` — "Cannot find module './MessageBubble'".

- [ ] **Step 4: Implement MessageBubble**

Create `src/components/MessageBubble/MessageBubble.module.css`:

```css
.wrapper {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  max-width: 100%;
}

/* ── Alignment ───────────────────────────────────────────── */
.own {
  flex-direction: row-reverse;
  margin-left: auto;
}

.other {
  flex-direction: row;
  margin-right: auto;
}

/* ── Bubble container ────────────────────────────────────── */
.bubbleGroup {
  display: flex;
  flex-direction: column;
  max-width: 75%;
  min-width: 0;
}

.own .bubbleGroup {
  align-items: flex-end;
}

.other .bubbleGroup {
  align-items: flex-start;
}

/* ── Sender name (other only) ────────────────────────────── */
.senderName {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-2xs);
  color: var(--yes-color-text-muted);
  margin-bottom: 3px;
  padding-left: 2px;
}

/* ── Bubble ──────────────────────────────────────────────── */
.bubble {
  padding: var(--yes-size-bubble-py) var(--yes-size-bubble-px);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  line-height: 1.45;
  word-break: break-word;
}

.ownBubble {
  background: var(--yes-color-primary);
  color: var(--yes-color-primary-fg);
  border-radius: 12px 4px 12px 12px;
}

.otherBubble {
  background: var(--yes-color-bubble-other-bg);
  color: var(--yes-color-text);
  border-radius: 4px 12px 12px 12px;
}

/* ── Timestamp ───────────────────────────────────────────── */
.timestamp {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-2xs);
  text-align: right;
  margin-top: 4px;
}

.ownTimestamp {
  color: var(--yes-color-bubble-own-time);
}

.otherTimestamp {
  color: var(--yes-color-text-subtle);
}
```

Create `src/components/MessageBubble/MessageBubble.tsx`:

```tsx
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import type { BaseProps } from '../../types/shared'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps extends BaseProps {
  content: string
  sender: 'own' | 'other'
  timestamp: string
  senderName?: string
  senderAvatar?: string
}

export function MessageBubble({
  content,
  sender,
  timestamp,
  senderName,
  senderAvatar,
  className,
  style,
  'data-testid': testId,
}: MessageBubbleProps) {
  const isOwn = sender === 'own'

  return (
    <div
      className={cn(styles.wrapper, isOwn ? styles.own : styles.other, className)}
      style={style}
      data-testid={testId}
    >
      {!isOwn && senderName && (
        <Avatar
          name={senderName}
          src={senderAvatar}
          style={{
            width: 'var(--yes-size-avatar-bubble)',
            height: 'var(--yes-size-avatar-bubble)',
            fontSize: 'calc(var(--yes-size-avatar-bubble) * 0.36)',
            flexShrink: 0,
          }}
        />
      )}
      <div className={styles.bubbleGroup}>
        {!isOwn && senderName && (
          <span className={styles.senderName}>{senderName}</span>
        )}
        <div className={cn(styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble)}>
          {content}
        </div>
        <span className={cn(styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp)}>
          {timestamp}
        </span>
      </div>
    </div>
  )
}
```

Create `src/components/MessageBubble/index.ts`:

```typescript
export { MessageBubble } from './MessageBubble'
export type { } from './MessageBubble'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/MessageBubble/MessageBubble.test.tsx` — 12 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/MessageBubble/MessageBubble.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MessageBubble } from './MessageBubble'

const meta: Meta<typeof MessageBubble> = {
  title: 'Wave 8 — Communication/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Burbuja de mensaje de chat. Own (agente) a la derecha, Other (cliente) a la izquierda. Reference: `ui_kits/appcenter/App.jsx` → ChatPanel.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MessageBubble>

export const OwnMessage: Story = {
  args: {
    content: 'Buenas tardes, Carlos. Con gusto te ayudo. ¿Me confirmas tu número de documento?',
    sender: 'own',
    timestamp: '09:42',
  },
}

export const OtherMessage: Story = {
  args: {
    content: 'Buenas tardes, quería preguntar por el estado de mi factura del mes pasado.',
    sender: 'other',
    timestamp: '09:41',
    senderName: 'Carlos Rodríguez',
  },
}

export const FullConversation: Story = {
  render: () => (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: '#F9FAFB', borderRadius: 8 }}>
      <MessageBubble
        content="Buenas tardes, quería preguntar por el estado de mi factura del mes pasado."
        sender="other"
        timestamp="09:41"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="Buenas tardes, Carlos. Con gusto te ayudo. ¿Me confirmas tu número de documento?"
        sender="own"
        timestamp="09:42"
      />
      <MessageBubble
        content="Sí, es 1234567890."
        sender="other"
        timestamp="09:43"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="Perfecto, Carlos. Tu factura está procesada. Tiene un saldo pendiente de $125.000 con vencimiento el 30 de mayo."
        sender="own"
        timestamp="09:44"
      />
      <MessageBubble
        content="Entendido. ¿Puedo pagar desde la app?"
        sender="other"
        timestamp="09:45"
        senderName="Carlos Rodríguez"
      />
      <MessageBubble
        content="¡Claro! Ingresa a Mi Cuenta > Pagos > Factura pendiente. El botón de pago estará disponible."
        sender="own"
        timestamp="09:46"
      />
      <MessageBubble
        content="¡Claro! Envíame el detalle por favor."
        sender="other"
        timestamp="09:47"
        senderName="Carlos Rodríguez"
      />
    </div>
  ),
}

export const WithAvatar: Story = {
  args: {
    content: 'Necesito hablar con un agente urgente.',
    sender: 'other',
    timestamp: '10:15',
    senderName: 'María Fernanda',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
  },
}

export const LongMessage: Story = {
  args: {
    content: 'Estimado cliente, le informamos que su solicitud de revisión de saldo ha sido procesada satisfactoriamente y el ajuste correspondiente se verá reflejado en su próximo estado de cuenta, aproximadamente en 3 días hábiles.',
    sender: 'own',
    timestamp: '11:00',
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 8 — Communication / MessageBubble / FullConversation`.
Open `ui_kits/appcenter/App.jsx` → render ChatPanel in a browser.
Verify side-by-side:
- Own bubbles: primary blue bg, white text, `12px 4px 12px 12px` radius (top-right clipped)
- Other bubbles: `#F3F4F6` bg, dark text, `4px 12px 12px 12px` radius (top-left clipped)
- Max-width 75% respected on long messages
- Timestamp muted and right-aligned in each bubble
- Avatar 20px appears only for 'other' messages

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/MessageBubble/MessageBubble.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as Stories from './MessageBubble.stories'

<Meta of={Stories} />

# MessageBubble

Burbuja individual de mensaje en un chat. Los mensajes del agente (`sender="own"`)
se ubican a la derecha con fondo azul primario. Los mensajes del cliente
(`sender="other"`) se ubican a la izquierda con fondo neutro.

**Referencia:** `ui_kits/appcenter/App.jsx` → ChatPanel

**Dependencias:** Avatar (Wave 1)

## Uso

```tsx
import { MessageBubble } from '@yes/ui'

// Mensaje propio (agente)
<MessageBubble content="Hola, ¿cómo puedo ayudarte?" sender="own" timestamp="09:42" />

// Mensaje del cliente
<MessageBubble
  content="Buenas tardes, tengo una consulta."
  sender="other"
  timestamp="09:41"
  senderName="Carlos Rodríguez"
/>
```

## Conversación completa

Envolver múltiples burbujas en un contenedor flex-column con gap de 12px.

<Canvas of={Stories.FullConversation} />
<Controls of={Stories.OwnMessage} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { MessageBubble } from './components/MessageBubble'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/MessageBubble/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-8): agregar componente MessageBubble"
```

---

## Task 4: PanelRich

**Reference:** `design-system-reference/preview/components-panel-rich.html` + `ui_kits/crm/CRMApp.jsx` → `DetailPanel`
**Dependencies:** Tabs (Wave 4), Avatar (Wave 1), Badge (Wave 1), Button (Wave 1)
**Translation passes:**
- Panel width: 340px → new token `--yes-size-panel-rich: 340px`
- Header padding: `14px 16px` → `--yes-space-3` (12px ≈ snap) / `--yes-space-4` (16px ✓) — use `--yes-space-3` for top and `--yes-space-4` for sides
- Avatar size: 42px → new token `--yes-size-avatar-42: 42px` (between lg=40 and new)
- Contact name: 15px, Barlow, weight 700, `#111827` → `--yes-font-heading`, `--yes-text-base` (15px? verify; add `--yes-text-panel-name: 15px`)
- Subtitle/role: 12px, `#6B7280` → `--yes-text-xs` (12px ✓), `--yes-color-text-muted` ✓
- Tab underline variant: color `#2B52A0` → `--yes-color-primary` ✓
- Tab font: 12px, weight 600 → `--yes-text-xs` ✓, `--yes-weight-semibold` ✓
- Info grid label: 11px uppercase, `#9CA3AF` → `--yes-text-2xs` ✓, `--yes-color-text-subtle` ✓
- Info grid value: 13px, `#111827` → `--yes-text-sm` ✓, `--yes-color-text` ✓
- Info grid item padding: `8px 0` with border-bottom `1px solid #F3F4F6`
- Timeline dot: 8px, `#2B52A0` border → primary color
- Timeline date: 11px, `#9CA3AF` → `--yes-text-2xs`, `--yes-color-text-subtle`
- Timeline action: 13px, `#374151` → `--yes-text-sm`, `--yes-color-text-secondary`
- Notes textarea: full width, min-height 100px, `--yes-radius-btn` border-radius, border `#E5E7EB`
- Save button: primary, full width, `mt-8px`
- Border separators: `1px solid #F3F4F6` → `--yes-color-conv-border` (already added) or `--yes-color-bg`
- Action buttons row (call, message, mail): secondary tone, gap 6px

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/PanelRich/PanelRich.tsx`
- Create: `src/components/PanelRich/PanelRich.module.css`
- Create: `src/components/PanelRich/PanelRich.test.tsx`
- Create: `src/components/PanelRich/PanelRich.stories.tsx`
- Create: `src/components/PanelRich/PanelRich.mdx`
- Create: `src/components/PanelRich/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add PanelRich tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the MessageBubble tokens:

```css
  /* ── PanelRich ───────────────────────────────────────────── */
  --yes-size-panel-rich:   340px;
  --yes-size-avatar-42:    42px;
  --yes-text-panel-name:   15px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/PanelRich/PanelRich.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PanelRich } from './PanelRich'

const defaultContact = {
  name: 'Carlos Rodríguez',
  role: 'Cliente Premium',
  status: 'success' as const,
  fields: [
    { label: 'Teléfono', value: '+57 310 555 0123' },
    { label: 'Correo', value: 'carlos@example.com' },
    { label: 'Empresa', value: 'ABC Ltda' },
  ],
}

const defaultHistory = [
  { date: '21 may 2026 · 09:42', action: 'Llamada saliente — Contactado' },
  { date: '19 may 2026 · 14:10', action: 'Mensaje WhatsApp enviado' },
]

describe('PanelRich', () => {
  it('renders contact name', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders contact role when provided', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Cliente Premium')).toBeInTheDocument()
  })

  it('renders info tab by default', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('+57 310 555 0123')).toBeInTheDocument()
  })

  it('renders all info fields in info tab', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Empresa')).toBeInTheDocument()
  })

  it('renders historial tab content when historial tab is clicked', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={defaultHistory} />)
    const historialTab = screen.getByRole('tab', { name: /historial/i })
    await user.click(historialTab)
    expect(screen.getByText('Llamada saliente — Contactado')).toBeInTheDocument()
  })

  it('renders notas tab with textarea when notas tab is clicked', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} />)
    const notasTab = screen.getByRole('tab', { name: /notas/i })
    await user.click(notasTab)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('switching tabs hides previous tab content', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={defaultHistory} />)
    // Info tab is default — Teléfono visible
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    // Switch to historial
    await user.click(screen.getByRole('tab', { name: /historial/i }))
    expect(screen.queryByText('Teléfono')).not.toBeInTheDocument()
    expect(screen.getByText('Llamada saliente — Contactado')).toBeInTheDocument()
  })

  it('calls onSaveNote with the typed text when save button is clicked', async () => {
    const user = userEvent.setup()
    const onSaveNote = vi.fn()
    render(<PanelRich contact={defaultContact} onSaveNote={onSaveNote} />)
    await user.click(screen.getByRole('tab', { name: /notas/i }))
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Cliente interesado en el plan empresarial')
    await user.click(screen.getByRole('button', { name: /guardar nota/i }))
    expect(onSaveNote).toHaveBeenCalledWith('Cliente interesado en el plan empresarial')
  })

  it('does not render history items when history is empty', async () => {
    const user = userEvent.setup()
    render(<PanelRich contact={defaultContact} history={[]} />)
    await user.click(screen.getByRole('tab', { name: /historial/i }))
    expect(screen.getByText(/sin historial/i)).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<PanelRich contact={defaultContact} data-testid="panel" />)
    expect(screen.getByTestId('panel')).toBeInTheDocument()
  })

  it('renders avatar with contact initials', () => {
    render(<PanelRich contact={defaultContact} />)
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders avatar image when avatarSrc is provided', () => {
    render(<PanelRich contact={{ ...defaultContact, avatarSrc: 'https://example.com/img.jpg' }} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/PanelRich/PanelRich.test.tsx` — "Cannot find module './PanelRich'".

- [ ] **Step 4: Implement PanelRich**

Create `src/components/PanelRich/PanelRich.module.css`:

```css
.panel {
  width: var(--yes-size-panel-rich);
  flex-shrink: 0;
  border-left: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Header ──────────────────────────────────────────────── */
.header {
  padding: 14px var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-bg);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
}

.headerInfo {
  flex: 1;
  min-width: 0;
}

.contactName {
  font-family: var(--yes-font-heading);
  font-size: var(--yes-text-panel-name);
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contactRole {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
  margin-top: 2px;
}

.badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* ── Action buttons row ──────────────────────────────────── */
.actions {
  display: flex;
  gap: 6px;
  padding: 10px var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-bg);
  flex-shrink: 0;
}

.actionBtn {
  flex: 1;
  height: var(--yes-size-height-sm);
  border-radius: var(--yes-radius-btn);
  border: 1px solid var(--yes-color-secondary-border);
  background: var(--yes-color-secondary);
  color: var(--yes-color-secondary-fg);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-btn-text-sm);
  font-weight: var(--yes-weight-semibold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Tabs area ───────────────────────────────────────────── */
.tabsBar {
  display: flex;
  border-bottom: 1px solid var(--yes-color-border);
  flex-shrink: 0;
}

.tab {
  flex: 1;
  padding: 9px 4px;
  text-align: center;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  cursor: pointer;
  color: var(--yes-color-text-muted);
  border-bottom: 2px solid transparent;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  transition: color var(--yes-duration-base) var(--yes-ease), border-color var(--yes-duration-base) var(--yes-ease);
}

.tab:hover {
  color: var(--yes-color-text);
}

.tabActive {
  color: var(--yes-color-primary);
  border-bottom-color: var(--yes-color-primary);
}

/* ── Tab content ─────────────────────────────────────────── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--yes-space-4);
}

/* ── Info tab ────────────────────────────────────────────── */
.fieldRow {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid var(--yes-color-bg);
}

.fieldRow:last-child {
  border-bottom: none;
}

.fieldLabel {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-2xs);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}

.fieldValue {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
}

/* ── Historial tab ───────────────────────────────────────── */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timelineItem {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--yes-color-bg);
}

.timelineItem:last-child {
  border-bottom: none;
}

.timelineDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--yes-color-primary);
  background: var(--yes-color-surface);
  flex-shrink: 0;
  margin-top: 3px;
}

.timelineBody {
  flex: 1;
  min-width: 0;
}

.timelineDate {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-2xs);
  color: var(--yes-color-text-subtle);
  margin-bottom: 2px;
}

.timelineAction {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
}

.emptyState {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-muted);
  text-align: center;
  padding: var(--yes-space-6) 0;
}

/* ── Notas tab ───────────────────────────────────────────── */
.notesArea {
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-2);
}

.textarea {
  width: 100%;
  min-height: 100px;
  padding: 8px 10px;
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-btn);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  resize: vertical;
  outline: none;
}

.textarea:focus {
  border-color: var(--yes-color-primary);
}

.saveBtn {
  width: 100%;
  height: var(--yes-size-height-sm);
  border-radius: var(--yes-radius-btn);
  border: none;
  background: var(--yes-color-primary);
  color: var(--yes-color-primary-fg);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-btn-text-sm);
  font-weight: var(--yes-weight-semibold);
  cursor: pointer;
}

.saveBtn:hover {
  background: var(--yes-color-primary-hover);
}
```

Create `src/components/PanelRich/PanelRich.tsx`:

```tsx
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar/Avatar'
import { Badge } from '../Badge/Badge'
import type { BaseProps } from '../../types/shared'
import styles from './PanelRich.module.css'

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'blue'
type PanelTab = 'info' | 'historial' | 'notas'

interface ContactField {
  label: string
  value: string
}

interface HistoryItem {
  date: string
  action: string
}

interface PanelContact {
  name: string
  role?: string
  status: BadgeVariant
  avatarSrc?: string
  fields: ContactField[]
}

interface PanelRichProps extends BaseProps {
  contact: PanelContact
  history?: HistoryItem[]
  onSaveNote?: (note: string) => void
}

const TAB_LABELS: Record<PanelTab, string> = {
  info:      'Info',
  historial: 'Historial',
  notas:     'Notas',
}

const STATUS_LABELS: Record<BadgeVariant, string> = {
  success: 'Activo',
  error:   'Fallido',
  warning: 'Pendiente',
  info:    'En proceso',
  neutral: 'Pausado',
  blue:    'Completado',
}

export function PanelRich({
  contact,
  history = [],
  onSaveNote,
  className,
  style,
  'data-testid': testId,
}: PanelRichProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('info')
  const [note, setNote] = useState('')

  function handleSave() {
    if (onSaveNote) onSaveNote(note)
  }

  return (
    <div
      className={cn(styles.panel, className)}
      style={style}
      data-testid={testId}
    >
      {/* Header */}
      <div className={styles.header}>
        <Avatar
          name={contact.name}
          src={contact.avatarSrc}
          style={{
            width: 'var(--yes-size-avatar-42)',
            height: 'var(--yes-size-avatar-42)',
            fontSize: 'calc(var(--yes-size-avatar-42) * 0.36)',
            flexShrink: 0,
          }}
        />
        <div className={styles.headerInfo}>
          <div className={styles.contactName}>{contact.name}</div>
          {contact.role && <div className={styles.contactRole}>{contact.role}</div>}
          <div className={styles.badges}>
            <Badge variant={contact.status} showDot={false}>
              {STATUS_LABELS[contact.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar} role="tablist">
        {(['info', 'historial', 'notas'] as PanelTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(styles.tab, activeTab === tab && styles.tabActive)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'info' && (
          <div>
            {contact.fields.map((field) => (
              <div key={field.label} className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{field.label}</span>
                <span className={styles.fieldValue}>{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'historial' && (
          <div className={styles.timeline}>
            {history.length === 0 ? (
              <p className={styles.emptyState}>Sin historial de gestiones</p>
            ) : (
              history.map((item, i) => (
                <div key={i} className={styles.timelineItem}>
                  <span className={styles.timelineDot} aria-hidden="true" />
                  <div className={styles.timelineBody}>
                    <div className={styles.timelineDate}>{item.date}</div>
                    <div className={styles.timelineAction}>{item.action}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notas' && (
          <div className={styles.notesArea}>
            <textarea
              className={styles.textarea}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Escribe una nota sobre este contacto..."
              rows={5}
            />
            {onSaveNote && (
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
                aria-label="Guardar nota"
              >
                Guardar nota
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

Create `src/components/PanelRich/index.ts`:

```typescript
export { PanelRich } from './PanelRich'
export type { } from './PanelRich'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/PanelRich/PanelRich.test.tsx` — 12 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/PanelRich/PanelRich.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { PanelRich } from './PanelRich'

const meta: Meta<typeof PanelRich> = {
  title: 'Wave 8 — Communication/PanelRich',
  component: PanelRich,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel lateral de detalle de contacto con tabs: Info, Historial, Notas. Reference: `preview/components-panel-rich.html` + `ui_kits/crm/CRMApp.jsx` → DetailPanel.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof PanelRich>

const sampleContact = {
  name: 'Carlos Rodríguez',
  role: 'Cliente Premium',
  status: 'success' as const,
  fields: [
    { label: 'Teléfono',    value: '+57 310 555 0123' },
    { label: 'Correo',      value: 'carlos@example.com' },
    { label: 'Empresa',     value: 'ABC Ltda' },
    { label: 'NIT',         value: '900.123.456-1' },
    { label: 'Ciudad',      value: 'Bogotá D.C.' },
    { label: 'Asignado a',  value: 'Ana Torres' },
  ],
}

const sampleHistory = [
  { date: '21 may 2026 · 09:42', action: 'Llamada saliente — Contactado' },
  { date: '19 may 2026 · 14:10', action: 'Mensaje WhatsApp enviado' },
  { date: '15 may 2026 · 11:00', action: 'Correo de seguimiento enviado' },
  { date: '10 may 2026 · 16:30', action: 'Llamada saliente — No contesta' },
]

export const Default: Story = {
  args: {
    contact: sampleContact,
    history: sampleHistory,
  },
}

export const InfoTab: Story = {
  args: {
    contact: sampleContact,
  },
}

export const HistorialTab: Story = {
  args: {
    contact: sampleContact,
    history: sampleHistory,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /historial/i }))
    await expect(canvas.getByText('Llamada saliente — Contactado')).toBeVisible()
  },
}

export const NotasTab: Story = {
  args: {
    contact: sampleContact,
    onSaveNote: (note) => console.info('Nota guardada:', note),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /notas/i }))
    const textarea = canvas.getByRole('textbox')
    await userEvent.type(textarea, 'Cliente interesado en plan empresarial')
    await expect(textarea).toHaveValue('Cliente interesado en plan empresarial')
  },
}

export const PendingStatus: Story = {
  args: {
    contact: {
      ...sampleContact,
      name: 'María Fernanda Gómez',
      role: 'Prospecto',
      status: 'warning' as const,
    },
    history: sampleHistory.slice(0, 2),
  },
}

export const EmptyHistory: Story = {
  args: {
    contact: sampleContact,
    history: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /historial/i }))
    await expect(canvas.getByText(/sin historial/i)).toBeVisible()
  },
}

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', height: 600, border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ flex: 1, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
          Contenido principal (tabla, lista, etc.)
        </span>
      </div>
      <PanelRich
        contact={sampleContact}
        history={sampleHistory}
        onSaveNote={(note) => console.info('Nota:', note)}
      />
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 8 — Communication / PanelRich / InContext`.
Open `design-system-reference/preview/components-panel-rich.html` at 700px.
Open `ui_kits/crm/CRMApp.jsx` → DetailPanel in a browser.
Verify:
- Panel 340px wide, white bg, left border `1px solid #E5E7EB`
- Avatar 42px, contact name 15px Barlow bold
- Tab bar underline style, active tab primary blue indicator
- Info tab: 11px uppercase label, 13px value, dividers between rows
- Historial: 8px dot with primary blue border, date 11px muted, action 13px
- Notas: full-width textarea, primary save button

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/PanelRich/PanelRich.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as Stories from './PanelRich.stories'

<Meta of={Stories} />

# PanelRich

Panel lateral de detalle de contacto. Contiene tres tabs: **Info** (campos clave
del registro), **Historial** (línea de tiempo de gestiones) y **Notas** (captura
libre de texto).

**Referencia:** `preview/components-panel-rich.html` + `ui_kits/crm/CRMApp.jsx` → DetailPanel

**Dependencias:** Avatar (Wave 1), Badge (Wave 1)

## Uso

```tsx
import { PanelRich } from '@yes/ui'

<PanelRich
  contact={{
    name: 'Carlos Rodríguez',
    role: 'Cliente Premium',
    status: 'success',
    fields: [
      { label: 'Teléfono', value: '+57 310 555 0123' },
      { label: 'Correo', value: 'carlos@example.com' },
    ],
  }}
  history={[
    { date: '21 may 2026 · 09:42', action: 'Llamada saliente — Contactado' },
  ]}
  onSaveNote={(note) => saveNote(contactId, note)}
/>
```

## Integración con Drawer

Para uso en overlay, envolver en `Drawer` (Wave 5):

```tsx
<Drawer isOpen={showPanel} onClose={() => setShowPanel(false)} placement="right">
  <PanelRich contact={selectedContact} history={contactHistory} onSaveNote={handleSave} />
</Drawer>
```

<Canvas of={Stories.InContext} />
<Controls of={Stories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { PanelRich } from './components/PanelRich'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/PanelRich/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-8): agregar componente PanelRich"
```

---

## Task 5: Wave 8 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all 4 Wave 8 component test files passing, 0 failures.
Paste the complete vitest output as evidence before marking done.

- [ ] **Step 2: Full build and dist check**

```bash
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

- [ ] **Step 3: Verify all Wave 8 exports are present**

```bash
node -e "
const { AgentStatusIndicator, ConversationItem, MessageBubble, PanelRich } = require('./dist/index.cjs');
const missing = ['AgentStatusIndicator','ConversationItem','MessageBubble','PanelRich'].filter(n => !eval(n));
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 8 exports present');
"
```

Expected: `All Wave 8 exports present`

- [ ] **Step 4: Start Storybook and do final wave sweep**

```bash
pnpm dev
```

Open each story group in order:
- Wave 8 — Communication / AgentStatusIndicator
- Wave 8 — Communication / ConversationItem
- Wave 8 — Communication / MessageBubble
- Wave 8 — Communication / PanelRich

Verify no console errors. Every composite story (`FullConversation`, `ConversationList`, `InContext`) renders correctly.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "chore(wave-8): verificación de integración completa"
```

---

## Task 6: v1.0.0 Release Checklist

This task is the final gate before tagging the library as production-ready.
All 39 components across Waves 1–8 must be verified before proceeding.

- [ ] **Step 1: Verify all 39 exports are present**

```bash
node -e "
const lib = require('./dist/index.cjs');
const expected = [
  // Wave 1
  'Icon','Avatar','Spinner','Button','Badge','ChannelBadge','Chip',
  // Wave 2
  'Input','Select','Textarea','Toggle','SearchInput','Checkbox',
  // Wave 3
  'Alert','Toast','Skeleton','EmptyState',
  // Wave 4
  'Sidebar','Tabs',
  // Wave 5
  'Modal','Drawer','FilterPanel',
  // Wave 6
  'Table','TableAdvanced','BulkActionBar','Toolbar','GroupFilter','Pagination','Card','KPICard','Widget',
  // Wave 7
  'PageHeader','SegmentedControl','ButtonToolbar','SplitButton','ColumnManager','ActionMenu','AdminBanner',
  // Wave 8
  'AgentStatusIndicator','ConversationItem','MessageBubble','PanelRich',
];
const missing = expected.filter(n => !lib[n]);
if (missing.length) { console.error('MISSING EXPORTS:', missing.join(', ')); process.exit(1); }
console.log('All 39 exports present. Library complete.');
"
```

Expected: `All 39 exports present. Library complete.`

- [ ] **Step 2: Run full test suite — all waves**

```bash
pnpm test
```

Expected: all test files passing, 0 failures across all 39 components.
Paste full vitest output as evidence — `X tests, 0 failed`.

- [ ] **Step 3: Build Storybook for production**

```bash
pnpm build-storybook
```

Expected: no errors, `storybook-static/` directory created.
Verify locally:

```bash
npx serve storybook-static
```

Open browser — all 8 wave groups visible, every story loads without console errors.

- [ ] **Step 4: Verify token completeness**

```bash
# Count --yes-* tokens in semantic.css
grep -c '\-\-yes-' src/tokens/semantic.css
```

Document the count. Ensure no component references a `--yes-*` token that does not exist in `semantic.css` or `primitives.css`.

- [ ] **Step 5: Verify consuming product has replaced at least one component per wave**

For each wave, confirm at least one component has been adopted by a product in the monorepo
(AppCenter, Dashboard, CRM, or other). Document the evidence:

| Wave | Component | Adopted in | PR / commit |
|------|-----------|------------|-------------|
| Wave 1 | Button | AppCenterFrontend | [link] |
| Wave 2 | Input | AppCenterFrontend | [link] |
| Wave 3 | Toast | Dashboard | [link] |
| Wave 4 | Sidebar | AppCenterFrontend | [link] |
| Wave 5 | Modal | CRM | [link] |
| Wave 6 | Table | CRM | [link] |
| Wave 7 | PageHeader | AppCenterFrontend | [link] |
| Wave 8 | ConversationItem | AppCenterFrontend | [link] |

Fill this table before proceeding. If a wave has no adoption, pause and align with the
product team before tagging `v1.0.0`.

- [ ] **Step 6: Typecheck clean**

```bash
pnpm typecheck
```

Expected: 0 TypeScript errors.

- [ ] **Step 7: Update package.json version and tag**

Update `version` in `package.json` from pre-release to `1.0.0`:

```bash
# Edit package.json version field to "1.0.0"
pnpm build
git add package.json src/ dist/
git commit -m "chore(release): v1.0.0 — biblioteca @yes/ui completa (39 componentes, 8 waves)"
git tag v1.0.0
```

- [ ] **Step 8: Publish (if registry configured)**

```bash
pnpm publish --access public
```

If publishing to a private registry, verify `.npmrc` credentials are set.
If publishing is gated by CI, push the tag and let the pipeline handle it:

```bash
git push origin main --tags
```

---

## Self-review notes

**Spec coverage check:**
- ✅ AgentStatusIndicator (5 states, dot + label, sm/md sizes, showLabel toggle) → Task 1
- ✅ ConversationItem (avatar+badge deps, active state, unread badge, onClick) → Task 2
- ✅ MessageBubble (own right / other left, avatar for other, timestamp, full convo story) → Task 3
- ✅ PanelRich (3 tabs, info fields, timeline, notes+save, all deps) → Task 4
- ✅ Wave 8 integration verify → Task 5
- ✅ v1.0.0 Release Checklist (39 exports, full suite, Storybook build, adoption per wave) → Task 6

**Dependency order for parallel execution:** AgentStatusIndicator (no deps) can be built in parallel with ConversationItem setup. MessageBubble depends only on Avatar (already done). PanelRich is last because it depends on Tabs (Wave 4) which must be confirmed available.

**Token additions summary:**
- `--yes-size-agent-dot: 8px`
- `--yes-size-agent-dot-sm: 6px`
- `--yes-color-agent-descanso: #7C3AED`
- `--yes-size-conv-py: 11px`
- `--yes-size-conv-px: 14px`
- `--yes-size-avatar-36: 36px`
- `--yes-text-2xs: 11px`
- `--yes-size-unread-badge: 18px`
- `--yes-color-conv-active: var(--yes-color-badge-blue)`
- `--yes-color-conv-border: var(--yes-color-bg)`
- `--yes-size-bubble-py: 10px`
- `--yes-size-bubble-px: 14px`
- `--yes-color-bubble-own-time: rgba(255, 255, 255, 0.65)`
- `--yes-color-bubble-other-bg: var(--yes-color-bg)`
- `--yes-size-avatar-bubble: 20px`
- `--yes-size-panel-rich: 340px`
- `--yes-size-avatar-42: 42px`
- `--yes-text-panel-name: 15px`

**Type consistency:** `AgentStatus`, `PanelTab`, `BadgeVariant` (PanelRich re-uses Badge's variant union locally). `Channel` type is re-declared locally in ConversationItem — matches Wave 1 ChannelBadge definition. All local unions are intentional (component-scoped).

**Storybook story highlights:**
- `MessageBubble / FullConversation` — 7 alternating bubbles showing a realistic chat thread
- `ConversationItem / ConversationList` — 5 rows with active state managed by useState, click to activate
- `PanelRich / InContext` — panel embedded next to a content area to show real side-panel usage
- All interactive stories have `play()` functions that exercise the user interaction paths
