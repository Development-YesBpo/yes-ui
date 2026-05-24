# @yes/ui

YES BPO unified UI component library. Replaces the independently-built component sets across AppCenter, CRM v1, DASHBOARD, AUTO-NOM, PECS, YES Links, and Lead Getter with a single, tokenized, tested, and documented source of truth.

**Current state:** v1.0.0 — 42 components across 8 thematic waves, 482 passing tests, full Storybook documentation. See [CHANGELOG](./CHANGELOG.md) for the full release log and [docs/HANDBOOK.md](./docs/HANDBOOK.md) for the operations guide (how to run, capture evidence, report, and verify).

---

## Component catalog

42 components grouped by the wave in which they shipped. Every component is exported by name from `@yes/ui` and documented in Storybook (`pnpm dev` → http://localhost:6006).

| Wave | Theme | Components |
|------|-------|------------|
| 1 | Atoms | `Icon` · `Avatar` · `Spinner` · `Button` · `Badge` · `ChannelBadge` · `Chip` |
| 2 | Form controls | `Input` · `Select` · `Textarea` · `Toggle` · `SearchInput` · `Checkbox` |
| 3 | Feedback | `Alert` · `Toast` (+ `ToastContainer`, `useToast`) · `Skeleton` · `EmptyState` |
| 4 | Navigation | `Tabs` · `Sidebar` |
| 5 | Overlay | `Modal` · `Drawer` · `FilterPanel` (+ `FilterPanel.Group`) |
| 6a | Data containers | `Pagination` · `Card` · `KPICard` · `Widget` · `Toolbar` · `GroupFilter` · `BulkActionBar` |
| 6b | Tables | `Table` · `TableAdvanced` |
| 7 | Meta actions | `PageHeader` · `SegmentedControl` · `ButtonToolbar` (+ `ToolbarButton`) · `SplitButton` · `ColumnManager` · `ActionMenu` · `AdminBanner` |
| 8 | Communication & layout | `AgentStatusIndicator` · `ConversationItem` · `MessageBubble` · `PanelRich` |

---

## Installation

```bash
pnpm add @yes/ui
```

Peer dependencies (install if not already present):

```bash
pnpm add react react-dom
```

---

## Setup

### 1. Import tokens

Add to your app's global CSS entry point (e.g. `globals.css`, `main.css`):

```css
/* Required — raw scale values */
@import '@yes/ui/tokens/primitives';

/* Required — semantic token mappings (light theme by default) */
@import '@yes/ui/tokens/default';

/* Optional — dark theme overrides */
@import '@yes/ui/tokens/themes/dark';
```

Or in your JS/TS entry:

```ts
import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
// import '@yes/ui/tokens/themes/dark'  // optional
```

### 2. Apply theme attribute (optional)

To enable dark mode on a specific subtree:

```html
<div data-yes-theme="dark">
  <!-- dark-themed content here -->
</div>
```

To toggle globally, set `data-yes-theme` on `<html>` or `<body>`.

---

## Usage

```tsx
import { Button, Badge, Input } from '@yes/ui'

function MyPage() {
  return (
    <div>
      <Input
        label="Nombre del cliente"
        name="customerName"
        onChange={(e) => setValue(e.target.value)}
      />
      <Badge variant="success">Activo</Badge>
      <Button tone="primary" onClick={handleSave}>
        Guardar cambios
      </Button>
    </div>
  )
}
```

---

## Token customization

Override semantic tokens in your product's CSS to adapt the library to your product's context without forking components:

```css
/* my-product/globals.css */
@import '@yes/ui/tokens/primitives';
@import '@yes/ui/tokens/default';

/* Override only what differs in this product */
:root {
  --yes-color-primary: #0070f3;
  --yes-color-sidebar-bg: #111111;
}
```

Components consume `--yes-*` variables — they automatically reflect your overrides.

---

## Component checklist (for contributors)

Every component in `@yes/ui` must have:

- [ ] `ComponentName.tsx` — implementation
- [ ] `ComponentName.module.css` — structural CSS only (no colors/sizes, use tokens)
- [ ] `ComponentName.test.tsx` — Vitest + RTL unit tests
- [ ] `ComponentName.stories.tsx` — Storybook stories (Default, AllTones, AllSizes, Interactive)
- [ ] `ComponentName.mdx` — Storybook documentation page
- [ ] `index.ts` — barrel export
- [ ] Entry in `src/index.ts`

---

## Prop interface conventions

All components share these base props:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Appended to root element. Never overrides internal structure. |
| `style` | `CSSProperties` | For dynamic token overrides only. |
| `data-testid` | `string` | Passed to root element for testing. |

Interactive components add:

| Prop | Type | Description |
|------|------|-------------|
| `tone` | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'outline'` | Semantic color variant. |
| `size` | `'sm' \| 'md' \| 'lg'` | Component size. |
| `as` | `React.ElementType` | Polymorphic element override. |
| `disabled` | `boolean` | Sets aria-disabled and prevents interaction. |

Form fields add:

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Required. Accessible label (visible or screen-reader-only). |
| `hideLabel` | `boolean` | Visually hides label but keeps it for screen readers. |
| `error` | `string` | Error message. Triggers error state and aria-invalid. |
| `hint` | `string` | Help text below the field. |

---

## Development

```bash
pnpm install
pnpm dev          # Storybook on :6006
pnpm test         # Vitest
pnpm test:watch   # Vitest watch mode
pnpm build        # tsup + copy tokens → dist/
pnpm typecheck    # tsc --noEmit
```

---

## Safety guarantees

- **No CSS leaking** — structural styles are CSS Modules (hashed class names). Token CSS only sets `--yes-*` custom properties.
- **No double triggers** — all event handlers via React synthetic events. Buttons have explicit `type="button"` unless overridden.
- **SSR safe** — no `window`/`document` access at module level. All browser APIs inside effects.
- **No XSS vectors** — zero `dangerouslySetInnerHTML` in the package.
- **Peer deps not bundled** — `react` and `react-dom` are peerDependencies; no double-React in host apps.
