# @yes/ui — Execution, Development, Validation & Delivery Plan

**Date:** 2026-05-22
**Package:** `@yes/ui`
**Location:** `4Yes/yes-ui/`
**First consumers:** lead-getter, DASHBOARD

---

## Context

`@yes/ui` is the YES BPO unified UI component library. It replaces independently-built
component sets across 7 products (AppCenter, CRM v1, DASHBOARD, AUTO-NOM, PECS,
YES Links, Lead Getter) with a single tokenized, tested, and documented source.

The design source of truth is `design-system-reference/`. All component work derives
from files in that directory. Nothing is invented — every visual decision traces back
to a file in `design-system-reference/`.

---

## Pipeline — 5 Stages

### Stage 1 — Design (Claude Design)

Claude Design operates with the `design-system-reference/` content as its system prompt.
It generates new component files in the format established by the reference:

- `preview/components-{name}.html` — self-contained visual spec card (inline styles, 700px wide)
- `ui_kits/{product}/Components.jsx` — React prototype with inline style objects

Generated files land in `design-system-reference/incoming/`.

### Stage 2 — Human Checkpoint

The user reviews every file in `incoming/` before any translation begins.

- **Approve:** Move file(s) to the appropriate location in `design-system-reference/`
  (`preview/` for HTML spec cards, `ui_kits/` for JSX prototypes)
- **Reject:** Iterate with Claude Design until the output is right

No translation starts without explicit human approval of the incoming file.

### Stage 3 — Translation (Claude Code)

Claude Code reads the approved file(s) and runs four passes:

**Pass 1 — Value extraction**
Every hardcoded value is extracted from the HTML/JSX: hex colors, px dimensions,
font sizes, border radii, shadows, font families. A complete map is built before
any code is written.

**Pass 2 — Token mapping**
Each extracted value is mapped to the nearest `--yes-*` token:

```
#2B52A0   → --yes-color-primary
#142860   → --yes-color-sidebar-bg
#E5E7EB   → --yes-color-border
#F3F4F6   → --yes-color-bg
6px       → --yes-radius-btn
8px       → --yes-radius-card
36px      → --yes-size-height-md
'Manrope' → --yes-font-sans
```

If a value has no existing token within tolerance (±2px for radii and heights,
±4px for spacing, exact match required for colors), it is added to `semantic.css`
first with a comment tracing it to the source file. No hardcoded value survives
into the component CSS.

**Pass 3 — Size variant inference**
The generated file typically shows one size (md). Claude Code derives sm and lg
by applying the token scale proportionally:

```
height 36px (md) → sm = --yes-size-height-sm (30px), lg = --yes-size-height-lg (44px)
font 13px (md)   → sm = --yes-size-text-sm,           lg = --yes-size-text-lg
padding 16px (md)→ sm = --yes-size-px-sm,             lg = --yes-size-px-lg
```

**Pass 4 — Prop interface derivation**
Visual variants in the design are mapped to the unified prop interface.
No new prop names are invented without justification. Defaults:

| Design concept | Prop name |
|---------------|-----------|
| Semantic color variant | `tone` |
| Component size | `size` |
| Polymorphic element | `as` |
| Error message | `error` |
| Help text | `hint` |
| Accessible label | `label` |
| Loading state | `isLoading` |
| Disabled state | `disabled` |

**Output per component:**
```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
├── ComponentName.mdx
└── index.ts
```

### Stage 4 — Validation

Three gates in sequence. All three must pass before a component is marked done.

**Gate 1 — RED (machine evidence)**
Failing tests written before implementation. Vitest output pasted as evidence.
Required test coverage per component:
- Renders without crashing
- All `tone` variants render correct semantic state
- All `size` variants apply correct token
- `disabled`: onClick not called, `aria-disabled` present
- `isLoading`: onClick not called, spinner visible
- onClick fires exactly once per interaction
- Keyboard: Enter/Space activate; Escape closes overlays
- Correct `aria-*` attributes per state
- `data-testid` reaches root element

**Gate 2 — GREEN (machine evidence)**
All tests passing. Vitest output pasted as evidence.

**Gate 3 — VISUAL (human evidence)**
Storybook story opened alongside approved HTML reference at 700px.
Colors, border radius, spacing, font size, font weight must match.
Human sign-off required. No component ships without visual confirmation.

### Stage 5 — Delivery

```
1. Uncomment export in src/index.ts
2. pnpm build → verify dist/ outputs
3. pnpm check-dist → 7/7 files present
4. Consuming product installs via file: reference or registry
5. One-for-one component swap in the consuming product
6. Visual verify in product context
7. Tag release when wave completes
```

---

## Component Build Order — 8 Waves

Waves are sequential. All components in a wave must be GREEN + VISUAL before
the next wave begins. Components within a wave are independent and may be
translated in parallel.

### Wave 1 — Atoms
No dependencies. Build these first.

| Component | Reference file | Kit reference |
|-----------|---------------|---------------|
| Icon | Lucide (no preview) | `appcenter/Components.jsx` |
| Avatar | (no preview) | `appcenter/Components.jsx` |
| Spinner | `components-buttons.html` (loading state) | — |
| Button | `components-buttons.html` | — |
| Badge | `components-badges.html` | `appcenter/Components.jsx` → StatusBadge |
| ChannelBadge | `components-badges.html` | `appcenter/Components.jsx` → ChannelBadge |
| Chip | `components-badges.html` | `crm/CRMApp.jsx` |

### Wave 2 — Form Controls
Depends on: Icon, Spinner

| Component | Reference file |
|-----------|---------------|
| Input | `components-inputs.html` |
| Select | `components-inputs.html` |
| Textarea | `components-inputs.html` |
| Toggle | `components-inputs.html` |
| SearchInput | `components-inputs.html` |
| Checkbox | `components-inputs.html` |

### Wave 3 — Feedback
Depends on: Icon

| Component | Reference file |
|-----------|---------------|
| Alert | `components-alerts.html` |
| Toast | `components-alerts.html` |
| Skeleton | (proportional to spacing scale) |
| EmptyState | `components-cards.html` |

### Wave 4 — Navigation
Depends on: Icon, Avatar, Badge

| Component | Reference file |
|-----------|---------------|
| Sidebar | `components-nav.html` |
| Tabs | `components-nav.html` |

### Wave 5 — Overlay
Depends on: Button, useFocusTrap (already built)

| Component | Reference file |
|-----------|---------------|
| Modal | `components-modals.html` |
| Drawer | `components-modals.html` |
| FilterPanel | `components-meta-filters.html` |

### Wave 6 — Data Display
Depends on: Badge, ChannelBadge, Checkbox, Button, Chip

Build order within this wave: Pagination and Card first (no internal deps),
then Toolbar, GroupFilter, BulkActionBar, then Table, TableAdvanced, KPICard, Widget.

| Component | Reference file |
|-----------|---------------|
| Pagination | `components-table.html` + `components-table-advanced.html` |
| Card | `components-cards.html` |
| Toolbar | `components-table.html` |
| GroupFilter | `components-meta-filters.html` |
| BulkActionBar | `components-table-advanced.html` + `components-meta-filters.html` |
| Table | `components-table.html` |
| TableAdvanced | `components-table-advanced.html` |
| KPICard | `components-cards.html` |
| Widget | `components-cards.html` |

### Wave 7 — Meta Actions
Depends on: Button, Checkbox, Sidebar

| Component | Reference file |
|-----------|---------------|
| PageHeader | `components-meta-actions.html` |
| SegmentedControl | `components-meta-actions.html` |
| ButtonToolbar | `components-meta-actions.html` |
| SplitButton | `components-meta-actions.html` |
| ColumnManager | `components-meta-actions.html` |
| ActionMenu | `components-meta-actions.html` |
| AdminBanner | `components-admin-banner.html` |

### Wave 8 — Communication & Layout
Depends on: Avatar, ChannelBadge, Badge

| Component | Reference file |
|-----------|---------------|
| MessageBubble | `appcenter/App.jsx` → ChatPanel |
| ConversationItem | `appcenter/App.jsx` → ConversationList |
| AgentStatusIndicator | `appcenter/Components.jsx` |
| PanelRich | `components-panel-rich.html` |

---

## Versioning

```
0.1.0 — Wave 1 (Atoms)
0.2.0 — Wave 2 (Form controls)
0.3.0 — Wave 3 (Feedback)
0.4.0 — Wave 4 (Navigation)
0.5.0 — Wave 5 (Overlay)
0.6.0 — Wave 6 (Data display — Table ships here)
0.7.0 — Wave 7 (Meta actions)
0.8.0 — Wave 8 (Communication)
1.0.0 — All 39 components, full visual validation, first production consumer
```

Patch releases (`0.x.y`) for fixes within a wave. No breaking changes within a minor.

---

## Consumption

**During development (local):**
```json
"dependencies": { "@yes/ui": "file:../../yes-ui" }
```

**Production:** Private npm registry or npm public. CI release workflow
triggers on `vX.Y.Z` tag push.

**Migration protocol per product (never big-bang):**
```
1. Install @yes/ui + import token CSS in globals
2. Pick one page or feature using the target component
3. Swap: DaisyUI/inline → @yes/ui equivalent
4. Verify: visual match + no regressions
5. Ship that page — repeat for next component
```

**First consumer:** lead-getter or DASHBOARD — whichever has the highest
density of Wave 1 components in production use.

---

## Success Criteria

A component is done when all three are true:
1. `pnpm test` — all tests green, coverage threshold met
2. `pnpm build` — `pnpm check-dist` passes (7/7 dist files)
3. VISUAL — Storybook AllVariants story matches the approved HTML reference at 700px

The package ships a wave when every component in the wave meets all three criteria.
Version `1.0.0` ships when all 8 waves are complete and the first consuming product
has replaced at least one component of each wave in production.
