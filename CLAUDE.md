# @yes/ui — Claude Working Instructions

## Authority: design-system-reference/

**Everything in this package derives from `design-system-reference/`. No exceptions.**

The reference directory is the single source of truth for all visual, typographic,
and behavioral decisions. Before writing any component code, read its reference file.
Before marking any component done, verify its visual output matches its reference file.

```
design-system-reference/
├── colors_and_type.css          ← CANONICAL TOKEN SOURCE — all hex values, all type scale
├── assets/logo-yesbpo.png       ← Official logo (1080×1080, transparent PNG)
├── preview/                     ← Visual spec for every component (700px wide)
│   ├── brand-logo.html
│   ├── colors-brand.html
│   ├── colors-blue.html
│   ├── colors-green.html
│   ├── colors-neutral.html
│   ├── colors-semantic.html
│   ├── type-display.html
│   ├── type-body.html
│   ├── type-mono.html
│   ├── spacing-scale.html
│   ├── spacing-radii.html
│   ├── spacing-shadows.html
│   ├── components-buttons.html
│   ├── components-inputs.html
│   ├── components-badges.html
│   ├── components-alerts.html
│   ├── components-nav.html
│   ├── components-cards.html
│   ├── components-table.html
│   ├── components-table-advanced.html
│   ├── components-modals.html
│   ├── components-meta-actions.html
│   ├── components-meta-filters.html
│   ├── components-panel-rich.html
│   └── components-admin-banner.html
└── ui_kits/                     ← Working React prototypes (reference implementations)
    ├── appcenter/Components.jsx  ← Icon, Avatar, ChannelBadge, StatusBadge, AppSidebar
    ├── appcenter/App.jsx         ← ConversationList, ChatPanel, CampaignView, AgentView
    ├── dashboard/DashComponents.jsx ← DashIcon, KpiCard, LineChart, BarChart, Widget, DashSidebar
    ├── dashboard/DashApp.jsx     ← DashboardHome, AIQueryView
    ├── crm/CRMComponents.jsx     ← CRMIcon, CRMAvatar, CRMStatusBadge, CRMSidebar
    └── crm/CRMApp.jsx            ← FilterBar, ContactsTable, DetailPanel
```

---

## Canonical design values (from colors_and_type.css)

### Brand colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-blue` | `#2B52A0` | Primary, buttons, links, active states |
| `--brand-green` | `#8CBC39` | CTAs, confirmations, active nav badges |
| Sidebar bg | `#142860` | All product sidebars (blue-900) |
| App bg | `#F3F4F6` | Page background |
| Card bg | `#FFFFFF` | Surface background |
| Card border | `#E5E7EB` | 1px border on cards and containers |

### Typography (Google Fonts — loaded in primitives.css)
| Role | Family | Weights |
|------|--------|---------|
| Display H1–H2 | `Barlow Semi Condensed` | 700 |
| Headings H3–H6 | `Barlow` | 600–700 |
| Body / UI | `Manrope` | 400–700 |
| Code / Data | `JetBrains Mono` | 400–500 |

### Border radius
| Usage | Value |
|-------|-------|
| Buttons, inputs | `6px` |
| Cards, containers | `8px` |
| Modals, drawers | `12px` |
| Badges, pills | `9999px` |

### Component dimensions
| Component | sm | md | lg |
|-----------|----|----|-----|
| Button height | 30px | 36px | 44px |
| Input height | 30px | 36px | 44px |
| Table row height | — | 44px | — |
| Table header height | — | 40px | — |
| Sidebar width | 220px expanded · 56px collapsed |

### Icon set
Lucide — stroke, 1.75px, `currentColor`. No filled icons. No other icon libraries.

---

## Component inventory — 42 components, 8 waves

Every component maps to a reference file. Open that file before writing code.

### Wave 1 — Atoms
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Icon` | *(Lucide, no preview file)* | `appcenter/Components.jsx` → `Icon` |
| `Avatar` | *(no preview file)* | `appcenter/Components.jsx` → `Avatar` |
| `Spinner` | `components-buttons.html` (loading state) | — |
| `Button` | `components-buttons.html` | — |
| `Badge` | `components-badges.html` | `appcenter/Components.jsx` → `StatusBadge` |
| `ChannelBadge` | `components-badges.html` | `appcenter/Components.jsx` → `ChannelBadge` |
| `Chip` | `components-badges.html` (filter chip section) | `crm/CRMApp.jsx` |

### Wave 2 — Form controls
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Input` | `components-inputs.html` | — |
| `Select` | `components-inputs.html` | — |
| `Textarea` | `components-inputs.html` | — |
| `Toggle` | `components-inputs.html` | — |
| `SearchInput` | `components-inputs.html` (search variant) | `crm/CRMApp.jsx` → FilterBar |
| `Checkbox` | `components-inputs.html` | `components-table-advanced.html` (row select) |

### Wave 3 — Feedback
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Alert` | `components-alerts.html` | — |
| `Toast` | `components-alerts.html` (toast section) | — |
| `Skeleton` | *(no preview — follow spacing-scale.html proportions)* | — |
| `EmptyState` | `components-cards.html` (empty state card) | — |

### Wave 4 — Navigation
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Sidebar` | `components-nav.html` | `appcenter/Components.jsx` → `AppSidebar` |
| `Tabs` | `components-nav.html` (tabs section) | — |

### Wave 5 — Overlay
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Modal` | `components-modals.html` | — |
| `Drawer` | `components-modals.html` (panel lateral section) | `crm/CRMApp.jsx` → `DetailPanel` |
| `FilterPanel` | `components-meta-filters.html` | `crm/CRMApp.jsx` |

### Wave 6 — Data display
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `Table` | `components-table.html` | `crm/CRMApp.jsx` → `ContactsTable` |
| `TableAdvanced` | `components-table-advanced.html` | `crm/CRMApp.jsx` |
| `BulkActionBar` | `components-table-advanced.html` + `components-meta-filters.html` | — |
| `Toolbar` | `components-table.html` + `components-table-advanced.html` | — |
| `GroupFilter` | `components-meta-filters.html` | `crm/CRMApp.jsx` → `FilterBar` |
| `Pagination` | `components-table.html` + `components-table-advanced.html` | — |
| `Card` | `components-cards.html` | — |
| `KPICard` | `components-cards.html` (KPI section) | `dashboard/DashComponents.jsx` → `KpiCard` |
| `Widget` | `components-cards.html` | `dashboard/DashComponents.jsx` → `Widget` |

### Wave 7 — Meta actions
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `PageHeader` | `components-meta-actions.html` | — |
| `SegmentedControl` | `components-meta-actions.html` (GroupButton section) | — |
| `ButtonToolbar` | `components-meta-actions.html` | — |
| `SplitButton` | `components-meta-actions.html` | — |
| `ColumnManager` | `components-meta-actions.html` + `components-table-advanced.html` | — |
| `ActionMenu` | `components-meta-actions.html` | — |
| `AdminBanner` | `components-admin-banner.html` | — |

### Wave 8 — Communication & Layout
| Component | Reference file | UI Kit reference |
|-----------|---------------|-----------------|
| `MessageBubble` | *(no preview — follow appcenter kit)* | `appcenter/App.jsx` → `ChatPanel` |
| `ConversationItem` | *(no preview — follow appcenter kit)* | `appcenter/App.jsx` → `ConversationList` |
| `AgentStatusIndicator` | *(no preview — follow appcenter kit)* | `appcenter/Components.jsx` |
| `PanelRich` | `components-panel-rich.html` | `crm/CRMApp.jsx` → `DetailPanel` |

---

## Non-negotiables (hard stops)

**Reference authority:**
- Every CSS value in a component must trace back to a token in `colors_and_type.css`
- Every visual decision must match its `preview/` HTML file
- No value is invented — if the reference doesn't define it, add it to `semantic.css` first

**Every component ships with 6 files. No exceptions:**
```
src/components/ComponentName/
├── ComponentName.tsx           ← implementation
├── ComponentName.module.css    ← structural CSS only (no colors, no sizes)
├── ComponentName.test.tsx      ← Vitest + RTL unit tests
├── ComponentName.stories.tsx   ← Storybook stories
├── ComponentName.mdx           ← documentation page
└── index.ts                    ← barrel export
```

**Zero hardcoded values in CSS modules.** All colors, sizes, radii, shadows via `var(--yes-*)`.
If a needed token doesn't exist in `semantic.css`, add it before writing the component.

**Zero `dangerouslySetInnerHTML`.** No exceptions. Icons are Lucide SVG components — not raw HTML.

**No `window`/`document` at module level.** Browser APIs only inside `useEffect`/`useCallback`.

**Buttons always `type="button"`** unless explicitly `type="submit"`.

**All event handlers via React synthetic events only.** Never `addEventListener` inside a component.

**All UI text in Colombian Spanish.** No hardcoded English strings visible to users.

---

## Development protocol (RED → GREEN → VISUAL)

Every component follows this sequence. Skipping any step is a hard stop.

### 1. SPEC — read the reference
```bash
open design-system-reference/preview/components-{name}.html
# Also read the ui_kits reference implementation if available
```
Extract: every hex value, every pixel dimension, every interactive state.
Map each value to an existing `--yes-*` token or add a new one to `semantic.css`.

### 2. RED — failing tests first
Write `ComponentName.test.tsx`. Tests required:
- Renders without crashing
- Every `tone`/`variant` prop renders the correct semantic state
- Every `size` prop applies the correct size token
- `disabled` state: `onClick` not called, `aria-disabled="true"` present
- `loading` state (where applicable): `onClick` not called, spinner visible
- `onClick` fires **exactly once** per user interaction (not zero, not two)
- Keyboard: `Enter`/`Space` activate buttons; `Escape` closes overlays
- Correct `aria-*` attributes in each state
- `data-testid` reaches the root element

Run `pnpm test` → must be RED. Paste output as evidence before proceeding.

### 3. IMPLEMENT
Write `ComponentName.tsx` + `ComponentName.module.css`.

Prop interface rules:
- Semantic variant → `tone` (never `variant`, `color`, `type`)
- Size → `size` (never `sz`, `scale`)
- Polymorphic element → `as`
- Error message → `error`
- Help text → `hint`
- Accessible label → `label` (required on all form fields)
- Spread remaining HTML props to root element after extracting own props

CSS module rules:
- Only layout/structure (flex, grid, display, position, overflow, transition)
- No color values — `var(--yes-color-*)`
- No size values — `var(--yes-size-*)` or `var(--yes-space-*)`
- No radius values — `var(--yes-radius-*)`
- No shadow values — `var(--yes-shadow-*)`
- No font values — `var(--yes-font-*)` or `var(--yes-text-*)`

### 4. GREEN — passing tests
Run `pnpm test` → must be GREEN. Paste output as evidence before proceeding.

### 5. STORY
Write `ComponentName.stories.tsx`. Required stories:
- `Default` — minimal props, shows the component in its primary state
- `AllVariants` — every `tone`/`variant` in a flex row
- `AllSizes` — sm / md / lg side by side
- `States` — disabled, loading, error (wherever applicable)
- `Interactive` — `play()` function that simulates user interaction and asserts

Run Storybook → every story must render without console errors.

### 6. VISUAL VALIDATION (mandatory gate)
Open reference side-by-side with Storybook:
```bash
open design-system-reference/preview/components-{name}.html
# In browser: resize to 700px wide
# In Storybook: navigate to AllVariants story
```
Compare pixel-by-pixel: colors, border radius, spacing, font size, font weight.
The Storybook output **must match** the reference HTML. No approximations.
This is the human gate. No component ships without visual sign-off.

### 7. DOCS
Write `ComponentName.mdx`:
- What it is (one sentence)
- Reference file path
- When to use vs alternatives
- Props table (auto from TypeScript via `autodocs`)
- Accessibility notes
- Token override example for product-level customization
- Migration guide: how to replace the existing implementation (DaisyUI, inline styles, etc.)

### 8. EXPORT
```typescript
// src/index.ts — uncomment the line for this component
export { ComponentName } from './components/ComponentName'
```
Run `pnpm build` → confirm `dist/` updates correctly.

---

## Token mapping reference (colors_and_type.css → --yes-* semantic)

| Reference var | YES token | Value |
|--------------|-----------|-------|
| `--brand-blue` | `--yes-color-primary` | `#2B52A0` |
| `--brand-green` | `--yes-color-brand-accent` | `#8CBC39` |
| `--blue-900` | `--yes-color-sidebar-bg` | `#142860` |
| `--neutral-50` | `--yes-color-bg` | `#F9FAFB` |
| `#F3F4F6` | `--yes-color-bg` (app) | neutral-100 |
| `#FFFFFF` | `--yes-color-surface` | white |
| `--neutral-200` | `--yes-color-border` | `#E5E7EB` |
| `--neutral-300` | `--yes-color-border-strong` | `#D1D5DB` |
| `--neutral-900` | `--yes-color-text` | `#111827` |
| `--neutral-500` | `--yes-color-text-muted` | `#6B7280` |
| `--neutral-400` | `--yes-color-text-subtle` | `#9CA3AF` |
| `--success-600` | `--yes-color-success` | `#16A34A` |
| `--error-600` | `--yes-color-danger` | `#DC2626` |
| `#D97706` | `--yes-color-warning` | amber-600 |
| `#2563EB` | `--yes-color-info` | blue-600 |
| `--font-display` | `--yes-font-display` | `'Barlow Semi Condensed'` |
| `--font-heading` | `--yes-font-heading` | `'Barlow'` |
| `--font-body` | `--yes-font-sans` | `'Manrope'` |
| `--font-mono` | `--yes-font-mono` | `'JetBrains Mono'` |
| `--radius-md` | `--yes-radius-btn` | `6px` |
| `--radius-lg` | `--yes-radius-card` | `8px` |
| `--radius-xl` | `--yes-radius-modal` | `12px` |
| `--radius-full` | `--yes-radius-badge` | `9999px` |
| `--btn-height-sm` | `--yes-size-height-sm` | `30px` |
| `--btn-height-md` | `--yes-size-height-md` | `36px` |
| `--btn-height-lg` | `--yes-size-height-lg` | `44px` |
| `--sidebar-width` | `--yes-size-sidebar-width` | `220px` |
| `--sidebar-bg` | `--yes-color-sidebar-bg` | `#142860` |

---

## Prop interface patterns

### Base props (all components)
```typescript
import type { BaseProps } from '../../types/shared'

interface MyComponentProps extends BaseProps {
  // 'className' → appended to root, never overrides internal classes
  // 'style'     → dynamic token overrides only
  // 'data-testid' → reaches root element
}
```

### Interactive components (Button, etc.)
```typescript
tone?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
size?: 'sm' | 'md' | 'lg'
as?: React.ElementType   // polymorphic
disabled?: boolean       // sets aria-disabled, prevents onClick
isLoading?: boolean      // spinner + disabled
```

### Form fields (Input, Select, Textarea)
```typescript
label: string            // required — never optional
hideLabel?: boolean      // visually hides label, keeps it for screen readers
name?: string
error?: string           // triggers error state + aria-invalid
hint?: string            // help text below field
disabled?: boolean
required?: boolean
```

---

## Test pattern
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName label="Test" />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  it('calls onClick exactly once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ComponentName onClick={onClick}>Acción</ComponentName>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ComponentName disabled onClick={onClick}>Acción</ComponentName>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
```

## Story pattern
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'One-sentence description. Reference: `design-system-reference/preview/components-name.html`',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = { args: { children: 'Etiqueta' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'danger', 'ghost', 'outline'] as const).map(
        (tone) => <ComponentName key={tone} tone={tone}>{tone}</ComponentName>
      )}
    </div>
  ),
}

export const Interactive: Story = {
  args: { children: 'Clic aquí' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByRole('button')).toBeVisible()
  },
}
```

---

## Commands
```bash
pnpm dev           # Storybook en :6006
pnpm test          # Vitest una vez
pnpm test:watch    # Vitest en modo observación
pnpm test:coverage # Reporte de cobertura
pnpm build         # Compila librería → dist/
pnpm check-dist    # Verifica que dist/ tenga todos los archivos
pnpm typecheck     # TypeScript sin compilar
```

## Git rules
- Commits en español
- Nunca hacer commit sin instrucción explícita
- No añadir líneas de co-autor
