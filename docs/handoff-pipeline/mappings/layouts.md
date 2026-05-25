# Layout mappings

Handoff inline-style pattern → `@yes/ui/styles/layout` utility class.

Every handoff `style={{ ... }}` block must translate to a class combination. If no existing utility fits, add a new class to `yes-ui/src/styles/layout.css` (separate yes-ui change), do NOT inline.

## Common patterns

| Handoff inline pattern | yes-ui className |
|------------------------|------------------|
| `style={{ display: 'flex', flexDirection: 'column', gap: 16 }}` | `className="yes-stack yes-gap-4"` |
| `style={{ display: 'flex', alignItems: 'center', gap: 8 }}` | `className="yes-row yes-items-center yes-gap-2"` |
| `style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}` | `className="yes-row-wrap yes-gap-2"` |
| `style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}` | `className="yes-grid-4 yes-gap-4"` |
| `style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}` | `className="yes-grid-2 yes-gap-4"` |
| `style={{ flex: 1, minWidth: 0 }}` | `className="yes-flex-1"` |
| `style={{ padding: 24 }}` | `className="yes-p-6"` |
| `style={{ padding: 16 }}` | `className="yes-p-4"` |
| `style={{ marginTop: 'auto' }}` | `className="yes-mt-auto"` |
| `style={{ width: '100%' }}` | `className="yes-w-full"` |
| `style={{ height: '100%' }}` | `className="yes-h-full"` |
| `style={{ minHeight: '100vh' }}` | `className="yes-min-h-screen"` |
| `style={{ justifyContent: 'space-between' }}` | `className="yes-justify-between"` |
| `style={{ color: '#6B7280' }}` (muted text) | `className="yes-text-muted"` |

## Case-specific extensions

When a handoff uses a pattern that is NOT in the common table:

1. **STOP** — do not inline.
2. **Check** `yes-ui/src/styles/layout.css` for an existing class.
3. **If missing:** open an issue against yes-ui, propose the new utility (must be design-token-driven), ship in yes-ui, then resume.
4. **Document** the new pattern here under a new sub-section for the case study.

(extend per case study as new patterns surface)
