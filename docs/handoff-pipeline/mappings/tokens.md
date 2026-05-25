# Token mappings

Handoff CSS variable → `@yes/ui` `--yes-*` token. Populated per case study in Phase 2 of `PLAYBOOK.md`.

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

**Library defaults win on numeric mismatches** — when the handoff and yes-ui both define a value (e.g. sidebar width 240 vs 220), yes-ui wins. The handoff is treated as a sketch; the design system is the contract.

**Gaps:** none. Every handoff token has an equivalent. Phase 2 gate passes.
