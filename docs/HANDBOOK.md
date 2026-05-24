# `@yes/ui` Operations Handbook

The single canonical reference for working in this repository. Covers what we're building, where we are, and the operational mechanics for the 4 things you'll do every day: **run**, **add**, **capture**, **report**, **verify**.

> If you only read one document in this repo, read this one. `CLAUDE.md` is the deeper authoring spec; `README.md` is the consumer-facing intro.

---

## 1 · What we are doing

`@yes/ui` is the unified React component library for YES BPO. It replaces the per-product component sets in **AppCenter**, **CRM v1**, **DASHBOARD**, **AUTO-NOM**, **PECS**, **YES Links**, and **Lead Getter** with a single tokenized, tested, and Storybook-documented source of truth.

### Scope

- 42 React components grouped into 8 thematic waves
- Token system: primitives → semantic → themes (light, dark)
- Zero hardcoded design values — every visual decision routes through a `--yes-*` token
- Spanish (Colombia) UI text throughout
- SSR-safe, no `dangerouslySetInnerHTML`, all events via React synthetic events
- Distributed as ESM + CJS + `.d.ts` via tsup, with separate token CSS files

### Authority

The single source of truth for design decisions is `design-system-reference/`:

- `design-system-reference/colors_and_type.css` — canonical hex values and type scale
- `design-system-reference/preview/components-*.html` — per-category visual specs at 700 px
- `design-system-reference/ui_kits/` — working React prototypes from each product

The pipeline from reference to library token is documented in `CLAUDE.md` → *Token mapping reference*.

---

## 2 · Current state

| Metric | Value |
|--------|-------|
| Version | 1.0.0 |
| Components shipped | 42 (42/42 indexed in Storybook) |
| Named exports | 47 (42 components + `ToastContainer`, `useToast`, `FilterPanel.Group`, `ToolbarButton`, `useFocusTrap`) |
| Test files | 42 |
| Total tests | 482 passing |
| `pnpm typecheck` | clean (exit 0) |
| `pnpm build` | ESM 173 KB · CJS 178 KB · d.ts 24 KB |
| Storybook entries | 207 |

See [CHANGELOG.md](../CHANGELOG.md) for the per-wave history.

### Wave map

```
Wave 1 — Atoms                 7   Icon · Avatar · Spinner · Button · Badge · ChannelBadge · Chip
Wave 2 — Form controls         6   Input · Select · Textarea · Toggle · SearchInput · Checkbox
Wave 3 — Feedback              4   Alert · Toast · Skeleton · EmptyState
Wave 4 — Navigation            2   Tabs · Sidebar
Wave 5 — Overlay               3   Modal · Drawer · FilterPanel
Wave 6a — Data containers      7   Pagination · Card · KPICard · Widget · Toolbar · GroupFilter · BulkActionBar
Wave 6b — Tables               2   Table · TableAdvanced
Wave 7 — Meta actions          7   PageHeader · SegmentedControl · ButtonToolbar · SplitButton · ColumnManager · ActionMenu · AdminBanner
Wave 8 — Communication         4   AgentStatusIndicator · ConversationItem · MessageBubble · PanelRich
                              ──
                              42
```

---

## 3 · How to run

### Prerequisites

Node 22 (via nvm). Homebrew's Node may be broken on macOS by `icu4c` mismatches, so prefix every shell:

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
```

### Daily commands

| Goal | Command | Notes |
|------|---------|-------|
| Storybook (visual sandbox) | `pnpm dev` | Serves on http://localhost:6006. Hot-reloads on file change. |
| Run all tests once | `pnpm test` | Vitest + jsdom. ~20s for the full 482-test suite. |
| Tests in watch mode | `pnpm test:watch` | Re-runs the affected files when you save. |
| Tests with coverage | `pnpm test:coverage` | Requires 80 % across statements / branches / lines / functions. |
| TypeScript check | `pnpm typecheck` | `tsc --noEmit`. Must be exit 0 before commit. |
| Build library | `pnpm build` | tsup → `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`. Then `node scripts/copy-tokens.mjs` mirrors token CSS into `dist/tokens/`. |
| Verify build artifacts | `pnpm check-dist` | Asserts every required file exists in `dist/`. |
| Build Storybook (static) | `pnpm build:storybook` | Outputs to `storybook-static/`. |

### Port collision on 6006

Storybook prompts interactively if `:6006` is busy. To check what's holding the port:

```bash
lsof -i :6006
```

If it's a stale Storybook from a prior session, kill the PID and re-run. Never accept the `:6007` fallback — every script in this handbook assumes `:6006`.

---

## 3.5 · Layout utilities (`@yes/ui/styles/layout`)

`@yes/ui` does not ship Stack / Grid / Container components — composition is the consumer's job. To avoid every consumer hand-rolling the same flex / grid / spacing rules, v1.2.0 adds an **optional** utility stylesheet:

```ts
import '@yes/ui/styles/layout'  // optional: utility classes for layout
```

It exposes a small set of `yes-`-prefixed classes (`.yes-stack`, `.yes-row`, `.yes-grid-{2,3,4,6}`, `.yes-gap-{1..8}`, `.yes-p-{1..8}` and its `px-` / `py-` variants, `.yes-m-{1..8}` and its `mx-` / `my-` / `mt-` / `mb-` / `mt-auto` variants, alignment helpers — `yes-items-*`, `yes-justify-*`, `yes-text-center`, `yes-text-right` — sizing — `yes-flex-1`, `yes-flex-auto`, `yes-w-full`, `yes-h-full`, `yes-min-h-screen` — surfaces — `yes-page`, `yes-app-shell`, `yes-main` — and typography helpers `yes-h1`, `yes-h2`, `yes-text-muted`, `yes-text-subtle`). Every value routes through an existing `--yes-*` semantic token: no hardcoded spacing, color, or radius. The mapping from utility index (`1..8`) to the underlying `--yes-space-*` token is documented at the top of `src/styles/layout.css`.

Apps that prefer their own layout primitives (Tailwind, CSS Modules, styled-components) simply omit the import — there's no runtime cost when it's not loaded.

---

## 4 · How to add a component (6-phase YES TDD)

Every component follows the same Plan → 🔴 RED → Implement → 🟢 GREEN → Refactor → Automate loop. Each transition demands machine-readable evidence (pasted test output, not prose).

### Phase 0 — Pre-flight

1. Read the reference: `design-system-reference/preview/components-{name}.html` and, when applicable, the `ui_kits/` prototype.
2. Extract every hex / px / radius / shadow / font value.
3. Map each to an existing `--yes-*` token in `src/tokens/semantic.css`. If a value has no token, add it to `semantic.css` FIRST.

### Phase 1 — Plan

List the test cases you'll write. Typical baseline (from `CLAUDE.md` § Tests required):

- Renders without crashing
- Every `tone` / `variant` renders the correct semantic state
- Every `size` applies the correct token
- `disabled` blocks `onClick` and sets `aria-disabled="true"`
- Keyboard: `Enter` / `Space` activate buttons, `Escape` closes overlays
- Correct `aria-*` attributes in each state
- `onClick` fires exactly once per user interaction
- `data-testid` reaches the root element

### Phase 2 — 🔴 RED

Write `ComponentName.test.tsx`. Run:

```bash
pnpm test --reporter=verbose src/components/ComponentName/ComponentName.test.tsx
```

Must FAIL with a clear "Cannot find module" or assertion-mismatch error. Paste the full failing output as proof in your task report.

### Phase 3 — Implement

Create the remaining 5 files:

```
src/components/ComponentName/
├── ComponentName.tsx           # implementation (inline React.CSSProperties + injected <style> for :hover etc.)
├── ComponentName.module.css    # structural-intent placeholder (see "CSS Modules note" below)
├── ComponentName.stories.tsx   # Storybook stories — NO `tags: ['autodocs']` (collides with the .mdx)
├── ComponentName.mdx           # docs (auto-discovered by Storybook)
└── index.ts                    # barrel: `export { ComponentName } from './ComponentName'; export type { ... }`
```

Then wire the barrel into `src/index.ts`.

**Imports:**
- `import React from 'react'` at the top of every `.tsx` (matches `Button.tsx` and silences IDE TS-server staleness).
- Compose Wave-N primitives directly: `import { Avatar } from '../Avatar/Avatar'`.

**CSS Modules note:** This repo's `tsup`/`esbuild` build does not have a working CSS Modules loader. Every component uses inline `React.CSSProperties` for layout + token values, plus an injected `<style>` block (guarded by `typeof document !== 'undefined'`) for selectors that can't be inlined: `:hover`, `:focus-visible`, `[aria-current='page']`, descendant rules. The `.module.css` file is kept per the 6-files-per-component contract and documents the structural intent verbatim — but it is **not imported** anywhere.

### Phase 4 — 🟢 GREEN

```bash
pnpm test --reporter=verbose src/components/ComponentName/ComponentName.test.tsx
```

Every assertion must pass. Paste the full PASSED output as proof.

### Phase 5 — Refactor

If you change anything to clean up the implementation, re-run vitest. GREEN must hold. Paste output again as proof.

### Phase 6 — Automate

```bash
pnpm typecheck                            # must exit 0
pnpm build                                # must succeed
node -e "const { ComponentName } = require('./dist/index.cjs'); if (!ComponentName) { console.error('MISSING'); process.exit(1); } console.log('export OK')"
```

Paste the full outputs of all three.

---

## 5 · How to capture visual evidence

Visual verification is part of completion. Storybook is the canvas; **Playwright (via the MCP server) is the camera**. Storybook visual gates are not human-only — drive them yourself.

### A · Manual sanity check

Run Storybook and open the canonical story per component:

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm dev
# Open http://localhost:6006/?path=/story/wave-{N}-{theme}-{component}--{variant}
```

### B · Programmatic verification (recommended)

For every component, navigate to the canonical story, then evaluate the rendered DOM. Two-call pattern per story:

```ts
// 1. Navigate
await page.goto('http://localhost:6006/iframe.html?id=wave-1-atoms-button--default&viewMode=story');

// 2. Evaluate (poll for storybook-root population, return compact summary)
async () => {
  for (let i = 0; i < 30; i++) {
    const r = document.querySelector('#storybook-root');
    if (r && r.children.length > 0) break;
    await new Promise(r => setTimeout(r, 100));
  }
  const root = document.querySelector('#storybook-root');
  return {
    childCount: root?.children.length || 0,
    text: (root?.textContent || '').slice(0, 100).replace(/\s+/g, ' ').trim(),
    svg: root?.querySelectorAll('svg').length || 0,
    btn: root?.querySelectorAll('button').length || 0,
    inp: root?.querySelectorAll('input,textarea,select').length || 0,
    hasErr: !!document.querySelector('.sb-errordisplay__error'),
  };
};
```

**Pass criteria:**
- `childCount > 0` AND `hasErr === false`
- `text` contains expected Spanish content for the component (e.g. "Guardar", "Activo", "Conversaciones")
- Expected element counts match (e.g. a `Pagination` story should show `btn > 5`)

**Portal-rendered components** (`Modal`, `Drawer`): use `document.querySelector('[role=dialog]')` instead of `#storybook-root`, because React Portals render outside the root.

### C · One-off screenshot when you need pixels

```ts
await page.screenshot({ path: 'wave-1-button-default.png', fullPage: true });
```

Prefer accessibility snapshots (`browser_snapshot`) over screenshots — they're cheaper, faster, and machine-readable. Reserve screenshots for hand-off artifacts and design-vs-implementation comparisons against `design-system-reference/preview/*.html`.

### D · The `index.json` trick

Storybook serves a manifest at `http://localhost:6006/index.json` listing every story ID. Use it to discover stories programmatically:

```ts
const r = await fetch('http://localhost:6006/index.json');
const d = await r.json();
const w8 = Object.keys(d.entries).filter(k => /wave-8/.test(k));
```

### E · Avoid this trap

**Storybook fatal-indexes any story with both `tags: ['autodocs']` AND a sibling `.mdx`.** Symptom: `index.json` returns invalid JSON and starts with an error block. Fix: remove the `tags: ['autodocs']` line from the offending `.stories.tsx`. Every existing component in this repo has the tag stripped.

---

## 6 · How to report

Reports go in the conversation, in the task tracker, or in a `progress/` markdown file. The format is the same in all three places: machine-readable evidence first, prose second.

### Required evidence per task

1. **vitest output** — full `--reporter=verbose` block. Must include the test names, pass/fail count, and duration.
2. **`pnpm typecheck` output** — must show exit 0.
3. **`pnpm build` output** — must show "Build success" for ESM + CJS + DTS.
4. **Export check** — `node -e "..."` output proving the named export loads from `dist/index.cjs`.
5. **Visual gate verdict** — for new components, the Playwright snapshot extract showing the rendered DOM (see § 5).

### Invalid evidence

- ❌ "Tests pass." (without the output)
- ❌ A diff of the test file (without running it)
- ❌ A code snippet of the component (without the GREEN run)
- ❌ "Looks good in Storybook." (without the Playwright snapshot)
- ❌ Type signatures alone

### Report skeleton

```markdown
# Wave {N} — {Theme}: Final Report

## Pre-flight
- Deps verified in dist/: {list}
- Tokens added to semantic.css: {list}

## Per-component (one block each)
### {ComponentName} — Task {N}
**Plan:** {test case count and types}
**🔴 RED:** ```{vitest FAIL output verbatim}```
**Files created:** {paths}
**🟢 GREEN:** ```{vitest PASS output verbatim}```
**Refactor:** {none | what changed} → ```{re-run vitest output}```
**Visual gate:** ✓ ({Playwright snapshot summary}) | PENDING

## Integration
- pnpm test: ```{tail with pass count}```
- pnpm typecheck: ```{exit 0 confirmation}```
- pnpm build: ```{ESM/CJS/DTS success lines}```
- Export check: ```{node -e output}```

## Files to commit (awaiting user)
{git add glob + commit message}

## Deviations / blockers
{list, or "none"}
```

This skeleton is the canonical format every Wave report this project has shipped used. Match it.

---

## 7 · How to verify

Four gates, all mandatory before any commit lands. Run in order — earlier gates are faster and catch coarser issues.

### Gate 1 — Tests (fast, ~20s)

```bash
pnpm test
```

Must show `Test Files {N} passed ({N})` and `Tests {M} passed ({M})`. Any failure is a hard stop.

### Gate 2 — TypeScript (fast, ~10s)

```bash
pnpm typecheck
```

Exit 0 with no error output. If the IDE shows TS errors but `pnpm typecheck` is clean, the IDE TS-server is stale — restart it (`Cmd+Shift+P` → "TypeScript: Restart TS Server"). Stale IDE diagnostics have been observed across this entire session; do not chase them.

### Gate 3 — Build (medium, ~10s)

```bash
pnpm build && pnpm check-dist
```

Must show "Build success" for ESM + CJS + DTS, and `pnpm check-dist` must list every expected `dist/` file.

### Gate 4 — Visual (medium, ~30s for sweep of N components)

Two sub-steps:

**4a — Export load check:**

```bash
node -e "const x = require('./dist/index.cjs'); console.log(Object.keys(x).filter(k => k.match(/^[A-Z]/)).join(','))"
```

Output must include every component you expect to ship.

**4b — Playwright a11y snapshot per story** (see § 5). For each component, navigate to the canonical story and verify the snapshot matches expectations: roles correct, Spanish text present, no React errors.

### Pass criteria

Only when all 4 gates are GREEN: commit. Spanish commit message, no co-author lines, no commits without explicit user instruction.

---

## 8 · Known issues and intentional decisions

The v1.1.0 release resolved or formally accepted every issue from the prior list. Current state:

### Resolved in v1.1.0

- **Storybook autodocs + MDX collision** — `.storybook/main.ts` now sets `docs.autodocs: false`. The `tags: ['autodocs']` array is ignored project-wide, so adding it cannot break indexing. The `.mdx` file per component remains the canonical docs surface.
- **`--yes-text-2xl` token collision** — verified zero component consumers; the global `--yes-text-2xl: 24px` and PageHeader's local `--yes-text-page-title: 22px` coexist without conflict.
- **Avatar `size` enumerated, not numeric** — Avatar's `size` prop now accepts `Size | number` (named token OR raw pixels). Wave 8 components (`ConversationItem`, `MessageBubble`, `PanelRich`) pass numeric sizes (36 / 20 / 42).
- **`exactOptionalPropertyTypes: true` spread workaround** — Avatar's `src` is typed `string | undefined`, so `src={maybeUndefined}` works without conditional spread. All 3 Wave 8 callers simplified.

### Intentional architecture (not debt)

- **Inline `React.CSSProperties` + injected `<style>` block instead of CSS Modules.** Every component uses this pattern. The `.module.css` files in each component directory document structural intent but are **not imported** by the source. `tsup.config.ts` reflects this honestly (no more misleading `injectStyle: true`). If you ever switch the build to a CSS-Modules-aware bundler, every component needs a rewrite — that work is out of scope for the foreseeable future.

### Mitigated

- **IDE TS-server stale-diagnostics bug.** Symptom: the editor's TS server intermittently reports `Cannot find module './X'` and `Property 'toBeInTheDocument' does not exist` for files that `pnpm typecheck` accepts cleanly. The bug is cross-tool, not in our code. Mitigation: `.vscode/settings.json` pins the workspace TypeScript version (`typescript.tsdk: "node_modules/typescript/lib"`) to reduce IDE-vs-tsc drift. When the diagnostics still surface, restart the TS server (`Cmd+Shift+P` → "TypeScript: Restart TS Server"). `pnpm typecheck` remains the source of truth — never modify code in response to these phantom errors.

---

## 9 · Wave-by-wave shipped log

The conversational/git history that produced v1.0.0:

| Commit | Wave | Date | Components |
|--------|------|------|------------|
| `adb591b` | 4 + 5 | 2026-05-23 | Tabs, Sidebar, Modal, Drawer, FilterPanel |
| `c90abb4` | 6a | 2026-05-23 | Pagination, Card, KPICard, Widget, Toolbar, GroupFilter, BulkActionBar |
| `6b4ffed` | 6b | 2026-05-23 | Table, TableAdvanced |
| `e5b0f94` | 7 | 2026-05-23 | PageHeader, SegmentedControl, ButtonToolbar (+ToolbarButton), SplitButton, ColumnManager, ActionMenu, AdminBanner |
| `e792525` | 8 | 2026-05-24 | AgentStatusIndicator, ConversationItem, MessageBubble, PanelRich |
| `d7efed7` | Fix | 2026-05-24 | Chip 3 missing files + Toast Default story |

Waves 1–3 shipped in earlier sessions.

---

## 10 · Where to put new docs

| Type | Location |
|------|----------|
| Public consumer docs | `README.md` |
| Per-release notes | `CHANGELOG.md` (Keep-a-Changelog format) |
| Internal authoring contract | `CLAUDE.md` |
| Operations / workflow (this file) | `docs/HANDBOOK.md` |
| Per-wave implementation plan | `docs/superpowers/plans/{date}-yes-ui-wave-{N}-{theme}.md` |
| Per-wave progress | `docs/superpowers/progress/wave-{N}/{NN}-{component}.md` (legacy; CHANGELOG is preferred) |
| Per-component docs | `src/components/{Name}/{Name}.mdx` (Storybook-rendered) |

If you're adding a new doc and it's not in the table, ask first whether it belongs in an existing doc instead.
