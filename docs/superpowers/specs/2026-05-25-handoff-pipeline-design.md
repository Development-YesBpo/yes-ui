# Design — Claude Design Handoff → @yes/ui Pipeline

**Status:** Approved 2026-05-25
**First case study:** Lead Getter (handoff at `~/Projects/4Yes/yes-ui/lead-getter-handoff/`)
**Repository:** `~/Projects/4Yes/yes-ui/` (methodology) + `~/Projects/4Yes/lead-getter-frontend/` (consumer app)

---

## 1 · Goal

Establish a **repeatable, validated process** for turning a Claude Design (claude.ai/design) handoff bundle into a production consumer app that consumes ONLY `@yes/ui` exports.

The methodology lives inside `@yes/ui` so it ships with the library. Every future @yes/ui consumer can apply the same playbook to their own handoff bundle.

The Lead Getter handoff is the **first exploratory ground** — we apply the methodology end-to-end to all 5 of its pages, capture every decision in a log, and feed those decisions back into the playbook.

This work produces three artifacts:

| Artifact | Lives in | Purpose |
|----------|----------|---------|
| **Methodology** (README + PLAYBOOK + mapping tables + templates + checklists) | `yes-ui/docs/handoff-pipeline/` | The reusable contract for any future handoff |
| **Consumer app** (5 pages, no backend) | `~/Projects/4Yes/lead-getter-frontend/` | Vite + React + TS app that proves the methodology by building all 5 handoff pages using only @yes/ui exports |
| **Decision log** (per handoff) | `yes-ui/docs/handoff-pipeline/decisions/2026-05-25-lead-getter.md` | Every mapping decision, snag, and library gap encountered during this run — fed back into the playbook |

---

## 2 · Methodology directory layout

```
yes-ui/docs/handoff-pipeline/
├── README.md                           # Entry point — what this is, when to use it
├── PLAYBOOK.md                         # The 7-phase process (defined in § 5)
├── mappings/
│   ├── tokens.md                       # handoff CSS var → yes-ui --yes-* token (~60 rows)
│   ├── components.md                   # handoff JSX component → yes-ui export
│   └── layouts.md                      # handoff inline-style pattern → @yes/ui/styles/layout class
├── templates/
│   ├── consumer-app-scaffold.md        # Vite + React + TS recipe matching yes-ui-mock-app
│   └── page-component.md               # Page-component skeleton matching the 5-page convention
├── decisions/
│   └── 2026-05-25-lead-getter.md       # First case-study log (this run)
└── checklists/
    ├── ingestion.md                    # Bundle-reading checklist (phase 1 gate)
    └── verification.md                 # Per-page gates (Playwright snapshot, inline-style audit)
```

### Naming convention

- `mappings/` is the **declarative** core — lookup tables, no narrative.
- `templates/` is **prescriptive scaffolds** — copy-paste recipes for the consumer side.
- `checklists/` is **gates** — concrete pass/fail criteria.
- `decisions/` is the **historical record** per handoff.
- `PLAYBOOK.md` is the **how-to** that references all of the above in order.

---

## 3 · Consumer app structure (lead-getter-frontend)

Sibling to `yes-ui/` and `yes-ui-mock-app/`. Same scaffold pattern proven during the v1.2.0 mock-app build:

```
~/Projects/4Yes/lead-getter-frontend/
├── package.json                        # "@yes/ui": "file:../yes-ui"
├── tsconfig.json                       # strict, exactOptionalPropertyTypes
├── vite.config.ts
├── index.html
├── README.md                           # how to run, link back to handoff-pipeline docs
├── .gitignore
├── .vscode/settings.json               # pin workspace TS (carryover from yes-ui v1.1.0)
└── src/
    ├── main.tsx                        # imports tokens + layout CSS from @yes/ui (ONLY place CSS is imported)
    ├── App.tsx                         # shell: Sidebar + page switcher (matches mock-app pattern)
    ├── lib/
    │   ├── nav.ts                      # 5 nav items: Prospectos / Detalle / Emails / Configuración + back-nav state
    │   ├── toast.tsx                   # ToastProvider context (matches mock-app pattern)
    │   └── format.ts                   # date / score formatters (one-off helpers — NOT in @yes/ui scope)
    ├── data/
    │   ├── prospects.ts                # MOCK_PROSPECTS (12 records, from handoff LGApp.jsx)
    │   ├── emails.ts                   # MOCK_EMAILS (5 records, from handoff)
    │   ├── events.ts                   # MOCK_EVENTS (4 records, from handoff)
    │   └── workspace.ts                # MOCK_WORKSPACE + MOCK_SETTINGS + MOCK_KB_DOCS
    ├── components/
    │   └── ScoreBar.tsx                # local one-off composition (see decision D-002 in the log)
    └── pages/
        ├── ProspectosPage.tsx          # list + filter + table + pagination
        ├── ProspectDetailPage.tsx      # PanelRich-style detail with tabs (Info / Emails / Eventos / Notas)
        ├── EmailsPage.tsx              # email review queue
        ├── ConfigPage.tsx              # workspace + brand voice + KB documents
        └── (Sidebar is in App.tsx, not a page)
```

### CSS imports (in `src/main.tsx` — ONLY place CSS is imported)

```ts
import '@yes/ui/tokens/primitives'
import '@yes/ui/tokens/default'
import '@yes/ui/styles/layout'
```

### Hard style policy

- **Zero `style={{}}` in any JSX.** Verified by `grep -rn "style={{" src/` → must return 0.
- Layout exclusively via `@yes/ui/styles/layout` utility classes (`yes-stack`, `yes-row`, `yes-grid-N`, `yes-gap-N`, etc.).
- If a layout need can't be met by existing utility classes, add the class to `@yes/ui/src/styles/layout.css` (separate yes-ui PR), do NOT inline.
- Local one-off compositions (e.g. `ScoreBar.tsx`) get their own focused file in `src/components/` and use only @yes/ui tokens + layout classes — same rules apply.

---

## 4 · Mapping rules (the heart of the methodology)

Three lookup tables. These are the methodology's **declarative core** — every handoff input has a deterministic target in the library.

### 4.1 Tokens (`mappings/tokens.md`)

The handoff `colors_and_type.css` already uses the same semantic naming as our library's source-of-truth design system. The mapping is mostly 1:1. Examples (full table populated during phase 2):

| Handoff variable | yes-ui token | Notes |
|------------------|--------------|-------|
| `--brand-blue` | `--yes-color-primary` | Same hex (#2B52A0) |
| `--brand-green` | `--yes-color-brand-accent` | Same hex (#8CBC39) |
| `--blue-900` | `--yes-color-sidebar-bg` | Same hex (#142860) |
| `--neutral-100` | `--yes-color-bg` | Page background |
| `--neutral-200` | `--yes-color-border` | Default border |
| `--neutral-900` | `--yes-color-text` | Primary text |
| `--font-display` | `--yes-font-display` | Barlow Semi Condensed |
| `--font-body` | `--yes-font-sans` | Manrope |
| `--space-4` | `--yes-space-4` | 16 px |
| `--sidebar-width` | `--yes-size-sidebar-width` | 220 px in yes-ui (vs 240 px in handoff — flag) |
| `--radius-md` | `--yes-radius-btn` | 6 px |
| `--shadow-md` | `--yes-shadow-md` | Identical formula |

**Phase 2 gate:** every handoff token must have a target. If a token is missing in yes-ui, the methodology requires adding it to `semantic.css` BEFORE the consumer app touches it (else inline-styles leak in).

### 4.2 Components (`mappings/components.md`)

Handoff JSX → yes-ui export. Examples (full table populated during phase 3):

| Handoff JSX | yes-ui target | Notes |
|-------------|---------------|-------|
| `LGSidebar` | `Sidebar` (Wave 4) | Direct swap; nav items shape matches |
| `StatusBadge` | `Badge` (Wave 1) | Tone mapping: `email_generated` → `info`, `email_approved` → `success`, etc. — captured in component mapping |
| `ChannelBadge` (handoff inline) | `ChannelBadge` (Wave 1) | Direct swap |
| `LGTopBar` | `PageHeader` (Wave 7) | Re-architected; handoff has filters inline, yes-ui composes Toolbar separately |
| `ProspectsTable` | `TableAdvanced` (Wave 6b) + `Pagination` (Wave 6a) | Page-level composition |
| `ProspectDetailPanel` | `PanelRich` (Wave 8) | Wave 8 was literally built for this |
| `EmailCard` | `Card` + `Badge` + `Button` | Local composition |
| Config form fields | `Input` / `Select` / `Textarea` / `Toggle` / `Checkbox` (Wave 2) | 1:1 |
| `KBDocumentRow` | `Card` + `Badge` + `ActionMenu` (Wave 7) | Local composition |
| `ProspectScoreBar` | **GAP — local composition `src/components/ScoreBar.tsx`** | See decision D-002 in the log |
| `TweaksPanel` | **SKIP — design-time tool, not production** | See decision D-001 |

**Phase 3 gate:** every handoff component maps to (a) one or more yes-ui exports, (b) a local composition with rationale, or (c) an explicit SKIP. No silent gaps.

### 4.3 Layouts (`mappings/layouts.md`)

Handoff uses inline `style={{ display: 'flex', gap: 16, ... }}` everywhere. The methodology requires every inline-style pattern to translate to a utility-class combination from `@yes/ui/styles/layout` (shipped in v1.2.0). Examples:

| Handoff inline pattern | yes-ui className |
|------------------------|------------------|
| `style={{ display: 'flex', flexDirection: 'column', gap: 16 }}` | `className="yes-stack yes-gap-4"` |
| `style={{ display: 'flex', alignItems: 'center', gap: 8 }}` | `className="yes-row yes-items-center yes-gap-2"` |
| `style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}` | `className="yes-grid-4 yes-gap-4"` |
| `style={{ flex: 1, minWidth: 0 }}` | `className="yes-flex-1"` |
| `style={{ padding: '24px' }}` | `className="yes-p-6"` |
| `style={{ marginTop: 'auto' }}` | `className="yes-mt-auto"` |
| `style={{ width: '100%' }}` | `className="yes-w-full"` |
| `style={{ minHeight: '100vh' }}` | `className="yes-min-h-screen"` |

If a layout need cannot be expressed with existing utilities, the methodology requires:
1. Add the class to `yes-ui/src/styles/layout.css` (separate library change, MUST land first).
2. Re-publish a new yes-ui version (patch bump).
3. Resume the consumer app once the new utility is available.

This keeps inline styles out of consumer code as a hard invariant.

---

## 5 · The 7-phase build process (PLAYBOOK.md)

Each phase produces an artifact that gates the next. The phases are deliberately small so each phase's output can be reviewed independently.

| Phase | Input | Output | Gate (concrete pass criterion) |
|-------|-------|--------|--------------------------------|
| **1. Ingest** | Handoff bundle (e.g. `lead-getter-handoff/`) | `INGESTION-NOTES.md` per page: page name, sections, data shape, list of interactions catalogued | Checklist in `checklists/ingestion.md` complete |
| **2. Token audit** | Handoff `colors_and_type.css` (or equivalent) | Diff appended to `mappings/tokens.md`: every handoff token either maps to existing `--yes-*` or is flagged as missing | Zero unmapped tokens (else add to library first) |
| **3. Component audit** | Handoff JSX files | Diff appended to `mappings/components.md`: every handoff component maps to a yes-ui export, a local composition, or an explicit SKIP | Zero unmapped components (else open library issue) |
| **4. Scaffold consumer app** | Templates in `templates/consumer-app-scaffold.md` | A consumer app directory with package.json, vite.config, tsconfig, src/main.tsx, src/App.tsx (Sidebar shell only — pages stubbed) | `pnpm dev` serves on a port; Sidebar nav switches between empty page placeholders |
| **5. Page-by-page port** | One handoff page at a time | One consumer page file using only @yes/ui exports + layout utilities | (a) a11y snapshot via Playwright matches handoff content; (b) `grep -rn "style={{" src/pages/<Page>.tsx` returns 0; (c) console has zero React errors |
| **6. Interaction wiring** | Stub handlers per page | Real handlers wired (mock data, state via useState/useReducer, no backend) | Every button / row / form actually does what the handoff prototype shows — verified via Playwright click + snapshot |
| **7. Decision log + methodology update** | Notes from phases 1–6 | `decisions/<YYYY-MM-DD>-<project>.md` plus updates to mapping tables, PLAYBOOK, or new utility classes in yes-ui | Doc reviewed; methodology updates merged; library changes (if any) have their own PR + version bump |

### Phase order is enforced

- Phases 2 and 3 BLOCK phase 4 if there are unresolved gaps. A library gap is fixed in yes-ui first (own PR + version bump), then the consumer app picks up the new version.
- Phase 5 runs page-by-page in dependency order — the shell (App + Sidebar) before any page; shared local compositions (e.g. ScoreBar) before pages that use them.
- Phase 6 only starts once phase 5 has produced the visual scaffold for a page. Interaction wiring is layered on top.

---

## 6 · Decision log shape (`decisions/<date>-<project>.md`)

Each entry follows this template:

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

### Pre-identified decisions for the lead-getter case study

These are recognized now and will land in the log as the first entries:

- **D-001 · Skip TweaksPanel** — handoff includes a design-time live-tweaks tool (`tweaks-panel.jsx`). Decision: omit from the consumer app. Methodology impact: add a "design-time tools" SKIP convention to `mappings/components.md`.
- **D-002 · ScoreBar as local composition** — handoff has `ProspectScoreBar` (a 0–1 score visualized as bar or number). Not in yes-ui. Decision: local `src/components/ScoreBar.tsx` using only @yes/ui tokens. Methodology impact: codify "when to add to library vs compose locally" rule in `mappings/components.md`.
- **D-003 · Sidebar width 220 px vs 240 px** — handoff token `--sidebar-width: 240px`, yes-ui `--yes-size-sidebar-width: 220px`. Decision: yes-ui default wins. Methodology impact: add "library defaults win" rule to `mappings/tokens.md`.
- **D-004 · Status tone mapping** — handoff `status` values (`email_generated`, `email_approved`, `delivered`, `replied`, etc.) need mapping to yes-ui `Badge` tones. Decision: explicit table in `mappings/components.md`. Methodology impact: lookup table per project.

---

## 7 · Verification (`checklists/verification.md`)

Per-page gates (all must pass before page is marked done in the decision log):

1. **Renders** — `pnpm dev` serves; Playwright `browser_navigate` returns HTTP 200.
2. **Content** — Playwright a11y snapshot contains expected Spanish text (page title, table column headers, action button labels).
3. **No inline styles** — `grep -rn "style={{" src/pages/<Page>.tsx` returns 0.
4. **Interactions** — for every interaction the handoff shows, a Playwright `browser_click` + snapshot verifies the state change.
5. **No console errors** — Playwright `browser_console_messages` at error level returns no React errors (favicon 404 acceptable).

Suite-level gates (must pass before merge):

6. **Typecheck clean** — `pnpm typecheck` exit 0.
7. **Build clean** — `pnpm build` succeeds.
8. **Inline-style audit, app-wide** — `grep -rn "style={{" src/` returns 0.
9. **Methodology updated** — decision log written, mapping tables updated where new entries were added during the build.

---

## 8 · Interfaces and boundaries

### Methodology consumers

- **Future @yes/ui consumer**: reads `docs/handoff-pipeline/README.md`, follows `PLAYBOOK.md`, consults `mappings/*.md` per phase, scaffolds via `templates/consumer-app-scaffold.md`.
- **yes-ui maintainers**: when a consumer's case-study log surfaces a recurring gap, that gap becomes a library backlog item (add a component, add a token, add a utility class).

### Consumer app → library boundary

- Consumer app imports ONLY from `@yes/ui`, `@yes/ui/tokens/*`, `@yes/ui/styles/layout`. No reach-through into yes-ui internals.
- Local compositions in `src/components/` use only yes-ui exports + tokens + layout classes — same import rule applies recursively.
- Mock data lives in `src/data/` and uses TypeScript shapes that mirror the handoff prototype's mock data structure (so swapping for a real API client later is a single layer change).

---

## 9 · Out of scope (YAGNI)

- ❌ Backend wiring — lead-getter-frontend stays mock-data-only. Real API integration is the lead-getter project's concern.
- ❌ Automated codemod scripts (handoff JSX → yes-ui TSX) — manual port is faster for this scale; the methodology is the leverage, not tooling. Revisit if a 3rd handoff arrives.
- ❌ Visual regression testing infrastructure (Chromatic / Percy) — Playwright a11y snapshots are sufficient verification for this scope.
- ❌ Storybook for the consumer app — yes-ui's Storybook is enough; consumer apps demonstrate composition, not catalog.
- ❌ A new yes-ui component just because the handoff has one — local composition is preferred unless the pattern recurs across 2+ consumers.
- ❌ Pixel-perfect match to the handoff prototype — visual fidelity is "functionally equivalent using yes-ui defaults". If a yes-ui `Button` is 2px taller than the prototype's button, yes-ui wins.

---

## 10 · Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Handoff uses a visual pattern with no yes-ui equivalent and no clean local composition | Medium | High (blocks page) | Methodology requires opening a library issue and either (a) adding the component to a future wave or (b) documenting a SKIP with rationale |
| `@yes/ui/styles/layout` (v1.2.0) lacks a utility for some handoff layout | Medium | Medium (blocks page) | Methodology requires adding the class to yes-ui first (separate PR + patch bump), then resuming |
| The decision log becomes a dumping ground with no synthesis | Low | Medium (methodology rots) | Phase 7 explicitly requires synthesis into mapping tables; the log is the source, not the destination |
| Consumer app diverges from `yes-ui-mock-app` patterns | Medium | Low (inconsistency between consumer apps) | `templates/consumer-app-scaffold.md` codifies the shared shape; deviations require a decision-log entry |
| The methodology gets written but no second handoff ever uses it | Low | Low (sunk cost) | Even one-shot, the lead-getter consumer app is a tangible deliverable on its own |

---

## 11 · Sequence

Single-track work, ordered:

1. Methodology scaffold first (empty README, PLAYBOOK skeleton, empty mapping tables) — gives the build something to fill in as it progresses.
2. Phase 1 (ingest) — produces INGESTION-NOTES per page.
3. Phase 2 (token audit) — fills tokens.md.
4. Phase 3 (component audit) — fills components.md.
5. Phase 4 (scaffold consumer app) — produces lead-getter-frontend with Sidebar + 5 empty pages.
6. Phase 5 + 6 per page, in order: Prospectos → Detalle → Emails → Configuración. (Sidebar shell already done in phase 4.)
7. Phase 7 (decision log + methodology sync) — final pass.

Each phase commits independently to make the case study reviewable.

---

## 12 · Done definition

- `yes-ui/docs/handoff-pipeline/` fully populated per the layout in § 2.
- `~/Projects/4Yes/lead-getter-frontend/` exists, `pnpm dev` serves on a port, all 5 pages render and respond to interactions per the handoff.
- Every page passes the verification checklist (§ 7).
- `decisions/2026-05-25-lead-getter.md` written with at minimum D-001 through D-004 and any additional decisions surfaced during the build.
- Mapping tables (`tokens.md`, `components.md`, `layouts.md`) populated with the real data from the case study, not placeholders.
- Spanish commit messages, no co-author lines, no commits without explicit user instruction.
