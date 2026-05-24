# Known Issues Fixes Implementation Plan (v1.1.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve or formally accept every entry in `docs/HANDBOOK.md` § 8 "Known Issues and Pre-Existing Debt" — see `docs/superpowers/specs/2026-05-24-known-issues-fixes-design.md` for the full design.

**Architecture:** Non-breaking minor release. Avatar gains a `size?: Size | number` prop, the 3 Wave 8 consumers pass numeric sizes and drop their conditional-spread workarounds, the 3 ad-hoc avatar size tokens are removed, Storybook autodocs is disabled project-wide, tsup config stops lying about CSS Modules, `.vscode/settings.json` pins the workspace TypeScript version, and docs are updated.

**Tech Stack:** TypeScript 5, React 18, Vitest 3 + RTL, Storybook 8.6, tsup, pnpm, Playwright MCP for visual verification.

---

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

> **Commit policy:** This plan produces ONE final commit at Task 13. Intermediate tasks do NOT commit. Each task ends with a verification step (typecheck / test / build) but the working tree stays dirty until Task 13. If a verification fails mid-plan, stop and fix before continuing.

---

## File map

| File | Action | Why |
|------|--------|-----|
| `.storybook/main.ts` | edit | Disable `autodocs: 'tag'` → `autodocs: false` |
| `src/components/Avatar/Avatar.tsx` | edit | Add `size?: Size \| number` + relax `src` typing |
| `src/components/ConversationItem/ConversationItem.tsx` | edit | Drop AVATAR_STYLE width/height/fontSize + spread; pass `size={36}` |
| `src/components/MessageBubble/MessageBubble.tsx` | edit | Same pattern, `size={20}` |
| `src/components/PanelRich/PanelRich.tsx` | edit | Same pattern, `size={42}` |
| `src/tokens/semantic.css` | edit | Remove 3 ad-hoc avatar size tokens |
| `tsup.config.ts` | edit | Remove `injectStyle: true`; rewrite comment |
| `.vscode/settings.json` | **new** | Pin workspace TS version |
| `docs/HANDBOOK.md` | edit | Rewrite § 8 Known Issues |
| `CHANGELOG.md` | edit | Add `[1.1.0]` section |
| `package.json` | edit | 1.0.0 → 1.1.0 |

---

## Task 1: Disable Storybook autodocs project-wide

**Files:**
- Modify: `.storybook/main.ts`

- [ ] **Step 1.1: Read the current config**

Run: `cat .storybook/main.ts`

Confirm the `docs` block reads:
```ts
  docs: {
    autodocs: 'tag',
    defaultName: 'Docs',
  },
```

- [ ] **Step 1.2: Apply the edit**

Change `.storybook/main.ts` so the `docs` block reads:
```ts
  docs: {
    autodocs: false,
    defaultName: 'Docs',
  },
```

Use the Edit tool. The exact `old_string` to match:
```
  docs: {
    autodocs: 'tag',
    defaultName: 'Docs',
  },
```

Replace with:
```
  docs: {
    autodocs: false,
    defaultName: 'Docs',
  },
```

- [ ] **Step 1.3: Verify Storybook still indexes**

If Storybook is already running on `:6006`, wait 4 seconds for it to pick up the config change, then run:

```bash
node -e "fetch('http://localhost:6006/index.json').then(r=>r.json()).then(d=>{const ks=Object.keys(d.entries||{}); console.log('Total:', ks.length); const docs=ks.filter(k=>/--docs$/.test(k)); console.log('Docs pages:', docs.length);})"
```

Expected: `Total: 207` (same as before) and `Docs pages: 42` (one per component). If Storybook is not running, skip this step and rely on Task 12 verification.

---

## Task 2: Extend Avatar API — numeric size + relaxed src typing

**Files:**
- Modify: `src/components/Avatar/Avatar.tsx`

- [ ] **Step 2.1: Read Avatar.tsx to confirm current state**

Run: `cat src/components/Avatar/Avatar.tsx`

Confirm the interface reads:
```ts
interface AvatarProps extends BaseProps {
  name: string
  size?: Size
  src?: string
  alt?: string
}
```

And the render body computes:
```ts
const sizeVar = SIZE_TOKENS[size]
const fontSizeVar = FONT_SIZE_TOKENS[size]
```

- [ ] **Step 2.2: Update the interface**

Use Edit. Replace:
```ts
interface AvatarProps extends BaseProps {
  name: string
  size?: Size
  src?: string
  alt?: string
}
```

With:
```ts
interface AvatarProps extends BaseProps {
  name: string
  size?: Size | number   // 'sm'|'md'|'lg' = 24|32|40 px; or raw pixels for product-specific sizes
  src?: string | undefined  // explicit "accepts undefined" under exactOptionalPropertyTypes: true
  alt?: string
}
```

- [ ] **Step 2.3: Update the size resolution in the render body**

Find the lines that read `const sizeVar = SIZE_TOKENS[size]` and `const fontSizeVar = FONT_SIZE_TOKENS[size]` (likely inside the function body just before the `return`). Replace those two lines with:

```ts
  const isNum = typeof size === 'number'
  const sizeVar = isNum ? `${size}px` : SIZE_TOKENS[size as Size]
  const fontSizeVar = isNum ? `${Math.round(size * 0.36)}px` : FONT_SIZE_TOKENS[size as Size]
```

The exact old/new will depend on what surrounds those lines — use Edit with enough context to make the old_string unique.

- [ ] **Step 2.4: Run typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit code 0, no errors. If TypeScript complains about `SIZE_TOKENS[size]` access (because `size` is now `Size | number`), the cast inside the ternary should resolve it.

- [ ] **Step 2.5: Run Avatar tests**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/Avatar/Avatar.test.tsx
```

Expected: all 10 existing Avatar tests still passing. The change is additive — named sizes still work.

---

## Task 3: Migrate ConversationItem to numeric Avatar size

**Files:**
- Modify: `src/components/ConversationItem/ConversationItem.tsx`

- [ ] **Step 3.1: Read the file to confirm current state**

Run: `sed -n '55,65p;165,180p' src/components/ConversationItem/ConversationItem.tsx`

Confirm `AVATAR_STYLE` constant reads:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-36)',
  height: 'var(--yes-size-avatar-36)',
  fontSize: 'calc(var(--yes-size-avatar-36) * 0.36)',
  flexShrink: 0,
}
```

And the Avatar invocation reads (around line 170):
```tsx
      <Avatar
        name={name}
        {...(avatarSrc ? { src: avatarSrc } : {})}
        style={AVATAR_STYLE}
      />
```

- [ ] **Step 3.2: Trim AVATAR_STYLE**

Use Edit. Replace:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-36)',
  height: 'var(--yes-size-avatar-36)',
  fontSize: 'calc(var(--yes-size-avatar-36) * 0.36)',
  flexShrink: 0,
}
```

With:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,
}
```

- [ ] **Step 3.3: Switch Avatar invocation to numeric size and direct src**

Use Edit. Replace:
```tsx
      <Avatar
        name={name}
        {...(avatarSrc ? { src: avatarSrc } : {})}
        style={AVATAR_STYLE}
      />
```

With:
```tsx
      <Avatar
        name={name}
        src={avatarSrc}
        size={36}
        style={AVATAR_STYLE}
      />
```

- [ ] **Step 3.4: Run typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit code 0. The `src={avatarSrc}` (where `avatarSrc?: string`) is now legal because Avatar's `src` accepts `string | undefined`.

- [ ] **Step 3.5: Run ConversationItem tests**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/ConversationItem/ConversationItem.test.tsx
```

Expected: all 17 tests passing.

---

## Task 4: Migrate MessageBubble to numeric Avatar size

**Files:**
- Modify: `src/components/MessageBubble/MessageBubble.tsx`

- [ ] **Step 4.1: Read the file to confirm current state**

Run: `sed -n '40,50p;125,135p' src/components/MessageBubble/MessageBubble.tsx`

Confirm `AVATAR_STYLE`:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-bubble)',
  height: 'var(--yes-size-avatar-bubble)',
  fontSize: 'calc(var(--yes-size-avatar-bubble) * 0.36)',
  flexShrink: 0,
}
```

And the Avatar invocation (inside the `!isOwn && senderName` branch around line 128):
```tsx
        <Avatar
          name={senderName}
          {...(senderAvatar ? { src: senderAvatar } : {})}
          style={AVATAR_STYLE}
        />
```

- [ ] **Step 4.2: Trim AVATAR_STYLE**

Use Edit. Replace:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-bubble)',
  height: 'var(--yes-size-avatar-bubble)',
  fontSize: 'calc(var(--yes-size-avatar-bubble) * 0.36)',
  flexShrink: 0,
}
```

With:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,
}
```

- [ ] **Step 4.3: Switch Avatar invocation**

Use Edit. Replace:
```tsx
        <Avatar
          name={senderName}
          {...(senderAvatar ? { src: senderAvatar } : {})}
          style={AVATAR_STYLE}
        />
```

With:
```tsx
        <Avatar
          name={senderName}
          src={senderAvatar}
          size={20}
          style={AVATAR_STYLE}
        />
```

- [ ] **Step 4.4: Run typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit code 0.

- [ ] **Step 4.5: Run MessageBubble tests**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/MessageBubble/MessageBubble.test.tsx
```

Expected: all 12 tests passing.

---

## Task 5: Migrate PanelRich to numeric Avatar size

**Files:**
- Modify: `src/components/PanelRich/PanelRich.tsx`

- [ ] **Step 5.1: Read the file to confirm current state**

Run: `sed -n '95,105p;295,310p' src/components/PanelRich/PanelRich.tsx`

Confirm `AVATAR_STYLE`:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-42)',
  height: 'var(--yes-size-avatar-42)',
  fontSize: 'calc(var(--yes-size-avatar-42) * 0.36)',
  flexShrink: 0,
}
```

And the Avatar invocation (around line 301):
```tsx
        <Avatar
          name={contact.name}
          {...(contact.avatarSrc ? { src: contact.avatarSrc } : {})}
          style={AVATAR_STYLE}
        />
```

- [ ] **Step 5.2: Trim AVATAR_STYLE**

Use Edit. Replace:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  width: 'var(--yes-size-avatar-42)',
  height: 'var(--yes-size-avatar-42)',
  fontSize: 'calc(var(--yes-size-avatar-42) * 0.36)',
  flexShrink: 0,
}
```

With:
```ts
const AVATAR_STYLE: React.CSSProperties = {
  flexShrink: 0,
}
```

- [ ] **Step 5.3: Switch Avatar invocation**

Use Edit. Replace:
```tsx
        <Avatar
          name={contact.name}
          {...(contact.avatarSrc ? { src: contact.avatarSrc } : {})}
          style={AVATAR_STYLE}
        />
```

With:
```tsx
        <Avatar
          name={contact.name}
          src={contact.avatarSrc}
          size={42}
          style={AVATAR_STYLE}
        />
```

- [ ] **Step 5.4: Run typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit code 0.

- [ ] **Step 5.5: Run PanelRich tests**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test --reporter=verbose src/components/PanelRich/PanelRich.test.tsx
```

Expected: all 12 tests passing.

---

## Task 6: Remove the 3 obsolete avatar size tokens

**Files:**
- Modify: `src/tokens/semantic.css`

- [ ] **Step 6.1: Locate the tokens**

Run: `grep -n "yes-size-avatar-36\|yes-size-avatar-42\|yes-size-avatar-bubble" src/tokens/semantic.css`

Expected output: 3 hits, with line numbers (something like 447, 458, 462).

- [ ] **Step 6.2: Read the surrounding context**

Run: `sed -n '440,470p' src/tokens/semantic.css`

This shows the 3 token definitions and any surrounding comments. Each will be a single line of the form:
```css
  --yes-size-avatar-36:      36px;
```

- [ ] **Step 6.3: Remove each token line**

Use Edit three times — once per token line. The `old_string` should include enough context (the line immediately above) to make it unique. For example:

```
{previous-line}
  --yes-size-avatar-36:      36px;
```

→

```
{previous-line}
```

Do the same for `--yes-size-avatar-42` and `--yes-size-avatar-bubble`. If a comment header introduces these tokens and becomes empty, remove the comment header too.

- [ ] **Step 6.4: Confirm zero remaining references**

```bash
grep -rn "yes-size-avatar-36\|yes-size-avatar-42\|yes-size-avatar-bubble" src/
```

Expected: no output (zero hits).

- [ ] **Step 6.5: Run typecheck and test**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
pnpm test
```

Expected: typecheck exit 0; tests show `Test Files 42 passed (42)` and `Tests 482 passed (482)`. If any test fails, a consumer of the removed tokens was missed — re-run Step 6.4 and chase the hit.

---

## Task 7: Stop tsup config from lying about CSS Modules

**Files:**
- Modify: `tsup.config.ts`

- [ ] **Step 7.1: Read the file**

Run: `cat tsup.config.ts`

Confirm the current file ends with:
```ts
  // CSS Modules for component structural styles are injected into JS bundles.
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  injectStyle: true,
})
```

- [ ] **Step 7.2: Apply the honesty edit**

Use Edit. Replace:
```ts
  // CSS Modules for component structural styles are injected into JS bundles.
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  injectStyle: true,
})
```

With:
```ts
  // Token CSS files (global custom properties) are copied separately
  // by scripts/copy-tokens.mjs — they must not be bundled into JS.
  //
  // Component visual styles use inline React.CSSProperties + a per-component
  // <style> block injected at runtime (see docs/HANDBOOK.md § 4 "How to add
  // a component" → CSS Modules note). The `.module.css` files in each
  // component directory document structural intent but are NOT imported,
  // so there is nothing for tsup to bundle here.
})
```

- [ ] **Step 7.3: Verify the build still works**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm build
```

Expected: "Build success" lines for ESM, CJS, DTS; token CSS copied to `dist/tokens`. Bundle sizes should be identical to before (the `injectStyle` option had nothing to inject anyway).

---

## Task 8: Pin workspace TypeScript version for IDE consistency

**Files:**
- Create: `.vscode/settings.json`

- [ ] **Step 8.1: Confirm the directory does not already exist**

Run: `ls -la .vscode/ 2>/dev/null && echo "EXISTS" || echo "missing"`

Expected: "missing" (no `.vscode/` in yes-ui). If it exists with a settings file already, read it first and merge the new keys instead of overwriting.

- [ ] **Step 8.2: Create the settings file**

Write the new file `.vscode/settings.json` with content:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

- [ ] **Step 8.3: Verify the file is well-formed JSON**

```bash
node -e "console.log('parsed OK:', !!JSON.parse(require('fs').readFileSync('.vscode/settings.json', 'utf8')))"
```

Expected: `parsed OK: true`.

---

## Task 9: Rewrite HANDBOOK § 8 Known Issues

**Files:**
- Modify: `docs/HANDBOOK.md`

- [ ] **Step 9.1: Locate § 8**

Run: `grep -n "^## 8" docs/HANDBOOK.md`

Expected: one match showing the line number of "## 8 · Known issues and pre-existing debt".

- [ ] **Step 9.2: Replace the section**

Use Edit. Find the heading line and the entire content through (but not including) `## 9 · Wave-by-wave shipped log`.

The `old_string` is the entire current § 8 — from the heading to the end of the IDE TS-server bullet. To avoid an over-long old_string, use Edit with the section's first sentence as the anchor and copy through to "Do **not** modify code in response to these phantom errors." inclusive.

Replace the section body with:

```markdown
## 8 · Known issues and intentional decisions

The v1.1.0 release resolved or formally accepted every issue from the prior list. Current state:

### Resolved in v1.1.0

- **Storybook autodocs + MDX collision** — `.storybook/main.ts` now sets `docs.autodocs: false`. The `tags: ['autodocs']` array is ignored project-wide, so adding it cannot break indexing. The `.mdx` file per component remains the canonical docs surface.
- **`--yes-text-2xl` token collision** — verified zero component consumers; the global `--yes-text-2xl: 24px` and PageHeader's local `--yes-text-page-title: 22px` coexist without conflict.
- **Avatar `size` enumerated, not numeric** — Avatar's `size` prop now accepts `Size | number` (named token OR raw pixels). Wave 8 components (`ConversationItem`, `MessageBubble`, `PanelRich`) pass numeric sizes (36 / 20 / 42).
- **`exactOptionalPropertyTypes: true` spread workaround** — Avatar's `src` is typed `string | undefined`, so `src={maybeUndefined}` works without conditional spread. All 3 Wave 8 callers simplified.

### Intentional architecture (not debt)

- **Inline `React.CSSProperties` + injected `<style>` block instead of CSS Modules.** Every component uses this pattern. The `.module.css` files in each component directory document structural intent but are **not imported** by the source. `tsup.config.ts` reflects this honestly (no more misleading `injectStyle: true`). If you ever switch the build to a CSS-Modules-aware bundler, every component needs a rewrite — that work is out of scope for the foreseeable future.

### Mitigated

- **IDE TS-server stale-diagnostics bug.** Symptom: the editor's TS server intermittently reports `Cannot find module './X'` and `Property 'toBeInTheDocument' does not exist` for files that `pnpm typecheck` accepts cleanly. The bug is cross-tool, not in our code. Mitigation: `.vscode/settings.json` pins the workspace TypeScript version (`typescript.tsdk: "node_modules/typescript/lib"`) to reduce IDE-vs-tsc drift. When the diagnostics still surface, restart the TS server (`Cmd+Shift+P` → "TypeScript: Restart TS Server"). `pnpm typecheck` remains the source of truth — never modify code in response to these phantom errors.

```

- [ ] **Step 9.3: Sanity-check the file**

Run: `grep -c "^## " docs/HANDBOOK.md`

Expected: 10 (sections 1 through 10). The edit must not accidentally delete subsequent sections.

---

## Task 10: Add `[1.1.0]` CHANGELOG entry

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 10.1: Read the top of the file**

Run: `head -20 CHANGELOG.md`

Confirm the file begins with the Keep-a-Changelog header followed by `## [1.0.0]`.

- [ ] **Step 10.2: Insert the new entry above `[1.0.0]`**

Use Edit. The `old_string` should anchor on the line `## [1.0.0] — 2026-05-24`. Replace:

```
## [1.0.0] — 2026-05-24
```

With:

```
## [1.1.0] — 2026-05-24

Maintenance release. Resolves or formally accepts every entry from the
v1.0.0 HANDBOOK § 8 "Known Issues and Pre-Existing Debt" list. No
breaking API changes. 482 tests still passing, clean typecheck, clean
build.

### Added
- `Avatar.size` now accepts `Size | number` — pass `size={36}` for product-specific pixel sizes; the existing `size="md"` keyword usage is unchanged.

### Changed
- `Avatar.src` typed `string | undefined` (explicit "accepts undefined") so consumers under `exactOptionalPropertyTypes: true` can pass optional values directly.
- Wave 8 components (`ConversationItem`, `MessageBubble`, `PanelRich`) pass numeric Avatar sizes (36 / 20 / 42 px) and drop their conditional-spread workarounds for `src`.
- Storybook autodocs disabled project-wide (`.storybook/main.ts` → `docs.autodocs: false`). `tags: ['autodocs']` in any story is now a safe no-op.
- `tsup.config.ts` comment rewritten to reflect the actual inline-styles + injected `<style>` architecture; misleading `injectStyle: true` removed.

### Removed
- 3 ad-hoc avatar size tokens from `src/tokens/semantic.css`: `--yes-size-avatar-36`, `--yes-size-avatar-42`, `--yes-size-avatar-bubble`. Replaced by Avatar's numeric `size` prop.

### Internal
- `.vscode/settings.json` pins the workspace TypeScript version (`typescript.tsdk: "node_modules/typescript/lib"`) to reduce IDE TS-server vs. `tsc` drift.
- `docs/HANDBOOK.md` § 8 rewritten as "Known issues and intentional decisions" reflecting the v1.1.0 resolutions.

---

## [1.0.0] — 2026-05-24
```

- [ ] **Step 10.3: Confirm the version sections are in order**

Run: `grep -n "^## \[" CHANGELOG.md`

Expected output (in this order):
```
N: ## [1.1.0] — 2026-05-24
M: ## [1.0.0] — 2026-05-24
P: ## [0.1.0] — initial scaffold
```

with `N < M < P`.

---

## Task 11: Bump package version

**Files:**
- Modify: `package.json`

- [ ] **Step 11.1: Read the current version**

Run: `node -e "console.log(require('./package.json').version)"`

Expected: `1.0.0`.

- [ ] **Step 11.2: Apply the bump**

Use Edit. Replace:
```json
  "version": "1.0.0",
```

With:
```json
  "version": "1.1.0",
```

- [ ] **Step 11.3: Confirm**

Run: `node -e "console.log(require('./package.json').version)"`

Expected: `1.1.0`.

---

## Task 12: Run all 4 verification gates

**Files:** none (verification only)

- [ ] **Step 12.1: Gate 1 — typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm typecheck
```

Expected: exit code 0, no output beyond the `> tsc --noEmit` echo.

- [ ] **Step 12.2: Gate 2 — full test suite**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm test
```

Expected tail:
```
Test Files  42 passed (42)
     Tests  482 passed (482)
```

If any test fails, do NOT proceed. Investigate, fix, re-run.

- [ ] **Step 12.3: Gate 3 — build + check-dist**

```bash
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
pnpm build && pnpm check-dist
```

Expected: "Build success" for ESM, CJS, DTS; token CSS files copied; `check-dist` shows `All dist files present.`

- [ ] **Step 12.4: Gate 4a — export load check**

```bash
node -e "const x = require('./dist/index.cjs'); const need=['Avatar','MessageBubble','ConversationItem','PanelRich']; const miss=need.filter(k=>typeof x[k]!=='function'); if (miss.length) { console.error('MISSING:',miss); process.exit(1); } console.log('All Wave 8 + Avatar exports OK');"
```

Expected: `All Wave 8 + Avatar exports OK`.

- [ ] **Step 12.5: Gate 4b — Playwright visual re-sweep of Wave 8 + Avatar**

If Storybook is running on `:6006`, navigate Playwright to each of the 4 stories and snapshot:

1. `wave-1-atoms-avatar--default`
2. `wave-8-communication-conversationitem--conversation-list`
3. `wave-8-communication-messagebubble--full-conversation`
4. `wave-8-communication-panelrich--in-context`

For each, after `mcp__playwright__browser_navigate` + a 1-second `browser_wait_for`, run `mcp__playwright__browser_evaluate` with:

```js
async () => {
  for (let i = 0; i < 30; i++) {
    const r = document.querySelector('#storybook-root');
    if (r && r.children.length > 0) break;
    await new Promise(r => setTimeout(r, 100));
  }
  const root = document.querySelector('#storybook-root');
  return {
    childCount: root?.children.length || 0,
    text: (root?.textContent || '').slice(0, 120).replace(/\s+/g, ' ').trim(),
    hasErr: !!document.querySelector('.sb-errordisplay__error'),
  };
}
```

Expected per story:
- Avatar/Default: `childCount > 0`, `text` contains initials like "CR" or similar
- ConversationItem/ConversationList: `text` contains Spanish customer names ("Carlos Rodríguez", etc.)
- MessageBubble/FullConversation: `text` contains "Buenas tardes" or similar Spanish CS dialog opener
- PanelRich/InContext: `text` contains "Carlos Rodríguez" + "Cliente Premium" or similar

All must have `hasErr: false`.

- [ ] **Step 12.6: Gate 4c — Storybook index sanity**

```bash
node -e "fetch('http://localhost:6006/index.json').then(r=>r.json()).then(d=>{const ks=Object.keys(d.entries||{}); console.log('Total:', ks.length); const docs=ks.filter(k=>/--docs$/.test(k)); console.log('Docs pages:', docs.length);})"
```

Expected: `Total: 207`, `Docs pages: 42`. Confirms Task 1's autodocs disable did not break MDX docs indexing.

If Storybook is not running, skip Step 12.5 and 12.6 — note as PENDING in the report.

---

## Task 13: Single commit

**Files:** none new (staging + commit only)

- [ ] **Step 13.1: Review staged changes**

```bash
git add \
  .storybook/main.ts \
  src/components/Avatar/Avatar.tsx \
  src/components/ConversationItem/ConversationItem.tsx \
  src/components/MessageBubble/MessageBubble.tsx \
  src/components/PanelRich/PanelRich.tsx \
  src/tokens/semantic.css \
  tsup.config.ts \
  .vscode/settings.json \
  docs/HANDBOOK.md \
  CHANGELOG.md \
  package.json

git diff --cached --stat
```

Confirm exactly 11 files staged. If `docs/superpowers/plans/2026-05-24-known-issues-fixes.md` (this plan) or `docs/superpowers/specs/2026-05-24-known-issues-fixes-design.md` (the design spec) show up untracked, add them too — both are part of the v1.1.0 release artifact.

- [ ] **Step 13.2: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore(release): v1.1.0 — resolución de issues conocidos de HANDBOOK § 8

Lanzamiento de mantenimiento sin breaking changes. Resuelve o acepta
formalmente cada entry del listado v1.0.0 de Known Issues.

Resueltos:
- Avatar.size acepta Size | number — Wave 8 componentes pasan size={36|20|42}
- Avatar.src typeado string | undefined — elimina 3 spreads condicionales
- Storybook autodocs deshabilitado project-wide (docs.autodocs: false)
- --yes-text-2xl colisión verificada como no-issue (cero consumers)

Decisiones intencionales documentadas:
- Patrón inline-styles + <style> inyectado en lugar de CSS Modules
- tsup.config.ts limpiado (removido injectStyle: true engañoso)

Mitigados:
- IDE TS-server stale: .vscode/settings.json pinea workspace TypeScript

Cleanup:
- Removidos 3 tokens ad-hoc de avatar (--yes-size-avatar-{36,42,bubble})
- HANDBOOK § 8 reescrito como "Known issues and intentional decisions"

Tests: 482/482 pasando. pnpm typecheck limpio. pnpm build OK.
Verificado visualmente en Storybook (Avatar/Default, ConversationItem/
ConversationList, MessageBubble/FullConversation, PanelRich/InContext)
sin errores de consola.
EOF
)"
```

- [ ] **Step 13.3: Confirm**

```bash
git log --oneline -3
```

Expected: the new commit at the top, then `195807b` (v1.0.0 docs release), then `d7efed7` (Chip + Toast fixes).

---

## Final report skeleton

After Task 13 lands, produce a summary using the report format from `docs/HANDBOOK.md` § 6:

```markdown
result: v1.1.0 shipped ({sha}) — 4 issues resolved (1, 3, 4, 5), 1 intentional decision documented (2), 1 mitigated (6). Avatar gained numeric size + relaxed src typing. Wave 8 simplified. Storybook autodocs collision impossible. Tests 482/482, typecheck clean, build green. Single commit, no breaking changes.
```
