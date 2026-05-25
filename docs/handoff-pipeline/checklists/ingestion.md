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
