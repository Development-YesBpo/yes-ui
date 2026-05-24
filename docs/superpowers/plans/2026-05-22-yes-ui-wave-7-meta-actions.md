# @yes/ui Wave 7 — Meta Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 7 Wave 7 Meta Action components — PageHeader, SegmentedControl, ButtonToolbar, SplitButton, ColumnManager, ActionMenu, AdminBanner — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Dependencies:**
- PageHeader uses `Button` (Wave 1)
- SplitButton uses `Button` (Wave 1)
- ActionMenu uses `Icon` (Wave 1)
- ColumnManager uses `Checkbox` (Wave 2)
- All use `Icon` (Wave 1) internally where applicable

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add missing tokens (Tasks 1–7)

src/components/
├── PageHeader/
│   ├── PageHeader.tsx
│   ├── PageHeader.module.css
│   ├── PageHeader.test.tsx
│   ├── PageHeader.stories.tsx
│   ├── PageHeader.mdx
│   └── index.ts
├── SegmentedControl/
│   ├── SegmentedControl.tsx
│   ├── SegmentedControl.module.css
│   ├── SegmentedControl.test.tsx
│   ├── SegmentedControl.stories.tsx
│   ├── SegmentedControl.mdx
│   └── index.ts
├── ButtonToolbar/
│   ├── ButtonToolbar.tsx
│   ├── ButtonToolbar.module.css
│   ├── ButtonToolbar.test.tsx
│   ├── ButtonToolbar.stories.tsx
│   ├── ButtonToolbar.mdx
│   └── index.ts
├── SplitButton/
│   ├── SplitButton.tsx
│   ├── SplitButton.module.css
│   ├── SplitButton.test.tsx
│   ├── SplitButton.stories.tsx
│   ├── SplitButton.mdx
│   └── index.ts
├── ColumnManager/
│   ├── ColumnManager.tsx
│   ├── ColumnManager.module.css
│   ├── ColumnManager.test.tsx
│   ├── ColumnManager.stories.tsx
│   ├── ColumnManager.mdx
│   └── index.ts
├── ActionMenu/
│   ├── ActionMenu.tsx
│   ├── ActionMenu.module.css
│   ├── ActionMenu.test.tsx
│   ├── ActionMenu.stories.tsx
│   ├── ActionMenu.mdx
│   └── index.ts
└── AdminBanner/
    ├── AdminBanner.tsx
    ├── AdminBanner.module.css
    ├── AdminBanner.test.tsx
    ├── AdminBanner.stories.tsx
    ├── AdminBanner.mdx
    └── index.ts

src/index.ts                         ← add 7 new named exports
```

---

## Task 1: PageHeader

**Reference:** `preview/components-meta-actions.html` — PageHeader section
**Translation passes:**
- `background: #fff` → `var(--yes-color-surface)`
- `border: 1px solid #E5E7EB` → `var(--yes-color-border)`
- `border-radius: 8px` → `var(--yes-radius-md)`
- `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` → `var(--yes-shadow-sm)`
- `padding: 0 20px` → `var(--yes-space-5)` (20px)
- breadcrumb `font-size: 12px` → `var(--yes-text-xs)` (12px)
- breadcrumb color `#9CA3AF` → `var(--yes-color-text-muted)`
- breadcrumb link `#2B52A0` → `var(--yes-color-primary)`
- `.ph-title` `font-family: Barlow; font-size: 22px; font-weight: 700; color: #111827` → `var(--yes-font-display)`, `var(--yes-text-2xl)` (add token 22px), `var(--yes-weight-bold)`, `var(--yes-color-text-default)`
- `.ph-sub` `font-size: 12px; color: #9CA3AF` → `var(--yes-text-xs)`, `var(--yes-color-text-muted)`
- breadcrumb separator `padding: 10px 0 0` → `var(--yes-space-2-5)` (add token 10px)
- `.ph-main` padding `8px 0 14px` → `var(--yes-space-2)` top, `var(--yes-space-3-5)` (add token 14px) bottom
- `.ph-actions` gap `8px` → `var(--yes-space-2)`

**New tokens needed:**
- `--yes-text-2xl: 22px` (page title)
- `--yes-space-ph-top: 10px` (breadcrumb top padding)
- `--yes-space-ph-bottom: 14px` (main section bottom padding)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/PageHeader/PageHeader.tsx`
- Create: `src/components/PageHeader/PageHeader.module.css`
- Create: `src/components/PageHeader/PageHeader.test.tsx`
- Create: `src/components/PageHeader/PageHeader.stories.tsx`
- Create: `src/components/PageHeader/PageHeader.mdx`
- Create: `src/components/PageHeader/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add PageHeader tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after existing size/text tokens:

```css
  /* ── PageHeader ──────────────────────────────────────────── */
  --yes-text-2xl:         22px;
  --yes-space-ph-top:     10px;
  --yes-space-ph-bottom:  14px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/PageHeader/PageHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="Contactos" />)
    expect(screen.getByRole('heading', { name: 'Contactos' })).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Contactos" subtitle="248 registros" />)
    expect(screen.getByText('248 registros')).toBeInTheDocument()
  })

  it('does not render subtitle when omitted', () => {
    const { queryByTestId } = render(<PageHeader title="Contactos" />)
    expect(queryByTestId('ph-subtitle')).toBeNull()
  })

  it('renders breadcrumb links', () => {
    render(
      <PageHeader
        title="Contactos"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Contactos', href: '/contactos' },
          { label: 'Carlos Rodríguez' },
        ]}
      />
    )
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contactos' })).toHaveAttribute('href', '/contactos')
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument()
  })

  it('renders last breadcrumb as plain text (no href)', () => {
    render(
      <PageHeader
        title="Detalle"
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Detalle' }]}
      />
    )
    const spans = screen.queryAllByRole('link', { name: 'Detalle' })
    expect(spans).toHaveLength(0)
  })

  it('renders actions slot', () => {
    render(
      <PageHeader
        title="Contactos"
        actions={<button>+ Nuevo contacto</button>}
      />
    )
    expect(screen.getByRole('button', { name: '+ Nuevo contacto' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<PageHeader title="T" data-testid="ph-root" />)
    expect(screen.getByTestId('ph-root')).toBeInTheDocument()
  })
})
```

Run tests — expect FAILED (component does not exist):

```bash
pnpm test -- --reporter=verbose src/components/PageHeader/PageHeader.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement PageHeader.tsx**

Create `src/components/PageHeader/PageHeader.tsx`:

```tsx
import React from 'react'
import styles from './PageHeader.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  ...rest
}: PageHeaderProps) {
  return (
    <div className={styles.root} {...rest}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.sep}>{' › '}</span>}
              {crumb.href ? (
                <a href={crumb.href} className={styles.crumbLink}>
                  {crumb.label}
                </a>
              ) : (
                <span className={styles.crumbText}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className={styles.main}>
        <div className={styles.left}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && (
            <p className={styles.subtitle} data-testid="ph-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement PageHeader.module.css**

Create `src/components/PageHeader/PageHeader.module.css`:

```css
.root {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-md);
  padding: 0 var(--yes-space-5);
  box-shadow: var(--yes-shadow-sm);
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: var(--yes-space-ph-top) 0 0;
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
}

.sep {
  margin: 0 var(--yes-space-1);
  color: var(--yes-color-text-muted);
}

.crumbLink {
  color: var(--yes-color-primary);
  text-decoration: none;
}

.crumbLink:hover {
  text-decoration: underline;
}

.crumbText {
  color: var(--yes-color-text-muted);
}

.main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yes-space-2) 0 var(--yes-space-ph-bottom);
}

.left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.title {
  font-family: var(--yes-font-display);
  font-size: var(--yes-text-2xl);
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text-default);
  line-height: 1;
  margin: 0;
}

.subtitle {
  font-size: var(--yes-text-xs);
  color: var(--yes-color-text-muted);
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--yes-space-2);
  align-items: center;
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/PageHeader/PageHeader.test.tsx
```

Paste output. All tests must show PASSED before continuing.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/PageHeader/PageHeader.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'
import { Button } from '../Button'

const meta: Meta<typeof PageHeader> = {
  title: 'Wave 7 — Meta Actions/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Encabezado estándar de página con migas de pan, título, subtítulo y acciones. Reference: `preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'Contactos',
    subtitle: '248 registros · Actualizado hace 2 min',
    breadcrumbs: [
      { label: 'Inicio', href: '#' },
      { label: 'Contactos', href: '#' },
      { label: 'Carlos Rodríguez' },
    ],
    actions: (
      <>
        <Button tone="secondary" size="sm">Exportar</Button>
        <Button tone="secondary" size="sm">Filtrar</Button>
        <Button tone="primary" size="sm">+ Nuevo contacto</Button>
      </>
    ),
  },
}

export const TitleOnly: Story = {
  args: { title: 'Gestión de campañas' },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Reportes',
    subtitle: 'Últimos 30 días',
  },
}

export const NoBreadcrumb: Story = {
  args: {
    title: 'Panel principal',
    subtitle: '5 agentes en línea',
    actions: <Button tone="primary" size="sm">+ Nuevo</Button>,
  },
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/PageHeader/PageHeader.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as PageHeaderStories from './PageHeader.stories'

<Meta of={PageHeaderStories} />

# PageHeader

Encabezado estándar de página. Combina migas de pan (breadcrumbs), título (Barlow 22px bold), subtítulo opcional y una zona de acciones a la derecha.

## Usage

```tsx
<PageHeader
  title="Contactos"
  subtitle="248 registros"
  breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Contactos' }]}
  actions={<Button tone="primary">+ Nuevo</Button>}
/>
```

## Props

<Controls of={PageHeaderStories.Default} />

## Variants

<Canvas of={PageHeaderStories.Default} />
<Canvas of={PageHeaderStories.TitleOnly} />
<Canvas of={PageHeaderStories.NoBreadcrumb} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/PageHeader/index.ts`:

```ts
export { PageHeader } from './PageHeader'
export type { PageHeaderProps, BreadcrumbItem } from './PageHeader'
```

Add to `src/index.ts`:

```ts
export { PageHeader } from './components/PageHeader'
export type { PageHeaderProps, BreadcrumbItem } from './components/PageHeader'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / PageHeader / Default`.
Open `preview/components-meta-actions.html` at 900px in a browser.
Compare side-by-side:

- Background white, 1px border, 8px radius, subtle shadow ✓
- Breadcrumb 12px muted text, links in primary blue ✓
- Title Barlow 22px bold, dark #111827 ✓
- Subtitle 12px muted ✓
- Actions flush-right, 8px gap between buttons ✓

**Do not proceed until visual match is confirmed.**

---

## Task 2: SegmentedControl

**Reference:** `preview/components-meta-actions.html` — GroupButton / Segmented control section
**Translation passes:**
- `.segment-group` `border: 1px solid #E5E7EB; border-radius: 6px; background: #F9FAFB` → `var(--yes-color-border)`, `var(--yes-radius-md)` (6px — check token; add `--yes-radius-seg: 6px` if needed), `var(--yes-color-surface-subtle)`
- `.seg-btn` `height: 32px` → add `--yes-size-seg-h: 32px`
- `.seg-btn` `padding: 0 14px` → `var(--yes-space-3-5)` (14px — add if missing)
- `.seg-btn` `font-size: 13px; font-weight: 600; color: #6B7280` → `var(--yes-text-sm)`, `var(--yes-weight-semibold)`, `var(--yes-color-text-subtle)`
- `.seg-btn` `border-right: 1px solid #E5E7EB` → `var(--yes-color-border)`
- `.seg-btn.active` `background: #fff; color: #2B52A0; box-shadow: 0 1px 3px rgba(0,0,0,0.08)` → `var(--yes-color-surface)`, `var(--yes-color-primary)`, `var(--yes-shadow-xs)`
- icon gap `5px` → `var(--yes-space-1)`

**New tokens needed:**
- `--yes-size-seg-h: 32px`
- `--yes-space-seg-px: 14px`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/SegmentedControl/SegmentedControl.tsx`
- Create: `src/components/SegmentedControl/SegmentedControl.module.css`
- Create: `src/components/SegmentedControl/SegmentedControl.test.tsx`
- Create: `src/components/SegmentedControl/SegmentedControl.stories.tsx`
- Create: `src/components/SegmentedControl/SegmentedControl.mdx`
- Create: `src/components/SegmentedControl/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add SegmentedControl tokens to semantic.css**

```css
  /* ── SegmentedControl ────────────────────────────────────── */
  --yes-size-seg-h:    32px;
  --yes-space-seg-px:  14px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/SegmentedControl/SegmentedControl.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'list', label: 'Lista' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'table', label: 'Tabla' },
]

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl options={options} value="list" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Lista' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tarjeta' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tabla' })).toBeInTheDocument()
  })

  it('marks active option with aria-pressed', () => {
    render(<SegmentedControl options={options} value="card" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Tarjeta' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with correct value on click', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="list" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tabla' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('table')
  })

  it('does not call onChange when clicking already-active option', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="list" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Lista' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root', () => {
    render(<SegmentedControl options={options} value="list" onChange={() => {}} data-testid="seg" />)
    expect(screen.getByTestId('seg')).toBeInTheDocument()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/SegmentedControl/SegmentedControl.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement SegmentedControl.tsx**

Create `src/components/SegmentedControl/SegmentedControl.tsx`:

```tsx
import styles from './SegmentedControl.module.css'

export interface SegmentOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange, ...rest }: SegmentedControlProps) {
  return (
    <div className={styles.group} role="group" aria-label="Selector de vista" {...rest}>
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.btn} ${opt.value === value ? styles.active : ''}`}
          aria-pressed={opt.value === value}
          onClick={() => { if (opt.value !== value) onChange(opt.value) }}
          data-last={i === options.length - 1 ? '' : undefined}
        >
          {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Implement SegmentedControl.module.css**

Create `src/components/SegmentedControl/SegmentedControl.module.css`:

```css
.group {
  display: inline-flex;
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-md);
  background: var(--yes-color-surface-subtle);
  overflow: hidden;
}

.btn {
  height: var(--yes-size-seg-h);
  padding: 0 var(--yes-space-seg-px);
  border: none;
  border-right: 1px solid var(--yes-color-border);
  background: transparent;
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--yes-space-1);
  transition: background 0.1s, color 0.1s;
}

.btn:last-child {
  border-right: none;
}

.btn.active {
  background: var(--yes-color-surface);
  color: var(--yes-color-primary);
  box-shadow: var(--yes-shadow-xs);
}

.icon {
  display: flex;
  align-items: center;
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/SegmentedControl/SegmentedControl.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/SegmentedControl/SegmentedControl.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Wave 7 — Meta Actions/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector de opción única agrupado. Reference: `preview/components-meta-actions.html` — GroupButton / Segmented control.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SegmentedControl>

const viewOptions = [
  { value: 'list', label: '☰ Lista' },
  { value: 'card', label: '⊞ Tarjeta' },
  { value: 'table', label: '⊟ Tabla' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('list')
    return <SegmentedControl options={viewOptions} value={value} onChange={setValue} />
  },
}

export const AllOptions: Story = {
  render: () => {
    const [value, setValue] = useState('card')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={viewOptions} value={value} onChange={setValue} />
        <SegmentedControl
          options={[
            { value: 'day', label: 'Día' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mes' },
            { value: 'year', label: 'Año' },
          ]}
          value="week"
          onChange={() => {}}
        />
      </div>
    )
  },
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/SegmentedControl/SegmentedControl.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as SegmentedControlStories from './SegmentedControl.stories'

<Meta of={SegmentedControlStories} />

# SegmentedControl

Grupo de botones mutuamente excluyentes. Un solo valor activo a la vez. El botón activo recibe fondo blanco, color primario y sombra leve.

## Usage

```tsx
const [view, setView] = useState('list')
<SegmentedControl
  options={[{ value: 'list', label: 'Lista' }, { value: 'card', label: 'Tarjeta' }]}
  value={view}
  onChange={setView}
/>
```

## Props

<Controls of={SegmentedControlStories.Default} />

<Canvas of={SegmentedControlStories.Default} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/SegmentedControl/index.ts`:

```ts
export { SegmentedControl } from './SegmentedControl'
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl'
```

Add to `src/index.ts`:

```ts
export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlProps, SegmentOption } from './components/SegmentedControl'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / SegmentedControl / Default`.
Open `preview/components-meta-actions.html` at 700px.
Compare:

- Group has 1px border, 6px radius, #F9FAFB background ✓
- Each segment 32px tall, 14px horizontal padding, 13px semibold text ✓
- Active segment: white background, primary blue text, subtle shadow ✓
- Dividers between segments (border-right) ✓
- Last segment: no right border ✓

**Do not proceed until visual match is confirmed.**

---

## Task 3: ButtonToolbar

**Reference:** `preview/components-meta-actions.html` — Button toolbar section
**Translation passes:**
- `.btn-toolbar` `border: 1px solid #E5E7EB; border-radius: 6px; background: #fff` → `var(--yes-color-border)`, `var(--yes-radius-md)`, `var(--yes-color-surface)`
- `.tb-btn` `height: 32px` → `var(--yes-size-seg-h)` (reuse 32px token from Task 2)
- `.tb-btn` `padding: 0 10px` → add `--yes-space-tb-px: 10px`
- `.tb-btn` `font-size: 12px; font-weight: 600; color: #374151` → `var(--yes-text-xs)`, `var(--yes-weight-semibold)`, `var(--yes-color-text-default)`
- `.tb-btn` `border-right: 1px solid #E5E7EB` → `var(--yes-color-border)`
- `.tb-btn:hover` `background: #F9FAFB` → `var(--yes-color-surface-subtle)`

**New tokens needed:**
- `--yes-space-tb-px: 10px`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/ButtonToolbar/ButtonToolbar.tsx`
- Create: `src/components/ButtonToolbar/ButtonToolbar.module.css`
- Create: `src/components/ButtonToolbar/ButtonToolbar.test.tsx`
- Create: `src/components/ButtonToolbar/ButtonToolbar.stories.tsx`
- Create: `src/components/ButtonToolbar/ButtonToolbar.mdx`
- Create: `src/components/ButtonToolbar/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add ButtonToolbar tokens to semantic.css**

```css
  /* ── ButtonToolbar ───────────────────────────────────────── */
  --yes-space-tb-px: 10px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/ButtonToolbar/ButtonToolbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ButtonToolbar, ToolbarButton } from './ButtonToolbar'

describe('ButtonToolbar', () => {
  it('renders children', () => {
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={() => {}}>Exportar</ToolbarButton>
        <ToolbarButton onClick={() => {}}>Filtrar</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument()
  })

  it('calls onClick on button click', async () => {
    const onClick = vi.fn()
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={onClick}>Acción</ToolbarButton>
      </ButtonToolbar>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders disabled button', () => {
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={() => {}} disabled>Deshabilitado</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('button', { name: 'Deshabilitado' })).toBeDisabled()
  })

  it('renders toolbar with correct role', () => {
    render(
      <ButtonToolbar aria-label="Acciones de tabla">
        <ToolbarButton onClick={() => {}}>A</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('toolbar', { name: 'Acciones de tabla' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(
      <ButtonToolbar data-testid="tb">
        <ToolbarButton onClick={() => {}}>B</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByTestId('tb')).toBeInTheDocument()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/ButtonToolbar/ButtonToolbar.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement ButtonToolbar.tsx**

Create `src/components/ButtonToolbar/ButtonToolbar.tsx`:

```tsx
import React from 'react'
import styles from './ButtonToolbar.module.css'

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

export function ToolbarButton({ icon, children, ...rest }: ToolbarButtonProps) {
  return (
    <button type="button" className={styles.btn} {...rest}>
      {icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  )
}

export interface ButtonToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ButtonToolbar({ children, ...rest }: ButtonToolbarProps) {
  return (
    <div className={styles.toolbar} role="toolbar" {...rest}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Implement ButtonToolbar.module.css**

Create `src/components/ButtonToolbar/ButtonToolbar.module.css`:

```css
.toolbar {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-md);
  background: var(--yes-color-surface);
  overflow: hidden;
}

.btn {
  height: var(--yes-size-seg-h);
  padding: 0 var(--yes-space-tb-px);
  border: none;
  border-right: 1px solid var(--yes-color-border);
  background: transparent;
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text-default);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--yes-space-1);
  white-space: nowrap;
  transition: background 0.1s;
}

.btn:last-child {
  border-right: none;
}

.btn:hover:not(:disabled) {
  background: var(--yes-color-surface-subtle);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btnIcon {
  display: flex;
  align-items: center;
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/ButtonToolbar/ButtonToolbar.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/ButtonToolbar/ButtonToolbar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ButtonToolbar, ToolbarButton } from './ButtonToolbar'

const meta: Meta<typeof ButtonToolbar> = {
  title: 'Wave 7 — Meta Actions/ButtonToolbar',
  component: ButtonToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Fila compacta de botones de acción agrupados con borde compartido. Reference: `preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ButtonToolbar>

export const Default: Story = {
  render: () => (
    <ButtonToolbar aria-label="Acciones de tabla">
      <ToolbarButton onClick={() => {}}>↓ Exportar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>⊟ Filtrar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>⊞ Columnas</ToolbarButton>
    </ButtonToolbar>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <ButtonToolbar aria-label="Acciones">
      <ToolbarButton onClick={() => {}}>Editar</ToolbarButton>
      <ToolbarButton onClick={() => {}} disabled>Eliminar</ToolbarButton>
      <ToolbarButton onClick={() => {}}>Duplicar</ToolbarButton>
    </ButtonToolbar>
  ),
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/ButtonToolbar/ButtonToolbar.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as ButtonToolbarStories from './ButtonToolbar.stories'

<Meta of={ButtonToolbarStories} />

# ButtonToolbar

Fila compacta de botones de acción con borde compartido. Usa `ButtonToolbar` como contenedor y `ToolbarButton` para cada acción.

## Usage

```tsx
<ButtonToolbar aria-label="Acciones de tabla">
  <ToolbarButton onClick={handleExport}>Exportar</ToolbarButton>
  <ToolbarButton onClick={handleFilter}>Filtrar</ToolbarButton>
</ButtonToolbar>
```

## Props

<Controls of={ButtonToolbarStories.Default} />

<Canvas of={ButtonToolbarStories.Default} />
<Canvas of={ButtonToolbarStories.WithDisabled} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/ButtonToolbar/index.ts`:

```ts
export { ButtonToolbar, ToolbarButton } from './ButtonToolbar'
export type { ButtonToolbarProps, ToolbarButtonProps } from './ButtonToolbar'
```

Add to `src/index.ts`:

```ts
export { ButtonToolbar, ToolbarButton } from './components/ButtonToolbar'
export type { ButtonToolbarProps, ToolbarButtonProps } from './components/ButtonToolbar'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / ButtonToolbar / Default`.
Open `preview/components-meta-actions.html` at 700px.
Compare:

- Toolbar: 1px border, 6px radius, white background ✓
- Buttons: 32px tall, 10px horizontal padding, 12px semibold text ✓
- Border-right dividers between buttons ✓
- Last button: no right border ✓
- Hover: #F9FAFB background ✓

**Do not proceed until visual match is confirmed.**

---

## Task 4: SplitButton

**Reference:** `preview/components-meta-actions.html` — Split button section
**Translation passes:**
- `.split-btn` `border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05)` → `var(--yes-radius-md)`, `var(--yes-shadow-xs)`
- `.split-main` `height: 34px; padding: 0 16px; background: #2B52A0; color: #fff; font-size: 13px; font-weight: 600` → add `--yes-size-split-h: 34px`, `var(--yes-space-4)`, `var(--yes-color-primary)`, `var(--yes-color-on-primary)`, `var(--yes-text-sm)`, `var(--yes-weight-semibold)`
- `.split-main` `border-right: 1px solid rgba(255,255,255,0.2)` → inline token `--yes-color-split-divider`
- `.split-arrow` `width: 30px` → add `--yes-size-split-arrow: 30px`
- `.split-dropdown` `top: calc(100%+4px); width: 200px; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.1)` → `var(--yes-radius-lg)`, `var(--yes-shadow-lg)`
- `.sd-item` `padding: 9px 14px; font-size: 13px; color: #374151` → add `--yes-space-sd-py: 9px`, `var(--yes-space-seg-px)`, `var(--yes-text-sm)`, `var(--yes-color-text-default)`
- `.sd-item.danger` `color: #DC2626` → `var(--yes-color-danger)`
- `.sd-divider` `height: 1px; background: #F3F4F6; margin: 4px 0` → `var(--yes-color-surface-subtle)`, `var(--yes-space-1)`

**New tokens needed:**
- `--yes-size-split-h: 34px`
- `--yes-size-split-arrow: 30px`
- `--yes-color-split-divider: rgba(255,255,255,0.2)`
- `--yes-space-sd-py: 9px`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/SplitButton/SplitButton.tsx`
- Create: `src/components/SplitButton/SplitButton.module.css`
- Create: `src/components/SplitButton/SplitButton.test.tsx`
- Create: `src/components/SplitButton/SplitButton.stories.tsx`
- Create: `src/components/SplitButton/SplitButton.mdx`
- Create: `src/components/SplitButton/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add SplitButton tokens to semantic.css**

```css
  /* ── SplitButton ─────────────────────────────────────────── */
  --yes-size-split-h:      34px;
  --yes-size-split-arrow:  30px;
  --yes-color-split-divider: rgba(255, 255, 255, 0.2);
  --yes-space-sd-py:        9px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/SplitButton/SplitButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SplitButton } from './SplitButton'

const items = [
  { label: 'Guardar y cerrar', onClick: vi.fn() },
  { label: 'Guardar y crear nuevo', onClick: vi.fn() },
  { label: 'Guardar copia', onClick: vi.fn() },
  { label: 'Descartar cambios', onClick: vi.fn(), danger: true },
]

describe('SplitButton', () => {
  it('renders main label', () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('calls onMainClick when main button clicked', async () => {
    const onMainClick = vi.fn()
    render(<SplitButton label="Guardar cambios" onMainClick={onMainClick} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(onMainClick).toHaveBeenCalledOnce()
  })

  it('dropdown is hidden by default', () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens dropdown on arrow click', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Guardar y cerrar')).toBeInTheDocument()
  })

  it('closes dropdown on Escape', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('calls item onClick and closes dropdown', async () => {
    const onClick = vi.fn()
    const testItems = [{ label: 'Opción A', onClick }]
    render(<SplitButton label="Guardar" onMainClick={() => {}} items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    await userEvent.click(screen.getByText('Opción A'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('applies danger class to danger items', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    const dangerItem = screen.getByText('Descartar cambios')
    expect(dangerItem.closest('[data-danger="true"]')).toBeInTheDocument()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/SplitButton/SplitButton.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement SplitButton.tsx**

Create `src/components/SplitButton/SplitButton.tsx`:

```tsx
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './SplitButton.module.css'

export interface SplitButtonItem {
  label: string
  onClick: () => void
  danger?: boolean
}

export interface SplitButtonProps {
  label: string
  onMainClick: () => void
  items: SplitButtonItem[]
  disabled?: boolean
  'data-testid'?: string
}

export function SplitButton({ label, onMainClick, items, disabled, ...rest }: SplitButtonProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  return (
    <div className={styles.wrap} ref={wrapRef} {...rest}>
      <div className={styles.btn}>
        <button
          type="button"
          className={styles.main}
          onClick={onMainClick}
          disabled={disabled}
        >
          {label}
        </button>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Abrir opciones"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          disabled={disabled}
        >
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </div>
      {open && (
        <div className={styles.dropdown} role="menu">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              className={`${styles.item} ${item.danger ? styles.danger : ''}`}
              data-danger={item.danger ? 'true' : undefined}
              onClick={() => { item.onClick(); setOpen(false) }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement SplitButton.module.css**

Create `src/components/SplitButton/SplitButton.module.css`:

```css
.wrap {
  position: relative;
  display: inline-block;
}

.btn {
  display: inline-flex;
  border-radius: var(--yes-radius-md);
  overflow: hidden;
  box-shadow: var(--yes-shadow-xs);
}

.main {
  height: var(--yes-size-split-h);
  padding: 0 var(--yes-space-4);
  background: var(--yes-color-primary);
  color: var(--yes-color-on-primary);
  border: none;
  border-right: 1px solid var(--yes-color-split-divider);
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  cursor: pointer;
  transition: opacity 0.1s;
}

.main:hover:not(:disabled) {
  opacity: 0.92;
}

.main:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.arrow {
  height: var(--yes-size-split-h);
  width: var(--yes-size-split-arrow);
  background: var(--yes-color-primary);
  color: var(--yes-color-on-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s;
}

.arrow:hover:not(:disabled) {
  opacity: 0.92;
}

.arrow:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-lg);
  box-shadow: var(--yes-shadow-lg);
  width: 200px;
  padding: var(--yes-space-1) 0;
  z-index: var(--yes-z-dropdown);
}

.item {
  display: block;
  width: 100%;
  padding: var(--yes-space-sd-py) var(--yes-space-seg-px);
  text-align: left;
  background: none;
  border: none;
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-default);
  cursor: pointer;
  transition: background 0.1s;
}

.item:hover {
  background: var(--yes-color-surface-subtle);
}

.danger {
  color: var(--yes-color-danger);
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/SplitButton/SplitButton.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/SplitButton/SplitButton.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SplitButton } from './SplitButton'

const meta: Meta<typeof SplitButton> = {
  title: 'Wave 7 — Meta Actions/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón primario con dropdown de variantes. Reference: `preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SplitButton>

const saveItems = [
  { label: 'Guardar y cerrar', onClick: () => {} },
  { label: 'Guardar y crear nuevo', onClick: () => {} },
  { label: 'Guardar copia', onClick: () => {} },
  { label: 'Descartar cambios', onClick: () => {}, danger: true },
]

export const Default: Story = {
  args: {
    label: 'Guardar cambios',
    onMainClick: () => {},
    items: saveItems,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Guardar cambios',
    onMainClick: () => {},
    items: saveItems,
    disabled: true,
  },
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/SplitButton/SplitButton.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as SplitButtonStories from './SplitButton.stories'

<Meta of={SplitButtonStories} />

# SplitButton

Acción principal combinada con un dropdown de variantes. El botón izquierdo ejecuta la acción primaria; el chevron abre el menú de opciones.

## Usage

```tsx
<SplitButton
  label="Guardar cambios"
  onMainClick={handleSave}
  items={[
    { label: 'Guardar y cerrar', onClick: handleSaveClose },
    { label: 'Descartar cambios', onClick: handleDiscard, danger: true },
  ]}
/>
```

## Props

<Controls of={SplitButtonStories.Default} />

<Canvas of={SplitButtonStories.Default} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/SplitButton/index.ts`:

```ts
export { SplitButton } from './SplitButton'
export type { SplitButtonProps, SplitButtonItem } from './SplitButton'
```

Add to `src/index.ts`:

```ts
export { SplitButton } from './components/SplitButton'
export type { SplitButtonProps, SplitButtonItem } from './components/SplitButton'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / SplitButton / Default`. Click the chevron arrow.
Open `preview/components-meta-actions.html` at 700px.
Compare:

- Primary blue combined button, 34px tall ✓
- White divider between main and arrow sections ✓
- Dropdown: white, 8px radius, 200px wide, shadow ✓
- Items: 9px vertical padding, 13px text ✓
- Danger item rendered in red ✓
- Escape closes dropdown ✓

**Do not proceed until visual match is confirmed.**

---

## Task 5: ColumnManager

**Reference:** `preview/components-meta-actions.html` — ColumnManager section
**Translation passes:**
- `.col-manager` `border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.12); width: 210px` → `var(--yes-color-border)`, add `--yes-radius-xl: 10px`, `var(--yes-shadow-xl)`, add `--yes-size-cm-w: 210px`
- `.cm-header` `padding: 10px 14px 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: #9CA3AF; border-bottom: 1px solid #F3F4F6` → add `--yes-size-cm-text: 11px`, `var(--yes-weight-bold)`, `var(--yes-color-text-muted)`, `var(--yes-color-surface-subtle)`
- `.cm-row` `padding: 7px 14px; font-size: 13px; color: #374151` → add `--yes-space-cm-py: 7px`, `var(--yes-text-sm)`, `var(--yes-color-text-default)`
- `.cm-row:hover` `background: #F9FAFB` → `var(--yes-color-surface-subtle)`
- `.cm-row.locked` `color: #9CA3AF` → `var(--yes-color-text-muted)`
- `.cm-drag` `color: #D1D5DB` → `var(--yes-color-border-strong)` (add if needed)
- `.cm-footer` `padding: 8px 14px; border-top: 1px solid #F3F4F6`
- `.cm-reset` `color: #6B7280` → `var(--yes-color-text-subtle)`
- `.cm-apply` `color: #2B52A0` → `var(--yes-color-primary)`

**New tokens needed:**
- `--yes-radius-xl: 10px`
- `--yes-shadow-xl: 0 8px 20px rgba(0,0,0,0.12)`
- `--yes-size-cm-w: 210px`
- `--yes-size-cm-text: 11px`
- `--yes-space-cm-py: 7px`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/ColumnManager/ColumnManager.tsx`
- Create: `src/components/ColumnManager/ColumnManager.module.css`
- Create: `src/components/ColumnManager/ColumnManager.test.tsx`
- Create: `src/components/ColumnManager/ColumnManager.stories.tsx`
- Create: `src/components/ColumnManager/ColumnManager.mdx`
- Create: `src/components/ColumnManager/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add ColumnManager tokens to semantic.css**

```css
  /* ── ColumnManager ───────────────────────────────────────── */
  --yes-radius-xl:    10px;
  --yes-shadow-xl:    0 8px 20px rgba(0, 0, 0, 0.12);
  --yes-size-cm-w:    210px;
  --yes-size-cm-text: 11px;
  --yes-space-cm-py:  7px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/ColumnManager/ColumnManager.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ColumnManager } from './ColumnManager'

const columns = [
  { key: 'name', label: 'Contacto', visible: true, locked: true },
  { key: 'phone', label: 'Teléfono', visible: true },
  { key: 'campaign', label: 'Campaña', visible: true },
  { key: 'email', label: 'Correo electrónico', visible: false },
]

describe('ColumnManager', () => {
  it('renders panel header "Columnas visibles"', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByText('Columnas visibles')).toBeInTheDocument()
  })

  it('renders all column labels', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
  })

  it('locked column checkbox is disabled', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    const contactoCheckbox = screen.getByRole('checkbox', { name: 'Contacto' })
    expect(contactoCheckbox).toBeDisabled()
  })

  it('calls onVisibilityChange on checkbox toggle', async () => {
    const onVisibilityChange = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={onVisibilityChange} onApply={() => {}} onReset={() => {}} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Teléfono' }))
    expect(onVisibilityChange).toHaveBeenCalledOnce()
    expect(onVisibilityChange).toHaveBeenCalledWith('phone', false)
  })

  it('calls onApply when Aplicar clicked', async () => {
    const onApply = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={onApply} onReset={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(onApply).toHaveBeenCalledOnce()
  })

  it('calls onReset when Restablecer clicked', async () => {
    const onReset = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: 'Restablecer' }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('unchecked column shows unchecked checkbox', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByRole('checkbox', { name: 'Correo electrónico' })).not.toBeChecked()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/ColumnManager/ColumnManager.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement ColumnManager.tsx**

Create `src/components/ColumnManager/ColumnManager.tsx`:

```tsx
import React from 'react'
import styles from './ColumnManager.module.css'

export interface ColumnDef {
  key: string
  label: string
  visible: boolean
  locked?: boolean
}

export interface ColumnManagerProps {
  columns: ColumnDef[]
  onVisibilityChange: (key: string, visible: boolean) => void
  onApply: () => void
  onReset: () => void
  'data-testid'?: string
}

export function ColumnManager({ columns, onVisibilityChange, onApply, onReset, ...rest }: ColumnManagerProps) {
  return (
    <div className={styles.panel} {...rest}>
      <div className={styles.header}>Columnas visibles</div>
      <ul className={styles.list}>
        {columns.map(col => (
          <li
            key={col.key}
            className={`${styles.row} ${col.locked ? styles.locked : ''}`}
          >
            <input
              type="checkbox"
              id={`cm-col-${col.key}`}
              checked={col.visible}
              disabled={col.locked}
              aria-label={col.label}
              onChange={e => onVisibilityChange(col.key, e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor={`cm-col-${col.key}`} className={styles.label}>
              {col.label}
            </label>
            {!col.locked && (
              <span className={styles.drag} aria-hidden="true">⠿</span>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={onReset}>
          Restablecer
        </button>
        <button type="button" className={styles.apply} onClick={onApply}>
          Aplicar
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement ColumnManager.module.css**

Create `src/components/ColumnManager/ColumnManager.module.css`:

```css
.panel {
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-xl);
  box-shadow: var(--yes-shadow-xl);
  width: var(--yes-size-cm-w);
  overflow: hidden;
}

.header {
  padding: 10px 14px 8px;
  font-size: var(--yes-size-cm-text);
  font-weight: var(--yes-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--yes-color-text-muted);
  border-bottom: 1px solid var(--yes-color-surface-subtle);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: var(--yes-space-2);
  padding: var(--yes-space-cm-py) 14px;
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-default);
  cursor: pointer;
  transition: background 0.1s;
}

.row:hover {
  background: var(--yes-color-surface-subtle);
}

.row.locked {
  color: var(--yes-color-text-muted);
  cursor: default;
}

.checkbox {
  accent-color: var(--yes-color-primary);
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

.row.locked .checkbox {
  opacity: 0.5;
  cursor: not-allowed;
}

.label {
  flex: 1;
  cursor: inherit;
}

.drag {
  color: var(--yes-color-border);
  font-size: var(--yes-text-sm);
  margin-left: auto;
  cursor: grab;
  flex-shrink: 0;
}

.footer {
  border-top: 1px solid var(--yes-color-surface-subtle);
  padding: var(--yes-space-2) 14px;
  display: flex;
  justify-content: space-between;
}

.reset,
.apply {
  background: none;
  border: none;
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  cursor: pointer;
  padding: 0;
}

.reset {
  color: var(--yes-color-text-subtle);
}

.apply {
  color: var(--yes-color-primary);
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/ColumnManager/ColumnManager.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/ColumnManager/ColumnManager.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ColumnManager } from './ColumnManager'
import type { ColumnDef } from './ColumnManager'

const meta: Meta<typeof ColumnManager> = {
  title: 'Wave 7 — Meta Actions/ColumnManager',
  component: ColumnManager,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Panel de control de visibilidad y orden de columnas de tabla. Reference: `preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ColumnManager>

const initialColumns: ColumnDef[] = [
  { key: 'name', label: 'Contacto', visible: true, locked: true },
  { key: 'phone', label: 'Teléfono', visible: true },
  { key: 'campaign', label: 'Campaña', visible: true },
  { key: 'channel', label: 'Canal', visible: true },
  { key: 'email', label: 'Correo electrónico', visible: false },
  { key: 'lastGest', label: 'Última gestión', visible: true },
]

export const Default: Story = {
  render: () => {
    const [cols, setCols] = useState(initialColumns)
    return (
      <ColumnManager
        columns={cols}
        onVisibilityChange={(key, visible) =>
          setCols(prev => prev.map(c => c.key === key ? { ...c, visible } : c))
        }
        onApply={() => {}}
        onReset={() => setCols(initialColumns)}
      />
    )
  },
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/ColumnManager/ColumnManager.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as ColumnManagerStories from './ColumnManager.stories'

<Meta of={ColumnManagerStories} />

# ColumnManager

Panel para controlar la visibilidad y el orden de columnas de una tabla. La primera columna siempre está bloqueada (checkbox deshabilitado).

## Usage

```tsx
<ColumnManager
  columns={columns}
  onVisibilityChange={(key, visible) => toggleColumn(key, visible)}
  onApply={applyColumnState}
  onReset={resetColumns}
/>
```

## Props

<Controls of={ColumnManagerStories.Default} />

<Canvas of={ColumnManagerStories.Default} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/ColumnManager/index.ts`:

```ts
export { ColumnManager } from './ColumnManager'
export type { ColumnManagerProps, ColumnDef } from './ColumnManager'
```

Add to `src/index.ts`:

```ts
export { ColumnManager } from './components/ColumnManager'
export type { ColumnManagerProps, ColumnDef } from './components/ColumnManager'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / ColumnManager / Default`.
Open `preview/components-meta-actions.html` at 700px.
Compare:

- Panel: 210px wide, 10px radius, shadow ✓
- Header: "COLUMNAS VISIBLES" 11px uppercase muted ✓
- Rows: 7px vertical padding, 13px text, hover bg subtle ✓
- Locked row (Contacto): muted text, disabled checkbox ✓
- Drag handle ⠿ on unlocked rows, right-aligned ✓
- Footer: "Restablecer" gray, "Aplicar" primary blue ✓

**Do not proceed until visual match is confirmed.**

---

## Task 6: ActionMenu

**Reference:** `preview/components-meta-actions.html` — ActionMenu section
**Translation passes:**
- `.action-menu-trigger` `width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E5E7EB` → add `--yes-size-am-trigger: 32px`, `var(--yes-radius-md)`, `var(--yes-color-border)`
- `.action-menu` `top: calc(100%+4px); width: 190px; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.1)` → `var(--yes-radius-lg)`, `var(--yes-shadow-xl)`, add `--yes-size-am-w: 190px`
- `.am-item` `padding: 8px 14px; font-size: 13px; color: #374151` → `var(--yes-space-2)`, `var(--yes-space-seg-px)`, `var(--yes-text-sm)`, `var(--yes-color-text-default)`
- `.am-item:hover` `background: #F9FAFB` → `var(--yes-color-surface-subtle)`
- `.am-item.danger` `color: #DC2626` → `var(--yes-color-danger)`
- `.am-item-icon` `color: #9CA3AF; width: 16px` → `var(--yes-color-text-muted)`
- `.am-section-label` `padding: 6px 14px 2px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #9CA3AF` → `var(--yes-color-text-muted)`
- `.am-divider` `height: 1px; background: #F3F4F6; margin: 4px 0` → `var(--yes-color-surface-subtle)`

**New tokens needed:**
- `--yes-size-am-trigger: 32px`
- `--yes-size-am-w: 190px`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/ActionMenu/ActionMenu.tsx`
- Create: `src/components/ActionMenu/ActionMenu.module.css`
- Create: `src/components/ActionMenu/ActionMenu.test.tsx`
- Create: `src/components/ActionMenu/ActionMenu.stories.tsx`
- Create: `src/components/ActionMenu/ActionMenu.mdx`
- Create: `src/components/ActionMenu/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add ActionMenu tokens to semantic.css**

```css
  /* ── ActionMenu ──────────────────────────────────────────── */
  --yes-size-am-trigger: 32px;
  --yes-size-am-w:       190px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/ActionMenu/ActionMenu.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ActionMenu } from './ActionMenu'
import type { ActionMenuItem } from './ActionMenu'

const items: ActionMenuItem[] = [
  { label: 'Editar', onClick: vi.fn() },
  { label: 'Duplicar', onClick: vi.fn() },
  { label: 'Ver historial', onClick: vi.fn(), section: 'Más acciones' },
  { label: 'Eliminar', onClick: vi.fn(), danger: true },
]

describe('ActionMenu', () => {
  it('renders trigger button', () => {
    render(<ActionMenu items={items} />)
    expect(screen.getByRole('button', { name: 'Más acciones' })).toBeInTheDocument()
  })

  it('menu is closed by default', () => {
    render(<ActionMenu items={items} />)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens menu on trigger click', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('renders all item labels', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Duplicar')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  it('renders section label', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByText('Más acciones')).toBeInTheDocument()
  })

  it('danger item has danger class', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    const eliminar = screen.getByRole('menuitem', { name: 'Eliminar' })
    expect(eliminar).toHaveAttribute('data-danger', 'true')
  })

  it('calls onClick exactly once per item click', async () => {
    const onClick = vi.fn()
    const testItems: ActionMenuItem[] = [{ label: 'Acción', onClick }]
    render(<ActionMenu items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('closes menu after item click', async () => {
    const testItems: ActionMenuItem[] = [{ label: 'Acción', onClick: vi.fn() }]
    render(<ActionMenu items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Acción' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes menu on Escape key', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes menu on outside click', async () => {
    render(
      <div>
        <ActionMenu items={items} />
        <button>Fuera</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Fuera' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/ActionMenu/ActionMenu.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement ActionMenu.tsx**

Create `src/components/ActionMenu/ActionMenu.tsx`:

```tsx
import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import styles from './ActionMenu.module.css'

export interface ActionMenuItem {
  label: string
  icon?: React.ElementType
  onClick: () => void
  danger?: boolean
  section?: string
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  trigger?: React.ReactNode
  'data-testid'?: string
}

export function ActionMenu({ items, trigger, ...rest }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  // Group items by section
  const sections: Array<{ label?: string; items: ActionMenuItem[] }> = []
  for (const item of items) {
    const sectionLabel = item.section
    const last = sections[sections.length - 1]
    if (!last || last.label !== sectionLabel) {
      sections.push({ label: sectionLabel, items: [item] })
    } else {
      last.items.push(item)
    }
  }

  return (
    <div className={styles.wrap} ref={wrapRef} {...rest}>
      {trigger ? (
        <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      ) : (
        <button
          type="button"
          className={styles.trigger}
          aria-label="Más acciones"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <MoreVertical size={16} strokeWidth={1.75} />
        </button>
      )}
      {open && (
        <div className={styles.menu} role="menu">
          {sections.map((section, si) => (
            <React.Fragment key={si}>
              {section.label && (
                <div className={styles.sectionLabel}>{section.label}</div>
              )}
              {si > 0 && !section.label && (
                <div className={styles.divider} aria-hidden="true" />
              )}
              {section.items.map((item, ii) => {
                const IconComp = item.icon
                return (
                  <button
                    key={ii}
                    type="button"
                    role="menuitem"
                    className={`${styles.item} ${item.danger ? styles.danger : ''}`}
                    data-danger={item.danger ? 'true' : undefined}
                    onClick={() => { item.onClick(); setOpen(false) }}
                  >
                    {IconComp && (
                      <span className={styles.itemIcon}>
                        <IconComp size={14} strokeWidth={1.75} />
                      </span>
                    )}
                    {item.label}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement ActionMenu.module.css**

Create `src/components/ActionMenu/ActionMenu.module.css`:

```css
.wrap {
  position: relative;
  display: inline-block;
}

.trigger {
  width: var(--yes-size-am-trigger);
  height: var(--yes-size-am-trigger);
  border-radius: var(--yes-radius-md);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--yes-color-text-subtle);
  transition: background 0.1s;
}

.trigger:hover {
  background: var(--yes-color-surface-subtle);
}

.menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: var(--yes-z-dropdown);
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-lg);
  box-shadow: var(--yes-shadow-xl);
  width: var(--yes-size-am-w);
  padding: var(--yes-space-1) 0;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--yes-space-2);
  width: 100%;
  padding: var(--yes-space-2) 14px;
  text-align: left;
  background: none;
  border: none;
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-default);
  cursor: pointer;
  transition: background 0.1s;
}

.item:hover {
  background: var(--yes-color-surface-subtle);
}

.danger {
  color: var(--yes-color-danger);
}

.itemIcon {
  display: flex;
  align-items: center;
  color: var(--yes-color-text-muted);
  width: 16px;
  flex-shrink: 0;
}

.sectionLabel {
  padding: 6px 14px 2px;
  font-size: 10px;
  font-weight: var(--yes-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--yes-color-text-muted);
}

.divider {
  height: 1px;
  background: var(--yes-color-surface-subtle);
  margin: var(--yes-space-1) 0;
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/ActionMenu/ActionMenu.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/ActionMenu/ActionMenu.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Pencil, Copy, Clock, Trash2 } from 'lucide-react'
import { ActionMenu } from './ActionMenu'

const meta: Meta<typeof ActionMenu> = {
  title: 'Wave 7 — Meta Actions/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Menú contextual disparado por botón ⋯. Reference: `preview/components-meta-actions.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ActionMenu>

export const Default: Story = {
  args: {
    items: [
      { label: 'Editar', icon: Pencil, onClick: () => {} },
      { label: 'Duplicar', icon: Copy, onClick: () => {} },
      { label: 'Ver historial', icon: Clock, onClick: () => {}, section: 'Más acciones' },
      { label: 'Eliminar', icon: Trash2, onClick: () => {}, danger: true },
    ],
  },
}

export const WithSections: Story = {
  args: {
    items: [
      { label: 'Editar contacto', onClick: () => {} },
      { label: 'Asignar agente', onClick: () => {} },
      { label: 'Exportar datos', onClick: () => {}, section: 'Exportar' },
      { label: 'Eliminar registro', onClick: () => {}, danger: true },
    ],
  },
}

export const NoDanger: Story = {
  args: {
    items: [
      { label: 'Ver detalle', onClick: () => {} },
      { label: 'Copiar enlace', onClick: () => {} },
      { label: 'Compartir', onClick: () => {} },
    ],
  },
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/ActionMenu/ActionMenu.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as ActionMenuStories from './ActionMenu.stories'

<Meta of={ActionMenuStories} />

# ActionMenu

Menú contextual disparado por botón ⋯ (moreVertical). Cierra al hacer clic fuera o presionar Escape. Los ítems peligrosos se renderizan en rojo.

## Usage

```tsx
<ActionMenu
  items={[
    { label: 'Editar', onClick: handleEdit },
    { label: 'Eliminar', onClick: handleDelete, danger: true },
  ]}
/>
```

## Props

<Controls of={ActionMenuStories.Default} />

## Variants

<Canvas of={ActionMenuStories.Default} />
<Canvas of={ActionMenuStories.WithSections} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/ActionMenu/index.ts`:

```ts
export { ActionMenu } from './ActionMenu'
export type { ActionMenuProps, ActionMenuItem } from './ActionMenu'
```

Add to `src/index.ts`:

```ts
export { ActionMenu } from './components/ActionMenu'
export type { ActionMenuProps, ActionMenuItem } from './components/ActionMenu'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / ActionMenu / Default`. Click the ⋯ trigger.
Open `preview/components-meta-actions.html` at 700px.
Compare:

- Trigger: 32px square, 6px radius, 1px border ✓
- Panel: 190px wide, 8px radius, shadow ✓
- Items: 8px 14px padding, 13px text ✓
- Hover: #F9FAFB background ✓
- Section label: 10px uppercase muted ✓
- Danger item: #DC2626 red ✓
- Closes on Escape ✓
- Closes on outside click ✓

**Do not proceed until visual match is confirmed.**

---

## Task 7: AdminBanner

**Reference:** `preview/components-admin-banner.html` — 4 variant banners
**Translation passes:**
- `.banner` `display: flex; align-items: center; gap: 10px; padding: 0 14px; height: 40px; border-radius: 6px; border-left: 4px solid` → `var(--yes-space-2-5)` (10px gap), `var(--yes-space-3-5)` (14px px), add `--yes-size-banner-h: 40px`, `var(--yes-radius-md)`, `--yes-size-banner-border: 4px`
- `.b-pill` `border-radius: 9999px; padding: 2px 8px; font-size: 11px; font-weight: 700` → `var(--yes-radius-full)`, `var(--yes-size-cm-text)` (11px), `var(--yes-weight-bold)`
- `.b-dot` `width: 5px; height: 5px; border-radius: 50%` → add `--yes-size-banner-dot: 5px`
- `.b-text` `font-size: 13px; font-weight: 500` → `var(--yes-text-sm)`, `var(--yes-weight-medium)`
- `.b-btn` `height: 26px; padding: 0 12px; border-radius: 5px; font-size: 12px; font-weight: 700` → add `--yes-size-banner-btn-h: 26px`, `var(--yes-space-3)` (12px), `var(--yes-radius-sm)`, `var(--yes-text-xs)`, `var(--yes-weight-bold)`

**Variant color map:**

| Variant | bg | border | text | pill bg | pill border | pill text | btn bg | btn color |
|---------|----|---------|----|---------|-------------|-----------|--------|-----------|
| amber | #FFFBEB | #F59E0B | #78350F | #FEF3C7 | #FCD34D | #92400E | #F59E0B | #fff |
| blue | #EEF3FA | #2B52A0 | #1E3A8A | #D8E3F4 | #B3C5E6 | #2B52A0 | #2B52A0 | #fff |
| neutral | #F9FAFB | #9CA3AF | #374151 | #E5E7EB | #D1D5DB | #4B5563 | #fff | #374151, border #D1D5DB |
| red | #FFF1F1 | #DC2626 | #7F1D1D | #FEE2E2 | #FECACA | #DC2626 | #DC2626 | #fff |

**New tokens needed:**
- `--yes-size-banner-h: 40px`
- `--yes-size-banner-border: 4px`
- `--yes-size-banner-dot: 5px`
- `--yes-size-banner-btn-h: 26px`
- `--yes-color-amber-bg: #FFFBEB`
- `--yes-color-amber-border: #F59E0B`
- `--yes-color-amber-text: #78350F`
- `--yes-color-amber-pill-bg: #FEF3C7`
- `--yes-color-amber-pill-border: #FCD34D`
- `--yes-color-amber-pill-text: #92400E`
- `--yes-color-blue-bg: #EEF3FA`
- `--yes-color-blue-text: #1E3A8A`
- `--yes-color-blue-pill-bg: #D8E3F4`
- `--yes-color-blue-pill-border: #B3C5E6`
- `--yes-color-red-bg: #FFF1F1`
- `--yes-color-red-text: #7F1D1D`
- `--yes-color-red-pill-bg: #FEE2E2`
- `--yes-color-red-pill-border: #FECACA`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/AdminBanner/AdminBanner.tsx`
- Create: `src/components/AdminBanner/AdminBanner.module.css`
- Create: `src/components/AdminBanner/AdminBanner.test.tsx`
- Create: `src/components/AdminBanner/AdminBanner.stories.tsx`
- Create: `src/components/AdminBanner/AdminBanner.mdx`
- Create: `src/components/AdminBanner/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add AdminBanner tokens to semantic.css**

```css
  /* ── AdminBanner ─────────────────────────────────────────── */
  --yes-size-banner-h:        40px;
  --yes-size-banner-border:   4px;
  --yes-size-banner-dot:      5px;
  --yes-size-banner-btn-h:    26px;

  /* amber */
  --yes-color-amber-bg:          #FFFBEB;
  --yes-color-amber-border:      #F59E0B;
  --yes-color-amber-text:        #78350F;
  --yes-color-amber-pill-bg:     #FEF3C7;
  --yes-color-amber-pill-border: #FCD34D;
  --yes-color-amber-pill-text:   #92400E;

  /* blue (banner) */
  --yes-color-banner-blue-bg:          #EEF3FA;
  --yes-color-banner-blue-text:        #1E3A8A;
  --yes-color-banner-blue-pill-bg:     #D8E3F4;
  --yes-color-banner-blue-pill-border: #B3C5E6;

  /* red (banner) */
  --yes-color-banner-red-bg:          #FFF1F1;
  --yes-color-banner-red-text:        #7F1D1D;
  --yes-color-banner-red-pill-bg:     #FEE2E2;
  --yes-color-banner-red-pill-border: #FECACA;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/AdminBanner/AdminBanner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AdminBanner } from './AdminBanner'

describe('AdminBanner', () => {
  it('renders amber variant', () => {
    render(
      <AdminBanner
        variant="amber"
        message="Viendo como Laura Cifuentes · Bogotá"
        badge="Asesora CRM"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByText('Viendo como Laura Cifuentes · Bogotá')).toBeInTheDocument()
    expect(screen.getByText('Asesora CRM')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument()
  })

  it('renders blue variant', () => {
    render(
      <AdminBanner
        variant="blue"
        message="Acceso limitado · 18 agentes visibles"
        badge="Coordinador"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'blue')
  })

  it('renders neutral variant', () => {
    render(
      <AdminBanner
        variant="neutral"
        message="Sin permisos de escritura · activo hasta las 18:00"
        badge="LECTURA"
        onAction={() => {}}
        actionLabel="Volver"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'neutral')
    expect(screen.getByText('LECTURA')).toBeInTheDocument()
  })

  it('renders red variant', () => {
    render(
      <AdminBanner
        variant="red"
        message="Acceso irrestricto al sistema · 234 usuarios en línea"
        badge="SUPERADMIN"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'red')
  })

  it('calls onAction exactly once on button click', async () => {
    const onAction = vi.fn()
    render(
      <AdminBanner
        variant="amber"
        message="Mensaje de prueba"
        onAction={onAction}
        actionLabel="Salir"
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('renders message text', () => {
    render(
      <AdminBanner variant="red" message="Acceso irrestricto" onAction={() => {}} />
    )
    expect(screen.getByText('Acceso irrestricto')).toBeInTheDocument()
  })

  it('renders without badge when omitted', () => {
    render(
      <AdminBanner variant="neutral" message="Solo lectura" onAction={() => {}} actionLabel="Volver" />
    )
    expect(screen.queryByTestId('banner-pill')).toBeNull()
  })
})
```

Run — expect FAILED:

```bash
pnpm test -- --reporter=verbose src/components/AdminBanner/AdminBanner.test.tsx
```

Paste output before continuing.

- [ ] **Step 3: Implement AdminBanner.tsx**

Create `src/components/AdminBanner/AdminBanner.tsx`:

```tsx
import React from 'react'
import styles from './AdminBanner.module.css'

export type AdminBannerVariant = 'amber' | 'blue' | 'neutral' | 'red'

const ICONS: Record<AdminBannerVariant, string> = {
  amber:   '⚠',
  blue:    '◈',
  neutral: 'ℹ',
  red:     '⚡',
}

export interface AdminBannerProps {
  variant: AdminBannerVariant
  badge?: string
  message: string
  onAction: () => void
  actionLabel?: string
  'data-testid'?: string
}

export function AdminBanner({
  variant,
  badge,
  message,
  onAction,
  actionLabel = 'Salir',
  ...rest
}: AdminBannerProps) {
  const hasDot = variant === 'amber' || variant === 'red'

  return (
    <div
      className={`${styles.banner} ${styles[variant]}`}
      data-variant={variant}
      data-testid="banner-root"
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">{ICONS[variant]}</span>
      {badge && (
        <span className={styles.pill} data-testid="banner-pill">
          {hasDot && <span className={styles.dot} aria-hidden="true" />}
          {badge}
        </span>
      )}
      <span className={styles.text}>{message}</span>
      <button type="button" className={styles.btn} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Implement AdminBanner.module.css**

Create `src/components/AdminBanner/AdminBanner.module.css`:

```css
.banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: var(--yes-size-banner-h);
  border-radius: var(--yes-radius-md);
  border-left: var(--yes-size-banner-border) solid;
  overflow: hidden;
}

.icon {
  font-size: 14px;
  flex-shrink: 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--yes-space-1);
  border-radius: var(--yes-radius-full);
  padding: 2px var(--yes-space-2);
  font-size: var(--yes-size-cm-text);
  font-weight: var(--yes-weight-bold);
  flex-shrink: 0;
  white-space: nowrap;
  border: 1px solid;
}

.dot {
  width: var(--yes-size-banner-dot);
  height: var(--yes-size-banner-dot);
  border-radius: 50%;
  flex-shrink: 0;
}

.text {
  flex: 1;
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-medium);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn {
  flex-shrink: 0;
  height: var(--yes-size-banner-btn-h);
  padding: 0 var(--yes-space-3);
  border-radius: var(--yes-radius-sm);
  font-family: var(--yes-font-body);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-bold);
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

/* ── Amber ──────────────────────────────────── */
.amber {
  background: var(--yes-color-amber-bg);
  border-color: var(--yes-color-amber-border);
  color: var(--yes-color-amber-text);
}
.amber .pill {
  background: var(--yes-color-amber-pill-bg);
  border-color: var(--yes-color-amber-pill-border);
  color: var(--yes-color-amber-pill-text);
}
.amber .dot { background: var(--yes-color-amber-border); }
.amber .text { color: var(--yes-color-amber-pill-text); }
.amber .btn {
  background: var(--yes-color-amber-border);
  color: var(--yes-color-on-primary);
  border: none;
}

/* ── Blue ───────────────────────────────────── */
.blue {
  background: var(--yes-color-banner-blue-bg);
  border-color: var(--yes-color-primary);
  color: var(--yes-color-banner-blue-text);
}
.blue .pill {
  background: var(--yes-color-banner-blue-pill-bg);
  border-color: var(--yes-color-banner-blue-pill-border);
  color: var(--yes-color-primary);
}
.blue .text { color: var(--yes-color-primary); }
.blue .btn {
  background: var(--yes-color-primary);
  color: var(--yes-color-on-primary);
  border: none;
}

/* ── Neutral ────────────────────────────────── */
.neutral {
  background: var(--yes-color-surface-subtle);
  border-color: var(--yes-color-text-muted);
  color: var(--yes-color-text-default);
}
.neutral .pill {
  background: var(--yes-color-border);
  border-color: var(--yes-color-border-strong, #D1D5DB);
  color: #4B5563;
  border-radius: var(--yes-radius-sm);
  letter-spacing: 0.04em;
}
.neutral .text { color: var(--yes-color-text-subtle); }
.neutral .btn {
  background: var(--yes-color-surface);
  color: var(--yes-color-text-default);
  border: 1px solid var(--yes-color-border-strong, #D1D5DB);
}

/* ── Red ────────────────────────────────────── */
.red {
  background: var(--yes-color-banner-red-bg);
  border-color: var(--yes-color-danger);
  color: var(--yes-color-banner-red-text);
}
.red .pill {
  background: var(--yes-color-banner-red-pill-bg);
  border-color: var(--yes-color-banner-red-pill-border);
  color: var(--yes-color-danger);
  border-radius: var(--yes-radius-sm);
}
.red .dot { background: var(--yes-color-danger); }
.red .text { color: #991B1B; }
.red .btn {
  background: var(--yes-color-danger);
  color: var(--yes-color-on-primary);
  border: none;
}
```

- [ ] **Step 5: Run tests — expect GREEN**

```bash
pnpm test -- --reporter=verbose src/components/AdminBanner/AdminBanner.test.tsx
```

Paste output. All tests must show PASSED.

- [ ] **Step 6: Write Storybook stories**

Create `src/components/AdminBanner/AdminBanner.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AdminBanner } from './AdminBanner'

const meta: Meta<typeof AdminBanner> = {
  title: 'Wave 7 — Meta Actions/AdminBanner',
  component: AdminBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Banner de estado de sistema a nivel de página. 4 variantes: amber (impersonación), blue (simulación de rol), neutral (solo lectura), red (superadmin). Reference: `preview/components-admin-banner.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof AdminBanner>

export const Amber: Story = {
  args: {
    variant: 'amber',
    badge: 'Asesora CRM',
    message: 'Viendo como Laura Cifuentes · Bogotá',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    badge: 'Coordinador',
    message: 'Acceso limitado · 18 agentes visibles',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    badge: 'LECTURA',
    message: 'Sin permisos de escritura · activo hasta las 18:00',
    actionLabel: 'Volver',
    onAction: () => {},
  },
}

export const Red: Story = {
  args: {
    variant: 'red',
    badge: 'SUPERADMIN',
    message: 'Acceso irrestricto al sistema · 234 usuarios en línea',
    actionLabel: 'Salir',
    onAction: () => {},
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AdminBanner variant="amber" badge="Asesora CRM" message="Viendo como Laura Cifuentes · Bogotá" actionLabel="Salir" onAction={() => {}} />
      <AdminBanner variant="blue" badge="Coordinador" message="Acceso limitado · 18 agentes visibles" actionLabel="Salir" onAction={() => {}} />
      <AdminBanner variant="neutral" badge="LECTURA" message="Sin permisos de escritura · activo hasta las 18:00" actionLabel="Volver" onAction={() => {}} />
      <AdminBanner variant="red" badge="SUPERADMIN" message="Acceso irrestricto al sistema · 234 usuarios en línea" actionLabel="Salir" onAction={() => {}} />
    </div>
  ),
}
```

- [ ] **Step 7: Write MDX doc**

Create `src/components/AdminBanner/AdminBanner.mdx`:

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as AdminBannerStories from './AdminBanner.stories'

<Meta of={AdminBannerStories} />

# AdminBanner

Banner de estado de sistema a nivel de página. Aparece en la parte superior de la vista para indicar un estado especial de sesión: impersonación, simulación de rol, modo solo lectura o sesión de superadministrador.

## Variants

| Variant | Context | Icon |
|---------|---------|------|
| `amber` | Impersonación de usuario | ⚠ |
| `blue` | Simulación de rol | ◈ |
| `neutral` | Modo solo lectura | ℹ |
| `red` | Sesión de superadministrador | ⚡ |

## Usage

```tsx
<AdminBanner
  variant="amber"
  badge="Asesora CRM"
  message="Viendo como Laura Cifuentes · Bogotá"
  actionLabel="Salir"
  onAction={handleExitImpersonation}
/>
```

## Props

<Controls of={AdminBannerStories.Amber} />

## All Variants

<Canvas of={AdminBannerStories.AllVariants} />
```

- [ ] **Step 8: Create index.ts and register export**

Create `src/components/AdminBanner/index.ts`:

```ts
export { AdminBanner } from './AdminBanner'
export type { AdminBannerProps, AdminBannerVariant } from './AdminBanner'
```

Add to `src/index.ts`:

```ts
export { AdminBanner } from './components/AdminBanner'
export type { AdminBannerProps, AdminBannerVariant } from './components/AdminBanner'
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 7 — Meta Actions / AdminBanner / AllVariants`.
Open `preview/components-admin-banner.html` in a browser.
Compare all 4 variants side-by-side:

- Height: 40px for all variants ✓
- Border-left: 4px solid, variant color ✓
- Amber: #FFFBEB background, amber pill with dot, amber button ✓
- Blue: #EEF3FA background, blue pill (no dot), blue button ✓
- Neutral: #F9FAFB background, gray pill with square radius, white button with border ✓
- Red: #FFF1F1 background, red pill with dot, red button ✓
- Message: 13px, truncates with ellipsis on overflow ✓

**Do not proceed until visual match is confirmed.**

---

## Task 8: Wave 7 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all 7 Wave 7 component test files passing, 0 failures.
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
All dist files present.
```

- [ ] **Step 3: Verify all Wave 7 exports are present**

```bash
node -e "
const lib = require('./dist/index.cjs');
const names = ['PageHeader','SegmentedControl','ButtonToolbar','SplitButton','ColumnManager','ActionMenu','AdminBanner'];
const missing = names.filter(n => !lib[n]);
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 7 exports present');
"
```

Expected: `All Wave 7 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
pnpm dev
```

Open each story group in order:

- Wave 7 — Meta Actions / PageHeader
- Wave 7 — Meta Actions / SegmentedControl
- Wave 7 — Meta Actions / ButtonToolbar
- Wave 7 — Meta Actions / SplitButton
- Wave 7 — Meta Actions / ColumnManager
- Wave 7 — Meta Actions / ActionMenu
- Wave 7 — Meta Actions / AdminBanner

Verify no console errors. Every `AllVariants` / `Default` story renders without errors.

- [ ] **Step 5: Tag Wave 7 release**

Update `version` in `package.json` — bump minor (e.g. `0.7.0`).

```bash
git add src/ docs/
git commit -m "feat(wave-7): agregar componentes de meta-acciones — PageHeader, SegmentedControl, ButtonToolbar, SplitButton, ColumnManager, ActionMenu, AdminBanner"
git tag v0.7.0
```

---

## Self-review notes

**Spec coverage check:**
- ✅ PageHeader (breadcrumb + title + subtitle + actions) → Task 1
- ✅ SegmentedControl (mutually exclusive, aria-pressed, onChange) → Task 2
- ✅ ButtonToolbar (compact toolbar, ToolbarButton, disabled) → Task 3
- ✅ SplitButton (primary action + dropdown, Escape, danger items) → Task 4
- ✅ ColumnManager (visible/locked columns, onVisibilityChange, Restablecer, Aplicar) → Task 5
- ✅ ActionMenu (⋯ trigger, sections, danger, closes on Escape + outside click) → Task 6
- ✅ AdminBanner (4 variants, badge, message, onAction) → Task 7
- ✅ Wave 7 integration verify → Task 8

**Test coverage highlights:**
- ActionMenu: closes on Escape ✓, closes on outside click ✓, danger items `data-danger="true"` ✓, onClick fires exactly once ✓
- AdminBanner: all 4 variants render ✓, onAction fires once ✓, message renders ✓, badge optional ✓
- SplitButton: closes on Escape ✓, danger items ✓, dropdown hidden by default ✓

**Type consistency:**
- `AdminBannerVariant` is a local union — not shared (component-specific).
- `ActionMenuItem` uses `React.ElementType` for icon — compatible with lucide-react components.
- `SegmentOption.value` is `string` — caller is responsible for unique values.

**Dependency note:**
- `SplitButton` and `ActionMenu` share `useEffect` for Escape + outside-click close — pattern is identical by design (no shared hook extracted to keep components self-contained at wave boundary).

**Placeholder scan:** Clean — all steps have complete code.
