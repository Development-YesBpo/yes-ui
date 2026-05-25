# Component mappings

Handoff JSX component → `@yes/ui` export. Populated per case study in Phase 3 of `PLAYBOOK.md`.

Three outcomes per component:
1. **Direct** — one or more yes-ui exports.
2. **Local composition** — built in `src/components/` of the consumer app. Add decision-log entry.
3. **Skip** — design-time tool, not for production. Add decision-log entry.

**Library promotion rule:** a pattern moves to `@yes/ui` only after 2 separate consumer projects request it (see `PLAYBOOK.md` § "When to promote a local composition to `@yes/ui`"). A second page in the same project does NOT count.

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
| `Pagination` (handoff inline) | Direct | `Pagination` (Wave 6a) | yes-ui API: `page/pageSize/total/onPageChange` |
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

Note: yes-ui `BadgeVariant` is `'success' | 'error' | 'warning' | 'info' | 'neutral' | 'blue'`. The type alias is internal — consumers redeclare locally if needed (`type BadgeVariant = 'success' | ...`).

### Enum mapping convention

Define handoff-enum → yes-ui-variant maps as `const TYPE: Record<DomainEnum, YesUiVariant>` colocated with the consumer page that needs them. Promote to a shared file only when 3+ pages share the same map.

### ScoreBar spec (`src/components/ScoreBar.tsx`)

Props: `{ value: number | null /* 0..1 */, label?: string, max?: number /* default 1 */ }`

Behavior:
- Renders a filled bar inside a track + the numeric percentage to the right.
- Uses `var(--yes-color-primary)` for fill, `var(--yes-color-border)` for track.
- Uses `var(--yes-space-2)` for inner gap.
- Track width via `className="yes-w-full"`. Fill width and bar height use inline `style` because they are dynamic values computed at render time. This is the documented exception per design spec § 3 and per D-002.

Implementation appears in the consumer app (Task 8).

**Gaps:** none beyond `ScoreBar` (local) and `TweaksPanel` (skip). Phase 3 gate passes.
