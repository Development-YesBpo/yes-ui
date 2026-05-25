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
