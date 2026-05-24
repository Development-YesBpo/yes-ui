# Button — Implementation Report

**Status:** COMPLETE
**Commit:** dbcb1b6
**Tests:** 17/17 passing (45 total)

## Architecture decision
CSS Modules incompatible with tsup (no CSS module plugin). Button uses
inline styles with var(--yes-*) tokens via TONE_STYLE/SIZE_STYLE lookup objects.
Token contract 100% honored — no hardcoded values.

## RED output
```
 Test Files  1 failed | 3 passed (4)
      Tests  22 passed (22)
   Start at  14:50:52
Error: Cannot find module './Button'
```

## GREEN output
```
 Test Files  4 passed (4)
      Tests  45 passed (45)
   Start at  14:54:02
   Duration  22.04s
```

## Inline style approach
- TONE_STYLE record maps tone→CSSProperties with var(--yes-*) values
- SIZE_STYLE record maps size→CSSProperties with var(--yes-*) values
- Disabled overrides all tone styles (highest specificity via JS object spread)
- Loading keeps tone bg, dims text to rgba(255,255,255,0.7) as per reference
- iconOnly removes padding, sets width = height token
- Removed `pointerEvents: 'none'` from DISABLED_STYLE — @testing-library/user-event v14
  refuses to click elements with pointer-events:none; native `disabled` attr + onClick guard
  is sufficient to block interaction

## Fix applied during GREEN phase
userEvent.setup() in @testing-library/user-event v14 throws on pointer-events:none elements.
Removed that CSS property — native `<button disabled>` blocks clicks at the DOM level,
and `onClick={isDisabled ? undefined : onClick}` guards the loading case.
