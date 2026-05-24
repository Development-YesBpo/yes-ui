# @yes/ui Wave 6a — Data Containers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship 7 Wave 6a Data Container components — Pagination, Card, KPICard, Widget, Toolbar, GroupFilter, BulkActionBar — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Dependencies: Toolbar and BulkActionBar compose Wave 1/2 primitives (Button, Chip, SearchInput, Checkbox). Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Wave dependencies (must be built in prior waves):**
- Wave 1: `Button`, `Icon`, `Chip`
- Wave 2: `SearchInput`, `Checkbox`

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add tokens: --yes-color-selection-bg, --yes-color-selection-border,
                                                    --yes-color-selection-text, --yes-color-kpi-up,
                                                    --yes-color-kpi-down, --yes-size-bulk-bar-height,
                                                    --yes-size-toolbar-height

src/components/
├── Pagination/
│   ├── Pagination.tsx
│   ├── Pagination.module.css
│   ├── Pagination.test.tsx
│   ├── Pagination.stories.tsx
│   ├── Pagination.mdx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.module.css
│   ├── Card.test.tsx
│   ├── Card.stories.tsx
│   ├── Card.mdx
│   └── index.ts
├── KPICard/
│   ├── KPICard.tsx
│   ├── KPICard.module.css
│   ├── KPICard.test.tsx
│   ├── KPICard.stories.tsx
│   ├── KPICard.mdx
│   └── index.ts
├── Widget/
│   ├── Widget.tsx
│   ├── Widget.module.css
│   ├── Widget.test.tsx
│   ├── Widget.stories.tsx
│   ├── Widget.mdx
│   └── index.ts
├── Toolbar/
│   ├── Toolbar.tsx
│   ├── Toolbar.module.css
│   ├── Toolbar.test.tsx
│   ├── Toolbar.stories.tsx
│   ├── Toolbar.mdx
│   └── index.ts
├── GroupFilter/
│   ├── GroupFilter.tsx
│   ├── GroupFilter.module.css
│   ├── GroupFilter.test.tsx
│   ├── GroupFilter.stories.tsx
│   ├── GroupFilter.mdx
│   └── index.ts
└── BulkActionBar/
    ├── BulkActionBar.tsx
    ├── BulkActionBar.module.css
    ├── BulkActionBar.test.tsx
    ├── BulkActionBar.stories.tsx
    ├── BulkActionBar.mdx
    └── index.ts

src/index.ts                         ← uncomment 7 new exports
```

---

## Task 0: Token additions

**Files modified:** `src/tokens/semantic.css`

- [ ] **Step 1: Add missing tokens**

Append to `src/tokens/semantic.css` inside `:root`:

```css
/* ── Data containers ──────────────────────────────────────────── */
/* BulkActionBar / row selection */
--yes-color-selection-bg:     #EEF3FA;
--yes-color-selection-border: #B3C5E6;
--yes-color-selection-text:   var(--yes-color-primary);

/* KPICard delta direction */
--yes-color-kpi-up:   var(--yes-color-success);   /* #16A34A */
--yes-color-kpi-down: var(--yes-color-danger);    /* #DC2626 */

/* Component heights */
--yes-size-toolbar-height:  40px;
--yes-size-bulk-bar-height: 44px;
--yes-size-pagination-btn:  28px;
```

- [ ] **Step 2: Verify no duplicate token names**

```bash
grep -n 'yes-color-selection\|yes-color-kpi\|yes-size-toolbar\|yes-size-bulk\|yes-size-pagination' /Users/danieltibaquira/Projects/4Yes/yes-ui/src/tokens/semantic.css
```

Expected: exactly the 8 lines just added (no duplicates).

---

## Task 1: Pagination

**Reference:** `preview/components-table.html` + `preview/components-table-advanced.html` → Pagination section  
**Props:** `page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange?`

- [ ] **Step 1: Read reference**

```bash
open design-system-reference/preview/components-table-advanced.html
```

Key values: page button 28×28px, radius 5px, border `#E5E7EB`, active bg `#2B52A0`, active color `#fff`, disabled opacity 0.35, ellipsis button no border/bg.

- [ ] **Step 2: RED — write failing tests**

Create `src/components/Pagination/Pagination.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const base = { page: 1, pageSize: 20, total: 248, onPageChange: vi.fn() }

  it('renders without crashing', () => {
    render(<Pagination {...base} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows correct record info text', () => {
    render(<Pagination {...base} />)
    expect(screen.getByText(/1–20 de 248/)).toBeInTheDocument()
  })

  it('prev/first buttons disabled on page 1', () => {
    render(<Pagination {...base} />)
    expect(screen.getByLabelText('Primera página')).toBeDisabled()
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
  })

  it('next/last buttons disabled on last page', () => {
    render(<Pagination {...base} page={13} />)
    expect(screen.getByLabelText('Página siguiente')).toBeDisabled()
    expect(screen.getByLabelText('Última página')).toBeDisabled()
  })

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...base} page={2} onPageChange={onPageChange} />)
    await user.click(screen.getByLabelText('Página siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('calls onPageSizeChange when select changes', async () => {
    const user = userEvent.setup()
    const onPageSizeChange = vi.fn()
    render(<Pagination {...base} pageSizeOptions={[20, 50, 100]} onPageSizeChange={onPageSizeChange} />)
    await user.selectOptions(screen.getByRole('combobox'), '50')
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })

  it('renders page size selector only when pageSizeOptions provided', () => {
    render(<Pagination {...base} />)
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('has correct aria-label on nav', () => {
    render(<Pagination {...base} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Paginación')
  })
})
```

Run: `pnpm test` → must be RED (Pagination does not exist yet). Paste failing output as evidence.

- [ ] **Step 3: Implement**

Create `src/components/Pagination/Pagination.tsx`:

```tsx
import { useMemo } from 'react'
import { cn } from '../../utils/cn'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
  'data-testid'?: string
}

function getPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
  'data-testid': testId,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pages = useMemo(() => getPages(page, totalPages), [page, totalPages])
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <nav
      role="navigation"
      aria-label="Paginación"
      className={cn(styles.root, className)}
      data-testid={testId}
    >
      {pageSizeOptions && (
        <div className={styles.pageSize}>
          Mostrar{' '}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className={styles.select}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>{' '}
          por página
        </div>
      )}

      <span className={styles.info}>{start}–{end} de {total}</span>

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.btn}
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          aria-label="Primera página"
        >«</button>
        <button
          type="button"
          className={styles.btn}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >‹</button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={cn(styles.btn, styles.ellipsis)}>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={cn(styles.btn, page === p && styles.active)}
              onClick={() => onPageChange(p as number)}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.btn}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >›</button>
        <button
          type="button"
          className={styles.btn}
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Última página"
        >»</button>
      </div>
    </nav>
  )
}
```

Create `src/components/Pagination/Pagination.module.css`:

```css
.root {
  display: flex;
  align-items: center;
  gap: var(--yes-space-3);
  flex-wrap: wrap;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
}
.pageSize { display: flex; align-items: center; gap: var(--yes-space-1); }
.select {
  height: var(--yes-size-pagination-btn);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-btn);
  padding: 0 var(--yes-space-2);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text);
  background: var(--yes-color-surface);
}
.info { color: var(--yes-color-text-muted); white-space: nowrap; }
.nav { display: flex; gap: var(--yes-space-1); margin-left: auto; }
.btn {
  width: var(--yes-size-pagination-btn);
  height: var(--yes-size-pagination-btn);
  border-radius: var(--yes-radius-btn);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: 600;
  color: var(--yes-color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
.btn:not(:disabled):not(.active):hover {
  background: var(--yes-color-bg);
}
.active {
  background: var(--yes-color-primary);
  color: var(--yes-primitive-white);
  border-color: var(--yes-color-primary);
}
.ellipsis { border: none; background: none; cursor: default; }
```

Create `src/components/Pagination/index.ts`:

```typescript
export { Pagination } from './Pagination'
export type { PaginationProps } from './Pagination'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Pagination/Pagination.test.tsx` — 7 tests passing. Paste output.

- [ ] **Step 5: Write stories**

Create `src/components/Pagination/Pagination.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Wave 6a — Data Containers/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Control de navegación por páginas. Reference: `preview/components-table-advanced.html` → sección Pagination.' } },
  },
}
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = { args: { page: 1, pageSize: 20, total: 248, onPageChange: () => {} } }

export const WithPageSize: Story = {
  args: { page: 2, pageSize: 20, total: 248, pageSizeOptions: [20, 50, 100], onPageChange: () => {}, onPageSizeChange: () => {} },
}

export const LastPage: Story = { args: { page: 13, pageSize: 20, total: 248, onPageChange: () => {} } }

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    return <Pagination page={page} pageSize={size} total={248} pageSizeOptions={[20, 50, 100]} onPageChange={setPage} onPageSizeChange={setSize} />
  },
}
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 6a — Data Containers / Pagination / WithPageSize`.  
Open `preview/components-table-advanced.html` → Pagination section.  
Verify: page button 28×28px, radius 5px, active page `#2B52A0` bg, prev/next arrows disabled opacity on page 1.  
**Do not proceed until visual matches reference.**

- [ ] **Step 7: Write MDX docs**

Create `src/components/Pagination/Pagination.mdx`:

```mdx
import { Meta, Controls, Canvas } from '@storybook/blocks'
import * as PaginationStories from './Pagination.stories'

<Meta of={PaginationStories} />

# Pagination

Control de navegación por páginas para tablas y listas.  
Reference: `design-system-reference/preview/components-table-advanced.html` → sección Pagination.

## Cuándo usarlo

- Siempre en tablas con más de `pageSize` registros
- No usar en listas infinitas con scroll — usar scroll virtual en su lugar

<Canvas of={PaginationStories.Interactive} />
<Controls />

## Accesibilidad

- `<nav aria-label="Paginación">` envuelve el control
- Botones prev/next/first/last tienen `aria-label` descriptivo
- Página activa lleva `aria-current="page"`
```

- [ ] **Step 8: Export from src/index.ts**

```typescript
export { Pagination } from './components/Pagination'
export type { PaginationProps } from './components/Pagination'
```

- [ ] **Step 9: Build verify**

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Pagination src/index.ts src/tokens/semantic.css
git commit -m "feat(wave-6a): Pagination — paginación de tablas con tokens y tests"
```

---

## Task 2: Card

**Reference:** `preview/components-cards.html` → Card section  
**Props:** `children`, `header?`, `footer?`, `interactive?`, `className?`

- [ ] **Step 1: Read reference**

```bash
open design-system-reference/preview/components-cards.html
```

Key values: bg `#fff`, border `1px solid #E5E7EB`, radius 8px, shadow `0 1px 3px rgba(0,0,0,0.06)`, header padding 12px 16px, body padding 14px 16px, footer bg `#FAFAFA`, footer border-top `#F3F4F6`.

- [ ] **Step 2: RED — write failing tests**

Create `src/components/Card/Card.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Contenido</Card>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(<Card header="Título">Cuerpo</Card>)
    expect(screen.getByText('Título')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Card footer={<button type="button">Acción</button>}>Cuerpo</Card>)
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument()
  })

  it('does not render header section when header omitted', () => {
    const { container } = render(<Card>Cuerpo</Card>)
    expect(container.querySelector('[data-section="header"]')).toBeNull()
  })

  it('applies interactive class when interactive prop set', () => {
    const { container } = render(<Card interactive>Cuerpo</Card>)
    expect(container.firstChild).toHaveAttribute('data-interactive', 'true')
  })

  it('fires onClick when interactive and clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card interactive onClick={onClick}>Cuerpo</Card>)
    await user.click(screen.getByText('Cuerpo'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards data-testid to root', () => {
    render(<Card data-testid="my-card">Cuerpo</Card>)
    expect(screen.getByTestId('my-card')).toBeInTheDocument()
  })
})
```

Run: `pnpm test` → RED. Paste output.

- [ ] **Step 3: Implement**

Create `src/components/Card/Card.tsx`:

```tsx
import { cn } from '../../utils/cn'
import styles from './Card.module.css'

export interface CardProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function Card({ children, header, footer, interactive, onClick, className, style, 'data-testid': testId }: CardProps) {
  return (
    <div
      className={cn(styles.root, interactive && styles.interactive, className)}
      style={style}
      data-testid={testId}
      data-interactive={interactive ? 'true' : undefined}
      onClick={interactive ? onClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {header && <div data-section="header" className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}
```

Create `src/components/Card/Card.module.css`:

```css
.root {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-sm);
  overflow: hidden;
}
.interactive { cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; }
.interactive:hover { box-shadow: var(--yes-shadow-md); border-color: var(--yes-color-border-strong); }
.interactive:focus-visible { outline: 2px solid var(--yes-color-primary); outline-offset: 2px; }
.header {
  padding: var(--yes-space-3) var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-border-faint);
  font-family: var(--yes-font-heading);
  font-size: var(--yes-text-sm);
  font-weight: 700;
  color: var(--yes-color-text);
}
.body { padding: var(--yes-space-3-5) var(--yes-space-4); }
.footer {
  padding: var(--yes-space-3) var(--yes-space-4);
  border-top: 1px solid var(--yes-color-border-faint);
  background: var(--yes-color-surface-sunken);
}
```

Create `src/components/Card/index.ts`:

```typescript
export { Card } from './Card'
export type { CardProps } from './Card'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: 7 passing for Card. Paste output.

- [ ] **Step 5: Write stories**

Create `src/components/Card/Card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Wave 6a — Data Containers/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'Contenedor de superficie con header/body/footer opcionales. Reference: `preview/components-cards.html`.' } } },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = { args: { children: 'Contenido de la tarjeta.' } }

export const WithHeader: Story = { args: { header: 'Título de tarjeta', children: 'Cuerpo de la tarjeta con información relevante.' } }

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Configuración',
    children: 'Contenido principal con descripción.',
    footer: <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button type="button">Cancelar</button><button type="button">Guardar</button></div>,
  },
}

export const Interactive: Story = { args: { header: 'Tarjeta interactiva', children: 'Haz clic para seleccionar.', interactive: true, onClick: () => alert('clic') } }
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 6a — Data Containers / Card / WithHeaderAndFooter`.  
Open `preview/components-cards.html` → Card section.  
Verify: white bg, 1px `#E5E7EB` border, 8px radius, footer bg `#FAFAFA`, header 12px 16px padding, body 14px 16px padding.  
**Do not proceed until visual matches reference.**

- [ ] **Step 7: Write MDX, export, build, commit** (same pattern as Task 1 steps 7–10)

```typescript
// src/index.ts
export { Card } from './components/Card'
export type { CardProps } from './components/Card'
```

```bash
git add src/components/Card src/index.ts
git commit -m "feat(wave-6a): Card — contenedor de superficie con header/body/footer"
```

---

## Task 3: KPICard

**Reference:** `preview/components-cards.html` → KPI section; `dashboard/DashComponents.jsx` → `KpiCard`  
**Props:** `label`, `value`, `delta?`, `deltaLabel?`, `icon?: LucideIcon`, `color?`

- [ ] **Step 1: Read reference**

Key values: label 11px 700 uppercase `#9CA3AF`, value font `Barlow Semi Condensed` 32px 700, delta 12px 600 green `#16A34A` or red `#DC2626`, TrendingUp/TrendingDown icon 13px.

- [ ] **Step 2: RED — write failing tests**

Create `src/components/KPICard/KPICard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrendingUp } from 'lucide-react'
import { KPICard } from './KPICard'

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Contactos hoy" value="1.248" />)
    expect(screen.getByText('Contactos hoy')).toBeInTheDocument()
    expect(screen.getByText('1.248')).toBeInTheDocument()
  })

  it('renders delta when provided', () => {
    render(<KPICard label="Ventas" value="$920k" delta="+12%" deltaLabel="vs. ayer" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs. ayer')).toBeInTheDocument()
  })

  it('does not render delta section when delta omitted', () => {
    const { container } = render(<KPICard label="Total" value="0" />)
    expect(container.querySelector('[data-section="delta"]')).toBeNull()
  })

  it('renders icon when provided', () => {
    render(<KPICard label="Total" value="100" icon={TrendingUp} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('applies color prop to value', () => {
    const { container } = render(<KPICard label="Total" value="100" color="#2B52A0" />)
    expect(container.querySelector('[data-section="value"]')).toHaveStyle({ color: '#2B52A0' })
  })

  it('has correct data-testid', () => {
    render(<KPICard label="Test" value="0" data-testid="kpi-test" />)
    expect(screen.getByTestId('kpi-test')).toBeInTheDocument()
  })
})
```

Run: `pnpm test` → RED. Paste output.

- [ ] **Step 3: Implement**

Create `src/components/KPICard/KPICard.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import styles from './KPICard.module.css'

export interface KPICardProps {
  label: string
  value: string | number
  delta?: string
  deltaLabel?: string
  icon?: LucideIcon
  color?: string
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

function isPositiveDelta(delta: string): boolean {
  return delta.startsWith('+') || (!delta.startsWith('-') && parseFloat(delta) > 0)
}

export function KPICard({ label, value, delta, deltaLabel, icon: IconComp, color, className, style, 'data-testid': testId }: KPICardProps) {
  const positive = delta ? isPositiveDelta(delta) : null

  return (
    <div className={cn(styles.root, className)} style={style} data-testid={testId}>
      <div className={styles.labelRow}>
        {IconComp && <IconComp size={14} className={styles.icon} />}
        <span className={styles.label}>{label}</span>
      </div>
      <div data-section="value" className={styles.value} style={color ? { color } : undefined}>
        {value}
      </div>
      {delta && (
        <div data-section="delta" className={cn(styles.delta, positive ? styles.deltaUp : styles.deltaDown)}>
          {positive
            ? <TrendingUp size={13} aria-hidden />
            : <TrendingDown size={13} aria-hidden />
          }
          <span>{delta}</span>
          {deltaLabel && <span className={styles.deltaLabel}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}
```

Create `src/components/KPICard/KPICard.module.css`:

```css
.root {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-sm);
  padding: var(--yes-space-4) var(--yes-space-4-5);
  flex: 1;
}
.labelRow { display: flex; align-items: center; gap: var(--yes-space-1-5); margin-bottom: var(--yes-space-1-5); }
.icon { color: var(--yes-color-text-subtle); flex-shrink: 0; }
.label {
  font-family: var(--yes-font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--yes-color-text-subtle);
}
.value {
  font-family: var(--yes-font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--yes-color-text);
  line-height: 1;
}
.delta {
  display: flex;
  align-items: center;
  gap: var(--yes-space-1);
  margin-top: var(--yes-space-2);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: 600;
}
.deltaUp { color: var(--yes-color-kpi-up); }
.deltaDown { color: var(--yes-color-kpi-down); }
.deltaLabel { color: var(--yes-color-text-muted); font-weight: 400; }
```

Create `src/components/KPICard/index.ts`:

```typescript
export { KPICard } from './KPICard'
export type { KPICardProps } from './KPICard'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: 6 passing for KPICard. Paste output.

- [ ] **Step 5: Write stories**

```tsx
// KPICard.stories.tsx (key stories only)
export const Default: Story = { args: { label: 'Contactos hoy', value: '1.248' } }
export const WithDelta: Story = { args: { label: 'Ventas', value: '$920k', delta: '+12%', deltaLabel: 'vs. ayer' } }
export const NegativeDelta: Story = { args: { label: 'Tasa de error', value: '4.2%', delta: '-0.8%', deltaLabel: 'vs. ayer' } }
export const WithIcon: Story = { args: { label: 'Uptime', value: '99.9%', icon: Activity, delta: '+0.1%', deltaLabel: 'vs. semana pasada' } }
export const KPIRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <KPICard label="Contactos" value="1.248" delta="+18%" deltaLabel="vs. ayer" />
      <KPICard label="Conversiones" value="234" delta="-3%" deltaLabel="vs. ayer" />
      <KPICard label="Uptime" value="99.9%" color="#2B52A0" />
    </div>
  ),
}
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 6a — Data Containers / KPICard / KPIRow`.  
Open `design-system-reference/ui_kits/dashboard/DashComponents.jsx` in browser.  
Verify: `Barlow Semi Condensed` 32px value, 11px uppercase label, green/red delta with correct icon.  
**Do not proceed until visual matches reference.**

- [ ] **Step 7: Export, build, commit**

```typescript
// src/index.ts
export { KPICard } from './components/KPICard'
export type { KPICardProps } from './components/KPICard'
```

```bash
git add src/components/KPICard src/index.ts
git commit -m "feat(wave-6a): KPICard — métrica con delta y dirección de tendencia"
```

---

## Task 4: Widget

**Reference:** `preview/components-cards.html` → Widget; `dashboard/DashComponents.jsx` → `Widget`  
**Props:** `title`, `action?`, `children`, `style?`

- [ ] **Step 2: RED — write failing tests**

Create `src/components/Widget/Widget.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Widget } from './Widget'

describe('Widget', () => {
  it('renders title', () => {
    render(<Widget title="Resumen semanal"><p>contenido</p></Widget>)
    expect(screen.getByText('Resumen semanal')).toBeInTheDocument()
  })

  it('renders children in body', () => {
    render(<Widget title="Test"><span data-testid="body">cuerpo</span></Widget>)
    expect(screen.getByTestId('body')).toBeInTheDocument()
  })

  it('renders action button when action provided', () => {
    render(<Widget title="Test" action={<button type="button">Ver todo</button>}><p>x</p></Widget>)
    expect(screen.getByRole('button', { name: 'Ver todo' })).toBeInTheDocument()
  })

  it('does not render action area when action omitted', () => {
    const { container } = render(<Widget title="Test"><p>x</p></Widget>)
    expect(container.querySelector('[data-section="action"]')).toBeNull()
  })

  it('applies style prop to root', () => {
    const { container } = render(<Widget title="Test" style={{ width: 300 }}><p>x</p></Widget>)
    expect(container.firstChild).toHaveStyle({ width: '300px' })
  })
})
```

- [ ] **Step 3: Implement**

Create `src/components/Widget/Widget.tsx`:

```tsx
import { cn } from '../../utils/cn'
import styles from './Widget.module.css'

export interface WidgetProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  'data-testid'?: string
}

export function Widget({ title, action, children, style, className, 'data-testid': testId }: WidgetProps) {
  return (
    <div className={cn(styles.root, className)} style={style} data-testid={testId}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {action && <div data-section="action">{action}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
```

Create `src/components/Widget/Widget.module.css`:

```css
.root {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-sm);
  overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yes-space-3) var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-border-faint);
}
.title {
  font-family: var(--yes-font-heading);
  font-size: var(--yes-text-sm);
  font-weight: 700;
  color: var(--yes-color-text);
}
.body { padding: var(--yes-space-3-5) var(--yes-space-4); }
```

- [ ] **Step 4–10:** Run GREEN, write stories (Default with chart placeholder, WithAction with "Ver todo" link), VISUAL GATE vs `DashComponents.jsx`, MDX, export, build, commit.

```bash
git add src/components/Widget src/index.ts
git commit -m "feat(wave-6a): Widget — contenedor de dashboard con header y acción"
```

---

## Task 5: Toolbar

**Reference:** `preview/components-table.html` + `preview/components-table-advanced.html` → Toolbar section  
**Props:** `value`, `onChange`, `onFilterClick?`, `filterCount?`, `activeFilters?`, `onDismissFilter?`, `actions?: ReactNode`  
**Imports:** `SearchInput` (Wave 2), `Chip` (Wave 1), `Button` (Wave 1)

- [ ] **Step 2: RED — write failing tests**

Create `src/components/Toolbar/Toolbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toolbar } from './Toolbar'

describe('Toolbar', () => {
  it('renders search input', () => {
    render(<Toolbar value="" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('calls onChange when search input changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toolbar value="" onChange={onChange} />)
    await user.type(screen.getByRole('searchbox'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders filter button when onFilterClick provided', () => {
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument()
  })

  it('calls onFilterClick exactly once', async () => {
    const user = userEvent.setup()
    const onFilterClick = vi.fn()
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={onFilterClick} />)
    await user.click(screen.getByRole('button', { name: /filtrar/i }))
    expect(onFilterClick).toHaveBeenCalledTimes(1)
  })

  it('shows filter count badge when filterCount > 0', () => {
    render(<Toolbar value="" onChange={vi.fn()} onFilterClick={vi.fn()} filterCount={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders active filter chips', () => {
    const filters = [{ key: 'estado', label: 'Estado: Activo' }]
    render(<Toolbar value="" onChange={vi.fn()} activeFilters={filters} onDismissFilter={vi.fn()} />)
    expect(screen.getByText('Estado: Activo')).toBeInTheDocument()
  })

  it('calls onDismissFilter with correct key', async () => {
    const user = userEvent.setup()
    const onDismissFilter = vi.fn()
    const filters = [{ key: 'estado', label: 'Estado: Activo' }]
    render(<Toolbar value="" onChange={vi.fn()} activeFilters={filters} onDismissFilter={onDismissFilter} />)
    await user.click(screen.getByRole('button', { name: /eliminar filtro/i }))
    expect(onDismissFilter).toHaveBeenCalledWith('estado')
  })

  it('renders right-side actions slot', () => {
    render(<Toolbar value="" onChange={vi.fn()} actions={<button type="button">Exportar</button>} />)
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument()
  })
})
```

Run: `pnpm test` → RED. Paste output.

- [ ] **Step 3: Implement**

Create `src/components/Toolbar/Toolbar.tsx`:

```tsx
import { cn } from '../../utils/cn'
import { SearchInput } from '../SearchInput'
import { Chip } from '../Chip'
import styles from './Toolbar.module.css'

export interface ActiveFilter {
  key: string
  label: string
}

export interface ToolbarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  filterCount?: number
  activeFilters?: ActiveFilter[]
  onDismissFilter?: (key: string) => void
  actions?: React.ReactNode
  className?: string
  'data-testid'?: string
}

export function Toolbar({
  value, onChange, onFilterClick, filterCount, activeFilters, onDismissFilter, actions, className, 'data-testid': testId,
}: ToolbarProps) {
  return (
    <div className={cn(styles.root, className)} data-testid={testId}>
      <SearchInput value={value} onChange={onChange} placeholder="Buscar…" />

      {onFilterClick && (
        <button
          type="button"
          className={cn(styles.filterBtn, filterCount && filterCount > 0 && styles.filterBtnActive)}
          onClick={onFilterClick}
          aria-label={`Filtrar${filterCount ? `, ${filterCount} activos` : ''}`}
        >
          Filtrar
          {filterCount != null && filterCount > 0 && (
            <span className={styles.filterBadge}>{filterCount}</span>
          )}
        </button>
      )}

      {activeFilters?.map((f) => (
        <Chip
          key={f.key}
          onDismiss={() => onDismissFilter?.(f.key)}
          dismissAriaLabel={`Eliminar filtro ${f.label}`}
        >
          {f.label}
        </Chip>
      ))}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
```

Create `src/components/Toolbar/Toolbar.module.css`:

```css
.root {
  display: flex;
  align-items: center;
  gap: var(--yes-space-2);
  flex-wrap: wrap;
  min-height: var(--yes-size-toolbar-height);
}
.filterBtn {
  display: flex;
  align-items: center;
  gap: var(--yes-space-1);
  height: var(--yes-size-height-sm);
  padding: 0 var(--yes-space-3);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-btn);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: 600;
  color: var(--yes-color-text);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.filterBtnActive { border-color: var(--yes-color-primary); color: var(--yes-color-primary); }
.filterBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: var(--yes-radius-badge);
  background: var(--yes-color-primary);
  color: var(--yes-primitive-white);
  font-size: 10px;
  font-weight: 700;
}
.actions { margin-left: auto; display: flex; gap: var(--yes-space-1-5); align-items: center; }
```

Create `src/components/Toolbar/index.ts`:

```typescript
export { Toolbar } from './Toolbar'
export type { ToolbarProps, ActiveFilter } from './Toolbar'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: 8 passing for Toolbar. Paste output.

- [ ] **Step 5–10:** Write stories (Default, WithFilters with 2 active chips, WithActions), VISUAL GATE vs `preview/components-table-advanced.html` toolbar section (search input + Filtrar badge + chips), MDX, export, build, commit.

```bash
git add src/components/Toolbar src/index.ts
git commit -m "feat(wave-6a): Toolbar — barra de búsqueda, filtros y acciones"
```

---

## Task 6: GroupFilter

**Reference:** `preview/components-meta-filters.html` → GroupFilter section  
**Props:** `onApply`, `onClear`, `children` (filter controls as children)

- [ ] **Step 2: RED — write failing tests**

Create `src/components/GroupFilter/GroupFilter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GroupFilter } from './GroupFilter'

describe('GroupFilter', () => {
  it('renders children', () => {
    render(<GroupFilter onApply={vi.fn()} onClear={vi.fn()}><input placeholder="Buscar" /></GroupFilter>)
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument()
  })

  it('renders Aplicar and Limpiar buttons', () => {
    render(<GroupFilter onApply={vi.fn()} onClear={vi.fn()}><span /></GroupFilter>)
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument()
  })

  it('calls onApply exactly once on Aplicar click', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<GroupFilter onApply={onApply} onClear={vi.fn()}><span /></GroupFilter>)
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onClear exactly once on Limpiar click', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<GroupFilter onApply={vi.fn()} onClear={onClear}><span /></GroupFilter>)
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('forwards data-testid to root', () => {
    render(<GroupFilter onApply={vi.fn()} onClear={vi.fn()} data-testid="gf"><span /></GroupFilter>)
    expect(screen.getByTestId('gf')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Implement**

Create `src/components/GroupFilter/GroupFilter.tsx`:

```tsx
import { cn } from '../../utils/cn'
import styles from './GroupFilter.module.css'

export interface GroupFilterProps {
  onApply: () => void
  onClear: () => void
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

export function GroupFilter({ onApply, onClear, children, className, 'data-testid': testId }: GroupFilterProps) {
  return (
    <div className={cn(styles.root, className)} data-testid={testId}>
      <div className={styles.controls}>{children}</div>
      <div className={styles.footer}>
        <button type="button" className={styles.btnClear} onClick={onClear}>Limpiar</button>
        <button type="button" className={styles.btnApply} onClick={onApply}>Aplicar</button>
      </div>
    </div>
  )
}
```

Create `src/components/GroupFilter/GroupFilter.module.css`:

```css
.root {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  overflow: hidden;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yes-space-2);
  padding: var(--yes-space-3) var(--yes-space-4);
}
.footer {
  display: flex;
  gap: var(--yes-space-2);
  padding: var(--yes-space-3) var(--yes-space-4);
  border-top: 1px solid var(--yes-color-border-faint);
  background: var(--yes-color-surface-sunken);
}
.btnClear {
  flex: 1;
  height: var(--yes-size-height-md);
  border-radius: var(--yes-radius-btn);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: 600;
  color: var(--yes-color-text-muted);
  cursor: pointer;
}
.btnApply {
  flex: 2;
  height: var(--yes-size-height-md);
  border-radius: var(--yes-radius-btn);
  border: none;
  background: var(--yes-color-primary);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: 600;
  color: var(--yes-primitive-white);
  cursor: pointer;
}
.btnApply:hover { opacity: 0.9; }
```

Create `src/components/GroupFilter/index.ts`:

```typescript
export { GroupFilter } from './GroupFilter'
export type { GroupFilterProps } from './GroupFilter'
```

- [ ] **Step 4: Run tests — verify GREEN.** Paste output.

- [ ] **Step 5: Write stories**

Key stories: `Default` with two `<select>` and a date range `<input>` as children; `WithAllControls` with search + estado select + campaña select + fecha.

- [ ] **Step 6: VISUAL GATE**

Open Storybook → `GroupFilter / WithAllControls`.  
Open `preview/components-meta-filters.html` → GroupFilter section.  
Verify: footer bg `#FAFAFA`, Aplicar primary blue, Limpiar neutral border, controls row wraps correctly.  
**Do not proceed until visual matches reference.**

- [ ] **Step 7–10:** MDX, export, build, commit.

```bash
git add src/components/GroupFilter src/index.ts
git commit -m "feat(wave-6a): GroupFilter — barra de filtros unificada con Aplicar/Limpiar"
```

---

## Task 7: BulkActionBar

**Reference:** `preview/components-table-advanced.html` + `preview/components-meta-filters.html` → BulkActionBar  
**Props:** `count`, `actions: Array<{label, onClick, danger?}>`, `onClear`  
**Imports:** `Button` (Wave 1), `Checkbox` (Wave 2)

- [ ] **Step 2: RED — write failing tests**

Create `src/components/BulkActionBar/BulkActionBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BulkActionBar } from './BulkActionBar'

const actions = [
  { label: 'Asignar campaña', onClick: vi.fn() },
  { label: 'Eliminar', onClick: vi.fn(), danger: true },
]

describe('BulkActionBar', () => {
  it('renders count text', () => {
    render(<BulkActionBar count={12} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByText(/12 seleccionados/)).toBeInTheDocument()
  })

  it('renders all action buttons', () => {
    render(<BulkActionBar count={3} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Asignar campaña' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })

  it('calls action onClick exactly once', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<BulkActionBar count={3} actions={[{ label: 'Acción', onClick }]} onClear={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies danger style to danger actions', () => {
    render(<BulkActionBar count={1} actions={actions} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Eliminar' })).toHaveAttribute('data-danger', 'true')
  })

  it('renders Limpiar selección button', () => {
    render(<BulkActionBar count={1} actions={[]} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: /limpiar selección/i })).toBeInTheDocument()
  })

  it('calls onClear exactly once', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<BulkActionBar count={1} actions={[]} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: /limpiar selección/i }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('does not render when count is 0', () => {
    const { container } = render(<BulkActionBar count={0} actions={actions} onClear={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('has correct data-testid', () => {
    render(<BulkActionBar count={1} actions={[]} onClear={vi.fn()} data-testid="bulk" />)
    expect(screen.getByTestId('bulk')).toBeInTheDocument()
  })
})
```

Run: `pnpm test` → RED. Paste output.

- [ ] **Step 3: Implement**

Create `src/components/BulkActionBar/BulkActionBar.tsx`:

```tsx
import { cn } from '../../utils/cn'
import styles from './BulkActionBar.module.css'

export interface BulkAction {
  label: string
  onClick: () => void
  danger?: boolean
}

export interface BulkActionBarProps {
  count: number
  actions: BulkAction[]
  onClear: () => void
  className?: string
  'data-testid'?: string
}

export function BulkActionBar({ count, actions, onClear, className, 'data-testid': testId }: BulkActionBarProps) {
  if (count === 0) return null

  const standard = actions.filter((a) => !a.danger)
  const dangerous = actions.filter((a) => a.danger)

  return (
    <div className={cn(styles.root, className)} role="toolbar" aria-label="Acciones en lote" data-testid={testId}>
      <span className={styles.count}>{count} seleccionados</span>

      {standard.map((action) => (
        <button key={action.label} type="button" className={styles.btn} onClick={action.onClick}>
          {action.label}
        </button>
      ))}

      {dangerous.length > 0 && <div className={styles.divider} aria-hidden />}

      {dangerous.map((action) => (
        <button
          key={action.label}
          type="button"
          className={cn(styles.btn, styles.btnDanger)}
          onClick={action.onClick}
          data-danger="true"
        >
          {action.label}
        </button>
      ))}

      <button type="button" className={styles.btnClear} onClick={onClear}>
        × Limpiar selección
      </button>
    </div>
  )
}
```

Create `src/components/BulkActionBar/BulkActionBar.module.css`:

```css
.root {
  background: var(--yes-color-selection-bg);
  border: 1px solid var(--yes-color-selection-border);
  border-radius: var(--yes-radius-card);
  padding: 0 var(--yes-space-3-5);
  height: var(--yes-size-bulk-bar-height);
  display: flex;
  align-items: center;
  gap: var(--yes-space-1-5);
}
.count {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: 700;
  color: var(--yes-color-selection-text);
  min-width: 100px;
}
.btn {
  height: 28px;
  padding: 0 var(--yes-space-2-5);
  border-radius: var(--yes-radius-btn);
  border: 1px solid var(--yes-color-selection-border);
  background: var(--yes-color-surface);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: 600;
  color: var(--yes-color-selection-text);
  cursor: pointer;
  white-space: nowrap;
}
.btn:hover { opacity: 0.85; }
.btnDanger { color: var(--yes-color-danger); border-color: #FECACA; }
.divider { width: 1px; height: 18px; background: var(--yes-color-selection-border); flex-shrink: 0; }
.btnClear {
  margin-left: auto;
  background: none;
  border: none;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: 600;
  color: var(--yes-color-text-subtle);
  cursor: pointer;
  white-space: nowrap;
}
.btnClear:hover { color: var(--yes-color-text-muted); }
```

Create `src/components/BulkActionBar/index.ts`:

```typescript
export { BulkActionBar } from './BulkActionBar'
export type { BulkActionBarProps, BulkAction } from './BulkActionBar'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: 8 passing for BulkActionBar. Paste output.

- [ ] **Step 5: Write stories**

```tsx
// BulkActionBar.stories.tsx key stories
export const Default: Story = {
  args: {
    count: 12,
    actions: [
      { label: 'Asignar campaña', onClick: () => {} },
      { label: 'Cambiar estado', onClick: () => {} },
      { label: 'Exportar selección', onClick: () => {} },
      { label: 'Eliminar', onClick: () => {}, danger: true },
    ],
    onClear: () => {},
  },
}
export const Hidden: Story = { args: { count: 0, actions: [], onClear: () => {} } }
export const SingleAction: Story = { args: { count: 1, actions: [{ label: 'Eliminar', onClick: () => {}, danger: true }], onClear: () => {} } }
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

Open Storybook → `BulkActionBar / Default`.  
Open `preview/components-meta-filters.html` → BulkActionBar section.  
Verify: background `#EEF3FA`, border `#B3C5E6`, count text `#2B52A0`, divider before danger actions, clear button right-aligned muted.  
**Do not proceed until visual matches reference.**

- [ ] **Step 7–10:** MDX, export, build, commit.

```typescript
// src/index.ts
export { BulkActionBar } from './components/BulkActionBar'
export type { BulkActionBarProps, BulkAction } from './components/BulkActionBar'
```

```bash
git add src/components/BulkActionBar src/index.ts
git commit -m "feat(wave-6a): BulkActionBar — barra de acciones en selección múltiple"
```

---

## Task 8: Wave 6a integration verify

- [ ] **Step 1: Full test run**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test
```

Expected: ALL tests passing (no skips, no failures). Paste full output.

- [ ] **Step 2: Build and dist check**

```bash
pnpm build && pnpm check-dist
```

Expected: `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` all updated. No build errors.

- [ ] **Step 3: Export check**

```bash
node -e "const lib = require('./dist/index.js'); ['Pagination','Card','KPICard','Widget','Toolbar','GroupFilter','BulkActionBar'].forEach(n => { if (!lib[n]) throw new Error('Missing: ' + n); console.log('OK:', n) })"
```

Expected: 7 lines `OK: {ComponentName}`.

- [ ] **Step 4: Storybook smoke run**

```bash
pnpm dev &
sleep 8
curl -s http://localhost:6006 | grep -q 'Storybook' && echo 'Storybook UP' || echo 'FAIL'
```

- [ ] **Step 5: TypeScript check**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 6: Wave 6a complete tag commit**

```bash
git add -A
git commit -m "feat(wave-6a): integración completa — 7 componentes Data Containers verificados"
```

---

## Summary

| Component | Files | Tests | Stories | VISUAL GATE |
|-----------|-------|-------|---------|-------------|
| Pagination | 6 | 7 | 4 | `components-table-advanced.html` |
| Card | 6 | 7 | 4 | `components-cards.html` |
| KPICard | 6 | 6 | 5 | `DashComponents.jsx` KpiCard |
| Widget | 6 | 5 | 3 | `DashComponents.jsx` Widget |
| Toolbar | 6 | 8 | 3 | `components-table-advanced.html` toolbar |
| GroupFilter | 6 | 5 | 2 | `components-meta-filters.html` GroupFilter |
| BulkActionBar | 6 | 8 | 3 | `components-meta-filters.html` BulkActionBar |
| **Total** | **42** | **46** | **24** | **7 gates** |

**New tokens added:** `--yes-color-selection-bg`, `--yes-color-selection-border`, `--yes-color-selection-text`, `--yes-color-kpi-up`, `--yes-color-kpi-down`, `--yes-size-toolbar-height`, `--yes-size-bulk-bar-height`, `--yes-size-pagination-btn`
