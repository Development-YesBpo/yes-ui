# @yes/ui Wave 1 — Atoms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 7 Wave 1 Atom components — Icon, Avatar, Spinner, Button, Badge, ChannelBadge, Chip — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Spinner is built before Button because Button imports it. Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
design-system-reference/incoming/
├── .gitkeep
└── README.md                        ← handoff protocol docs

src/tokens/semantic.css              ← add missing tokens (Tasks 2–4, 7)

src/components/
├── Icon/
│   ├── Icon.tsx
│   ├── Icon.test.tsx
│   ├── Icon.stories.tsx
│   ├── Icon.mdx
│   └── index.ts
├── Avatar/
│   ├── Avatar.tsx
│   ├── Avatar.module.css
│   ├── Avatar.test.tsx
│   ├── Avatar.stories.tsx
│   ├── Avatar.mdx
│   └── index.ts
├── Spinner/
│   ├── Spinner.tsx
│   ├── Spinner.module.css
│   ├── Spinner.test.tsx
│   ├── Spinner.stories.tsx
│   ├── Spinner.mdx
│   └── index.ts
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   ├── Button.mdx
│   └── index.ts
├── Badge/
│   ├── Badge.tsx
│   ├── Badge.module.css
│   ├── Badge.test.tsx
│   ├── Badge.stories.tsx
│   ├── Badge.mdx
│   └── index.ts
├── ChannelBadge/
│   ├── ChannelBadge.tsx
│   ├── ChannelBadge.module.css
│   ├── ChannelBadge.test.tsx
│   ├── ChannelBadge.stories.tsx
│   ├── ChannelBadge.mdx
│   └── index.ts
└── Chip/
    ├── Chip.tsx
    ├── Chip.module.css
    ├── Chip.test.tsx
    ├── Chip.stories.tsx
    ├── Chip.mdx
    └── index.ts

src/index.ts                         ← uncomment export per component
package.json                         ← add lucide-react dependency
```

---

## Task 0: Incoming folder + handoff protocol

**Files:**
- Create: `design-system-reference/incoming/.gitkeep`
- Create: `design-system-reference/incoming/README.md`

- [ ] **Step 1: Create the incoming directory and placeholder**

```bash
mkdir -p design-system-reference/incoming
touch design-system-reference/incoming/.gitkeep
```

- [ ] **Step 2: Write the handoff protocol README**

Create `design-system-reference/incoming/README.md`:

```markdown
# Design Handoff — Incoming

This folder receives output from Claude Design sessions.

## How to use

1. Generate a component or variation using Claude Design with the
   `design-system-reference/` content as system context.

2. Drop the generated file(s) here:
   - HTML preview card → `incoming/components-{name}.html`
   - JSX prototype     → `incoming/{name}.jsx`

3. Review the file. Open it in a browser (HTML) or inspect the JSX.
   Ask: does it match YES BPO's visual language? Are states complete?

4. Approve: move the file to its permanent location:
   - HTML → `preview/components-{name}.html`
   - JSX  → `ui_kits/{product}/` (or create a new product subfolder)

5. Tell Claude Code: "translate design-system-reference/preview/components-{name}.html"

6. Claude Code runs translation passes, builds the component, runs tests,
   builds the story, and stops at the VISUAL GATE for your sign-off.

## Translation tolerance rules
- Colors: exact hex match required. No rounding.
- Heights/radii: ±2px tolerance → snap to nearest token.
- Spacing/padding: ±4px tolerance → snap to nearest token.
- Values outside tolerance: add a new --yes-* token to semantic.css first.

## Do not commit approved files back into incoming/
This folder is a transit area only.
```

- [ ] **Step 3: Commit**

```bash
git add design-system-reference/incoming/
git commit -m "chore: agregar carpeta incoming para handoff de diseño"
```

---

## Task 1: Icon

**Reference:** `ui_kits/appcenter/Components.jsx` → `Icon` function
**Approach:** Wrap `lucide-react` icons with consistent stroke defaults and a11y handling.
No CSS module needed — lucide-react renders its own SVG.

**Files:**
- Modify: `package.json` (add lucide-react)
- Create: `src/components/Icon/Icon.tsx`
- Create: `src/components/Icon/Icon.test.tsx`
- Create: `src/components/Icon/Icon.stories.tsx`
- Create: `src/components/Icon/Icon.mdx`
- Create: `src/components/Icon/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Install lucide-react**

```bash
pnpm add lucide-react
```

Expected: `lucide-react` appears in `dependencies` in `package.json`.

- [ ] **Step 2: Write failing tests**

Create `src/components/Icon/Icon.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { X } from 'lucide-react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders an svg element', () => {
    render(<Icon icon={X} aria-label="Cerrar" />)
    expect(screen.getByRole('img', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('applies aria-hidden when no aria-label provided', () => {
    const { container } = render(<Icon icon={X} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('passes data-testid to the svg', () => {
    render(<Icon icon={X} aria-label="test" data-testid="my-icon" />)
    expect(screen.getByTestId('my-icon')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    render(<Icon icon={X} size={24} aria-label="test" />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('applies custom className', () => {
    render(<Icon icon={X} aria-label="test" className="custom" />)
    expect(screen.getByRole('img')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected output: `FAIL src/components/Icon/Icon.test.tsx` with "Cannot find module './Icon'".

- [ ] **Step 4: Implement Icon**

Create `src/components/Icon/Icon.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import type { BaseProps } from '../../types/shared'

interface IconProps extends BaseProps {
  icon: LucideIcon
  size?: number
  strokeWidth?: number
  color?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

export function Icon({
  icon: LucideComponent,
  size = 16,
  strokeWidth = 1.75,
  color = 'currentColor',
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const hidden = ariaHidden ?? !ariaLabel

  return (
    <LucideComponent
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
      style={style}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={hidden}
      role={ariaLabel ? 'img' : undefined}
    />
  )
}
```

Create `src/components/Icon/index.ts`:

```typescript
export { Icon } from './Icon'
export type { } from './Icon'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Icon/Icon.test.tsx` — 5 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Icon/Icon.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { X, Check, AlertCircle, Info, ChevronRight, Plus, Search, Filter } from 'lucide-react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Wave 1 — Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
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
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
# Start Storybook if not running
pnpm dev
```

Open Storybook → `Wave 1 — Atoms / Icon / CommonIcons`.
Verify: icons are stroke-only (no fill), strokeWidth appears consistent (~1.75px).
Compare against Lucide's own docs — they should match.

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Icon/Icon.mdx`:

```mdx
import { Meta, Controls, Story, Canvas } from '@storybook/blocks'
import * as IconStories from './Icon.stories'

<Meta of={IconStories} />

# Icon

Envuelve un ícono de [Lucide React](https://lucide.dev) con los defaults visuales de YES BPO:
stroke de 1.75px, `currentColor`. Maneja `aria-label` / `aria-hidden` automáticamente.

**Referencia:** `ui_kits/appcenter/Components.jsx` → función `Icon`

## Uso

```tsx
import { Icon } from '@yes/ui'
import { Check } from 'lucide-react'

<Icon icon={Check} size={20} aria-label="Confirmado" />
```

Sin `aria-label`, el ícono se oculta a lectores de pantalla (`aria-hidden="true"`).
Con `aria-label`, se expone como `role="img"`.

<Canvas of={IconStories.CommonIcons} />
<Controls of={IconStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Icon } from './components/Icon'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/Icon/ src/index.ts package.json pnpm-lock.yaml
git commit -m "feat(wave-1): agregar componente Icon (lucide wrapper)"
```

---

## Task 2: Avatar

**Reference:** `ui_kits/appcenter/Components.jsx` → `Avatar` + `avatarColor`
**Translation passes:**
- `size * 0.36` for font-size → hardcoded ratio, keep as formula
- `letterSpacing: '-0.02em'` → `--yes-tracking-tight`
- `fontWeight: 700` → `--yes-weight-bold`
- Colors: 7 from brand palette (already in primitives)
- New tokens needed: `--yes-size-avatar-sm/md/lg`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Avatar/Avatar.tsx`
- Create: `src/components/Avatar/Avatar.module.css`
- Create: `src/components/Avatar/Avatar.test.tsx`
- Create: `src/components/Avatar/Avatar.stories.tsx`
- Create: `src/components/Avatar/Avatar.mdx`
- Create: `src/components/Avatar/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add avatar tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the `--yes-size-drawer-lg` line:

```css
  /* ── Avatar ──────────────────────────────────────────────── */
  --yes-size-avatar-sm: 24px;
  --yes-size-avatar-md: 32px;
  --yes-size-avatar-lg: 40px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Avatar/Avatar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials from a full name', () => {
    render(<Avatar name="Carlos Rodríguez" />)
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders initials from a single name', () => {
    render(<Avatar name="Carlos" />)
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders initials uppercased', () => {
    render(<Avatar name="maría fernanda" />)
    expect(screen.getByText('MF')).toBeInTheDocument()
  })

  it('uses at most 2 initials', () => {
    render(<Avatar name="Juan Carlos Pérez Gómez" />)
    expect(screen.getByText('JC')).toBeInTheDocument()
  })

  it('renders sm size', () => {
    render(<Avatar name="Test" size="sm" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-sm)' })
  })

  it('renders md size by default', () => {
    render(<Avatar name="Test" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-md)' })
  })

  it('renders lg size', () => {
    render(<Avatar name="Test" size="lg" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-lg)' })
  })

  it('shows image when src is provided', () => {
    render(<Avatar name="Test" src="https://example.com/img.jpg" alt="Foto de Test" />)
    expect(screen.getByRole('img', { name: 'Foto de Test' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<Avatar name="Test" data-testid="my-avatar" />)
    expect(screen.getByTestId('my-avatar')).toBeInTheDocument()
  })

  it('produces consistent color for the same name', () => {
    const { container: c1 } = render(<Avatar name="Carlos" data-testid="a1" />)
    const { container: c2 } = render(<Avatar name="Carlos" data-testid="a2" />)
    const bg1 = (c1.firstChild as HTMLElement).style.backgroundColor
    const bg2 = (c2.firstChild as HTMLElement).style.backgroundColor
    expect(bg1).toBe(bg2)
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL src/components/Avatar/Avatar.test.tsx` — "Cannot find module './Avatar'".

- [ ] **Step 4: Implement Avatar**

Create `src/components/Avatar/Avatar.module.css`:

```css
.avatar {
  border-radius: 50%;
  color: var(--yes-primitive-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--yes-font-sans);
  font-weight: var(--yes-weight-bold);
  letter-spacing: var(--yes-tracking-tight);
  overflow: hidden;
  user-select: none;
}

.sm {
  width: var(--yes-size-avatar-sm);
  height: var(--yes-size-avatar-sm);
  font-size: calc(var(--yes-size-avatar-sm) * 0.36);
}

.md {
  width: var(--yes-size-avatar-md);
  height: var(--yes-size-avatar-md);
  font-size: calc(var(--yes-size-avatar-md) * 0.36);
}

.lg {
  width: var(--yes-size-avatar-lg);
  height: var(--yes-size-avatar-lg);
  font-size: calc(var(--yes-size-avatar-lg) * 0.36);
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Create `src/components/Avatar/Avatar.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import type { Size } from '../../types/shared'
import styles from './Avatar.module.css'

const AVATAR_COLORS = [
  '#2B52A0', '#16A34A', '#D97706', '#7C3AED',
  '#0891B2', '#BE185D', '#0F766E', '#DC2626',
]

function avatarColor(name: string): string {
  let h = 0
  for (const ch of name) h = ((h << 5) - h) + ch.charCodeAt(0)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

interface AvatarProps extends BaseProps {
  name: string
  size?: Size
  src?: string
  alt?: string
}

export function Avatar({
  name,
  size = 'md',
  src,
  alt,
  className,
  style,
  'data-testid': testId,
}: AvatarProps) {
  const sizeVar = `var(--yes-size-avatar-${size})`

  return (
    <div
      className={cn(styles.avatar, styles[size], className)}
      style={{ backgroundColor: src ? undefined : avatarColor(name), width: sizeVar, height: sizeVar, ...style }}
      data-testid={testId}
      aria-label={!src ? name : undefined}
    >
      {src ? (
        <img src={src} alt={alt ?? name} className={styles.img} />
      ) : (
        initials(name)
      )}
    </div>
  )
}
```

Create `src/components/Avatar/index.ts`:

```typescript
export { Avatar } from './Avatar'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Avatar/Avatar.test.tsx` — 10 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Avatar/Avatar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Wave 1 — Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar de iniciales con color determinístico. Reference: `ui_kits/appcenter/Components.jsx` → `Avatar`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: { name: 'Carlos Rodríguez', size: 'md' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Carlos Rodríguez" size="sm" />
      <Avatar name="Carlos Rodríguez" size="md" />
      <Avatar name="Carlos Rodríguez" size="lg" />
    </div>
  ),
}

export const MultipleNames: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['Carlos Rodríguez','María Gómez','Andrés Martínez','Laura Cifuentes','Pedro Sánchez'].map(n => (
        <Avatar key={n} name={n} size="md" />
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  args: { name: 'Carlos Rodríguez', src: 'https://i.pravatar.cc/150?img=3', alt: 'Foto de Carlos', size: 'lg' },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / Avatar / MultipleNames`.
Open `ui_kits/appcenter/index.html` in a browser — look at the sidebar user avatar.
Verify: circular, initials are 2 chars, font weight bold, different colors per name.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Avatar/Avatar.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as AvatarStories from './Avatar.stories'

<Meta of={AvatarStories} />

# Avatar

Muestra las iniciales del usuario o su foto. El color de fondo es determinístico:
el mismo nombre siempre produce el mismo color. Máximo 2 iniciales.

**Referencia:** `ui_kits/appcenter/Components.jsx` → `avatarColor` + `Avatar`

## Uso

```tsx
import { Avatar } from '@yes/ui'

<Avatar name="Carlos Rodríguez" size="md" />
<Avatar name="María Gómez" src="/foto.jpg" alt="Foto de María" size="lg" />
```

<Canvas of={AvatarStories.AllSizes} />
<Controls of={AvatarStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Avatar } from './components/Avatar'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Avatar/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente Avatar"
```

---

## Task 3: Spinner

**Reference:** `preview/components-buttons.html` — loading state `.spinner` CSS
**Translation passes:**
- sm: 14px (reference btn spinner), md: 20px, lg: 28px (interpolated)
- border: 2px solid rgba(255,255,255,0.3), border-top-color: white → keep as currentColor-relative
- New tokens: `--yes-size-spinner-sm/md/lg`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Spinner/Spinner.tsx`
- Create: `src/components/Spinner/Spinner.module.css`
- Create: `src/components/Spinner/Spinner.test.tsx`
- Create: `src/components/Spinner/Spinner.stories.tsx`
- Create: `src/components/Spinner/Spinner.mdx`
- Create: `src/components/Spinner/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add spinner tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-size-avatar-lg`:

```css
  /* ── Spinner ─────────────────────────────────────────────── */
  --yes-size-spinner-sm: 14px;
  --yes-size-spinner-md: 20px;
  --yes-size-spinner-lg: 28px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Spinner/Spinner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with default testid', () => {
    render(<Spinner data-testid="spinner" />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('has role="status" for screen readers', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Cargando')
  })

  it('applies sm size class', () => {
    render(<Spinner size="sm" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/sm/)
  })

  it('applies md size by default', () => {
    render(<Spinner data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/md/)
  })

  it('applies lg size class', () => {
    render(<Spinner size="lg" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.className).toMatch(/lg/)
  })

  it('applies custom className', () => {
    render(<Spinner className="custom" data-testid="s" />)
    expect(screen.getByTestId('s')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Spinner'".

- [ ] **Step 4: Implement Spinner**

Create `src/components/Spinner/Spinner.module.css`:

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.15);
  border-top-color: currentColor;
  animation: spin var(--yes-duration-slow) linear infinite;
  flex-shrink: 0;
}

.sm {
  width: var(--yes-size-spinner-sm);
  height: var(--yes-size-spinner-sm);
  border-width: 2px;
}

.md {
  width: var(--yes-size-spinner-md);
  height: var(--yes-size-spinner-md);
  border-width: 2px;
}

.lg {
  width: var(--yes-size-spinner-lg);
  height: var(--yes-size-spinner-lg);
  border-width: 3px;
}
```

Create `src/components/Spinner/Spinner.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps, Size } from '../../types/shared'
import styles from './Spinner.module.css'

interface SpinnerProps extends BaseProps {
  size?: Size
}

export function Spinner({
  size = 'md',
  className,
  style,
  'data-testid': testId,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      data-testid={testId}
      className={cn(styles.spinner, styles[size], className)}
      style={style}
    />
  )
}
```

Create `src/components/Spinner/index.ts`:

```typescript
export { Spinner } from './Spinner'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Spinner/Spinner.test.tsx` — 7 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Spinner/Spinner.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Wave 1 — Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Indicador de carga. Reference: `.spinner` en `preview/components-buttons.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = { args: { size: 'md' } }

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const OnDarkBackground: Story = {
  render: () => (
    <div style={{ background: '#2B52A0', padding: 16, borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Spinner size="sm" style={{ color: 'white' }} />
      <Spinner size="md" style={{ color: 'white' }} />
      <Spinner size="lg" style={{ color: 'white' }} />
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / Spinner / OnDarkBackground`.
Open `preview/components-buttons.html` and look at the loading button.
Verify: spinner matches size, animation speed, border style.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Spinner/Spinner.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as SpinnerStories from './Spinner.stories'

<Meta of={SpinnerStories} />

# Spinner

Indicador circular de carga. El color hereda `currentColor` del contenedor padre.
Usar dentro de botones con `isLoading`, o en secciones que cargan datos.

**Referencia:** `.spinner` en `preview/components-buttons.html`

## Uso

```tsx
import { Spinner } from '@yes/ui'

<Spinner size="sm" />  // dentro de botón
<Spinner size="lg" />  // sección cargando
```

<Canvas of={SpinnerStories.AllSizes} />
<Controls of={SpinnerStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Spinner } from './components/Spinner'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Spinner/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente Spinner"
```

---

## Task 4: Button

**Reference:** `preview/components-buttons.html`
**Translation passes:**
- sm: 13px / 12px padding / 30px height → tokens: `--yes-size-btn-text-sm: 13px`, `--yes-size-px-sm` (12px ✓), `--yes-size-height-sm` (30px ✓)
- md: 14px / 16px padding / 36px height → new token `--yes-size-btn-text-md: 14px`, `--yes-size-px-md` (16px ✓), `--yes-size-height-md` (36px ✓)
- lg: 15px / 20px padding / 44px height → new tokens `--yes-size-btn-text-lg: 15px`, `--yes-size-btn-px-lg: 20px`, `--yes-size-height-lg` (44px ✓)
- gap 6px → new token `--yes-space-btn-gap: 6px`
- primary: `--yes-color-primary` (#2B52A0 ✓)
- secondary: bg white, color #374151 → `--yes-color-secondary` / `--yes-color-secondary-fg`
- ghost: transparent, color + border #2B52A0 → `--yes-color-primary`
- green: bg `--yes-color-brand-accent` (#8CBC39 ✓)
- danger: `--yes-color-danger` (#DC2626 ✓)
- disabled: `--yes-color-surface-disabled`, `--yes-color-text-disabled`, `--yes-color-border-disabled`
- loading: keeps primary bg, text rgba(255,255,255,0.7)
- icon button: 36px × 36px → uses `--yes-size-height-md` as width too

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Button/Button.tsx`
- Create: `src/components/Button/Button.module.css`
- Create: `src/components/Button/Button.test.tsx`
- Create: `src/components/Button/Button.stories.tsx`
- Create: `src/components/Button/Button.mdx`
- Create: `src/components/Button/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add button tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-space-icon-gap` line (add before the `--yes-size-sidebar-width` line):

```css
  /* ── Button-specific sizing ──────────────────────────────── */
  --yes-space-btn-gap:     6px;   /* gap between icon and text in button */
  --yes-size-btn-text-sm: 13px;   /* reference: btn-sm font-size */
  --yes-size-btn-text-md: 14px;   /* reference: btn-md font-size */
  --yes-size-btn-text-lg: 15px;   /* reference: btn-lg font-size */
  --yes-size-btn-px-lg:   20px;   /* reference: btn-lg horizontal padding */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Button/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('has type="button" by default', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it.each(['primary', 'secondary', 'ghost', 'green', 'danger'] as const)(
    'renders %s tone without crashing',
    (tone) => {
      render(<Button tone={tone}>Acción</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md', 'lg'] as const)(
    'renders %s size without crashing',
    (size) => {
      render(<Button size={size}>Acción</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it('calls onClick exactly once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Button disabled>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('sets aria-disabled when loading', () => {
    render(<Button isLoading>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('sets aria-busy when loading', () => {
    render(<Button isLoading>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button isLoading onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders spinner when loading', () => {
    render(<Button isLoading data-testid="btn">Procesando</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<Button data-testid="my-btn">Acción</Button>)
    expect(screen.getByTestId('my-btn')).toBeInTheDocument()
  })

  it('appends className to root', () => {
    render(<Button className="custom">Acción</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom')
  })

  it('activates on Enter key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Acción</Button>)
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Acción</Button>)
    screen.getByRole('button').focus()
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as anchor when as="a"', () => {
    render(<Button as="a" href="/test">Enlace</Button>)
    expect(screen.getByRole('link', { name: 'Enlace' })).toBeInTheDocument()
  })

  it('renders icon-only variant with correct aria-label', () => {
    render(<Button iconOnly aria-label="Cerrar" />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Button'".

- [ ] **Step 4: Implement Button**

Create `src/components/Button/Button.module.css`:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--yes-space-btn-gap);
  border: 1px solid transparent;
  cursor: pointer;
  font-family: var(--yes-font-sans);
  font-weight: var(--yes-weight-semibold);
  border-radius: var(--yes-radius-btn);
  transition: background var(--yes-duration-base) var(--yes-ease),
              border-color var(--yes-duration-base) var(--yes-ease),
              color var(--yes-duration-base) var(--yes-ease);
  white-space: nowrap;
  line-height: 1;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
}

/* ── Sizes ────────────────────────────────────────────────── */
.sm {
  height: var(--yes-size-height-sm);
  padding: 0 var(--yes-size-px-sm);
  font-size: var(--yes-size-btn-text-sm);
}
.md {
  height: var(--yes-size-height-md);
  padding: 0 var(--yes-size-px-md);
  font-size: var(--yes-size-btn-text-md);
}
.lg {
  height: var(--yes-size-height-lg);
  padding: 0 var(--yes-size-btn-px-lg);
  font-size: var(--yes-size-btn-text-lg);
}

/* ── Tones ────────────────────────────────────────────────── */
.primary {
  background: var(--yes-color-primary);
  color: var(--yes-color-primary-fg);
  border-color: var(--yes-color-primary);
}
.primary:hover:not([aria-disabled='true']) {
  background: var(--yes-color-primary-hover);
  border-color: var(--yes-color-primary-hover);
}

.secondary {
  background: var(--yes-color-secondary);
  color: var(--yes-color-secondary-fg);
  border-color: var(--yes-color-secondary-border);
}
.secondary:hover:not([aria-disabled='true']) {
  background: var(--yes-color-secondary-hover);
}

.ghost {
  background: transparent;
  color: var(--yes-color-primary);
  border-color: var(--yes-color-primary);
}
.ghost:hover:not([aria-disabled='true']) {
  background: var(--yes-color-primary-subtle);
}

.green {
  background: var(--yes-color-brand-accent);
  color: var(--yes-color-primary-fg);
  border-color: var(--yes-color-brand-accent);
}

.danger {
  background: var(--yes-color-danger);
  color: var(--yes-color-danger-fg);
  border-color: var(--yes-color-danger);
}
.danger:hover:not([aria-disabled='true']) {
  background: var(--yes-color-danger-hover);
  border-color: var(--yes-color-danger-hover);
}

/* ── Disabled (overrides all tones) ──────────────────────── */
.btn[aria-disabled='true']:not([aria-busy='true']) {
  background: var(--yes-color-surface-disabled) !important;
  color: var(--yes-color-text-disabled) !important;
  border-color: var(--yes-color-border-disabled) !important;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Loading (keeps tone bg, dims text) ───────────────────── */
.btn[aria-busy='true'] {
  cursor: wait;
  pointer-events: none;
}
.btn[aria-busy='true'].primary,
.btn[aria-busy='true'].green {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Icon-only ────────────────────────────────────────────── */
.iconOnly {
  padding: 0;
}
.iconOnly.sm { width: var(--yes-size-height-sm); }
.iconOnly.md { width: var(--yes-size-height-md); }
.iconOnly.lg { width: var(--yes-size-height-lg); }
```

Create `src/components/Button/Button.tsx`:

```tsx
import React from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from '../Spinner/Spinner'
import type { BaseProps } from '../../types/shared'
import styles from './Button.module.css'

type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'green' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonOwnProps extends BaseProps {
  tone?: ButtonTone
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  as?: React.ElementType
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  'aria-label'?: string
}

export function Button({
  tone = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconOnly = false,
  as: Element = 'button',
  children,
  type = 'button',
  onClick,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...rest
}: ButtonOwnProps) {
  const isDisabled = disabled || isLoading

  return (
    <Element
      type={Element === 'button' ? type : undefined}
      disabled={Element === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      onClick={isDisabled ? undefined : onClick}
      data-testid={testId}
      className={cn(
        styles.btn,
        styles[tone],
        styles[size],
        iconOnly && styles.iconOnly,
        className,
      )}
      style={style}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </Element>
  )
}
```

Create `src/components/Button/index.ts`:

```typescript
export { Button } from './Button'
export type { } from './Button'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Button/Button.test.tsx` — 17 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Button/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Wave 1 — Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón de acción principal. Reference: `preview/components-buttons.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Guardar cambios', tone: 'primary', size: 'md' },
}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button tone="primary">Guardar cambios</Button>
      <Button tone="secondary">Cancelar</Button>
      <Button tone="ghost">Exportar</Button>
      <Button tone="green">Enviar campaña</Button>
      <Button tone="danger">Eliminar registro</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Acción pequeña</Button>
      <Button size="md">Acción media</Button>
      <Button size="lg">Acción grande</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button isLoading>Procesando…</Button>
      <Button disabled>Deshabilitado</Button>
    </div>
  ),
}

export const Interactive: Story = {
  args: { children: 'Clic aquí', tone: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: 'Clic aquí' })
    await userEvent.click(btn)
    await expect(btn).toBeVisible()
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / Button / AllTones`.
Open `preview/components-buttons.html` at 700px in a browser.
Compare side-by-side:
- Colors match exactly (primary blue, green, red, gray)
- Heights match (30/36/44px)
- Border radius 6px consistent
- Font weight semibold
- Loading state shows spinner inline

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Button/Button.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ButtonStories from './Button.stories'

<Meta of={ButtonStories} />

# Button

Botón de acción. Siempre lleva una etiqueta de texto que describe exactamente
la acción: "Guardar cambios", no "Aceptar". Nunca solo un ícono en posición primaria.

**Referencia:** `preview/components-buttons.html`

## Tonos

| Tono | Uso |
|------|-----|
| `primary` | Acción principal de la pantalla |
| `secondary` | Alternativa válida o acción secundaria |
| `ghost` | Acción de menor jerarquía, con borde |
| `green` | CTAs de confirmación positiva ("Enviar campaña") |
| `danger` | Acciones destructivas o irreversibles |

## Uso

```tsx
import { Button } from '@yes/ui'

<Button tone="primary" onClick={handleSave}>Guardar cambios</Button>
<Button tone="danger" onClick={handleDelete}>Eliminar registro</Button>
<Button isLoading>Procesando…</Button>
<Button as="a" href="/detalle">Ver detalles</Button>
```

## Seguridad

- `type="button"` por defecto — nunca envía formularios accidentalmente
- `onClick` no se dispara si `disabled` o `isLoading`
- `aria-disabled` + `aria-busy` para lectores de pantalla

<Canvas of={ButtonStories.AllTones} />
<Controls of={ButtonStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Button } from './components/Button'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Button/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente Button"
```

---

## Task 5: Badge

**Reference:** `preview/components-badges.html` — status badge section
**Translation passes:**
- font-size 12px → `--yes-text-xs` (12px ✓)
- font-weight 600 → `--yes-weight-semibold` ✓
- padding 3px 9px → no exact token (3px is space-1/2, 9px is between space-2/space-3). Add `--yes-size-badge-py: 3px`, `--yes-size-badge-px: 9px`
- border-radius 9999px → `--yes-radius-badge` ✓
- dot: 6px circle → add `--yes-size-badge-dot: 6px`
- All 6 variant color pairs already in semantic.css as `--yes-color-success/danger/warning/info/neutral/badge-blue`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Badge/Badge.tsx`
- Create: `src/components/Badge/Badge.module.css`
- Create: `src/components/Badge/Badge.test.tsx`
- Create: `src/components/Badge/Badge.stories.tsx`
- Create: `src/components/Badge/Badge.mdx`
- Create: `src/components/Badge/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add badge tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-size-btn-px-lg`:

```css
  /* ── Badge ───────────────────────────────────────────────── */
  --yes-size-badge-py:  3px;
  --yes-size-badge-px:  9px;
  --yes-size-badge-dot: 6px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Badge/Badge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge variant="success">Activo</Badge>)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it.each(['success', 'error', 'warning', 'info', 'neutral', 'blue'] as const)(
    'renders %s variant without crashing',
    (variant) => {
      render(<Badge variant={variant}>Estado</Badge>)
      expect(screen.getByText('Estado')).toBeInTheDocument()
    }
  )

  it('renders dot by default', () => {
    render(<Badge variant="success" data-testid="badge">Activo</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge.querySelector('[data-dot]')).toBeInTheDocument()
  })

  it('hides dot when showDot is false', () => {
    render(<Badge variant="success" showDot={false} data-testid="badge">Activo</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge.querySelector('[data-dot]')).not.toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<Badge variant="info" data-testid="my-badge">En proceso</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge variant="neutral" className="custom">Pausado</Badge>)
    expect(screen.getByText('Pausado').closest('span')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Badge'".

- [ ] **Step 4: Implement Badge**

Create `src/components/Badge/Badge.module.css`:

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  padding: var(--yes-size-badge-py) var(--yes-size-badge-px);
  border-radius: var(--yes-radius-badge);
  white-space: nowrap;
  line-height: 1;
}

.dot {
  width: var(--yes-size-badge-dot);
  height: var(--yes-size-badge-dot);
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Variants ─────────────────────────────────────────────── */
.success {
  background: var(--yes-color-success-subtle);
  color: var(--yes-color-success-fg);
}
.success .dot { background: var(--yes-color-success); }

.error {
  background: var(--yes-color-danger-subtle);
  color: var(--yes-primitive-error-700);
}
.error .dot { background: var(--yes-color-danger); }

.warning {
  background: var(--yes-color-warning-subtle);
  color: var(--yes-color-warning-fg);
}
.warning .dot { background: var(--yes-color-warning); }

.info {
  background: var(--yes-color-info-subtle);
  color: var(--yes-primitive-info-700);
}
.info .dot { background: var(--yes-color-info); }

.neutral {
  background: var(--yes-color-neutral);
  color: var(--yes-color-neutral-fg);
}
.neutral .dot { background: var(--yes-color-text-subtle); }

.blue {
  background: var(--yes-color-badge-blue);
  color: var(--yes-color-badge-blue-fg);
}
.blue .dot { background: var(--yes-color-primary); }
```

Create `src/components/Badge/Badge.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Badge.module.css'

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'blue'

interface BadgeProps extends BaseProps {
  variant: BadgeVariant
  showDot?: boolean
  children: React.ReactNode
}

export function Badge({
  variant,
  showDot = true,
  children,
  className,
  style,
  'data-testid': testId,
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      style={style}
      data-testid={testId}
    >
      {showDot && <span className={styles.dot} data-dot="" aria-hidden="true" />}
      {children}
    </span>
  )
}
```

Create `src/components/Badge/index.ts`:

```typescript
export { Badge } from './Badge'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Badge/Badge.test.tsx` — 6 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Badge/Badge.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Wave 1 — Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insignia de estado semántico. Reference: `preview/components-badges.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { variant: 'success', children: 'Activo' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="success">Activo</Badge>
      <Badge variant="error">Fallido</Badge>
      <Badge variant="warning">Pendiente</Badge>
      <Badge variant="info">En proceso</Badge>
      <Badge variant="neutral">Pausado</Badge>
      <Badge variant="blue">Completado</Badge>
    </div>
  ),
}

export const WithoutDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge variant="success" showDot={false}>Activo</Badge>
      <Badge variant="error" showDot={false}>Fallido</Badge>
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / Badge / AllVariants`.
Open `preview/components-badges.html` → "Badges de estado" section.
Verify: each variant's background, text color, and dot color match exactly.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Badge/Badge.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as BadgeStories from './Badge.stories'

<Meta of={BadgeStories} />

# Badge

Insignia de estado semántico en forma de píldora. Siempre acompañada de texto
corto (1–3 palabras). Nunca reemplaza la información — la refuerza.

**Referencia:** `preview/components-badges.html` — sección "Badges de estado"

| Variante | Uso |
|----------|-----|
| `success` | Activo, Confirmado, Entregado |
| `error` | Fallido, Error, Rechazado |
| `warning` | Pendiente, En revisión |
| `info` | En proceso, Programado |
| `neutral` | Pausado, Inactivo, Borrador |
| `blue` | Completado (estado final positivo de marca) |

<Canvas of={BadgeStories.AllVariants} />
<Controls of={BadgeStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Badge } from './components/Badge'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Badge/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente Badge"
```

---

## Task 6: ChannelBadge

**Reference:** `preview/components-badges.html` — channel badge section + `ui_kits/appcenter/Components.jsx` → `ChannelBadge`
**Translation passes:**
- font-size 11px → no exact token. Add `--yes-size-channel-badge-text: 11px`
- font-weight 700 → `--yes-weight-bold` ✓
- padding 2px 8px → py=2px (add token), px=`--yes-space-2` (8px ✓)
- border-radius 4px → `--yes-radius-sm` (4px ✓)
- border 1px solid → channel border tokens already in semantic.css ✓
- All 4 channel color triples already in `--yes-channel-*` ✓

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/ChannelBadge/ChannelBadge.tsx`
- Create: `src/components/ChannelBadge/ChannelBadge.module.css`
- Create: `src/components/ChannelBadge/ChannelBadge.test.tsx`
- Create: `src/components/ChannelBadge/ChannelBadge.stories.tsx`
- Create: `src/components/ChannelBadge/ChannelBadge.mdx`
- Create: `src/components/ChannelBadge/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add ChannelBadge tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-size-badge-dot`:

```css
  /* ── ChannelBadge ────────────────────────────────────────── */
  --yes-size-channel-badge-text: 11px;
  --yes-size-channel-badge-py:    2px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/ChannelBadge/ChannelBadge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChannelBadge } from './ChannelBadge'

describe('ChannelBadge', () => {
  it('renders WhatsApp label', () => {
    render(<ChannelBadge channel="whatsapp" />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })

  it('renders SMS label', () => {
    render(<ChannelBadge channel="sms" />)
    expect(screen.getByText('SMS')).toBeInTheDocument()
  })

  it('renders email label as "Correo"', () => {
    render(<ChannelBadge channel="email" />)
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })

  it('renders voice label as "Voz"', () => {
    render(<ChannelBadge channel="voice" />)
    expect(screen.getByText('Voz')).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<ChannelBadge channel="sms" data-testid="ch" />)
    expect(screen.getByTestId('ch')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ChannelBadge channel="whatsapp" className="custom" />)
    expect(screen.getByText('WhatsApp')).toHaveClass('custom')
  })

  it.each(['whatsapp', 'sms', 'email', 'voice'] as const)(
    'renders %s without crashing',
    (channel) => {
      render(<ChannelBadge channel={channel} />)
      expect(document.querySelector('span')).toBeInTheDocument()
    }
  )
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './ChannelBadge'".

- [ ] **Step 4: Implement ChannelBadge**

Create `src/components/ChannelBadge/ChannelBadge.module.css`:

```css
.badge {
  display: inline-block;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-channel-badge-text);
  font-weight: var(--yes-weight-bold);
  padding: var(--yes-size-channel-badge-py) var(--yes-space-2);
  border-radius: var(--yes-radius-sm);
  border: 1px solid;
  white-space: nowrap;
  line-height: 1.4;
}

.whatsapp {
  background: var(--yes-channel-wa-bg);
  color: var(--yes-channel-wa-fg);
  border-color: var(--yes-channel-wa-border);
}

.sms {
  background: var(--yes-channel-sms-bg);
  color: var(--yes-channel-sms-fg);
  border-color: var(--yes-channel-sms-border);
}

.email {
  background: var(--yes-channel-email-bg);
  color: var(--yes-channel-email-fg);
  border-color: var(--yes-channel-email-border);
}

.voice {
  background: var(--yes-channel-voice-bg);
  color: var(--yes-channel-voice-fg);
  border-color: var(--yes-channel-voice-border);
}
```

Create `src/components/ChannelBadge/ChannelBadge.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './ChannelBadge.module.css'

type Channel = 'whatsapp' | 'sms' | 'email' | 'voice'

const LABELS: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Correo',
  voice: 'Voz',
}

interface ChannelBadgeProps extends BaseProps {
  channel: Channel
}

export function ChannelBadge({
  channel,
  className,
  style,
  'data-testid': testId,
}: ChannelBadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[channel], className)}
      style={style}
      data-testid={testId}
    >
      {LABELS[channel]}
    </span>
  )
}
```

Create `src/components/ChannelBadge/index.ts`:

```typescript
export { ChannelBadge } from './ChannelBadge'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/ChannelBadge/ChannelBadge.test.tsx` — 7 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/ChannelBadge/ChannelBadge.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ChannelBadge } from './ChannelBadge'

const meta: Meta<typeof ChannelBadge> = {
  title: 'Wave 1 — Atoms/ChannelBadge',
  component: ChannelBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Insignia de canal de comunicación. Reference: `preview/components-badges.html` → "Canal de conversación".',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ChannelBadge>

export const Default: Story = { args: { channel: 'whatsapp' } }

export const AllChannels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <ChannelBadge channel="whatsapp" />
      <ChannelBadge channel="sms" />
      <ChannelBadge channel="email" />
      <ChannelBadge channel="voice" />
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / ChannelBadge / AllChannels`.
Open `preview/components-badges.html` → "Canal de conversación" section.
Verify: border color, background, text color match for each channel. Radius is squarer (4px, not pill).

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/ChannelBadge/ChannelBadge.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ChannelBadgeStories from './ChannelBadge.stories'

<Meta of={ChannelBadgeStories} />

# ChannelBadge

Identifica el canal de una conversación: WhatsApp, SMS, Correo o Voz.
Radio cuadrado (4px), diferente del Badge de estado (píldora).

**Referencia:** `preview/components-badges.html` — sección "Canal de conversación"

<Canvas of={ChannelBadgeStories.AllChannels} />
<Controls of={ChannelBadgeStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { ChannelBadge } from './components/ChannelBadge'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/ChannelBadge/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente ChannelBadge"
```

---

## Task 7: Chip

**Reference:** `preview/components-badges.html` — filter chip section
**Translation passes:**
- font-size 12px → `--yes-text-xs` (12px ✓)
- font-weight 600 → `--yes-weight-semibold` ✓
- padding 3px 10px → py=`--yes-size-badge-py` (3px ✓), px=10px → add `--yes-size-chip-px: 10px`
- border-radius 9999px → `--yes-radius-badge` ✓
- bg #EEF3FA → `--yes-color-badge-blue` ✓
- color #2B52A0 → `--yes-color-primary` ✓
- border 1px solid #B3C5E6 → `--yes-color-primary-border` ✓
- dismiss × color #7E9CD1 → `--yes-primitive-blue-300` ✓ → add `--yes-color-chip-dismiss`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Chip/Chip.tsx`
- Create: `src/components/Chip/Chip.module.css`
- Create: `src/components/Chip/Chip.test.tsx`
- Create: `src/components/Chip/Chip.stories.tsx`
- Create: `src/components/Chip/Chip.mdx`
- Create: `src/components/Chip/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add Chip tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-size-channel-badge-py`:

```css
  /* ── Chip ────────────────────────────────────────────────── */
  --yes-size-chip-px:       10px;
  --yes-color-chip-dismiss: var(--yes-primitive-blue-300);
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Chip/Chip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>Estado: Activo</Chip>)
    expect(screen.getByText('Estado: Activo')).toBeInTheDocument()
  })

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<Chip>Estado: Activo</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Chip onDismiss={() => {}}>Estado: Activo</Chip>)
    expect(screen.getByRole('button', { name: 'Eliminar filtro' })).toBeInTheDocument()
  })

  it('calls onDismiss exactly once when × is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Chip onDismiss={onDismiss}>Estado: Activo</Chip>)
    await user.click(screen.getByRole('button', { name: 'Eliminar filtro' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('passes data-testid to root', () => {
    render(<Chip data-testid="chip">Filtro</Chip>)
    expect(screen.getByTestId('chip')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Chip className="custom" data-testid="chip">Filtro</Chip>)
    expect(screen.getByTestId('chip')).toHaveClass('custom')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Chip'".

- [ ] **Step 4: Implement Chip**

Create `src/components/Chip/Chip.module.css`:

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-xs);
  font-weight: var(--yes-weight-semibold);
  padding: var(--yes-size-badge-py) var(--yes-size-chip-px);
  border-radius: var(--yes-radius-badge);
  border: 1px solid var(--yes-color-primary-border);
  background: var(--yes-color-badge-blue);
  color: var(--yes-color-primary);
  white-space: nowrap;
  line-height: 1.4;
}

.dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--yes-color-chip-dismiss);
  font-size: 14px;
  line-height: 1;
  margin-left: 1px;
}

.dismiss:hover {
  color: var(--yes-color-primary);
}
```

Create `src/components/Chip/Chip.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Chip.module.css'

interface ChipProps extends BaseProps {
  children: React.ReactNode
  onDismiss?: () => void
}

export function Chip({
  children,
  onDismiss,
  className,
  style,
  'data-testid': testId,
}: ChipProps) {
  return (
    <span
      className={cn(styles.chip, className)}
      style={style}
      data-testid={testId}
    >
      {children}
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Eliminar filtro"
        >
          ×
        </button>
      )}
    </span>
  )
}
```

Create `src/components/Chip/index.ts`:

```typescript
export { Chip } from './Chip'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Chip/Chip.test.tsx` — 6 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Chip/Chip.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Wave 1 — Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chip de filtro activo con opción de descartar. Reference: `preview/components-badges.html` → chips.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: { children: 'Estado: Activo' },
}

export const WithDismiss: Story = {
  args: { children: 'Estado: Activo', onDismiss: () => {} },
}

export const MultipleChips: Story = {
  render: () => {
    const [chips, setChips] = useState(['Estado: Activo', 'Campaña: Cobranza Q2', 'Canal: WhatsApp'])
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {chips.map((label) => (
          <Chip key={label} onDismiss={() => setChips(chips.filter(c => c !== label))}>
            {label}
          </Chip>
        ))}
      </div>
    )
  },
}

export const Interactive: Story = {
  args: { children: 'Estado: Activo', onDismiss: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: 'Eliminar filtro' })
    await expect(btn).toBeVisible()
    await userEvent.hover(btn)
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 1 — Atoms / Chip / MultipleChips`.
Open `preview/components-badges.html` → filter chip section.
Verify: blue tint background, primary blue text, blue-300 × dismiss button, pill radius.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Chip/Chip.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ChipStories from './Chip.stories'

<Meta of={ChipStories} />

# Chip

Chip de filtro activo. Aparece debajo de la barra de filtros cuando el usuario
ha aplicado uno o más filtros. El botón × permite descartarlo individualmente.

**Referencia:** `preview/components-badges.html` — sección chips de filtro

## Uso

```tsx
import { Chip } from '@yes/ui'

<Chip onDismiss={() => removeFilter('estado')}>Estado: Activo</Chip>
<Chip>Canal: WhatsApp</Chip>  {/* sin dismiss — solo informativo */}
```

<Canvas of={ChipStories.MultipleChips} />
<Controls of={ChipStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Chip } from './components/Chip'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Chip/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-1): agregar componente Chip"
```

---

## Task 8: Wave 1 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all 7 component test files passing, 0 failures.
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

- [ ] **Step 3: Verify all Wave 1 exports are present**

```bash
node -e "
const { Icon, Avatar, Spinner, Button, Badge, ChannelBadge, Chip } = require('./dist/index.cjs');
const missing = ['Icon','Avatar','Spinner','Button','Badge','ChannelBadge','Chip'].filter(n => !eval(n));
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 1 exports present');
"
```

Expected: `All Wave 1 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
pnpm dev
```

Open each story group in order:
- Wave 1 — Atoms / Icon
- Wave 1 — Atoms / Avatar
- Wave 1 — Atoms / Spinner
- Wave 1 — Atoms / Button
- Wave 1 — Atoms / Badge
- Wave 1 — Atoms / ChannelBadge
- Wave 1 — Atoms / Chip

Verify no console errors. Every `AllVariants` / `AllTones` / `AllChannels` story renders without errors.

- [ ] **Step 5: Tag Wave 1 release**

Update `version` in `package.json` from `0.1.0` to `0.1.0` (already correct for first release).

```bash
git tag v0.1.0
git commit --allow-empty -m "chore(release): wave 1 atoms — v0.1.0"
```

---

## Self-review notes

**Spec coverage check:**
- ✅ Incoming folder + handoff protocol → Task 0
- ✅ Icon (lucide-react, stroke 1.75) → Task 1
- ✅ Avatar (deterministic color, 3 sizes, image fallback) → Task 2
- ✅ Spinner (3 sizes, currentColor, aria status) → Task 3
- ✅ Button (5 tones, 3 sizes, loading+disabled, as, keyboard) → Task 4
- ✅ Badge (6 variants, dot, showDot toggle) → Task 5
- ✅ ChannelBadge (4 channels, Spanish labels, square radius) → Task 6
- ✅ Chip (dismiss button, aria-label on ×, stateful story) → Task 7
- ✅ Wave 1 integration verify → Task 8

**Type consistency:** `ButtonTone` is local to Button (not shared Tone) — documented in Button.mdx. `BadgeVariant` and `Channel` are local — correct, they are component-specific unions not shared across the library.

**Placeholder scan:** Clean — all steps have complete code.
