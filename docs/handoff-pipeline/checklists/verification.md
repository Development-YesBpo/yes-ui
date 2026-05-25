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
8. **Inline-style audit, app-wide** — `grep -rn "style={{" src/` returns 0 hits (`src/components/ScoreBar.tsx` is the only documented exception per D-002).
9. **Methodology updated** — decision log written, mapping tables updated, no `TBD` strings left in any methodology doc.
