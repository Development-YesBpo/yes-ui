# Changelog

All notable changes to `@yes/ui` are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-05-24

Library complete. 42 components across 8 thematic waves. 482 passing tests,
clean `tsc --noEmit`, all exports load from `dist/index.cjs`. Every component
visually verified rendering in Storybook with Spanish content and proper
ARIA roles.

### Added — Wave 8 — Communication & Layout
- `AgentStatusIndicator` — 5 status states (Disponible / Ocupado / En llamada / Descanso / Desconectado), dot + optional label, sm/md sizes
- `ConversationItem` — single conversation row with Avatar + name + timestamp + last-message preview + ChannelBadge + unread count
- `MessageBubble` — chat bubble with own/other variants, incoming bubbles include Avatar + name, timestamp inline
- `PanelRich` — right-side detail panel with Avatar+meta header, tablist (Info / Historial / Notas), Info field grid, Historial list, Notas textarea + save

### Added — Wave 7 — Meta Actions
- `PageHeader` — breadcrumb + title + subtitle + actions slot
- `SegmentedControl` — single-select grouped buttons with `aria-pressed`, 2 variants (icon+text, text-only)
- `ButtonToolbar` — `toolbar` role wrapper + `ToolbarButton` sub-export
- `SplitButton` — main action + dropdown trigger, Escape to close, danger items
- `ColumnManager` — visible-columns checklist with locked column support, Restablecer + Aplicar footer
- `ActionMenu` — overflow menu (`role="menu"`), opens on trigger click, sections, danger items, Escape + outside-click close
- `AdminBanner` — top-of-page status banner, 4 variants (amber / blue / neutral / red), `role="status"` for live region

### Added — Wave 6b — Tables
- `Table` — `<table>` semantics, sortable columns, row selection, optional Pagination integration, Skeleton loading state, EmptyState
- `TableAdvanced` — extends Table with bulk action bar, multi-sort priority badges, column manager dropdown, per-column resize handles

### Added — Wave 6a — Data Containers
- `Pagination` — page navigation with `«` / `‹` / page numbers / `›` / `»`, optional page-size selector
- `Card` — surface with optional header / body / footer slots, interactive variant
- `KPICard` — label + large value + optional delta (auto-direction) + optional icon
- `Widget` — titled container with action slot, used for charts and structured panels
- `Toolbar` — search + filter button (with active count badge) + filter chips + actions slot
- `GroupFilter` — multi-control filter panel + Limpiar / Aplicar footer
- `BulkActionBar` — selection-aware action bar, renders only when count > 0, danger separator

### Added — Wave 5 — Overlay
- `Modal` — centered dialog via React Portal, sm/md/lg sizes, focus trap, Escape + overlay-click close, optional footer
- `Drawer` — slide-from-right panel via React Portal, md/lg sizes, focus trap, Escape + overlay-click close
- `FilterPanel` — floating filter panel (not a modal — no focus trap, no portal), `FilterPanel.Group` sub-export

### Added — Wave 4 — Navigation
- `Tabs` — controlled tablist, `underline` and `contained` variants, keyboard Enter/Space activation, count badges
- `Sidebar` — product navigation rail, collapsed mode, grouped items, footer with Avatar + name + role + logout

### Added — Wave 3 — Feedback
- `Alert` — inline status block with 4 tones (success / error / warning / info)
- `Toast` — transient notification + `ToastContainer` + `useToast` hook, auto-dismiss
- `Skeleton` — animated shimmer placeholder
- `EmptyState` — empty-list illustration + title + description + action

### Added — Wave 2 — Form Controls
- `Input` — single-line text input with label / hint / error states
- `Select` — native select with the same label / hint / error contract
- `Textarea` — multi-line text input
- `Toggle` — on/off switch with label
- `SearchInput` — text input with search icon, hideable label
- `Checkbox` — checkbox with label, supports `indeterminate`

### Added — Wave 1 — Atoms
- `Icon` — Lucide wrapper enforcing 1.75 stroke + `currentColor`
- `Avatar` — initials or image avatar with 3 sizes
- `Spinner` — animated loading indicator
- `Button` — primary / secondary / danger / ghost / outline tones, sm/md/lg sizes, loading state
- `Badge` — semantic status pill (success / error / warning / info / neutral / blue)
- `ChannelBadge` — communication channel badge (WhatsApp / SMS / Voz / Correo)
- `Chip` — filter chip with optional dismiss button

### Added — Foundations
- Token architecture: primitives → semantic → themes (light, dark)
- Hooks: `useId`, `useFocusTrap`, `useControllable`
- Utils: `cn` (clsx wrapper)
- Storybook 8 configuration with a11y + interactions addons
- Vitest configuration with jsdom and 80% coverage thresholds
- tsup build configuration (ESM + CJS + d.ts)

### Fixed
- `Chip` — completed missing `.module.css`, `.stories.tsx`, `.mdx` files (6-files rule)
- `Toast` — Default story rewritten to use `render` function so it shows visibly
- `Tabs.tsx` and `Sidebar.tsx` — added explicit `import React from 'react'` to match Button convention and silence IDE TS-server staleness
- Wave 4–8 stories: removed `tags: ['autodocs']` because Storybook 8.6 treats `autodocs + MDX` as a fatal indexing error
- Wave 1 atoms — added structural-intent `.module.css` placeholders to Badge / Button / ChannelBadge / Icon / Spinner

### Notes
- All components use inline `React.CSSProperties` + injected `<style>` blocks instead of CSS Modules. The `.module.css` files exist per the 6-files contract but are not imported — tsup's esbuild build does not currently have a working CSS Modules loader. Each `.module.css` documents the structural intent of its component.
- All UI text is in Colombian Spanish.
- Zero `dangerouslySetInnerHTML` in the package. All events via React synthetic events. Buttons explicitly `type="button"`.

---

## [0.1.0] — initial scaffold

### Added
- Project scaffold: tooling, token system, shared types, hooks, utils
- Token architecture: primitives → semantic → themes (light, dark)
- `useId` — SSR-safe stable ID hook
- `useFocusTrap` — keyboard focus trap for Modal/Drawer
- `useControllable` — controlled/uncontrolled state bridge
- `cn` — class name utility (clsx)
- Storybook 8 configuration with a11y and interactions addons
- Vitest configuration with jsdom and 80% coverage thresholds
- tsup build configuration (ESM + CJS + d.ts)
