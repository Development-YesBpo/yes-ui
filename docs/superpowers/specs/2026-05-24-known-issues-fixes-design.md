# Design — Known Issues Fixes (v1.1.0)

**Status:** Approved 2026-05-24
**Target version:** 1.1.0
**Predecessor:** v1.0.0 (commit `195807b`) — see `docs/HANDBOOK.md` § 8 for the issue catalog this design resolves.

---

## 1 · Goal

Eliminate or formally accept every entry in `docs/HANDBOOK.md` § 8 "Known Issues and Pre-Existing Debt". After this work, the section becomes a much shorter "Documented Intentional Decisions" list.

Concretely:

| # | Issue (current) | Target state after this work |
|---|-----------------|------------------------------|
| 1 | Storybook autodocs+MDX collision (worked around) | **RESOLVED** — config change makes the collision impossible |
| 2 | CSS Modules not bundled (intentional) | **DOCUMENTED-INTENT** — `tsup.config.ts` no longer lies; HANDBOOK reframes the inline-style pattern as the chosen architecture |
| 3 | `--yes-text-2xl` collision (worked around) | **RESOLVED** — verified zero conflict, no action needed beyond removing from the list |
| 4 | Avatar `size` enumerated, not numeric | **RESOLVED** — `size` accepts `Size \| number`; Wave 8 consumers pass pixels |
| 5 | `exactOptionalPropertyTypes` spread workaround | **RESOLVED** — Avatar's `src` typed `string \| undefined`; conditional spreads removed |
| 6 | IDE TS-server stale diagnostics | **MITIGATED** — `.vscode/settings.json` pins workspace TS version; HANDBOOK keeps the "restart TS server" remediation |

---

## 2 · Architecture and units of work

### Group A — Real source fixes

#### A1 — Avatar (`src/components/Avatar/Avatar.tsx`)

Two API extensions, both non-breaking:

1. **Numeric size support**

   Current:
   ```ts
   interface AvatarProps extends BaseProps {
     name: string
     size?: Size            // 'sm' | 'md' | 'lg' → 24 | 32 | 40 px
     src?: string
     alt?: string
   }
   ```

   Target:
   ```ts
   interface AvatarProps extends BaseProps {
     name: string
     size?: Size | number   // accepts named token OR raw pixels
     src?: string | undefined  // explicit "accepts undefined" under exactOptionalPropertyTypes
     alt?: string
   }
   ```

   Implementation in the render body:
   ```ts
   const isNum = typeof size === 'number'
   const sizePx = isNum ? `${size}px` : SIZE_TOKENS[size as Size]
   const fontPx = isNum ? `${Math.round(size * 0.36)}px` : FONT_SIZE_TOKENS[size as Size]
   ```

   The `0.36` initials-to-avatar font ratio already lives in the existing FONT_SIZE_TOKENS calc; this just lifts it to runtime when numeric.

2. **`src` typing relax**

   `src?: string` does NOT accept `src: undefined` under `exactOptionalPropertyTypes: true`. `src?: string | undefined` does. The explicit-`undefined` typing is the canonical fix for this exact case (TypeScript handbook recommends it).

#### A2 — Wave 8 consumers

Three files migrate from ad-hoc tokens to numeric sizes and drop their conditional spreads:

| File | Token used (drop) | New `<Avatar size={N}>` | Spread removed |
|------|------------------|--------------------------|----------------|
| `MessageBubble.tsx` (line 130) | `--yes-size-avatar-bubble` (20px) | `size={20}` | `{...(senderAvatar ? { src: senderAvatar } : {})}` → `src={senderAvatar}` |
| `ConversationItem.tsx` (line 173) | `--yes-size-avatar-36` (36px) | `size={36}` | `{...(avatarSrc ? { src: avatarSrc } : {})}` → `src={avatarSrc}` |
| `PanelRich.tsx` (line 303) | `--yes-size-avatar-42` (42px) | `size={42}` | `{...(contact.avatarSrc ? { src: contact.avatarSrc } : {})}` → `src={contact.avatarSrc}` |

Then remove the 3 ad-hoc tokens from `src/tokens/semantic.css`:
- `--yes-size-avatar-36`
- `--yes-size-avatar-42`
- `--yes-size-avatar-bubble`

Current invocation pattern in all 3 components (verified by reading source at the line ranges above):

```tsx
const AVATAR_STYLE: React.CSSProperties = {
  width:    'var(--yes-size-avatar-{36|42|bubble})',
  height:   'var(--yes-size-avatar-{36|42|bubble})',
  fontSize: 'calc(var(--yes-size-avatar-{36|42|bubble}) * 0.36)',
  flexShrink: 0,
}

<Avatar
  name={...}
  {...(src ? { src } : {})}
  style={AVATAR_STYLE}
/>
```

After migration:

```tsx
const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,                          // only the layout-critical override remains
}

<Avatar
  name={...}
  src={src}                                // direct pass-through; no spread
  size={36}                                // or 20 / 42
  style={AVATAR_STYLE}
/>
```

`flexShrink: 0` stays — it prevents Avatar from collapsing inside flex parents. The width/height/fontSize trio comes from Avatar's own internal sizing logic, now driven by the numeric `size` prop.

### Group B — Tooling/config

#### B1 — Storybook autodocs disable (`.storybook/main.ts`)

```diff
   docs: {
-    autodocs: 'tag',
+    autodocs: false,
     defaultName: 'Docs',
   },
```

Effect: `tags: ['autodocs']` in any story file becomes a no-op. The `.mdx` files (one per component) remain the canonical docs surface. `defaultName: 'Docs'` still controls the title of the MDX-rendered docs entry.

Impact verification: re-fetch `http://localhost:6006/index.json` after the change and confirm component count drops to expected (one `--docs` entry per component, same as today).

#### B2 — `tsup.config.ts` honesty edit

Current (misleading):
```ts
  // CSS Modules for component structural styles are injected into JS bundles.
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  injectStyle: true,
```

Target (truthful):
```ts
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  //
  // Component visual styles use inline React.CSSProperties + a per-component
  // <style> block injected at runtime (see docs/HANDBOOK.md § 4 "How to add
  // a component" → CSS Modules note). The `.module.css` files in each
  // component directory document structural intent but are NOT imported,
  // so there is nothing for tsup to bundle here.
```

Remove the `injectStyle: true` line — it was for the never-realized CSS Modules path.

#### B3 — `.vscode/settings.json` (new)

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

Pins the IDE to the project's TypeScript version. Reduces the IDE-vs-tsc drift that produces the stale "Cannot find module" diagnostics observed across every wave this session.

### Group C — Docs

#### C1 — HANDBOOK § 8 rewrite

Replace the 6-issue debt list with:

- **Resolved in 1.1.0** (issues 1, 3, 4, 5) — bullet each with the commit that resolved it.
- **Documented intentional decisions** (issue 2) — reframe inline-styles + `.module.css` placeholders as the chosen architecture, not technical debt.
- **Mitigated** (issue 6) — note `.vscode/settings.json` pin and the restart-TS-server remediation.

#### C2 — CHANGELOG `[1.1.0]` entry

Sections:
- **Added** — `Avatar.size` numeric support.
- **Changed** — Wave 8 components pass numeric size; Storybook autodocs disabled project-wide.
- **Removed** — 3 ad-hoc avatar size tokens; misleading `injectStyle: true` from tsup config.
- **Fixed** — `Avatar.src` typing accepts undefined under exactOptionalPropertyTypes.
- **Internal** — `.vscode/settings.json` pins workspace TS.

#### C3 — `package.json` 1.0.0 → 1.1.0

Minor bump (additive, non-breaking).

### Group D — Verification gates

1. `pnpm typecheck` → exit 0
2. `pnpm test` → 482/482 passing (no test changes expected — assertions are on text/role/aria, not pixel computed styles)
3. `pnpm build && pnpm check-dist` → all artifacts present
4. Playwright a11y snapshot of `wave-8-communication-messagebubble--full-conversation`, `wave-8-communication-conversationitem--conversation-list`, `wave-8-communication-panelrich--in-context` → confirm Avatar elements still render with `name=` initials
5. Storybook `index.json` fetch → confirms entries indexed cleanly after B1

---

## 3 · Sequence (single commit, ordered)

| Step | Action | Why this order |
|------|--------|----------------|
| 1 | B1 (Storybook autodocs disable) | Independent, smallest change, easy to back out |
| 2 | A1 (Avatar API extensions) | Foundation for A2; must land before consumers compile |
| 3 | A2 (Wave 8 migrations + token removal) | Depends on A1 |
| 4 | B2 (tsup config honesty edit) | Independent |
| 5 | B3 (`.vscode/settings.json` new file) | Independent |
| 6 | D gates (typecheck → test → build → Playwright) | Verify before any commit |
| 7 | C1 (HANDBOOK § 8 rewrite) | Reflects what just landed |
| 8 | C2 (CHANGELOG `[1.1.0]`) | Reflects what just landed |
| 9 | C3 (`package.json` 1.1.0) | Final version bump |
| 10 | Single `git commit` | Spanish message, no co-author, awaits explicit user instruction |

---

## 4 · Interfaces and boundaries

### Avatar — public API after this work

```ts
interface AvatarProps extends BaseProps {
  name: string                  // required; drives initials + background hash color
  size?: Size | number          // 'sm'|'md'|'lg' = 24|32|40 px; or raw pixels for product-specific sizes
  src?: string | undefined      // image URL; when present, replaces initials
  alt?: string                  // alt text for the image
}
```

- Backwards compatible: existing `size="md"` callers unaffected.
- New: `size={36}` or `size={20}` etc.
- New: `src={maybeUndefined}` works without conditional spread.

### Wave 8 components — internal API unchanged

`MessageBubble`, `ConversationItem`, `PanelRich` keep their existing public props. Only their internal Avatar invocation changes.

### Storybook — author contract changes

- Before: `tags: ['autodocs']` had to be explicitly removed from new stories or it broke indexing.
- After: `tags: ['autodocs']` is ignored. Authors don't need to know it exists. The `.mdx` file is the canonical docs surface.

### IDE — workspace contract

- New: contributors who use VS Code will inherit the pinned TS version automatically.
- Contributors who use other editors are unaffected.

---

## 5 · Error handling and edge cases

- **Numeric `size` of 0 or negative** — render at the requested size (no clamping). Document as caller responsibility.
- **Numeric `size` < 16** — initials may overflow. Document as "use named sizes for <16px" in Avatar.mdx.
- **`src` provided as empty string** — current behavior: renders as `<img src="">` and may show broken-image icon. Out of scope for this fix; existing behavior preserved.
- **VS Code without TS extension** — `.vscode/settings.json` is ignored gracefully.

---

## 6 · Testing strategy

No new tests planned. Existing test coverage is sufficient:

- Avatar's 10 existing tests cover `name` initials, `src` image rendering, 3 named sizes, className/style passthrough, data-testid. Adding numeric `size` doesn't require a new test because the typing change is type-system-only and the runtime branch is `typeof size === 'number'` → straight-line pixel string.
- Wave 8 components' 41 tests (16 + 17 + 12) assert text content and ARIA roles — none depend on Avatar's exact pixel size.

If GREEN suite drops below 482, that's a regression to investigate, not an expected outcome.

Optional add-ons NOT in this design (could be follow-ups):
- Test that `Avatar size={36}` produces `style="width: 36px; height: 36px"` — purely cosmetic test, low value.
- Visual regression test (Chromatic) — separate initiative.

---

## 7 · YAGNI checks (rejected scope)

- ❌ Add `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` enum tokens — sprawls the type, sprawls the token system, doesn't help product-specific sizes.
- ❌ Migrate to real CSS Modules — 1–2 week rewrite with no user-visible benefit. Issue 2 is reframed as intentional architecture, not as debt.
- ❌ Investigate IDE TS-server bug root cause — cross-tool, not ours to fix. `.vscode/settings.json` pin is the cheap mitigation.
- ❌ Pre-commit grep guard for `autodocs` tag — Storybook config change makes the tag moot. Guard would be redundant.
- ❌ Audit-and-merge `--yes-text-2xl` and `--yes-text-page-title` — zero consumers, no benefit.

---

## 8 · Rollback

Single commit means single revert. If gates fail mid-sequence (steps 1–5), reset working directory before any commit lands:

```bash
git checkout -- .
git clean -fd src/components/  # if any new file accidentally created
```

If gates pass and a regression surfaces post-commit, `git revert <sha>` restores the prior state cleanly. No database migrations, no external services, no consumer-facing API breakage.

---

## 9 · Out of scope

- New components or wave additions
- Performance optimization
- Build system migration (vite-only, etc.)
- Visual regression test infrastructure
- npm publish workflow (separate concern; not blocked by these fixes)
- Storybook upgrade to v9 (would re-trigger autodocs review)

---

## 10 · Done definition

- Commit lands on `main` containing all 9 sequence steps.
- `pnpm test` 482/482, `pnpm typecheck` exit 0, `pnpm build` green.
- HANDBOOK § 8 rewritten to current state.
- CHANGELOG `[1.1.0]` entry present.
- `package.json` version is `1.1.0`.
- All 3 Wave 8 components re-verified visually via Playwright a11y snapshot.

When all of the above is true and the commit message has been written in Spanish with no co-author line, the work is complete.
