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

## When to promote a local composition to `@yes/ui`

A pattern qualifies for library promotion when **all three** are true:

1. **Two or more separate consumer projects** ask for the same composition.
2. The composition is **stable** — its API hasn't churned in the last 2 weeks of use.
3. The composition uses **only `@yes/ui` exports + tokens + layout utilities** (no external deps).

Below the threshold: keep as a local composition in `src/components/` of the consumer app and add a decision-log entry citing this rule.

(See D-002 and D-005 in `decisions/2026-05-25-lead-getter.md` for examples.)

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
