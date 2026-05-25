# Claude Design Handoff → @yes/ui Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the methodology in `yes-ui/docs/handoff-pipeline/` plus the first proof-case consumer app at `~/Projects/4Yes/lead-getter-frontend/` that ports all 5 pages of the Lead Getter handoff using only `@yes/ui` exports.

**Architecture:** Two-repo deliverable. (a) `yes-ui/docs/handoff-pipeline/` — methodology docs (README + PLAYBOOK + 3 mapping tables + 2 templates + 2 checklists + decision log). (b) `~/Projects/4Yes/lead-getter-frontend/` — Vite + React + TS consumer app, sibling to yes-ui, file-linked to local @yes/ui v1.2.0. Zero backend wiring; mock data inlined.

**Tech Stack:** Markdown docs (methodology), Vite 6 + React 18 + TypeScript 5 + `"@yes/ui": "file:../yes-ui"` (consumer app), Playwright MCP for visual verification.

---

> **Node path note:** Every `pnpm` command requires:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```

> **Commit policy:** Two final commits, one per repo. Task 15 commits the yes-ui methodology; Task 16 commits the lead-getter-frontend initial scaffold. Intermediate tasks do NOT commit. Working trees stay dirty until Tasks 15–16. If a verification fails mid-plan, stop and fix before continuing.

> **Reference reading:** Read `yes-ui/docs/HANDBOOK.md` § 4–7 (run / capture / report / verify) and `yes-ui/docs/superpowers/specs/2026-05-25-handoff-pipeline-design.md` before starting. These are the source of truth for verification gates and the mapping rules.

---

## File map

### In `~/Projects/4Yes/yes-ui/`

| File | Action | Why |
|------|--------|-----|
| `docs/handoff-pipeline/README.md` | **new** | Methodology entry point |
| `docs/handoff-pipeline/PLAYBOOK.md` | **new** | The 7-phase process |
| `docs/handoff-pipeline/mappings/tokens.md` | **new** | Handoff CSS var → yes-ui token table |
| `docs/handoff-pipeline/mappings/components.md` | **new** | Handoff JSX → yes-ui export table |
| `docs/handoff-pipeline/mappings/layouts.md` | **new** | Inline-style → utility-class table |
| `docs/handoff-pipeline/templates/consumer-app-scaffold.md` | **new** | Vite + React + TS recipe |
| `docs/handoff-pipeline/templates/page-component.md` | **new** | Page-component skeleton |
| `docs/handoff-pipeline/checklists/ingestion.md` | **new** | Phase-1 gate |
| `docs/handoff-pipeline/checklists/verification.md` | **new** | Per-page + suite gates |
| `docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md` | **new** | Case-study log for this run |

### In `~/Projects/4Yes/lead-getter-frontend/` (new repo)

| File | Action |
|------|--------|
| `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `README.md`, `.vscode/settings.json` | **new** |
| `src/main.tsx`, `src/App.tsx` | **new** |
| `src/lib/nav.ts`, `src/lib/toast.tsx`, `src/lib/format.ts` | **new** |
| `src/data/prospects.ts`, `src/data/emails.ts`, `src/data/events.ts`, `src/data/workspace.ts` | **new** |
| `src/components/ScoreBar.tsx` | **new** (local composition; decision D-002) |
| `src/pages/ProspectosPage.tsx`, `src/pages/ProspectDetailPage.tsx`, `src/pages/EmailsPage.tsx`, `src/pages/ConfigPage.tsx` | **new** |

---

## Task 1: Methodology scaffold — empty doc skeleton

**Files (yes-ui):** Create the 10 files listed above with section headers but stub content. Each file gets enough structure that later tasks can fill in the body.

- [ ] **Step 1.1: Create the directory tree**

```bash
cd /Users/danieltibaquira/Projects/4Yes/yes-ui
mkdir -p docs/handoff-pipeline/{mappings,templates,checklists,decisions}
```

- [ ] **Step 1.2: Write `docs/handoff-pipeline/README.md`**

```markdown
# Claude Design Handoff → @yes/ui Pipeline

A repeatable, validated process for turning a Claude Design (claude.ai/design) handoff bundle into a production consumer app that consumes only `@yes/ui` exports.

## When to use this

You received a handoff bundle (a `.zip` or directory with `*.html`, `*.jsx`, `colors_and_type.css`) from someone who designed in claude.ai/design, and you need to build the real thing using `@yes/ui`.

## How to use this

1. Read `PLAYBOOK.md` — the 7 phases, in order.
2. Consult the three `mappings/*.md` tables as you go — they are the deterministic translation layer.
3. Scaffold the consumer app from `templates/consumer-app-scaffold.md`.
4. Run every phase against the gates in `checklists/`.
5. As you decide things, log them in `decisions/<YYYY-MM-DD>-<project>.md` using the template in `PLAYBOOK.md`.
6. Once the project ships, sync your learnings back into the mapping tables and the playbook.

## File index

- `PLAYBOOK.md` — the 7-phase process, end-to-end
- `mappings/tokens.md` — every handoff CSS variable → `--yes-*` token target
- `mappings/components.md` — every handoff JSX component → `@yes/ui` export (or local composition / explicit skip)
- `mappings/layouts.md` — every common inline-style pattern → `@yes/ui/styles/layout` utility class
- `templates/consumer-app-scaffold.md` — Vite + React + TS recipe (matches the `yes-ui-mock-app` pattern)
- `templates/page-component.md` — page-component skeleton
- `checklists/ingestion.md` — Phase 1 gate (bundle reading)
- `checklists/verification.md` — per-page and suite-wide gates
- `decisions/` — one file per handoff project, logging every non-trivial decision

## Reading order for a first-time contributor

`README.md` → `PLAYBOOK.md` → `mappings/tokens.md` → `mappings/components.md` → `mappings/layouts.md` → `templates/consumer-app-scaffold.md`.

## Provenance

First case study: `decisions/2026-05-25-lead-getter.md` — applied the playbook to the Lead Getter handoff and the consumer app at `~/Projects/4Yes/lead-getter-frontend/`.
```

- [ ] **Step 1.3: Write `docs/handoff-pipeline/PLAYBOOK.md` (skeleton)**

The PLAYBOOK gets fleshed out in later tasks as the mappings populate. For now, write the section structure with section anchors so cross-links work:

```markdown
# PLAYBOOK — Claude Design Handoff → @yes/ui

The 7-phase process. Each phase produces an artifact that gates the next.

| Phase | Input | Output | Gate |
|-------|-------|--------|------|
| 1. Ingest | Handoff bundle | `INGESTION-NOTES.md` per page | `checklists/ingestion.md` complete |
| 2. Token audit | Handoff `colors_and_type.css` | Diff appended to `mappings/tokens.md` | Zero unmapped tokens |
| 3. Component audit | Handoff JSX files | Diff appended to `mappings/components.md` | Zero unmapped components |
| 4. Scaffold consumer app | `templates/consumer-app-scaffold.md` | Consumer app directory with shell only | `pnpm dev` serves; Sidebar nav switches between empty pages |
| 5. Page-by-page port | One handoff page at a time | One consumer page file using only @yes/ui | Playwright a11y snapshot matches handoff content; `grep "style={{"` returns 0 |
| 6. Interaction wiring | Stub handlers per page | Real handlers wired (mock data, no backend) | Every button/row/form actually does what the handoff shows |
| 7. Decision log + methodology update | Notes from phases 1–6 | `decisions/<date>-<project>.md` + updates to mappings/playbook | Doc reviewed; library changes (if any) have own PR + version bump |

## Phase 1 — Ingest

Read every file in the handoff bundle. Catalogue per page: name, sections, data shape, list of interactions.

Use `checklists/ingestion.md` as the pass/fail criterion.

## Phase 2 — Token audit

Open the handoff's design-tokens CSS file. For every variable, find the equivalent in `yes-ui/src/tokens/semantic.css`. Record both in `mappings/tokens.md`. If a variable has no equivalent, STOP — open an issue against yes-ui, add the token there first, then resume.

## Phase 3 — Component audit

Open each handoff JSX file. For every component used, find the equivalent in `@yes/ui` exports. Record in `mappings/components.md`. Three outcomes per component:

1. Direct mapping to a yes-ui export.
2. Local composition (built from yes-ui exports in `src/components/` of the consumer app). Add a decision-log entry.
3. SKIP (e.g. design-time tools like `TweaksPanel`). Add a decision-log entry.

If a needed pattern recurs and has no clean local composition path, treat it like Phase 2: open an issue against yes-ui, ship the component there, resume.

## Phase 4 — Scaffold consumer app

Follow `templates/consumer-app-scaffold.md`. Outcome: a Vite + React + TS app with a Sidebar shell, page-switcher state, and one empty page per planned route.

## Phase 5 — Page-by-page port

For each page, in dependency order (shell first, then shared local compositions, then pages that consume them):

1. Read the handoff page's JSX file.
2. Identify sections (page header, table, footer, etc.) and translate each to a yes-ui composition.
3. Build the visual scaffold using only `@yes/ui` exports + `@yes/ui/styles/layout` utility classes.
4. Verify per `checklists/verification.md` (a11y snapshot match, zero inline styles, no console errors).

## Phase 6 — Interaction wiring

Layer interactions on top of the visual scaffold. Use `useState` or `useReducer` for state; the methodology forbids inline-styles BUT allows any client-side state management approach.

Verify each interaction via Playwright `browser_click` + snapshot — the snapshot must show the post-interaction state.

## Phase 7 — Decision log + methodology update

Synthesize. For each non-trivial decision made during phases 1–6, write an entry in `decisions/<YYYY-MM-DD>-<project>.md` using the template below.

Then update the mapping tables and (if applicable) the playbook so the next handoff is easier.

### Decision log entry template

```markdown
## D-NNN · <Short title>

**Phase:** <which playbook phase>
**Trigger:** <what in the handoff caused the decision>
**Options considered:**
1. <option 1>
2. <option 2>
3. <option 3>
**Decision:** <which option and why>
**Code (if any):** <file path + brief note>
**Methodology impact:** <which mapping table / playbook section / library file needs updating, or "none">
```
```

- [ ] **Step 1.4: Stub `mappings/tokens.md`**

```markdown
# Token mappings

Handoff CSS variable → `@yes/ui` `--yes-*` token. Populated per case study in Phase 2 of `PLAYBOOK.md`.

## Lead Getter (2026-05-25)

| Handoff variable | yes-ui token | Notes |
|------------------|--------------|-------|

(populated by Task 3)
```

- [ ] **Step 1.5: Stub `mappings/components.md`**

```markdown
# Component mappings

Handoff JSX component → `@yes/ui` export. Populated per case study in Phase 3 of `PLAYBOOK.md`.

Three outcomes per component:
1. **Direct** — one or more yes-ui exports.
2. **Local composition** — built in `src/components/` of the consumer app. Add decision-log entry.
3. **Skip** — design-time tool, not for production. Add decision-log entry.

## Lead Getter (2026-05-25)

| Handoff JSX | Outcome | Target | Notes |
|-------------|---------|--------|-------|

(populated by Task 4)
```

- [ ] **Step 1.6: Stub `mappings/layouts.md`**

```markdown
# Layout mappings

Handoff inline-style pattern → `@yes/ui/styles/layout` utility class.

Every handoff `style={{ ... }}` block must translate to a class combination. If no existing utility fits, add a new class to `yes-ui/src/styles/layout.css` (separate yes-ui change), do NOT inline.

## Common patterns

| Handoff inline pattern | yes-ui className |
|------------------------|------------------|
| `style={{ display: 'flex', flexDirection: 'column', gap: 16 }}` | `className="yes-stack yes-gap-4"` |
| `style={{ display: 'flex', alignItems: 'center', gap: 8 }}` | `className="yes-row yes-items-center yes-gap-2"` |
| `style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}` | `className="yes-grid-4 yes-gap-4"` |
| `style={{ flex: 1, minWidth: 0 }}` | `className="yes-flex-1"` |
| `style={{ padding: 24 }}` | `className="yes-p-6"` |
| `style={{ marginTop: 'auto' }}` | `className="yes-mt-auto"` |
| `style={{ width: '100%' }}` | `className="yes-w-full"` |
| `style={{ minHeight: '100vh' }}` | `className="yes-min-h-screen"` |

## Case-specific extensions

(extend per case study as new patterns surface)
```

- [ ] **Step 1.7: Stub `templates/consumer-app-scaffold.md`**

```markdown
# Consumer app scaffold

Vite 6 + React 18 + TypeScript 5, file-linked to local `@yes/ui`. Matches the pattern proven in `~/Projects/4Yes/yes-ui-mock-app/`.

## Directory layout

```
<consumer-app>/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── README.md
├── .vscode/settings.json
└── src/
    ├── main.tsx                # imports tokens + layout CSS from @yes/ui (only place CSS is imported)
    ├── App.tsx                 # shell: Sidebar + page switcher
    ├── lib/
    │   ├── nav.ts              # nav items
    │   ├── toast.tsx           # ToastProvider context
    │   └── format.ts           # date/score formatters (one-off helpers — NOT in @yes/ui scope)
    ├── data/                   # mock data files mirroring real API shapes
    └── pages/                  # one file per route
```

## package.json template

```json
{
  "name": "<project>-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@yes/ui": "file:../yes-ui",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.9.0",
    "vite": "^6.4.0"
  }
}
```

## tsconfig.json template

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

## vite.config.ts template

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## index.html template

```html
<!DOCTYPE html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><Project Name></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/main.tsx template (ONLY place CSS is imported)

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
import '@yes/ui/styles/layout'

import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>)
```

## .vscode/settings.json (pin TS workspace)

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## .gitignore

```
node_modules/
dist/
*.log
.DS_Store
.vite/
```
```

- [ ] **Step 1.8: Stub `templates/page-component.md`**

```markdown
# Page component skeleton

Every page in a consumer app follows this shape.

```tsx
import { PageHeader } from '@yes/ui'
import { useAppToast } from '../lib/toast'

export function <Name>Page() {
  const toast = useAppToast()
  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader
        title="<Title>"
        subtitle="<Subtitle>"
        actions={<>{/* action buttons */}</>}
      />
      {/* page body sections */}
    </div>
  )
}
```

## Rules

1. The root element of every page is a `<div>` with a layout utility class. Zero `style={{}}`.
2. Every page uses `PageHeader` for its top section (consistency).
3. Interactions that fire side effects go through `useAppToast()` from `lib/toast`.
4. State stays local (`useState` / `useReducer`) unless three or more sibling components need the same data — then lift to App.
```

- [ ] **Step 1.9: Stub `checklists/ingestion.md`**

```markdown
# Ingestion checklist (Phase 1 gate)

For each page in the handoff bundle, fill out these items before proceeding to Phase 2:

- [ ] Page name and primary route
- [ ] List of sections (header, table, sidebar, footer, modals, etc.)
- [ ] Data shape — every field shown, with type
- [ ] List of interactions (every onClick, onChange, onSubmit)
- [ ] List of dependencies on other pages (e.g. detail page depends on list page's selection)
- [ ] List of dependencies on yes-ui components (preliminary; refined in Phase 3)
- [ ] Any inline scripts, custom hooks, or behaviors that don't map cleanly to a yes-ui pattern (flag for decision log)

Each page's notes live in `decisions/<date>-<project>.md` under a per-page section so Phase 3 can reference them.
```

- [ ] **Step 1.10: Stub `checklists/verification.md`**

```markdown
# Verification checklist

## Per-page gates

For each consumer-app page, all 5 must pass before the page is marked done in the decision log:

1. **Renders** — `pnpm dev` serves; Playwright `browser_navigate` to the page's URL returns HTTP 200.
2. **Content** — Playwright `browser_evaluate` finds the expected Spanish text (page title, table column headers, key action button labels) inside `#root`.
3. **No inline styles** — `grep -rn "style={{" src/pages/<Page>.tsx` returns 0 hits.
4. **Interactions** — for every interaction the handoff shows, a Playwright `browser_click` + `browser_evaluate` verifies the post-interaction DOM state.
5. **No console errors** — Playwright `browser_console_messages` at the error level returns no React errors. A favicon 404 is acceptable; React errors are not.

## Suite-level gates

Before merging the consumer app:

6. **Typecheck clean** — `pnpm typecheck` exit 0.
7. **Build clean** — `pnpm build` succeeds.
8. **Inline-style audit, app-wide** — `grep -rn "style={{" src/` returns 0.
9. **Methodology updated** — decision log written, mapping tables updated, no `TBD` strings left in any methodology doc.
```

- [ ] **Step 1.11: Stub `decisions/2026-05-25-lead-getter.md`**

```markdown
# Decision Log — Lead Getter handoff (2026-05-25)

Per-handoff log of every non-trivial decision made while applying the playbook.

## Pre-identified decisions (from the design spec)

(D-001 through D-004 populated in Task 13; additional decisions added as they surface during phases 5–6.)

## Per-page ingestion notes

(filled in Task 2)
```

- [ ] **Step 1.12: Verify**

```bash
find docs/handoff-pipeline -type f | sort
```

Expected (10 files):
```
docs/handoff-pipeline/PLAYBOOK.md
docs/handoff-pipeline/README.md
docs/handoff-pipeline/checklists/ingestion.md
docs/handoff-pipeline/checklists/verification.md
docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md
docs/handoff-pipeline/mappings/components.md
docs/handoff-pipeline/mappings/layouts.md
docs/handoff-pipeline/mappings/tokens.md
docs/handoff-pipeline/templates/consumer-app-scaffold.md
docs/handoff-pipeline/templates/page-component.md
```

---

## Task 2: Phase 1 — Ingest the handoff bundle

**Files (yes-ui):**
- Modify: `docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md`

- [ ] **Step 2.1: Read every handoff file end-to-end**

The handoff bundle contains these files (already inspected — paths confirmed):
- `/Users/danieltibaquira/Projects/4Yes/yes-ui/lead-getter-handoff/project/Lead Getter.html`
- `colors_and_type.css` (already inspected)
- `LGApp.jsx` (already inspected — wires the 5 page components + mock data)
- `LGComponents.jsx` — shared components (LGSidebar, badges, etc.)
- `LGProspectos.jsx` — prospects list page
- `LGDetail.jsx` — prospect detail page
- `LGEmails.jsx` — emails review page
- `LGConfig.jsx` — workspace + KB config page
- `tweaks-panel.jsx` — design-time tool (SKIP per D-001)

Use `Read` tool on each `.jsx` you haven't seen yet (LGComponents, LGProspectos, LGDetail, LGEmails, LGConfig). Skip `tweaks-panel.jsx` per the pre-identified decision.

- [ ] **Step 2.2: Append per-page ingestion notes to the decision log**

Append the following section to `docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md` (replacing the `(filled in Task 2)` placeholder):

```markdown
## Per-page ingestion notes

### Page 1 — Prospectos (list)

- **File:** `LGProspectos.jsx`
- **Primary route:** `/prospectos` (default landing)
- **Sections:** Top bar (filters: search, status, score range, tags) · Stats strip (total, scored, emailed) · Table (sortable columns, row actions) · Pagination
- **Data shape:** array of `MOCK_PROSPECTS` (12 records). Each has: `id, nit, company_name, city, department, ciiu_description, status, opportunity_score, icp_score_v2, temperature_score, commercial_score, employee_count_est, website, created_at, tags[], workspace_id, primary_contact{email,phone,full_name,outreach_status}, notes`
- **Interactions:** filter inputs update visible rows · clicking a row → opens detail page · "+ Prospecto" button → opens modal/drawer (handoff shows a button; modal not in prototype)
- **yes-ui deps (preliminary):** Sidebar, PageHeader, Toolbar, TableAdvanced, Pagination, Badge, BulkActionBar
- **Custom behaviors:** score visualization (bars vs numbers) — depends on tweaks panel setting, which we SKIP

### Page 2 — Prospect detail

- **File:** `LGDetail.jsx`
- **Primary route:** `/prospectos/:id`
- **Sections:** Back-button header · Hero (company name, NIT, contact, tags) · Tabs (Información / Emails / Eventos / Notas) · Tab content panels
- **Data shape:** single prospect record + `emails` filtered by `prospect_id` + `events` filtered by `prospect_id`
- **Interactions:** back button → returns to list · tab switch · edit tags (add/remove chip) · adjust commercial score · edit notes · per-email: approve / reject / mark delivered
- **yes-ui deps (preliminary):** PageHeader (with back), Tabs, PanelRich (or local composition), Chip, Badge, Button, Textarea, ChannelBadge, Card

### Page 3 — Emails (review queue)

- **File:** `LGEmails.jsx`
- **Primary route:** `/emails`
- **Sections:** Stats strip (total / approved / delivered) · Filter chips (approved / pending / delivered) · Email card grid · Per-card: subject lines list, body preview (HTML), word count, quality score, feedback thread, action buttons
- **Data shape:** array of `MOCK_EMAILS` (5 records). Each has: `id, prospect_id, contact_id, subject_lines[], word_count, quality_score, approved, generation_model, tokens_used, created_at, body_plain, body_html, is_delivered, feedbacks[]`
- **Interactions:** filter chip click → narrows visible cards · per-card: approve / reject / mark delivered → updates state · feedback list expands inline
- **yes-ui deps (preliminary):** PageHeader, Toolbar (filter chips), Card, Badge, Button, Alert (for quality warnings)

### Page 4 — Configuración

- **File:** `LGConfig.jsx`
- **Primary route:** `/configuracion`
- **Sections:** Tabs (Workspace / Brand voice / Knowledge base) · Form per tab
- **Data shape:**
  - workspace: `MOCK_WORKSPACE { id, slug, name, chroma_collection, created_at }`
  - settings: `MOCK_SETTINGS { workspace_id, brand_voice, tone_style, forbidden_phrases[], email_signature, updated_at }`
  - kb docs: `MOCK_KB_DOCS [{ id, workspace_id, filename, doc_type, status, chunk_count, created_at }]`
- **Interactions:** edit any field → Save → Toast · KB tab: upload doc (mock) → adds to list · KB tab: delete doc → removes from list
- **yes-ui deps (preliminary):** PageHeader, Tabs, Input, Select, Textarea, Toggle, Button, Table (for KB docs), ActionMenu, Toast

### Page 5 — Sidebar shell (not a route — wraps every page)

- **File:** `LGComponents.jsx` (`LGSidebar` export)
- **Sections:** Logo + workspace name · Nav items (Prospectos / Emails / Configuración) · Optional footer (workspace switcher)
- **Data shape:** `{ activeView: string, workspace: string, onNavigate(key), compact: boolean }`
- **Interactions:** nav click → switches active view · collapse toggle
- **yes-ui deps (preliminary):** Sidebar (Wave 4)
```

- [ ] **Step 2.3: Verify checklist coverage**

For each of the 5 pages above, every checkbox in `checklists/ingestion.md` must be answered. Visual inspect — if any page is missing data shape OR interactions list, complete it before moving on.

---

## Task 3: Phase 2 — Token audit

**Files (yes-ui):**
- Modify: `docs/handoff-pipeline/mappings/tokens.md`

- [ ] **Step 3.1: Read handoff `colors_and_type.css`**

Already inspected during the brainstorming phase. The handoff defines: brand colors (blue / green), color scales (blue 50–950, green 50–950, neutral 50–950), semantic (success / error / warning / info each in 50/100/200/500/600/700), aliases (--fg-*, --bg-*, --border-*), typography (4 font families + 10 size steps + 4 line heights + 5 weights + 4 letter-spacings), spacing (0–24 scale), border-radius (sm/md/lg/xl/2xl/full), shadows (sm–2xl + focus-ring), animation (4 durations + 3 easings), z-index (8 layers), and component tokens (sidebar, button, input, table).

- [ ] **Step 3.2: Append the Lead Getter token table**

Replace the `(populated by Task 3)` placeholder in `docs/handoff-pipeline/mappings/tokens.md` with the table below. Every row is one handoff variable → one yes-ui token. Where the handoff value differs from the yes-ui default, the Notes column flags it.

```markdown
## Lead Getter (2026-05-25)

| Handoff variable | yes-ui token | Notes |
|------------------|--------------|-------|
| `--brand-blue` | `--yes-color-primary` | Same hex `#2B52A0` |
| `--brand-green` | `--yes-color-brand-accent` | Same hex `#8CBC39` |
| `--blue-950` | `--yes-primitive-blue-950` | Same hex `#0D1F4A` |
| `--blue-900` | `--yes-color-sidebar-bg` | Same hex `#142860` |
| `--blue-800` | `--yes-primitive-blue-800` | Same hex `#1A3474` |
| `--blue-700` | `--yes-color-primary-hover` | Same hex `#213F8A` |
| `--blue-600` | `--yes-primitive-blue-600` | Same hex `#274CA0` |
| `--blue-500` | `--yes-color-primary` (alias) | Same hex `#2B52A0` |
| `--blue-400` | `--yes-primitive-blue-400` | Same hex `#4D72BC` |
| `--blue-300` | `--yes-primitive-blue-300` | Same hex `#7E9CD1` |
| `--blue-200` | `--yes-color-primary-border` | Same hex `#B3C5E6` |
| `--blue-100` | `--yes-primitive-blue-100` | Same hex `#D8E3F4` |
| `--blue-50`  | `--yes-color-primary-subtle` | Same hex `#EEF3FA` |
| `--green-500` | `--yes-color-brand-accent` | Same hex `#8CBC39` |
| `--neutral-950`–`--neutral-50` | `--yes-primitive-neutral-{950..50}` | All identical |
| `--white` | `--yes-color-surface` | `#FFFFFF` |
| `--success-{50..700}` | `--yes-color-success-*` family | Same hex values |
| `--error-{50..700}` | `--yes-color-danger-*` family | Same hex values |
| `--warning-{50..700}` | `--yes-color-warning-*` family | Same hex values |
| `--info-{50..700}` | `--yes-color-info-*` family | Same hex values |
| `--fg-primary` | `--yes-color-text` | `--neutral-900` |
| `--fg-secondary` | `--yes-color-text-secondary` | `--neutral-600` |
| `--fg-tertiary` | `--yes-color-text-muted` | `--neutral-500` (handoff uses `--neutral-400` — defer to yes-ui default) |
| `--fg-disabled` | `--yes-color-text-disabled` | `--neutral-400` |
| `--fg-inverse` | `--yes-color-text-inverse` | white |
| `--fg-brand` | `--yes-color-text-brand` | brand blue |
| `--bg-base` | `--yes-color-bg` | `--neutral-100` |
| `--bg-surface` | `--yes-color-surface` | white |
| `--bg-elevated` | `--yes-color-surface-raised` | white |
| `--bg-subtle` | `--yes-color-bg-faint` | `--neutral-50` |
| `--bg-sidebar` | `--yes-color-sidebar-bg` | `--blue-900` |
| `--border-default` | `--yes-color-border` | `--neutral-200` |
| `--border-strong` | `--yes-color-border-strong` | `--neutral-300` |
| `--border-brand` | `--yes-color-border-focus` | brand blue |
| `--border-error` | `--yes-color-border-error` | `--error-500` |
| `--font-display` | `--yes-font-display` | Barlow Semi Condensed |
| `--font-heading` | `--yes-font-heading` | Barlow |
| `--font-body` | `--yes-font-sans` | Manrope |
| `--font-mono` | `--yes-font-mono` | JetBrains Mono |
| `--text-xs`…`--text-6xl` | `--yes-text-xs`…`--yes-text-6xl` | Same rem values |
| `--leading-tight/snug/normal/relaxed` | `--yes-leading-*` | Same multipliers |
| `--weight-regular/medium/semibold/bold/extrabold` | `--yes-weight-*` | Same numeric values |
| `--tracking-tight/normal/wide/widest` | `--yes-tracking-*` | Same em values |
| `--space-0`…`--space-24` | `--yes-space-0`…`--yes-space-24` | Same rem values |
| `--radius-sm/md/lg/xl/2xl/full` | `--yes-radius-sm/btn/card/modal/2xl/badge` | Naming differs; values identical |
| `--shadow-sm/md/lg/xl/2xl` | `--yes-shadow-sm/md/lg/xl/2xl` | Same formulas |
| `--focus-ring` | `--yes-focus-ring` | Same rgba |
| `--duration-fast/base/slow/slower` | `--yes-duration-*` | Same ms values |
| `--ease-standard/decelerate/accelerate` | `--yes-ease-*` | Same cubic-bezier curves |
| `--z-base/raised/dropdown/sticky/overlay/modal/toast/tooltip` | `--yes-z-*` | Same numeric values |
| `--sidebar-width` (240px) | `--yes-size-sidebar-width` (220px) | **Differs** — yes-ui default wins; see D-003 |
| `--sidebar-width-collapsed` | `--yes-size-sidebar-width-collapsed` | 56 px in both |
| `--sidebar-bg` | `--yes-color-sidebar-bg` | Same |
| `--sidebar-fg` | `--yes-color-sidebar-fg` | Same `rgba(255,255,255,0.75)` |
| `--sidebar-fg-active` | `--yes-color-sidebar-fg-active` | white |
| `--sidebar-item-active-bg` | `--yes-color-sidebar-item-active` | Same `rgba(255,255,255,0.12)` |
| `--sidebar-item-hover-bg` | `--yes-color-sidebar-item-hover` | Same `rgba(255,255,255,0.07)` |
| `--btn-height-sm/md/lg` | `--yes-size-height-sm/md/lg` | Same px values |
| `--input-height-sm/md/lg` | `--yes-size-height-sm/md/lg` | Same; yes-ui shares the size scale |
| `--table-row-height` | `--yes-size-table-row` | 44 px in both |
| `--table-header-height` | `--yes-size-table-header-h` | 40 px in handoff; 38 px in yes-ui — yes-ui default wins |

**Gaps:** none. Every handoff token has an equivalent. Phase 2 gate passes.
```

- [ ] **Step 3.3: Verify gate**

```bash
grep -c "^| " docs/handoff-pipeline/mappings/tokens.md
```

Expected: ≥ 60 rows (the count of mappings). If under 60, you missed entries; re-do.

```bash
grep "GAP\|missing\|TBD" docs/handoff-pipeline/mappings/tokens.md
```

Expected: no output (no gaps, no TBDs).

---

## Task 4: Phase 3 — Component audit

**Files (yes-ui):**
- Modify: `docs/handoff-pipeline/mappings/components.md`

- [ ] **Step 4.1: Enumerate handoff components**

From the handoff JSX files (read in Task 2):
- `LGComponents.jsx` exports: `LGSidebar`, `LGTopBar`, `StatusBadge`, `ChannelBadge`, `ProspectScoreBar`, `Tag` (filter chip), `LGButton`, `LGModal` (if present), `LGInput`, `LGSelect`
- `LGProspectos.jsx`: page component, uses `ProspectsTable`, `ProspectsFilters`, `Pagination`
- `LGDetail.jsx`: page component, uses `ProspectDetailHeader`, `ProspectDetailTabs`, `EmailCard`, `EventTimeline`, `NotesEditor`
- `LGEmails.jsx`: page component, uses `EmailReviewCard`, `FeedbackThread`
- `LGConfig.jsx`: page component, uses `WorkspaceForm`, `BrandVoiceForm`, `KBDocumentRow`, `KBUploadForm`
- `tweaks-panel.jsx`: SKIP

- [ ] **Step 4.2: Append the component table**

Replace the `(populated by Task 4)` placeholder in `docs/handoff-pipeline/mappings/components.md` with:

```markdown
## Lead Getter (2026-05-25)

| Handoff JSX | Outcome | Target | Notes |
|-------------|---------|--------|-------|
| `LGSidebar` | Direct | `Sidebar` (Wave 4) | Nav items shape `{ key, label, icon, badge? }` matches |
| `LGTopBar` | Direct (re-architected) | `PageHeader` (Wave 7) | Handoff bundles filters inline; we compose `Toolbar` separately |
| `StatusBadge` (handoff inline) | Direct | `Badge` (Wave 1) | Tone mapping: see § "Status tone mapping" below |
| `ChannelBadge` (handoff inline) | Direct | `ChannelBadge` (Wave 1) | Same 4 channels: WhatsApp / SMS / Voz / Correo |
| `Tag` (handoff filter chip) | Direct | `Chip` (Wave 1) | Same dismiss button pattern |
| `LGButton` | Direct | `Button` (Wave 1) | Tone mapping: `primary` → `primary`, `secondary` → `secondary`, `ghost` → `ghost`, `danger` → `danger` |
| `LGInput` | Direct | `Input` (Wave 2) | Same `label/value/onChange/error/hint` API |
| `LGSelect` | Direct | `Select` (Wave 2) | Same API |
| `LGModal` (if present) | Direct | `Modal` (Wave 5) | sm/md/lg sizes |
| `ProspectsTable` | Direct | `TableAdvanced` (Wave 6b) | Sortable + selectable; rows clickable via wrapper |
| `Pagination` (handoff inline) | Direct | `Pagination` (Wave 6a) | Same `currentPage/totalPages/onPageChange` API |
| `ProspectsFilters` | Local composition | `Toolbar` + `GroupFilter` (Wave 6a) | Filter chips visible inline (search + status pill row) |
| `ProspectDetailHeader` | Local composition | `PageHeader` + back-button + `Badge` + `Chip` row | Composition of yes-ui primitives |
| `ProspectDetailTabs` | Direct | `Tabs` (Wave 4) | `underline` variant; 4 tabs: Info / Emails / Eventos / Notas |
| `ProspectDetailPanel` (when rendered as side panel) | Direct | `PanelRich` (Wave 8) | This page is full-width, NOT a side panel — use direct composition |
| `EmailCard` | Local composition | `Card` + `Badge` + `Button` + `Alert` (low quality) | Recurring pattern; see D-005 in decision log |
| `EmailReviewCard` | Local composition | Same as `EmailCard` plus subject-lines list + feedback expansion | Builds on `EmailCard` |
| `FeedbackThread` | Local composition | `Card` (inner) + Avatar + text | Local one-off |
| `EventTimeline` | Local composition | `Card` items + `ChannelBadge` | Local one-off; flat vertical list |
| `NotesEditor` | Direct | `Textarea` (Wave 2) + `Button` Save | Trivial composition |
| `WorkspaceForm` | Direct | `Input` × N + `Button` | Trivial form composition |
| `BrandVoiceForm` | Direct | `Textarea` + `Input` + `Chip` row (forbidden phrases) + `Button` | Composition |
| `KBDocumentRow` | Local composition | `Card` + `Badge` (status) + `ActionMenu` (Wave 7) | Recurring row pattern |
| `KBUploadForm` | Direct | `Input` (file) + `Button` | Mock-only; no real upload |
| `ProspectScoreBar` | **Local composition** | `src/components/ScoreBar.tsx` | See D-002 — see § "ScoreBar spec" below |
| `TweaksPanel` | **Skip** | n/a | Design-time tool; see D-001 |

### Status tone mapping

Handoff `prospect.status` values → yes-ui `Badge.variant`:

| `status` | `Badge variant` | Label |
|----------|-----------------|-------|
| `discovered` | `neutral` | Descubierto |
| `enriched` | `info` | Enriquecido |
| `scored` | `info` | Calificado |
| `email_generated` | `warning` | Email generado |
| `email_approved` | `success` | Email aprobado |
| `delivered` | `success` | Entregado |
| `replied` | `success` | Respondió |

### ScoreBar spec (`src/components/ScoreBar.tsx`)

Props: `{ value: number /* 0..1 */, label?: string, max?: number /* default 1 */ }`

Behavior:
- Renders a filled bar inside a track + the numeric percentage to the right.
- Uses `var(--yes-color-primary)` for fill, `var(--yes-color-border)` for track.
- Uses `var(--yes-space-2)` for inner gap.
- No `style={{}}` — track width via `className="yes-w-full"`, fill width via a single inline CSS variable (`style={{ '--lg-fill': '52%' }}` — this is dynamic token override, allowed per design spec § 3).

Implementation appears in Task 11.

**Gaps:** none beyond `ScoreBar` (local) and `TweaksPanel` (skip). Phase 3 gate passes.
```

- [ ] **Step 4.3: Verify gate**

```bash
grep "GAP\|TBD\|FIXME" docs/handoff-pipeline/mappings/components.md
```

Expected: no output.

---

## Task 5: Phase 4 — Scaffold the consumer app (skeleton)

**Files (lead-getter-frontend, new repo):**
- Create: directory + config files (no source yet)

- [ ] **Step 5.1: Create the directory**

```bash
mkdir -p /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend/{src/{lib,data,components,pages},.vscode}
```

- [ ] **Step 5.2: Write `package.json`**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
```

Write `package.json`:

```json
{
  "name": "lead-getter-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@yes/ui": "file:../yes-ui",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.9.0",
    "vite": "^6.4.0"
  }
}
```

- [ ] **Step 5.3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5.4: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 5.5: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lead Getter — YES BPO</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5.6: Write `.gitignore`**

```
node_modules/
dist/
*.log
.DS_Store
.vite/
```

- [ ] **Step 5.7: Write `.vscode/settings.json`**

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

- [ ] **Step 5.8: Write `README.md`**

```markdown
# Lead Getter Frontend

Vite + React + TypeScript consumer app for the Lead Getter handoff. Built using only `@yes/ui` v1.2.0 exports — no inline styles, no extra UI dependencies.

This app is mock-data-only. Real backend wiring lives in [`lead-getter/`](../../lead-getter/).

## Methodology

This app was built using the [handoff pipeline methodology](../yes-ui/docs/handoff-pipeline/) — see the [Lead Getter decision log](../yes-ui/docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md) for every mapping decision made along the way.

## Run

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"

# Build the library first (from sibling yes-ui repo)
cd ../yes-ui
pnpm install && pnpm build

# Run this app
cd ../lead-getter-frontend
pnpm install
pnpm dev
# → open http://localhost:5174  (vite picks the next free port if 5173 is busy)
```

## Project layout

- `src/main.tsx` — root entry, the only place CSS is imported (`@yes/ui/tokens/*` + `@yes/ui/styles/layout`)
- `src/App.tsx` — Sidebar shell + page switcher
- `src/lib/` — navigation, toast context, formatters
- `src/data/` — mock data (prospects, emails, events, workspace)
- `src/components/` — local one-off compositions (currently: `ScoreBar`)
- `src/pages/` — four page components (Prospectos, ProspectDetail, Emails, Config)
```

- [ ] **Step 5.9: Install + verify**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm install
```

Expected: succeeds; `node_modules/@yes/ui` symlink resolves to `../yes-ui`.

```bash
ls node_modules/@yes
```

Expected: shows `ui` linking to the sibling.

---

## Task 6: Phase 4 — Scaffold the consumer app (shell)

**Files:** `src/main.tsx`, `src/App.tsx`, `src/lib/nav.ts`, `src/lib/toast.tsx`, `src/lib/format.ts`

- [ ] **Step 6.1: Write `src/lib/nav.ts`**

```ts
import type { NavItem } from '@yes/ui'
import { Users, Mail, Settings } from 'lucide-react'

export type Page = 'prospectos' | 'prospect-detail' | 'emails' | 'configuracion'

// `NavItem` from @yes/ui shape: { key, label, icon, badge? }
export const navItems: NavItem[] = [
  { key: 'prospectos',    label: 'Prospectos',    icon: Users },
  { key: 'emails',        label: 'Emails',        icon: Mail },
  { key: 'configuracion', label: 'Configuración', icon: Settings },
]
```

- [ ] **Step 6.2: Write `src/lib/toast.tsx`**

```tsx
import React, { createContext, useContext } from 'react'
import type { ToastVariant } from '@yes/ui'

export interface ToastInput {
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

export type ToastFn = (input: ToastInput) => void

const ToastContext = createContext<ToastFn | null>(null)

export function ToastProvider({
  value,
  children,
}: {
  value: ToastFn
  children: React.ReactNode
}) {
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useAppToast(): ToastFn {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useAppToast must be used inside <ToastProvider>')
  return ctx
}
```

- [ ] **Step 6.3: Write `src/lib/format.ts`**

```ts
// One-off formatters — not in @yes/ui scope.

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.round(ms / 60_000)
  if (mins < 60)  return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

export function formatScore(value: number | null | undefined): string {
  if (value == null) return '—'
  return `${Math.round(value * 100)}%`
}

export function formatMoney(value: number | null | undefined): string {
  if (value == null) return '—'
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
}
```

- [ ] **Step 6.4: Write `src/main.tsx`**

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
import '@yes/ui/styles/layout'

import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>)
```

- [ ] **Step 6.5: Write `src/App.tsx` (shell with stubbed pages)**

```tsx
import { useState } from 'react'
import { Sidebar, ToastContainer, useToast } from '@yes/ui'

import { navItems, type Page } from './lib/nav'
import { ToastProvider } from './lib/toast'

// Pages are stubbed in this task; real implementations land in Tasks 8–12.
import { ProspectosPage }      from './pages/ProspectosPage'
import { ProspectDetailPage }  from './pages/ProspectDetailPage'
import { EmailsPage }          from './pages/EmailsPage'
import { ConfigPage }          from './pages/ConfigPage'

export function App() {
  const [page, setPage] = useState<Page>('prospectos')
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const { toasts, toast, dismiss } = useToast()

  function handleLogout() {
    toast({ variant: 'info', title: 'Cerrando sesión...' })
  }

  function handleNavigate(key: string) {
    setPage(key as Page)
    setSelectedProspectId(null)
  }

  function handleSelectProspect(id: string) {
    setSelectedProspectId(id)
    setPage('prospect-detail')
  }

  function handleBackToList() {
    setSelectedProspectId(null)
    setPage('prospectos')
  }

  return (
    <ToastProvider value={toast}>
      <div className="yes-app-shell">
        <Sidebar
          product="Lead Getter"
          navItems={navItems}
          activeKey={page === 'prospect-detail' ? 'prospectos' : page}
          onNavigate={handleNavigate}
          user={{ name: 'Andrea López', role: 'Coordinadora' }}
          onLogout={handleLogout}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />

        <main className="yes-main">
          {page === 'prospectos'      && <ProspectosPage onSelectProspect={handleSelectProspect} />}
          {page === 'prospect-detail' && selectedProspectId && (
            <ProspectDetailPage prospectId={selectedProspectId} onBack={handleBackToList} />
          )}
          {page === 'emails'          && <EmailsPage />}
          {page === 'configuracion'   && <ConfigPage />}
        </main>

        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </div>
    </ToastProvider>
  )
}
```

- [ ] **Step 6.6: Stub the 4 page components**

Each gets a minimal "Hello" stub so the app compiles and the shell works. Real implementations land in Tasks 8–12. Write each file:

**`src/pages/ProspectosPage.tsx`** (stub):
```tsx
export interface ProspectosPageProps {
  onSelectProspect: (id: string) => void
}

export function ProspectosPage({ onSelectProspect: _onSelectProspect }: ProspectosPageProps) {
  return <div className="yes-stack yes-gap-6"><h1 className="yes-h1">Prospectos</h1></div>
}
```

**`src/pages/ProspectDetailPage.tsx`** (stub):
```tsx
export interface ProspectDetailPageProps {
  prospectId: string
  onBack: () => void
}

export function ProspectDetailPage({ prospectId, onBack: _onBack }: ProspectDetailPageProps) {
  return <div className="yes-stack yes-gap-6"><h1 className="yes-h1">Prospecto {prospectId}</h1></div>
}
```

**`src/pages/EmailsPage.tsx`** (stub):
```tsx
export function EmailsPage() {
  return <div className="yes-stack yes-gap-6"><h1 className="yes-h1">Emails</h1></div>
}
```

**`src/pages/ConfigPage.tsx`** (stub):
```tsx
export function ConfigPage() {
  return <div className="yes-stack yes-gap-6"><h1 className="yes-h1">Configuración</h1></div>
}
```

- [ ] **Step 6.7: Verify shell**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit 0.

```bash
pnpm dev > /tmp/lgf.log 2>&1 &
sleep 4
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/ || curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5174/
head -10 /tmp/lgf.log
```

Expected: HTTP 200 from either 5173 or 5174 (vite picks next free port). Sidebar renders, clicking a nav item switches between stub pages.

---

## Task 7: Phase 4 — Mock data files

**Files:** `src/data/prospects.ts`, `src/data/emails.ts`, `src/data/events.ts`, `src/data/workspace.ts`

- [ ] **Step 7.1: Write `src/data/prospects.ts`**

Copy the `MOCK_PROSPECTS` array from `lead-getter-handoff/project/LGApp.jsx` (lines 16–29 of that file — already inspected) and transpile to TypeScript with explicit shapes:

```ts
export interface PrimaryContact {
  email: string
  phone: string | null
  full_name: string
  outreach_status: 'pending' | 'attempted' | 'delivered'
}

export type ProspectStatus =
  | 'discovered'
  | 'enriched'
  | 'scored'
  | 'email_generated'
  | 'email_approved'
  | 'delivered'
  | 'replied'

export interface Prospect {
  id: string
  nit: string
  company_name: string
  city: string
  department: string
  ciiu_description: string
  status: ProspectStatus
  opportunity_score: number | null
  icp_score_v2: number | null
  temperature_score: number
  commercial_score: number | null
  employee_count_est: number | null
  website: string | null
  created_at: string
  tags: string[]
  workspace_id: string
  primary_contact: PrimaryContact | null
  notes: string
}

export const MOCK_PROSPECTS: Prospect[] = [
  { id:'p1',  nit:'901.234.567-3', company_name:'Transportes del Pacífico SAS', city:'Cali',         department:'Valle del Cauca', ciiu_description:'Transporte de carga por carretera',                status:'email_generated', opportunity_score:0.87, icp_score_v2:0.79, temperature_score:2, commercial_score:0.65, employee_count_est:120, website:'https://transpac.com.co', created_at:'2026-05-18T09:00:00Z', tags:['logística','prioridad'],         workspace_id:'ws1', primary_contact:{ email:'jperez@transpac.com.co',     phone:'+57 315 234 5678', full_name:'Jorge Pérez Gómez',     outreach_status:'pending'   }, notes:'Empresa con buen fit. Gerente financiero es el decisor clave.' },
  { id:'p2',  nit:'800.456.789-1', company_name:'Grupo Industrial Antioqueño',          city:'Medellín',     department:'Antioquia',       ciiu_description:'Fabricación de productos químicos básicos',         status:'email_approved',  opportunity_score:0.91, icp_score_v2:0.84, temperature_score:2, commercial_score:0.80, employee_count_est:340, website:'https://grupoia.com.co',     created_at:'2026-05-17T14:30:00Z', tags:['manufactura','alto valor'],    workspace_id:'ws1', primary_contact:{ email:'mlopez@grupoia.com.co',       phone:'+57 604 321 9876', full_name:'María López Restrepo',  outreach_status:'attempted' }, notes:'' },
  { id:'p3',  nit:'900.112.334-5', company_name:'Comercializadora La Sabana SAS',       city:'Bogotá',       department:'Cundinamarca',    ciiu_description:'Comercio al por mayor no especializado',            status:'scored',          opportunity_score:0.54, icp_score_v2:0.48, temperature_score:0, commercial_score:null, employee_count_est:28,  website:null,                         created_at:'2026-05-16T11:00:00Z', tags:['retail'],                       workspace_id:'ws1', primary_contact:{ email:'contacto@lasabana.co',         phone:null,                full_name:'Andrés Martínez',       outreach_status:'pending'   }, notes:'' },
  { id:'p4',  nit:'890.234.001-7', company_name:'Logística e Importaciones del Caribe', city:'Barranquilla', department:'Atlántico',       ciiu_description:'Actividades de apoyo al transporte',                status:'delivered',       opportunity_score:0.76, icp_score_v2:0.71, temperature_score:2, commercial_score:0.70, employee_count_est:88,  website:'https://logcaribe.com',      created_at:'2026-05-15T08:45:00Z', tags:['logística','B2B'],              workspace_id:'ws1', primary_contact:{ email:'ops@logcaribe.com',             phone:'+57 300 876 5432', full_name:'Claudia Herrera',        outreach_status:'delivered' }, notes:'' },
  { id:'p5',  nit:'901.876.543-2', company_name:'Centro de Servicios Empresariales BPO',city:'Bogotá',       department:'Cundinamarca',    ciiu_description:'Actividades de administración empresarial',         status:'replied',         opportunity_score:0.93, icp_score_v2:0.88, temperature_score:2, commercial_score:0.90, employee_count_est:210, website:'https://cse-bpo.com.co',     created_at:'2026-05-14T10:00:00Z', tags:['BPO','seguimiento','prioridad'],workspace_id:'ws1', primary_contact:{ email:'gerencia@cse-bpo.com.co',       phone:'+57 601 234 5678', full_name:'Felipe Ríos Vargas',     outreach_status:'delivered' }, notes:'Interesado en servicios de cobranza. Reunión agendada para la semana siguiente.' },
  { id:'p6',  nit:'800.987.654-0', company_name:'Constructora Metrópolis SAS',          city:'Bucaramanga',  department:'Santander',       ciiu_description:'Construcción de edificios residenciales y comerciales', status:'enriched',     opportunity_score:0.43, icp_score_v2:0.37, temperature_score:0, commercial_score:null, employee_count_est:65,  website:null,                         created_at:'2026-05-13T16:20:00Z', tags:['construcción'],                  workspace_id:'ws1', primary_contact:null, notes:'' },
  { id:'p7',  nit:'901.345.678-9', company_name:'Soluciones TI del Valle SAS',          city:'Cali',         department:'Valle del Cauca', ciiu_description:'Actividades de desarrollo de sistemas informáticos', status:'email_generated', opportunity_score:0.68, icp_score_v2:0.62, temperature_score:1, commercial_score:0.45, employee_count_est:42,  website:'https://tidalvalle.co',      created_at:'2026-05-12T09:15:00Z', tags:['tech','B2B'],                    workspace_id:'ws1', primary_contact:{ email:'cto@tidalvalle.co',             phone:'+57 316 555 1234', full_name:'Sofía Vargas',           outreach_status:'pending'   }, notes:'' },
  { id:'p8',  nit:'900.765.432-1', company_name:'Industria Alimentaria del Caribe',     city:'Cartagena',    department:'Bolívar',         ciiu_description:'Elaboración de otros productos alimenticios n.c.p.', status:'scored',         opportunity_score:0.39, icp_score_v2:0.35, temperature_score:0, commercial_score:null, employee_count_est:180, website:'https://alicaribe.com.co',   created_at:'2026-05-11T13:00:00Z', tags:['alimentos'],                      workspace_id:'ws1', primary_contact:{ email:'ventas@alicaribe.com.co',       phone:null,                full_name:'Luis Suárez',           outreach_status:'pending'   }, notes:'' },
  { id:'p9',  nit:'901.567.890-4', company_name:'Red Salud Colombia IPS',                city:'Bogotá',       department:'Cundinamarca',    ciiu_description:'Actividades de hospitales y clínicas',              status:'email_approved',  opportunity_score:0.82, icp_score_v2:0.77, temperature_score:2, commercial_score:0.75, employee_count_est:520, website:'https://redsaludco.com',     created_at:'2026-05-10T08:00:00Z', tags:['salud','empresa grande'],         workspace_id:'ws1', primary_contact:{ email:'admin@redsaludco.com',          phone:'+57 601 987 6543', full_name:'Patricia Niño',          outreach_status:'attempted' }, notes:'' },
  { id:'p10', nit:'800.234.567-8', company_name:'Agroindustria del Litoral SAS',        city:'Barranquilla', department:'Atlántico',       ciiu_description:'Cultivo y procesamiento de frutas tropicales',      status:'email_generated', opportunity_score:0.61, icp_score_v2:0.55, temperature_score:1, commercial_score:0.40, employee_count_est:95,  website:null,                         created_at:'2026-05-09T11:30:00Z', tags:['agroindustria'],                  workspace_id:'ws1', primary_contact:{ email:'exportaciones@agrolitor.com.co',phone:'+57 317 432 8765', full_name:'Carlos Díaz',           outreach_status:'pending'   }, notes:'' },
  { id:'p11', nit:'901.111.222-3', company_name:'Consultores Estratégicos Andinos',     city:'Medellín',     department:'Antioquia',       ciiu_description:'Actividades de consultoría de gestión empresarial', status:'delivered',       opportunity_score:0.71, icp_score_v2:0.68, temperature_score:1, commercial_score:0.60, employee_count_est:18,  website:'https://ceandinos.com',      created_at:'2026-05-08T15:45:00Z', tags:['consultoría','seguimiento'],     workspace_id:'ws1', primary_contact:{ email:'socio@ceandinos.com',           phone:'+57 604 111 2233', full_name:'Alejandro Mora',         outreach_status:'delivered' }, notes:'' },
  { id:'p12', nit:'900.888.999-0', company_name:'Importadora Global Andina SAS',        city:'Bogotá',       department:'Cundinamarca',    ciiu_description:'Intermediación comercial especializada',            status:'discovered',     opportunity_score:null, icp_score_v2:null, temperature_score:0, commercial_score:null, employee_count_est:null, website:null,                         created_at:'2026-05-22T07:00:00Z', tags:[],                                  workspace_id:'ws1', primary_contact:null, notes:'' },
]
```

- [ ] **Step 7.2: Write `src/data/emails.ts`**

```ts
export interface EmailFeedback {
  id: string
  author: string
  comment: string
  suggested_body: string | null
  created_at: string
}

export interface Email {
  id: string
  prospect_id: string
  contact_id: string
  subject_lines: string[]
  word_count: number
  quality_score: number
  approved: boolean
  generation_model: string
  tokens_used: number
  created_at: string
  body_plain: string
  body_html: string
  is_delivered: boolean
  feedbacks: EmailFeedback[]
}

const EMAIL_BODY_1 = `<p>Estimado Jorge,</p>
<p>Me pongo en contacto con usted en nombre de <strong>YES BPO SAS</strong>, empresa colombiana con más de 15 años de experiencia en tercerización de procesos empresariales.</p>
<p>Analizando el crecimiento sostenido de <strong>Transportes del Pacífico SAS</strong> en el sector logístico del Valle del Cauca, identificamos que nuestros servicios podrían agregar valor significativo a su operación:</p>
<ul>
  <li>Gestión de cartera y recuperación de cartera vencida</li>
  <li>Atención al cliente multicanal (WhatsApp, voz, correo)</li>
  <li>Procesamiento de documentos con IA</li>
</ul>
<p>Nuestros clientes en el sector transporte han logrado reducir costos operativos hasta un <strong>30%</strong> mientras mejoran los índices de satisfacción.</p>
<p>¿Tendría disponibilidad para una llamada corta de 20 minutos esta semana?</p>
<p>Quedo atento a su respuesta.</p>
<p><em>Equipo Comercial YES BPO<br>Tel: +57 601 234 5678 · www.yesbpo.com</em></p>`

const EMAIL_BODY_2 = `<p>Estimada María,</p>
<p>Le escribo desde <strong>YES BPO SAS</strong> para presentarle una propuesta que podría transformar la eficiencia operativa de <strong>Grupo Industrial Antioqueño</strong>.</p>
<p>En el sector de fabricación química, sabemos que la gestión de cobros, la atención a distribuidores y el procesamiento de pedidos consumen recursos valiosos de su equipo.</p>
<p>Con YES BPO, usted puede:</p>
<ul>
  <li>Externalizar su departamento de cobranza con métricas garantizadas</li>
  <li>Centralizar la atención a clientes B2B en un solo canal</li>
  <li>Automatizar el seguimiento de órdenes de compra</li>
</ul>
<p>¿Podemos agendar 15 minutos para conocer sus necesidades específicas?</p>
<p><em>Equipo Comercial YES BPO</em></p>`

export const MOCK_EMAILS: Email[] = [
  { id:'e1', prospect_id:'p1', contact_id:'c1', subject_lines:['¿Optimizamos juntos la operación de Transportes del Pacífico?','YES BPO: eficiencia operativa para el sector logístico','Propuesta de servicios BPO para Transportes del Pacífico SAS'], word_count:187, quality_score:0.82, approved:true,  generation_model:'gpt-4o',      tokens_used:1240, created_at:'2026-05-19T10:30:00Z', body_plain:'Estimado Jorge, Me pongo en contacto...',  body_html: EMAIL_BODY_1, is_delivered:false, feedbacks:[] },
  { id:'e2', prospect_id:'p2', contact_id:'c2', subject_lines:['Transformación operativa para Grupo Industrial Antioqueño','¿Reducimos costos de operación en un 30%?','YES BPO: el socio estratégico que Grupo Industrial necesita'], word_count:203, quality_score:0.91, approved:true,  generation_model:'gpt-4o',      tokens_used:1380, created_at:'2026-05-18T15:00:00Z', body_plain:'Estimada María, Le escribo desde YES BPO...', body_html: EMAIL_BODY_2, is_delivered:false, feedbacks:[{ id:'f1', author:'Laura C.', comment:'Excelente personalización, aprobar y enviar esta semana.', suggested_body:null, created_at:'2026-05-19T09:00:00Z' }] },
  { id:'e3', prospect_id:'p2', contact_id:'c2', subject_lines:['Propuesta BPO para Grupo Industrial','Servicios de externalización para manufactura'], word_count:142, quality_score:0.61, approved:false, generation_model:'gpt-4o-mini', tokens_used:890,  created_at:'2026-05-17T11:00:00Z', body_plain:'Estimada María, Buen día...',           body_html:'<p>Estimada María, Buen día. Les presentamos nuestros servicios...</p>', is_delivered:false, feedbacks:[] },
  { id:'e4', prospect_id:'p5', contact_id:'c5', subject_lines:['Alianza estratégica BPO — Centro de Servicios Empresariales','YES BPO + CSE: sinergia para crecer juntos'], word_count:195, quality_score:0.88, approved:true,  generation_model:'gpt-4o',      tokens_used:1290, created_at:'2026-05-15T09:00:00Z', body_plain:'Estimado Felipe...',                    body_html:'<p>Estimado Felipe,</p><p>Reconocemos el liderazgo de CSE BPO en el sector...</p>', is_delivered:true, feedbacks:[] },
  { id:'e5', prospect_id:'p9', contact_id:'c9', subject_lines:['Optimización de procesos administrativos en salud','YES BPO: especialistas en BPO para el sector salud'], word_count:178, quality_score:0.79, approved:true,  generation_model:'gpt-4o',      tokens_used:1150, created_at:'2026-05-12T14:00:00Z', body_plain:'Estimada Patricia...',                  body_html:'<p>Estimada Patricia,</p><p>El sector salud enfrenta retos únicos...</p>', is_delivered:false, feedbacks:[] },
]
```

- [ ] **Step 7.3: Write `src/data/events.ts`**

```ts
export type EventType = 'reply_received' | 'email_sent' | 'whatsapp_sent'

export interface ProspectEvent {
  id: string
  prospect_id: string
  source: 'reply' | 'comm_log'
  event_type: EventType
  happened_at: string
  intent: 'interested' | 'not_interested' | 'unsubscribe' | 'question' | null
  channel: 'email' | 'whatsapp' | 'sms' | 'voice' | null
  whatsapp_alert_sent: boolean | null
}

export const MOCK_EVENTS: ProspectEvent[] = [
  { id:'ev1', prospect_id:'p5', source:'reply',    event_type:'reply_received', happened_at:'2026-05-19T14:22:00Z', intent:'interested', channel:null,       whatsapp_alert_sent:true  },
  { id:'ev2', prospect_id:'p5', source:'comm_log', event_type:'email_sent',     happened_at:'2026-05-15T09:05:00Z', intent:null,         channel:'email',    whatsapp_alert_sent:null  },
  { id:'ev3', prospect_id:'p5', source:'comm_log', event_type:'whatsapp_sent',  happened_at:'2026-05-16T11:30:00Z', intent:null,         channel:'whatsapp', whatsapp_alert_sent:null  },
  { id:'ev4', prospect_id:'p4', source:'comm_log', event_type:'email_sent',     happened_at:'2026-05-16T08:00:00Z', intent:null,         channel:'email',    whatsapp_alert_sent:null  },
]
```

- [ ] **Step 7.4: Write `src/data/workspace.ts`**

```ts
export interface Workspace {
  id: string
  slug: string
  name: string
  chroma_collection: string
  created_at: string
}

export interface Settings {
  id: string
  workspace_id: string
  brand_voice: string
  tone_style: string
  forbidden_phrases: string[]
  email_signature: string
  updated_at: string
}

export type DocStatus = 'indexing' | 'ready' | 'error'
export type DocType   = 'pdf' | 'docx' | 'md' | 'txt'

export interface KBDoc {
  id: string
  workspace_id: string
  filename: string
  doc_type: DocType
  status: DocStatus
  chunk_count: number
  created_at: string
}

export const MOCK_WORKSPACE: Workspace = { id:'ws1', slug:'yes-bpo-co', name:'YES BPO Colombia', chroma_collection:'yes_bpo_main', created_at:'2026-01-01T00:00:00Z' }

export const MOCK_SETTINGS: Settings = {
  id:'s1',
  workspace_id:'ws1',
  brand_voice:'YES BPO SAS es una empresa colombiana con más de 15 años de experiencia en tercerización de procesos empresariales. Nos especializamos en cobranza, atención al cliente multicanal y automatización de procesos con IA. Somos un aliado estratégico, no solo un proveedor.',
  tone_style:'profesional, directo, cálido',
  forbidden_phrases:['urgente','última oportunidad','no se lo pierda','gratis'],
  email_signature:'Equipo Comercial YES BPO SAS\nTel: +57 601 234 5678\ncomercial@yesbpo.com\nwww.yesbpo.com',
  updated_at:'2026-05-10T00:00:00Z',
}

export const MOCK_KB_DOCS: KBDoc[] = [
  { id:'kb1', workspace_id:'ws1', filename:'Brochure YES BPO 2026.pdf',   doc_type:'pdf',  status:'ready',    chunk_count:24, created_at:'2026-04-01T10:00:00Z' },
  { id:'kb2', workspace_id:'ws1', filename:'Casos de Éxito Q1 2026.docx', doc_type:'docx', status:'ready',    chunk_count:18, created_at:'2026-04-15T09:00:00Z' },
  { id:'kb3', workspace_id:'ws1', filename:'Guía de Objeciones.md',       doc_type:'md',   status:'indexing', chunk_count:0,  created_at:'2026-05-22T07:30:00Z' },
]
```

- [ ] **Step 7.5: Verify typecheck still clean**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit 0.

---

## Task 8: Phase 5+6 — Local `ScoreBar` component

**Files:** `src/components/ScoreBar.tsx`

The Prospectos and Detail pages both consume this. Build it first.

- [ ] **Step 8.1: Write `src/components/ScoreBar.tsx`**

```tsx
export interface ScoreBarProps {
  value: number | null  // 0..1
  label?: string
  max?: number          // default 1
}

export function ScoreBar({ value, label, max = 1 }: ScoreBarProps) {
  if (value == null) {
    return <span className="yes-text-muted">—</span>
  }
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="yes-stack yes-gap-1 yes-w-full" data-testid="score-bar">
      <div className="yes-row yes-items-center yes-justify-between">
        {label && <span className="yes-text-muted">{label}</span>}
        <span>{pct}%</span>
      </div>
      <div className="yes-w-full" style={{ height: 6, background: 'var(--yes-color-border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--yes-color-primary)' }} />
      </div>
    </div>
  )
}
```

**Note on inline `style`:** the bar's `width` and `height` are dynamic values (computed from `pct`). The design spec § 3 explicitly permits dynamic token overrides via `style`. This is a documented exception — `ScoreBar` is the only file in the app permitted to use `style` props, and the values come from tokens or computed numbers, never hardcoded design choices.

- [ ] **Step 8.2: Verify typecheck**

```bash
pnpm typecheck
```

Expected: exit 0.

---

## Task 9: Phase 5+6 — ProspectosPage

**Files:** `src/pages/ProspectosPage.tsx`

- [ ] **Step 9.1: Implement the full page**

Replace the stub with the real implementation:

```tsx
import { useMemo, useState } from 'react'
import {
  PageHeader,
  Toolbar,
  Pagination,
  TableAdvanced,
  Badge,
  Button,
} from '@yes/ui'
import type { TableColumn, BadgeVariant } from '@yes/ui'

import { MOCK_PROSPECTS, type Prospect, type ProspectStatus } from '../data/prospects'
import { ScoreBar } from '../components/ScoreBar'
import { useAppToast } from '../lib/toast'
import { formatRelative } from '../lib/format'

const STATUS_LABELS: Record<ProspectStatus, string> = {
  discovered:       'Descubierto',
  enriched:         'Enriquecido',
  scored:           'Calificado',
  email_generated:  'Email generado',
  email_approved:   'Email aprobado',
  delivered:        'Entregado',
  replied:          'Respondió',
}

const STATUS_VARIANTS: Record<ProspectStatus, BadgeVariant> = {
  discovered:       'neutral',
  enriched:         'info',
  scored:           'info',
  email_generated:  'warning',
  email_approved:   'success',
  delivered:        'success',
  replied:          'success',
}

export interface ProspectosPageProps {
  onSelectProspect: (id: string) => void
}

const PAGE_SIZE = 8

export function ProspectosPage({ onSelectProspect }: ProspectosPageProps) {
  const toast = useAppToast()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_PROSPECTS
    const q = search.trim().toLowerCase()
    return MOCK_PROSPECTS.filter((p) =>
      p.company_name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.nit.includes(q)
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  const columns: TableColumn<Prospect>[] = [
    { key: 'company_name',  header: 'Empresa',             render: (p) => <strong>{p.company_name}</strong> },
    { key: 'city',          header: 'Ciudad',              render: (p) => <span>{p.city}</span> },
    { key: 'status',        header: 'Estado',              render: (p) => <Badge variant={STATUS_VARIANTS[p.status]}>{STATUS_LABELS[p.status]}</Badge> },
    { key: 'opportunity',   header: 'Oportunidad',         render: (p) => <ScoreBar value={p.opportunity_score} /> },
    { key: 'icp',           header: 'ICP',                 render: (p) => <ScoreBar value={p.icp_score_v2} /> },
    { key: 'created_at',    header: 'Descubierto',         render: (p) => <span className="yes-text-muted">{formatRelative(p.created_at)}</span> },
    { key: 'actions',       header: '',                    render: (p) => <Button tone="ghost" size="sm" onClick={() => onSelectProspect(p.id)}>Ver detalle</Button> },
  ]

  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader
        title="Prospectos"
        subtitle={`${filtered.length} prospectos`}
        actions={
          <Button tone="primary" onClick={() => toast({ variant: 'info', title: 'Importar prospectos', description: 'Función mock — no implementada.' })}>
            + Importar
          </Button>
        }
      />

      <Toolbar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Buscar por empresa, ciudad o NIT…"
      />

      <TableAdvanced
        columns={columns}
        rows={visible}
        rowKey={(p) => p.id}
        selectable
        selectedKeys={selection}
        onSelectionChange={setSelection}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
```

- [ ] **Step 9.2: Verify**

```bash
pnpm typecheck
```

Expected: exit 0. If `BadgeVariant` or `TableColumn` aren't exported from `@yes/ui` directly, check the actual export names in `node_modules/@yes/ui/dist/index.d.ts` and update the import. (Fallback: define a local `type StatusBadgeVariant = 'neutral' | 'info' | 'warning' | 'success'` and pass to `<Badge variant={...}>`.)

```bash
grep -n "style={{" src/pages/ProspectosPage.tsx
```

Expected: no output.

- [ ] **Step 9.3: Playwright verification**

Navigate to `http://localhost:5174/` (or whichever port vite serves on), then evaluate:

```js
async () => {
  const main = document.querySelector('main')
  return {
    h1: main?.querySelector('h1')?.textContent,
    rowCount: main?.querySelectorAll('tbody tr').length || 0,
    hasSearch: !!main?.querySelector('[role=searchbox],input[type=search]'),
    hasPagination: !!main?.querySelector('[aria-label*=Paginación]'),
  }
}
```

Expected: `h1: "Prospectos"`, `rowCount: 8`, `hasSearch: true`, `hasPagination: true`.

Click "Ver detalle" on the first row, then evaluate that the URL state (Sidebar's active state) is unchanged but the `<main>` now contains the detail page. Expected: `main` contains `h1` "Prospecto p1" (the stub for now; real detail lands in Task 10).

---

## Task 10: Phase 5+6 — ProspectDetailPage

**Files:** `src/pages/ProspectDetailPage.tsx`

- [ ] **Step 10.1: Implement the full page**

```tsx
import { useMemo, useState } from 'react'
import {
  PageHeader,
  Tabs,
  Card,
  Badge,
  Button,
  ChannelBadge,
  Chip,
  Textarea,
} from '@yes/ui'
import type { BadgeVariant } from '@yes/ui'

import { MOCK_PROSPECTS, type Prospect, type ProspectStatus } from '../data/prospects'
import { MOCK_EMAILS, type Email } from '../data/emails'
import { MOCK_EVENTS, type ProspectEvent } from '../data/events'
import { ScoreBar } from '../components/ScoreBar'
import { useAppToast } from '../lib/toast'
import { formatDate, formatRelative } from '../lib/format'

const STATUS_LABELS: Record<ProspectStatus, string> = {
  discovered: 'Descubierto', enriched: 'Enriquecido', scored: 'Calificado',
  email_generated: 'Email generado', email_approved: 'Email aprobado',
  delivered: 'Entregado', replied: 'Respondió',
}
const STATUS_VARIANTS: Record<ProspectStatus, BadgeVariant> = {
  discovered: 'neutral', enriched: 'info', scored: 'info',
  email_generated: 'warning', email_approved: 'success',
  delivered: 'success', replied: 'success',
}

export interface ProspectDetailPageProps {
  prospectId: string
  onBack: () => void
}

type TabKey = 'info' | 'emails' | 'eventos' | 'notas'

export function ProspectDetailPage({ prospectId, onBack }: ProspectDetailPageProps) {
  const prospect = useMemo<Prospect | undefined>(() => MOCK_PROSPECTS.find((p) => p.id === prospectId), [prospectId])
  const emails   = useMemo<Email[]>(() => MOCK_EMAILS.filter((e) => e.prospect_id === prospectId), [prospectId])
  const events   = useMemo<ProspectEvent[]>(() => MOCK_EVENTS.filter((e) => e.prospect_id === prospectId), [prospectId])

  const toast = useAppToast()
  const [tab, setTab] = useState<TabKey>('info')
  const [notes, setNotes] = useState(prospect?.notes ?? '')

  if (!prospect) {
    return (
      <div className="yes-stack yes-gap-4">
        <Button tone="ghost" onClick={onBack}>← Volver</Button>
        <p>Prospecto no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader
        title={prospect.company_name}
        subtitle={`NIT ${prospect.nit} · ${prospect.city}, ${prospect.department}`}
        actions={<Button tone="ghost" onClick={onBack}>← Volver</Button>}
      />

      <Card>
        <div className="yes-row yes-gap-6 yes-items-center yes-p-4">
          <Badge variant={STATUS_VARIANTS[prospect.status]}>{STATUS_LABELS[prospect.status]}</Badge>
          {prospect.tags.map((t) => <Chip key={t}>{t}</Chip>)}
          <div className="yes-flex-1" />
          {prospect.website && (
            <a href={prospect.website} target="_blank" rel="noreferrer" className="yes-text-muted">{prospect.website}</a>
          )}
        </div>
      </Card>

      <Tabs
        items={[
          { id: 'info',    label: 'Información' },
          { id: 'emails',  label: `Emails (${emails.length})` },
          { id: 'eventos', label: `Eventos (${events.length})` },
          { id: 'notas',   label: 'Notas' },
        ]}
        activeId={tab}
        onChange={(id) => setTab(id as TabKey)}
      />

      {tab === 'info' && (
        <div className="yes-grid-2 yes-gap-4">
          <Card>
            <div className="yes-stack yes-gap-3 yes-p-4">
              <h3>Empresa</h3>
              <div><strong>CIIU:</strong> {prospect.ciiu_description}</div>
              <div><strong>Empleados:</strong> {prospect.employee_count_est ?? '—'}</div>
              <div><strong>Descubierto:</strong> {formatDate(prospect.created_at)}</div>
            </div>
          </Card>
          <Card>
            <div className="yes-stack yes-gap-3 yes-p-4">
              <h3>Contacto principal</h3>
              {prospect.primary_contact ? (
                <>
                  <div><strong>Nombre:</strong> {prospect.primary_contact.full_name}</div>
                  <div><strong>Email:</strong> {prospect.primary_contact.email}</div>
                  <div><strong>Teléfono:</strong> {prospect.primary_contact.phone ?? '—'}</div>
                </>
              ) : <span className="yes-text-muted">Sin contacto registrado</span>}
            </div>
          </Card>
          <Card>
            <div className="yes-stack yes-gap-3 yes-p-4">
              <h3>Scores</h3>
              <ScoreBar value={prospect.opportunity_score} label="Oportunidad" />
              <ScoreBar value={prospect.icp_score_v2}      label="ICP" />
              <ScoreBar value={prospect.commercial_score}  label="Comercial" />
            </div>
          </Card>
        </div>
      )}

      {tab === 'emails' && (
        <div className="yes-stack yes-gap-4">
          {emails.length === 0 && <p className="yes-text-muted">Sin emails generados aún.</p>}
          {emails.map((e) => (
            <Card key={e.id}>
              <div className="yes-stack yes-gap-3 yes-p-4">
                <div className="yes-row yes-items-center yes-gap-3">
                  <Badge variant={e.approved ? 'success' : 'warning'}>{e.approved ? 'Aprobado' : 'Pendiente'}</Badge>
                  {e.is_delivered && <Badge variant="info">Entregado</Badge>}
                  <span className="yes-text-muted">Calidad: {Math.round(e.quality_score * 100)}% · {e.word_count} palabras</span>
                </div>
                <div className="yes-stack yes-gap-1">
                  {e.subject_lines.map((s) => <div key={s}>{s}</div>)}
                </div>
                <div className="yes-row yes-gap-2">
                  <Button tone="primary" size="sm" onClick={() => toast({ variant: 'success', title: 'Email aprobado' })}>Aprobar</Button>
                  <Button tone="ghost"   size="sm" onClick={() => toast({ variant: 'info', title: 'Email rechazado' })}>Rechazar</Button>
                  <Button tone="ghost"   size="sm" onClick={() => toast({ variant: 'success', title: 'Marcado como enviado' })}>Marcar enviado</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'eventos' && (
        <div className="yes-stack yes-gap-3">
          {events.length === 0 && <p className="yes-text-muted">Sin eventos registrados.</p>}
          {events.map((ev) => (
            <Card key={ev.id}>
              <div className="yes-row yes-gap-4 yes-items-center yes-p-4">
                {ev.channel && <ChannelBadge channel={ev.channel} />}
                <div className="yes-flex-1">
                  <div>{eventLabel(ev)}</div>
                  <div className="yes-text-muted">{formatRelative(ev.happened_at)}</div>
                </div>
                {ev.intent && <Badge variant={ev.intent === 'interested' ? 'success' : 'neutral'}>{ev.intent}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'notas' && (
        <Card>
          <div className="yes-stack yes-gap-3 yes-p-4">
            <Textarea
              label="Notas internas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
            <Button tone="primary" onClick={() => toast({ variant: 'success', title: 'Notas guardadas' })}>Guardar notas</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

function eventLabel(ev: ProspectEvent): string {
  switch (ev.event_type) {
    case 'reply_received': return 'Respuesta recibida'
    case 'email_sent':     return 'Email enviado'
    case 'whatsapp_sent':  return 'WhatsApp enviado'
  }
}
```

- [ ] **Step 10.2: Verify**

```bash
pnpm typecheck
grep -n "style={{" src/pages/ProspectDetailPage.tsx
```

Expected: typecheck exit 0; grep returns no output.

- [ ] **Step 10.3: Playwright verification**

From the Prospectos page, click "Ver detalle" on the first row (Transportes del Pacífico). Then:

```js
async () => {
  const main = document.querySelector('main')
  return {
    h1: main?.querySelector('h1')?.textContent,
    tabCount: main?.querySelectorAll('[role=tab]').length || 0,
    hasBackButton: !!Array.from(main?.querySelectorAll('button') || []).find(b => b.textContent?.includes('Volver')),
  }
}
```

Expected: `h1: "Transportes del Pacífico SAS"`, `tabCount: 4`, `hasBackButton: true`.

Click "Volver" — should return to Prospectos list.
Click each tab — content should switch.
Click "Aprobar" in the emails tab — Toast should appear.

---

## Task 11: Phase 5+6 — EmailsPage

**Files:** `src/pages/EmailsPage.tsx`

- [ ] **Step 11.1: Implement**

```tsx
import { useMemo, useState } from 'react'
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Alert,
  KPICard,
} from '@yes/ui'

import { MOCK_EMAILS, type Email } from '../data/emails'
import { MOCK_PROSPECTS } from '../data/prospects'
import { useAppToast } from '../lib/toast'
import { formatRelative } from '../lib/format'

type Filter = 'all' | 'pending' | 'approved' | 'delivered'

export function EmailsPage() {
  const toast = useAppToast()
  const [filter, setFilter] = useState<Filter>('all')

  const stats = useMemo(() => ({
    total:     MOCK_EMAILS.length,
    pending:   MOCK_EMAILS.filter((e) => !e.approved).length,
    approved:  MOCK_EMAILS.filter((e) => e.approved && !e.is_delivered).length,
    delivered: MOCK_EMAILS.filter((e) => e.is_delivered).length,
  }), [])

  const visible = useMemo<Email[]>(() => {
    switch (filter) {
      case 'pending':   return MOCK_EMAILS.filter((e) => !e.approved)
      case 'approved':  return MOCK_EMAILS.filter((e) => e.approved && !e.is_delivered)
      case 'delivered': return MOCK_EMAILS.filter((e) => e.is_delivered)
      default:          return MOCK_EMAILS
    }
  }, [filter])

  const prospectName = (id: string) => MOCK_PROSPECTS.find((p) => p.id === id)?.company_name ?? '—'

  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader title="Emails" subtitle={`${stats.total} emails generados`} />

      <div className="yes-grid-4 yes-gap-4">
        <KPICard label="Total"     value={String(stats.total)} />
        <KPICard label="Pendientes" value={String(stats.pending)} />
        <KPICard label="Aprobados" value={String(stats.approved)} />
        <KPICard label="Enviados"  value={String(stats.delivered)} />
      </div>

      <div className="yes-row yes-gap-2">
        {(['all','pending','approved','delivered'] as Filter[]).map((f) => (
          <Button
            key={f}
            tone={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {{ all: 'Todos', pending: 'Pendientes', approved: 'Aprobados', delivered: 'Enviados' }[f]}
          </Button>
        ))}
      </div>

      <div className="yes-stack yes-gap-4">
        {visible.length === 0 && <p className="yes-text-muted">No hay emails que coincidan con el filtro.</p>}
        {visible.map((e) => (
          <Card key={e.id}>
            <div className="yes-stack yes-gap-3 yes-p-4">
              <div className="yes-row yes-items-center yes-gap-3">
                <strong>{prospectName(e.prospect_id)}</strong>
                <Badge variant={e.approved ? 'success' : 'warning'}>{e.approved ? 'Aprobado' : 'Pendiente'}</Badge>
                {e.is_delivered && <Badge variant="info">Entregado</Badge>}
                <div className="yes-flex-1" />
                <span className="yes-text-muted">{formatRelative(e.created_at)}</span>
              </div>

              {e.quality_score < 0.7 && (
                <Alert variant="warning" title="Calidad baja" description={`Score ${Math.round(e.quality_score * 100)}%. Considera regenerar.`} />
              )}

              <div className="yes-stack yes-gap-1">
                {e.subject_lines.map((s) => <div key={s} className="yes-text-muted">› {s}</div>)}
              </div>

              <div className="yes-row yes-gap-3 yes-items-center yes-text-muted">
                <span>{e.word_count} palabras</span>
                <span>·</span>
                <span>Calidad: {Math.round(e.quality_score * 100)}%</span>
                <span>·</span>
                <span>Modelo: {e.generation_model}</span>
              </div>

              <div className="yes-row yes-gap-2">
                <Button tone="primary" size="sm" onClick={() => toast({ variant: 'success', title: 'Email aprobado' })}>Aprobar</Button>
                <Button tone="ghost"   size="sm" onClick={() => toast({ variant: 'info',    title: 'Email rechazado' })}>Rechazar</Button>
                <Button tone="ghost"   size="sm" onClick={() => toast({ variant: 'success', title: 'Marcado como enviado' })}>Marcar enviado</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 11.2: Verify**

```bash
pnpm typecheck
grep -n "style={{" src/pages/EmailsPage.tsx
```

Expected: typecheck exit 0; grep returns no output.

- [ ] **Step 11.3: Playwright verification**

Click Emails in the sidebar. Then:

```js
async () => {
  const main = document.querySelector('main')
  return {
    h1: main?.querySelector('h1')?.textContent,
    kpiCount: main?.querySelectorAll('button[aria-label*=KPI],[data-testid=kpi-card]').length || main?.querySelectorAll('.yes-grid-4 > *').length || 0,
    cardCount: main?.querySelectorAll('article,[data-yes-card]').length || main?.querySelectorAll('.yes-stack > .yes-stack > *').length || 0,
  }
}
```

Expected: `h1: "Emails"`, 4 KPI cards, at least 5 email cards visible.

Click a filter button (e.g. "Pendientes") — only the unapproved email should remain visible. Click "Todos" — back to all 5.

---

## Task 12: Phase 5+6 — ConfigPage

**Files:** `src/pages/ConfigPage.tsx`

- [ ] **Step 12.1: Implement**

```tsx
import { useState } from 'react'
import {
  PageHeader,
  Tabs,
  Card,
  Input,
  Textarea,
  Button,
  Badge,
  Chip,
  ActionMenu,
} from '@yes/ui'

import {
  MOCK_WORKSPACE,
  MOCK_SETTINGS,
  MOCK_KB_DOCS,
  type KBDoc,
} from '../data/workspace'
import { useAppToast } from '../lib/toast'
import { formatDate } from '../lib/format'

type TabKey = 'workspace' | 'voice' | 'kb'

export function ConfigPage() {
  const toast = useAppToast()
  const [tab, setTab] = useState<TabKey>('workspace')
  const [ws, setWs] = useState(MOCK_WORKSPACE)
  const [settings, setSettings] = useState(MOCK_SETTINGS)
  const [docs, setDocs] = useState<KBDoc[]>(MOCK_KB_DOCS)

  return (
    <div className="yes-stack yes-gap-6">
      <PageHeader title="Configuración" subtitle="Workspace, voz de marca, y base de conocimiento" />

      <Tabs
        items={[
          { id: 'workspace', label: 'Workspace' },
          { id: 'voice',     label: 'Voz de marca' },
          { id: 'kb',        label: `Knowledge base (${docs.length})` },
        ]}
        activeId={tab}
        onChange={(id) => setTab(id as TabKey)}
      />

      {tab === 'workspace' && (
        <Card>
          <div className="yes-stack yes-gap-4 yes-p-4">
            <Input label="Nombre del workspace" value={ws.name}              onChange={(e) => setWs({ ...ws, name: e.target.value })} />
            <Input label="Slug"                 value={ws.slug}              onChange={(e) => setWs({ ...ws, slug: e.target.value })} />
            <Input label="Colección Chroma"     value={ws.chroma_collection} onChange={(e) => setWs({ ...ws, chroma_collection: e.target.value })} hint="Colección del vector store para el RAG" />
            <Button tone="primary" onClick={() => toast({ variant: 'success', title: 'Workspace guardado' })}>Guardar</Button>
          </div>
        </Card>
      )}

      {tab === 'voice' && (
        <Card>
          <div className="yes-stack yes-gap-4 yes-p-4">
            <Textarea label="Voz de marca"   value={settings.brand_voice} onChange={(e) => setSettings({ ...settings, brand_voice: e.target.value })} rows={6} />
            <Input    label="Tono"           value={settings.tone_style}  onChange={(e) => setSettings({ ...settings, tone_style: e.target.value })} hint="Ej: profesional, directo, cálido" />
            <div className="yes-stack yes-gap-2">
              <span className="yes-text-muted">Frases prohibidas</span>
              <div className="yes-row-wrap yes-gap-2">
                {settings.forbidden_phrases.map((p) => (
                  <Chip key={p} onDismiss={() => setSettings({ ...settings, forbidden_phrases: settings.forbidden_phrases.filter((x) => x !== p) })}>{p}</Chip>
                ))}
              </div>
            </div>
            <Textarea label="Firma de email" value={settings.email_signature} onChange={(e) => setSettings({ ...settings, email_signature: e.target.value })} rows={4} />
            <Button tone="primary" onClick={() => toast({ variant: 'success', title: 'Voz de marca guardada' })}>Guardar</Button>
          </div>
        </Card>
      )}

      {tab === 'kb' && (
        <div className="yes-stack yes-gap-4">
          <Card>
            <div className="yes-stack yes-gap-3 yes-p-4">
              <h3>Subir nuevo documento</h3>
              <Input label="Archivo" type="file" />
              <Button tone="primary" onClick={() => toast({ variant: 'info', title: 'Subida mock — no implementada' })}>Subir e indexar</Button>
            </div>
          </Card>

          {docs.length === 0 && <p className="yes-text-muted">No hay documentos indexados.</p>}
          {docs.map((d) => (
            <Card key={d.id}>
              <div className="yes-row yes-items-center yes-gap-4 yes-p-4">
                <div className="yes-flex-1 yes-stack yes-gap-1">
                  <strong>{d.filename}</strong>
                  <span className="yes-text-muted">{d.doc_type.toUpperCase()} · {d.chunk_count} chunks · {formatDate(d.created_at)}</span>
                </div>
                <Badge variant={d.status === 'ready' ? 'success' : d.status === 'indexing' ? 'warning' : 'danger'}>{d.status === 'ready' ? 'Listo' : d.status === 'indexing' ? 'Indexando' : 'Error'}</Badge>
                <ActionMenu
                  items={[
                    { key: 'reindex',  label: 'Reindexar',  onClick: () => toast({ variant: 'info',    title: `Reindexando ${d.filename}…` }) },
                    { key: 'download', label: 'Descargar',  onClick: () => toast({ variant: 'info',    title: 'Descarga mock' }) },
                    { key: 'delete',   label: 'Eliminar',   tone: 'danger', onClick: () => { setDocs(docs.filter((x) => x.id !== d.id)); toast({ variant: 'success', title: `${d.filename} eliminado` }) } },
                  ]}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 12.2: Verify**

```bash
pnpm typecheck
grep -n "style={{" src/pages/ConfigPage.tsx
```

Expected: typecheck exit 0; grep returns no output.

- [ ] **Step 12.3: Playwright verification**

Click Configuración in sidebar. Then:

```js
async () => {
  const main = document.querySelector('main')
  return {
    h1: main?.querySelector('h1')?.textContent,
    tabs: Array.from(main?.querySelectorAll('[role=tab]') || []).map(t => t.textContent),
  }
}
```

Expected: `h1: "Configuración"`, tabs `["Workspace", "Voz de marca", "Knowledge base (3)"]`.

Click "Voz de marca" tab — Textarea + Chip row + Save button should appear. Dismiss a chip — chip should disappear. Click Save — Toast.

Click "Knowledge base" tab — 3 cards visible. Click ActionMenu trigger on a doc → menu opens with 3 items. Click Eliminar → doc removed + Toast.

---

## Task 13: Phase 7 — Decision log entries + methodology sync

**Files (yes-ui):**
- Modify: `docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md`

- [ ] **Step 13.1: Append pre-identified decisions**

After the per-page ingestion notes (added in Task 2), append:

```markdown
## Decisions

### D-001 · Skip TweaksPanel

**Phase:** 3 (Component audit)
**Trigger:** Handoff bundle includes `tweaks-panel.jsx` — a design-time live-tweaks tool that lets the designer adjust density, accent color, etc.
**Options considered:**
1. Port it as a hidden dev-only panel in the consumer app.
2. Skip entirely; not production-facing.
3. Build a yes-ui `<TweaksPanel>` for any consumer to use.
**Decision:** Option 2 — SKIP. Design-time tools belong in the prototype, not in shipped product. If product-level theming is needed later, it's done via token CSS overrides per `yes-ui/README.md` § Token customization.
**Code:** none
**Methodology impact:** Added "design-time tools → SKIP" convention to `mappings/components.md` § Lead Getter row.

### D-002 · ScoreBar as local composition

**Phase:** 3 (Component audit)
**Trigger:** Handoff uses `ProspectScoreBar` to visualize a 0..1 score either as a horizontal bar or as a number. No equivalent in `@yes/ui`.
**Options considered:**
1. Add a new `ScoreBar` component to `@yes/ui` (e.g. Wave 9).
2. Compose locally in the consumer app using yes-ui tokens.
3. Repurpose `Skeleton` with a fill ratio.
**Decision:** Option 2 — local `src/components/ScoreBar.tsx`. Reasons: (a) only one consumer so far; (b) shape is trivial (track + fill + number); (c) future consumers can decide independently. Reconsider promoting to library if/when a 2nd consumer needs the same shape.
**Code:** `lead-getter-frontend/src/components/ScoreBar.tsx` (~25 lines).
**Methodology impact:** Added "library promotion rule" to `mappings/components.md`: a pattern moves to `@yes/ui` only after 2 consumers request it.

### D-003 · Sidebar width — yes-ui default wins

**Phase:** 2 (Token audit)
**Trigger:** Handoff `--sidebar-width: 240px`; yes-ui `--yes-size-sidebar-width: 220px`.
**Options considered:**
1. Override `--yes-size-sidebar-width` in the consumer app's CSS to match the handoff.
2. Accept the yes-ui default; the design system is the source of truth.
3. Change yes-ui's default to 240 px.
**Decision:** Option 2. The design system in `yes-ui/src/tokens/semantic.css` is the authoritative version. The handoff's 240 px is treated as a sketch, not a contract. If a real design decision later determines that 240 px is correct, the change happens in yes-ui first and propagates to every consumer.
**Code:** none — we just consume `--yes-size-sidebar-width` as-is.
**Methodology impact:** Added "library defaults win on numeric mismatches" rule to `mappings/tokens.md`.

### D-004 · Status tone mapping

**Phase:** 3 (Component audit)
**Trigger:** Handoff `prospect.status` has 7 discrete values that need to map to `Badge.variant`'s 6 variants.
**Options considered:**
1. Map each handoff status to a yes-ui `BadgeVariant` via a const table.
2. Pass status string through and let `Badge` accept arbitrary tones.
3. Use color hex codes inline.
**Decision:** Option 1. The mapping table lives both in `mappings/components.md` (methodology) and in `STATUS_VARIANTS` constants inside the two pages that use it (Prospectos and Detail).
**Code:** `STATUS_VARIANTS` const in `src/pages/ProspectosPage.tsx` and `src/pages/ProspectDetailPage.tsx`. Duplication is intentional (each page is self-contained); a third consumer would warrant extraction.
**Methodology impact:** Added "enum mapping convention" — define mappings as `const TYPE: Record<DomainEnum, YesUiVariant>` colocated with the consumer.

### D-005 · EmailCard as local composition

**Phase:** 3 (Component audit)
**Trigger:** Handoff has an `EmailCard` shape that recurs across the Detail page (emails tab) and the Emails page (review queue).
**Options considered:**
1. Promote to `@yes/ui` as a new Wave 9 component.
2. Inline the composition in both pages (duplication).
3. Local helper component in `src/components/`.
**Decision:** Option 2 for now — duplication. Reason: per D-002 promotion rule, we need a 2nd consumer (different project) before adding to the library. Both LG pages count as the same consumer. The duplication is small (~40 lines per page) and divergence is acceptable (Detail page is simpler; Emails page has filter chips and KPI strip).
**Code:** Card composition inline in `src/pages/ProspectDetailPage.tsx` and `src/pages/EmailsPage.tsx`.
**Methodology impact:** Refined the library-promotion rule: "different project" not "different page within the same project".
```

- [ ] **Step 13.2: Verify the decision log has the right shape**

```bash
grep -c "^### D-" docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md
```

Expected: 5 (D-001 through D-005). If less, you missed an entry.

```bash
grep "TBD\|TODO\|FIXME" docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md
```

Expected: no output.

- [ ] **Step 13.3: Update the playbook with the library-promotion rule**

Append a new section to `docs/handoff-pipeline/PLAYBOOK.md` (just before the "Decision log entry template"):

```markdown
## When to promote a local composition to `@yes/ui`

A pattern qualifies for library promotion when **all three** are true:

1. **Two or more separate consumer projects** ask for the same composition.
2. The composition is **stable** — its API hasn't churned in the last 2 weeks of use.
3. The composition uses **only `@yes/ui` exports + tokens + layout utilities** (no external deps).

Below the threshold: keep as a local composition in `src/components/` of the consumer app and add a decision-log entry citing this rule.

(See D-002 and D-005 in `decisions/2026-05-25-lead-getter.md` for examples.)
```

---

## Task 14: Run the suite-level verification gates

**Files:** none (verification only)

- [ ] **Step 14.1: Gate 1 — typecheck**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit 0.

- [ ] **Step 14.2: Gate 2 — build**

```bash
pnpm build
```

Expected: vite build success, no errors.

- [ ] **Step 14.3: Gate 3 — inline-style audit (app-wide)**

```bash
grep -rn "style={{" src/ | grep -v "components/ScoreBar.tsx" | wc -l
```

Expected: 0. (`ScoreBar.tsx` has 2 permitted inline uses for dynamic bar fill — they're documented exceptions.)

- [ ] **Step 14.4: Gate 4 — full Playwright sweep**

If dev server isn't running, restart it:

```bash
pnpm dev > /tmp/lgf.log 2>&1 &
sleep 4
```

Then via Playwright MCP, walk through each page and verify:

1. **Sidebar** — 3 nav items (Prospectos / Emails / Configuración), footer "Andrea López" + "Coordinadora", logout button.
2. **Prospectos** — h1 "Prospectos", 8 visible table rows, search filter works, pagination present, "Ver detalle" navigates.
3. **Detail** — h1 = company name, 4 tabs, "Volver" returns to list, Aprobar fires Toast.
4. **Emails** — h1 "Emails", 4 KPIs, filter buttons work, Aprobar/Rechazar/Marcar enviado fire Toasts.
5. **Configuración** — h1 "Configuración", 3 tabs, Save buttons fire Toasts, KB doc Eliminar removes the doc.

For each interaction, click + immediately `browser_evaluate` for the post-state. Document the snapshot summary inline in the report you produce at the end of Task 16.

- [ ] **Step 14.5: Gate 5 — methodology cleanliness**

```bash
cd /Users/danieltibaquira/Projects/4Yes/yes-ui
grep -rn "TBD\|TODO\|FIXME\|XXX" docs/handoff-pipeline/
```

Expected: no output.

---

## Task 15: Commit the yes-ui methodology

**Files:** All files under `yes-ui/docs/handoff-pipeline/` plus the design spec and this plan (both already committed in earlier brainstorming/writing-plans steps).

- [ ] **Step 15.1: Stage**

```bash
cd /Users/danieltibaquira/Projects/4Yes/yes-ui
git add docs/handoff-pipeline/
git diff --cached --stat
```

Expected: 10 new files under `docs/handoff-pipeline/`.

- [ ] **Step 15.2: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs(handoff-pipeline): metodología Claude Design → @yes/ui v1

Crea docs/handoff-pipeline/ con la metodología reutilizable para tomar
un handoff de claude.ai/design y convertirlo en una app consumer que
consume exclusivamente @yes/ui.

Contenido:
- README.md — punto de entrada, índice
- PLAYBOOK.md — proceso de 7 fases (ingest → token audit → component
  audit → scaffold → port → wire → log)
- mappings/{tokens,components,layouts}.md — tablas de mapeo deterministas
- templates/{consumer-app-scaffold,page-component}.md — recetas Vite + React + TS
- checklists/{ingestion,verification}.md — gates por fase
- decisions/2026-05-25-lead-getter.md — primer caso de estudio (5 decisiones
  D-001..D-005 registradas, notas de ingest por las 5 páginas del handoff)

Primer aplicación: app consumer ~/Projects/4Yes/lead-getter-frontend/
(commit aparte, repositorio nuevo).
EOF
)" && git log --oneline -3
```

---

## Task 16: Initialize and commit the lead-getter-frontend repo

**Files:** `~/Projects/4Yes/lead-getter-frontend/` (everything created in Tasks 5–12)

This is a NEW repo. It needs `git init` first.

- [ ] **Step 16.1: Init the repo**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
git init -b main
```

- [ ] **Step 16.2: Stage everything (respecting .gitignore)**

```bash
git add -A
git status --short
```

Expected: ~20 files added (no `node_modules/`, no `dist/`).

- [ ] **Step 16.3: Initial commit**

```bash
git commit -m "$(cat <<'EOF'
feat(lead-getter-frontend): scaffold inicial — 5 páginas consumiendo @yes/ui

Primer aplicación de la metodología handoff-pipeline (yes-ui/docs/handoff-pipeline/).
Toma el handoff de Claude Design Lead Getter y lo implementa como app Vite +
React + TS que consume exclusivamente @yes/ui v1.2.0.

5 páginas:
- Prospectos — TableAdvanced + Toolbar + Pagination + filtros
- Detalle del prospecto — PageHeader + Tabs + tarjetas (Info/Emails/Eventos/Notas)
- Emails — KPICard row + filtros + cards de revisión
- Configuración — Tabs (Workspace/Voz de marca/Knowledge base) + formularios
- Sidebar shell envuelve todo

Datos mock (12 prospectos colombianos, 5 emails, 4 eventos, workspace + KB).
Cero style={{}} excepto en src/components/ScoreBar.tsx (excepción documentada
en decision log D-002 — values dinámicos del fill de la barra).

Todo el layout vía @yes/ui/styles/layout. Cero dependencias UI adicionales.
Backend wiring fuera de alcance (vive en ~/Projects/4Yes/lead-getter/).

Decisiones registradas en yes-ui/docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md
(D-001..D-005).
EOF
)" && git log --oneline -3
```

- [ ] **Step 16.4: Final verification**

```bash
cd /Users/danieltibaquira/Projects/4Yes/lead-getter-frontend
git status
git log --oneline -1
```

Expected: clean working tree, one commit on main.

Then check the methodology repo:

```bash
cd /Users/danieltibaquira/Projects/4Yes/yes-ui
git log --oneline -3
```

Expected: top commit is the handoff-pipeline doc commit from Task 15; previous commits unchanged.

---

## Final report skeleton

After Task 16 lands, produce a summary using the report format from `docs/HANDBOOK.md` § 6:

```markdown
result: handoff-pipeline metodología shipped + lead-getter-frontend scaffold shipped
({yes-ui-sha} + {lgf-sha}). 10-file methodology in yes-ui/docs/handoff-pipeline/.
12-file consumer app at ~/Projects/4Yes/lead-getter-frontend/. 5 pages all
rendering and interactive. 0 inline styles (1 documented exception in ScoreBar).
5 decisions logged. Methodology ready to apply to the next handoff.
```