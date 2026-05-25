# Decision Log — Lead Getter handoff (2026-05-25)

Per-handoff log of every non-trivial decision made while applying the playbook.

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
**Code:** `lead-getter-frontend/src/components/ScoreBar.tsx` (~25 lines). Two `style={{}}` props are permitted (and the only ones in the entire consumer app) because they hold runtime-computed dynamic values: the fill bar's `width` (percentage) and `height` (track size).
**Methodology impact:** Added "library promotion rule" to `mappings/components.md`: a pattern moves to `@yes/ui` only after 2 separate consumer projects request it.

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
