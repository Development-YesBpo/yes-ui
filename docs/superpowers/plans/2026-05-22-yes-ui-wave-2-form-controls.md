# @yes/ui Wave 2 — Form Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 6 Wave 2 Form Control components — Input, Select, Textarea, Checkbox, Toggle, SearchInput — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Input is built first (Select and Textarea share its state structure). SearchInput is built last because it imports `Icon` from Wave 1. Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Wave 1 dependency:** SearchInput imports `{ Icon } from '../Icon/Icon'` and wraps it with `import { Search, X } from 'lucide-react'`. lucide-react is already installed.

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add Wave 2 field tokens (Task 0)

src/components/
├── Input/
│   ├── Input.tsx
│   ├── Input.module.css
│   ├── Input.test.tsx
│   ├── Input.stories.tsx
│   ├── Input.mdx
│   └── index.ts
├── Select/
│   ├── Select.tsx
│   ├── Select.module.css
│   ├── Select.test.tsx
│   ├── Select.stories.tsx
│   ├── Select.mdx
│   └── index.ts
├── Textarea/
│   ├── Textarea.tsx
│   ├── Textarea.module.css
│   ├── Textarea.test.tsx
│   ├── Textarea.stories.tsx
│   ├── Textarea.mdx
│   └── index.ts
├── Checkbox/
│   ├── Checkbox.tsx
│   ├── Checkbox.module.css
│   ├── Checkbox.test.tsx
│   ├── Checkbox.stories.tsx
│   ├── Checkbox.mdx
│   └── index.ts
├── Toggle/
│   ├── Toggle.tsx
│   ├── Toggle.module.css
│   ├── Toggle.test.tsx
│   ├── Toggle.stories.tsx
│   ├── Toggle.mdx
│   └── index.ts
└── SearchInput/
    ├── SearchInput.tsx
    ├── SearchInput.module.css
    ├── SearchInput.test.tsx
    ├── SearchInput.stories.tsx
    ├── SearchInput.mdx
    └── index.ts

src/index.ts                         ← uncomment export per component
```

---

## Task 0: Wave 2 field tokens

**Files:**
- Modify: `src/tokens/semantic.css`

All 6 components share a base field token set. Verify each against `components-inputs.html` before adding.

**Translation passes (from `components-inputs.html` CSS):**
- `font-size: 14px` (control text) → `--yes-text-sm` (14px ✓)
- `font-size: 13px` (label) → `--yes-text-sm` is 14px — add `--yes-size-field-label-text: 13px`
- `font-size: 11px` (hint/error) → `--yes-text-xs` is 12px — add `--yes-size-field-hint-text: 11px`
- `color: #374151` (label) → `--yes-color-text` is #111827 — use `--yes-primitive-neutral-700` (#374151) → add `--yes-color-field-label`
- `color: #6B7280` (hint) → `--yes-color-text-muted` (#6B7280 ✓)
- `color: #DC2626` (error) → `--yes-color-border-error` / `--yes-primitive-error-500` — add `--yes-color-field-error`
- `border: 1px solid #D1D5DB` → `--yes-color-border-strong` (#D1D5DB ✓)
- `border-radius: 6px` → `--yes-radius-btn` (6px ✓) — use as field radius via `--yes-radius-field`
- `height: 36px` (md) → `--yes-size-height-md` (36px ✓)
- `height: 30px` (sm) → `--yes-size-height-sm` (30px ✓)
- `height: 44px` (lg) → `--yes-size-height-lg` (44px ✓)
- `padding: 0 12px` → `--yes-space-3` (12px ✓)
- `gap: 5px` (field gap) → add `--yes-size-field-gap: 5px`
- `background: #F3F4F6` (disabled) → `--yes-color-surface-disabled` (#F3F4F6 ✓)
- `color: #9CA3AF` (disabled text) → `--yes-color-text-disabled` (#9CA3AF ✓)
- focus `border-color: #2B52A0` → `--yes-color-border-focus` (#2B52A0 ✓)
- focus `box-shadow: 0 0 0 3px rgba(43,82,160,0.15)` → `--yes-color-focus-ring` (rgba(43,82,160,0.15) ✓) — compose as `0 0 0 3px var(--yes-color-focus-ring)`
- error `border-color: #DC2626` → `--yes-color-border-error` ✓
- error `box-shadow: 0 0 0 3px rgba(220,38,38,0.12)` → add `--yes-color-focus-ring-error: rgba(220,38,38,0.12)`
- Toggle: `width: 40px; height: 22px; border-radius: 11px` → add `--yes-size-toggle-w`, `--yes-size-toggle-h`, `--yes-radius-toggle`
- Toggle knob: `width: 18px; height: 18px; top: 2px; right: 2px` → add `--yes-size-toggle-knob`, `--yes-size-toggle-knob-offset`
- Toggle inactive bg: `#D1D5DB` → `--yes-color-border-strong` ✓ — add `--yes-color-toggle-off`
- Toggle active bg: `#8CBC39` → `--yes-color-brand-accent` ✓ — add `--yes-color-toggle-on`
- SearchInput icon left: `left: 10px; font-size: 15px` → search icon uses `size=14` (Icon prop) + `padding-left: 34px` → add `--yes-size-search-icon-left: 10px`, `--yes-size-search-pl: 34px`
- Checkbox: browser default `<input type="checkbox">` — no custom height token needed; standard 16×16 default

- [ ] **Step 1: Add Wave 2 tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the last `--yes-size-chip-*` block (before the closing `}`):

```css
  /* ── Wave 2 — Field shared ───────────────────────────────── */
  --yes-size-field-gap:         5px;   /* gap: label → control → hint */
  --yes-size-field-label-text: 13px;   /* reference: .field-label font-size */
  --yes-size-field-hint-text:  11px;   /* reference: .field-hint font-size */
  --yes-radius-field:           var(--yes-radius-btn);  /* 6px */
  --yes-color-field-label:      var(--yes-primitive-neutral-700); /* #374151 */
  --yes-color-field-hint:       var(--yes-color-text-muted);      /* #6B7280 */
  --yes-color-field-error:      var(--yes-primitive-error-500);   /* #DC2626 */
  --yes-color-focus-ring-error: rgba(220, 38, 38, 0.12);

  /* ── Toggle ──────────────────────────────────────────────── */
  --yes-size-toggle-w:           40px;
  --yes-size-toggle-h:           22px;
  --yes-radius-toggle:           11px;
  --yes-size-toggle-knob:        18px;
  --yes-size-toggle-knob-offset:  2px;
  --yes-color-toggle-on:         var(--yes-color-brand-accent);   /* #8CBC39 */
  --yes-color-toggle-off:        var(--yes-color-border-strong);  /* #D1D5DB */

  /* ── SearchInput ─────────────────────────────────────────── */
  --yes-size-search-icon-left: 10px;
  --yes-size-search-pl:        34px;
```

- [ ] **Step 2: Verify token file**

```bash
grep -c 'yes-size-field\|yes-color-field\|yes-radius-field\|yes-color-toggle\|yes-size-toggle\|yes-radius-toggle\|yes-size-search\|yes-color-focus-ring-error' src/tokens/semantic.css
```

Expected: `14` (one match per token line). If fewer, re-check the file for missing entries.

- [ ] **Step 3: Commit tokens**

```bash
git add src/tokens/semantic.css
git commit -m "feat(wave-2): agregar tokens para form controls"
```

---

## Task 1: Input

**Reference:** `design-system-reference/preview/components-inputs.html` — first 4 field examples (default, focused, select, error)
**Translation passes:** all resolved in Task 0. No additional tokens needed for Input.

**Files:**
- Create: `src/components/Input/Input.tsx`
- Create: `src/components/Input/Input.module.css`
- Create: `src/components/Input/Input.test.tsx`
- Create: `src/components/Input/Input.stories.tsx`
- Create: `src/components/Input/Input.mdx`
- Create: `src/components/Input/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/components/Input/Input.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders a labeled text input', () => {
    render(<Input label="Nombre" />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Input label="Teléfono" />)
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
  })

  it('renders hint text when provided', () => {
    render(<Input label="Nombre" hint="Nombre completo según registro" />)
    expect(screen.getByText('Nombre completo según registro')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(<Input label="Correo" error="Correo electrónico no válido" />)
    expect(screen.getByText('Correo electrónico no válido')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Input label="Correo" error="Error" />)
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without error', () => {
    render(<Input label="Nombre" />)
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'false')
  })

  it('associates error with aria-describedby', () => {
    render(<Input label="Correo" error="Error" />)
    const input = screen.getByLabelText('Correo')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent('Error')
  })

  it('associates hint with aria-describedby', () => {
    render(<Input label="Nombre" hint="Ayuda" />)
    const input = screen.getByLabelText('Nombre')
    const hintId = input.getAttribute('aria-describedby')
    expect(hintId).toBeTruthy()
    expect(document.getElementById(hintId!)).toHaveTextContent('Ayuda')
  })

  it('disables the input when disabled prop is set', () => {
    render(<Input label="Campo" disabled />)
    expect(screen.getByLabelText('Campo')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Input label="Campo" required />)
    expect(screen.getByLabelText('Campo')).toBeRequired()
  })

  it('hides label visually when hideLabel is set', () => {
    render(<Input label="Búsqueda" hideLabel />)
    const label = screen.getByText('Búsqueda')
    expect(label).toHaveClass('srOnly')
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<Input label="Campo" size={size} />)
      expect(screen.getByLabelText('Campo')).toBeInTheDocument()
    }
  )

  it('calls onChange with the new value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Nombre" onChange={onChange} />)
    await user.type(screen.getByLabelText('Nombre'), 'Hola')
    expect(onChange).toHaveBeenCalled()
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Nombre" disabled onChange={onChange} />)
    await user.type(screen.getByLabelText('Nombre'), 'X')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root element', () => {
    render(<Input label="Campo" data-testid="my-input" />)
    expect(screen.getByTestId('my-input')).toBeInTheDocument()
  })

  it('appends className to root wrapper', () => {
    render(<Input label="Campo" className="extra" />)
    expect(screen.getByTestId ? document.querySelector('.extra') : document.querySelector('.extra')).toBeInTheDocument()
  })

  it('forwards name to the input element', () => {
    render(<Input label="Campo" name="customer_name" />)
    expect(screen.getByLabelText('Campo')).toHaveAttribute('name', 'customer_name')
  })

  it('forwards placeholder to the input element', () => {
    render(<Input label="Campo" placeholder="Ej. María González" />)
    expect(screen.getByPlaceholderText('Ej. María González')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify RED**

```bash
pnpm test src/components/Input
```

Expected: `FAIL` — "Cannot find module './Input'".

- [ ] **Step 3: Implement Input**

Create `src/components/Input/Input.module.css`:

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--yes-size-field-gap);
  width: 100%;
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-label-text);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-field-label);
  line-height: 1.4;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.input {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border-strong);
  border-radius: var(--yes-radius-field);
  padding: 0 var(--yes-space-3);
  width: 100%;
  outline: none;
  transition: border-color var(--yes-duration-base) var(--yes-ease),
              box-shadow var(--yes-duration-base) var(--yes-ease);
  line-height: 1;
}

/* ── Sizes ─────────────────────────────────────────────────── */
.sm { height: var(--yes-size-height-sm); }
.md { height: var(--yes-size-height-md); }
.lg { height: var(--yes-size-height-lg); }

/* ── States ────────────────────────────────────────────────── */
.input:focus {
  border-color: var(--yes-color-border-focus);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring);
}

.input:disabled {
  background: var(--yes-color-surface-disabled);
  color: var(--yes-color-text-disabled);
  border-color: var(--yes-color-border-disabled);
  cursor: not-allowed;
}

.inputError {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.inputError:focus {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.hint {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-hint);
  line-height: 1.4;
}

.error {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-error);
  line-height: 1.4;
}
```

Create `src/components/Input/Input.tsx`:

```tsx
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'
import styles from './Input.module.css'

interface InputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof FieldProps | 'size'> {
  size?: Size
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
}

export function Input({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  size = 'md',
  className,
  style,
  'data-testid': testId,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const describedBy =
    error ? errorId : hint ? hintId : undefined

  return (
    <div
      className={cn(styles.field, className)}
      style={style}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={cn(styles.label, hideLabel && styles.srOnly)}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(styles.input, styles[size], error && styles.inputError)}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
```

Create `src/components/Input/index.ts`:

```typescript
export { Input } from './Input'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test src/components/Input
```

Expected: `PASS src/components/Input/Input.test.tsx` — 18 tests passing.

- [ ] **Step 5: Write stories**

Create `src/components/Input/Input.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Wave 2 — Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de texto con etiqueta, estado de error, hint y soporte de tamaños sm/md/lg. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Nombre del cliente',
    placeholder: 'Ej. María González',
    hint: 'Nombre completo según registro',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Normal" placeholder="Escribe aquí" hint="Texto de ayuda" />
      <Input label="Con error" value="carlos@ejemp" error="Correo electrónico no válido" onChange={() => {}} />
      <Input label="Deshabilitado" value="Valor fijo" disabled onChange={() => {}} />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Tamaño sm" size="sm" placeholder="Pequeño" />
      <Input label="Tamaño md" size="md" placeholder="Mediano (por defecto)" />
      <Input label="Tamaño lg" size="lg" placeholder="Grande" />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Correo electrónico',
    type: 'email',
    value: 'carlos@ejemp',
    error: 'Correo electrónico no válido',
    onChange: () => {},
  },
}

export const Interactive: Story = {
  args: {
    label: 'Buscar cliente',
    placeholder: 'Escribe para buscar',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Buscar cliente')
    await userEvent.type(input, 'Carlos')
    await expect(input).toHaveValue('Carlos')
  },
}
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 2 — Form Controls / Input / AllStates`.
Open `design-system-reference/preview/components-inputs.html` side-by-side.

Verify:
- Label: 13px, semibold, #374151
- Input border: 1px solid #D1D5DB, radius 6px, height 36px (md)
- Focus state: blue border (#2B52A0) + soft blue ring
- Error state: red border (#DC2626) + soft red ring + red error text below
- Disabled state: gray background (#F3F4F6), gray text (#9CA3AF), not-allowed cursor

**Sign off before continuing.**

- [ ] **Step 7: Write MDX docs**

Create `src/components/Input/Input.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as InputStories from './Input.stories'

<Meta of={InputStories} />

# Input

Campo de texto controlado con etiqueta accesible, mensaje de error, hint y tres tamaños.

**Referencia:** `design-system-reference/preview/components-inputs.html` — campos "Nombre del cliente", "Teléfono de contacto", "Correo electrónico"

## Uso

```tsx
import { Input } from '@yes/ui'

<Input
  label="Nombre del cliente"
  placeholder="Ej. María González"
  hint="Nombre completo según registro"
/>
```

Con error:

```tsx
<Input
  label="Correo electrónico"
  type="email"
  error="Correo electrónico no válido"
/>
```

<Canvas of={InputStories.AllStates} />
<Controls of={InputStories.Default} />
```

- [ ] **Step 8: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Input } from './components/Input'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 9: Commit**

```bash
git add src/components/Input/ src/index.ts
git commit -m "feat(wave-2): agregar componente Input"
```

---

## Task 2: Select

**Reference:** `design-system-reference/preview/components-inputs.html` — "Estado de la gestión" field (native `<select>`)
**Translation passes:**
- Same base tokens as Input: height, border, radius, font, colors ✓ (all from Task 0)
- Select needs `appearance: none` to remove OS default arrow → add custom chevron via CSS background-image
- `background-image: url("data:image/svg+xml,...")` — build an inline SVG chevron using `--yes-color-text-muted` (#6B7280)
- `padding-right: 36px` to make room for the arrow icon → add `--yes-size-select-pr: 36px`

- [ ] **Step 1: Add Select-specific token**

Open `src/tokens/semantic.css`. Add to the Wave 2 field shared block:

```css
  --yes-size-select-pr: 36px;   /* padding-right: room for custom chevron */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Select/Select.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './Select'

const options = [
  { value: 'contactado', label: 'Contactado' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'promesa', label: 'Promesa de pago' },
]

describe('Select', () => {
  it('renders a labeled select', () => {
    render(<Select label="Estado" options={options} />)
    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
  })

  it('renders all option labels', () => {
    render(<Select label="Estado" options={options} />)
    expect(screen.getByRole('option', { name: 'Contactado' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'No contesta' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Promesa de pago' })).toBeInTheDocument()
  })

  it('renders a placeholder option when provided', () => {
    render(<Select label="Estado" options={options} placeholder="Selecciona una opción" />)
    expect(screen.getByRole('option', { name: 'Selecciona una opción' })).toBeInTheDocument()
  })

  it('placeholder option is disabled and selected by default', () => {
    render(<Select label="Estado" options={options} placeholder="Selecciona" />)
    const placeholder = screen.getByRole('option', { name: 'Selecciona' }) as HTMLOptionElement
    expect(placeholder.disabled).toBe(true)
    expect(placeholder.selected).toBe(true)
  })

  it('renders hint text', () => {
    render(<Select label="Estado" options={options} hint="Elige el estado actual" />)
    expect(screen.getByText('Elige el estado actual')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Select label="Estado" options={options} error="Selección requerida" />)
    expect(screen.getByText('Selección requerida')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Select label="Estado" options={options} error="Error" />)
    expect(screen.getByLabelText('Estado')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the select when disabled prop is set', () => {
    render(<Select label="Estado" options={options} disabled />)
    expect(screen.getByLabelText('Estado')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Select label="Estado" options={options} required />)
    expect(screen.getByLabelText('Estado')).toBeRequired()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<Select label="Estado" options={options} size={size} />)
      expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    }
  )

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Estado" options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByLabelText('Estado'), 'promesa')
    expect(onChange).toHaveBeenCalled()
  })

  it('passes name to the select element', () => {
    render(<Select label="Estado" options={options} name="gestion_estado" />)
    expect(screen.getByLabelText('Estado')).toHaveAttribute('name', 'gestion_estado')
  })

  it('passes data-testid to root element', () => {
    render(<Select label="Estado" options={options} data-testid="sel-estado" />)
    expect(screen.getByTestId('sel-estado')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test src/components/Select
```

Expected: `FAIL` — "Cannot find module './Select'".

- [ ] **Step 4: Implement Select**

Create `src/components/Select/Select.module.css`:

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--yes-size-field-gap);
  width: 100%;
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-label-text);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-field-label);
  line-height: 1.4;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.wrapper {
  position: relative;
  width: 100%;
}

.select {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border-strong);
  border-radius: var(--yes-radius-field);
  padding: 0 var(--yes-size-select-pr) 0 var(--yes-space-3);
  width: 100%;
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--yes-space-3) center;
  background-size: 16px;
  transition: border-color var(--yes-duration-base) var(--yes-ease),
              box-shadow var(--yes-duration-base) var(--yes-ease);
}

/* ── Sizes ─────────────────────────────────────────────────── */
.sm { height: var(--yes-size-height-sm); }
.md { height: var(--yes-size-height-md); }
.lg { height: var(--yes-size-height-lg); }

/* ── States ────────────────────────────────────────────────── */
.select:focus {
  border-color: var(--yes-color-border-focus);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring);
}

.select:disabled {
  background-color: var(--yes-color-surface-disabled);
  color: var(--yes-color-text-disabled);
  border-color: var(--yes-color-border-disabled);
  cursor: not-allowed;
}

.selectError {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.selectError:focus {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.hint {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-hint);
  line-height: 1.4;
}

.error {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-error);
  line-height: 1.4;
}
```

Create `src/components/Select/Select.tsx`:

```tsx
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof FieldProps | 'size'> {
  options: SelectOption[]
  placeholder?: string
  size?: Size
}

export function Select({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  options,
  placeholder,
  size = 'md',
  className,
  style,
  'data-testid': testId,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div
      className={cn(styles.field, className)}
      style={style}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={cn(styles.label, hideLabel && styles.srOnly)}
      >
        {label}
      </label>
      <div className={styles.wrapper}>
        <select
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(styles.select, styles[size], error && styles.selectError)}
          defaultValue={placeholder ? '' : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
```

Create `src/components/Select/index.ts`:

```typescript
export { Select } from './Select'
export type { SelectOption } from './Select'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test src/components/Select
```

Expected: `PASS src/components/Select/Select.test.tsx` — 14 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Select/Select.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Select } from './Select'

const options = [
  { value: 'contactado', label: 'Contactado' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'promesa', label: 'Promesa de pago' },
  { value: 'no_interesado', label: 'No interesado' },
]

const meta: Meta<typeof Select> = {
  title: 'Wave 2 — Form Controls/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Selector nativo con etiqueta accesible, flecha personalizada, estados de error y deshabilitado. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    label: 'Estado de la gestión',
    options,
    placeholder: 'Selecciona una opción',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Select label="Normal" options={options} placeholder="Selecciona" />
      <Select label="Con error" options={options} error="Selección requerida" />
      <Select label="Deshabilitado" options={options} disabled defaultValue="contactado" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Select label="Tamaño sm" options={options} size="sm" placeholder="Pequeño" />
      <Select label="Tamaño md" options={options} size="md" placeholder="Mediano" />
      <Select label="Tamaño lg" options={options} size="lg" placeholder="Grande" />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Estado de la gestión',
    options,
    placeholder: 'Selecciona',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sel = canvas.getByLabelText('Estado de la gestión')
    await userEvent.selectOptions(sel, 'promesa')
    await expect(sel).toHaveValue('promesa')
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 2 — Form Controls / Select / AllStates`.
Open `design-system-reference/preview/components-inputs.html` — "Estado de la gestión" field.

Verify:
- Custom chevron arrow visible (not browser default)
- Same height/border/radius as Input
- Error state shows red ring + red text below
- Disabled state shows gray background

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Select/Select.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as SelectStories from './Select.stories'

<Meta of={SelectStories} />

# Select

Selector nativo con flecha personalizada, etiqueta accesible y sistema de estados idéntico al de Input.

**Referencia:** `design-system-reference/preview/components-inputs.html` — campo "Estado de la gestión"

<Canvas of={SelectStories.AllStates} />
<Controls of={SelectStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Select } from './components/Select'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Select/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-2): agregar componente Select"
```

---

## Task 3: Textarea

**Reference:** `design-system-reference/preview/components-inputs.html` — "Observaciones de gestión" field (`<textarea>`)
**Translation passes:**
- Same base tokens as Input ✓
- `height: 70px` (default textarea height) → add `--yes-size-textarea-h: 70px`
- `padding: 8px 12px` → `8px` vertical = half `--yes-space-4`; horizontal = `--yes-space-3` ✓ → add `--yes-size-textarea-py: 8px`
- `resize: vertical` → CSS only, no token needed

- [ ] **Step 1: Add Textarea-specific tokens**

Open `src/tokens/semantic.css`. Add to the Wave 2 field shared block:

```css
  --yes-size-textarea-h:  70px;   /* reference: textarea default height */
  --yes-size-textarea-py:  8px;   /* reference: textarea vertical padding */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Textarea/Textarea.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a labeled textarea', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toBeInTheDocument()
  })

  it('renders the textarea as a textarea element', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones').tagName).toBe('TEXTAREA')
  })

  it('renders hint text', () => {
    render(<Textarea label="Observaciones" hint="Máximo 500 caracteres" />)
    expect(screen.getByText('Máximo 500 caracteres')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Textarea label="Observaciones" error="Campo requerido" />)
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Textarea label="Observaciones" error="Error" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without error', () => {
    render(<Textarea label="Observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('aria-invalid', 'false')
  })

  it('disables the textarea when disabled prop is set', () => {
    render(<Textarea label="Observaciones" disabled />)
    expect(screen.getByLabelText('Observaciones')).toBeDisabled()
  })

  it('marks as required when required prop is set', () => {
    render(<Textarea label="Observaciones" required />)
    expect(screen.getByLabelText('Observaciones')).toBeRequired()
  })

  it('hides label visually when hideLabel is set', () => {
    render(<Textarea label="Notas" hideLabel />)
    expect(screen.getByText('Notas')).toHaveClass('srOnly')
  })

  it('forwards name to the textarea element', () => {
    render(<Textarea label="Observaciones" name="observaciones" />)
    expect(screen.getByLabelText('Observaciones')).toHaveAttribute('name', 'observaciones')
  })

  it('forwards placeholder to the textarea element', () => {
    render(<Textarea label="Observaciones" placeholder="Escribe aquí las notas de la llamada…" />)
    expect(screen.getByPlaceholderText('Escribe aquí las notas de la llamada…')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Observaciones" onChange={onChange} />)
    await user.type(screen.getByLabelText('Observaciones'), 'Nota')
    expect(onChange).toHaveBeenCalled()
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Observaciones" disabled onChange={onChange} />)
    await user.type(screen.getByLabelText('Observaciones'), 'X')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root element', () => {
    render(<Textarea label="Observaciones" data-testid="ta-obs" />)
    expect(screen.getByTestId('ta-obs')).toBeInTheDocument()
  })

  it('associates error with aria-describedby', () => {
    render(<Textarea label="Observaciones" error="Error" />)
    const ta = screen.getByLabelText('Observaciones')
    const errorId = ta.getAttribute('aria-describedby')
    expect(document.getElementById(errorId!)).toHaveTextContent('Error')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test src/components/Textarea
```

Expected: `FAIL` — "Cannot find module './Textarea'".

- [ ] **Step 4: Implement Textarea**

Create `src/components/Textarea/Textarea.module.css`:

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--yes-size-field-gap);
  width: 100%;
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-label-text);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-field-label);
  line-height: 1.4;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.textarea {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border-strong);
  border-radius: var(--yes-radius-field);
  padding: var(--yes-size-textarea-py) var(--yes-space-3);
  height: var(--yes-size-textarea-h);
  width: 100%;
  outline: none;
  resize: vertical;
  transition: border-color var(--yes-duration-base) var(--yes-ease),
              box-shadow var(--yes-duration-base) var(--yes-ease);
  line-height: 1.5;
}

.textarea:focus {
  border-color: var(--yes-color-border-focus);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring);
}

.textarea:disabled {
  background: var(--yes-color-surface-disabled);
  color: var(--yes-color-text-disabled);
  border-color: var(--yes-color-border-disabled);
  cursor: not-allowed;
  resize: none;
}

.textareaError {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.textareaError:focus {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.hint {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-hint);
  line-height: 1.4;
}

.error {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-error);
  line-height: 1.4;
}
```

Create `src/components/Textarea/Textarea.tsx`:

```tsx
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps } from '../../types/shared'
import styles from './Textarea.module.css'

interface TextareaProps extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof FieldProps> {
  placeholder?: string
}

export function Textarea({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  className,
  style,
  'data-testid': testId,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div
      className={cn(styles.field, className)}
      style={style}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={cn(styles.label, hideLabel && styles.srOnly)}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(styles.textarea, error && styles.textareaError)}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
```

Create `src/components/Textarea/index.ts`:

```typescript
export { Textarea } from './Textarea'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test src/components/Textarea
```

Expected: `PASS src/components/Textarea/Textarea.test.tsx` — 16 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Textarea/Textarea.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Wave 2 — Form Controls/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Área de texto multilínea con el mismo sistema de etiqueta/error/hint que Input. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    label: 'Observaciones de gestión',
    placeholder: 'Escribe aquí las notas de la llamada…',
    hint: 'Máximo 500 caracteres',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Textarea label="Normal" placeholder="Escribe aquí…" hint="Texto de ayuda" />
      <Textarea
        label="Con error"
        value="Texto muy largo que supera el límite"
        error="El texto supera el límite permitido"
        onChange={() => {}}
      />
      <Textarea label="Deshabilitado" value="Texto de solo lectura" disabled onChange={() => {}} />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Observaciones de gestión',
    placeholder: 'Escribe aquí…',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ta = canvas.getByLabelText('Observaciones de gestión')
    await userEvent.type(ta, 'Notas de la llamada')
    await expect(ta).toHaveValue('Notas de la llamada')
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 2 — Form Controls / Textarea / AllStates`.
Open `design-system-reference/preview/components-inputs.html` — "Observaciones de gestión" field.

Verify:
- Same border/radius/font as Input
- Resize handle visible (vertical only)
- Error + disabled states match Input visual treatment

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Textarea/Textarea.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as TextareaStories from './Textarea.stories'

<Meta of={TextareaStories} />

# Textarea

Área de texto multilínea. Comportamiento de estados idéntico al de Input (error, hint, disabled, required).

**Referencia:** `design-system-reference/preview/components-inputs.html` — campo "Observaciones de gestión"

<Canvas of={TextareaStories.AllStates} />
<Controls of={TextareaStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Textarea } from './components/Textarea'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Textarea/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-2): agregar componente Textarea"
```

---

## Task 4: Checkbox

**Reference:** `design-system-reference/preview/components-inputs.html` (row selection pattern); secondary reference: `design-system-reference/ui_kits/` table advanced (Wave 6 DataTable row select)
**Translation passes:**
- Browser native checkbox: 16×16 default → accept native sizing, override accent color
- `accent-color: var(--yes-color-primary)` → colors the checkmark in supported browsers
- Custom appearance needed for indeterminate state: use a pseudo-element overlay
- Label text: 14px, weight 500, color #374151 → `--yes-text-sm` + `--yes-weight-medium` + `--yes-color-field-label` ✓
- Gap between checkbox and label: 8px → `--yes-space-2` (8px ✓)
- Indeterminate state: set via `ref.current.indeterminate = true` (DOM property, not HTML attr)
- Checkbox size token: add `--yes-size-checkbox: 16px`

- [ ] **Step 1: Add Checkbox tokens**

Open `src/tokens/semantic.css`. Add to the Wave 2 field shared block:

```css
  --yes-size-checkbox: 16px;   /* checkbox width/height */
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Checkbox/Checkbox.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders a labeled checkbox', () => {
    render(<Checkbox label="Seleccionar fila" />)
    expect(screen.getByLabelText('Seleccionar fila')).toBeInTheDocument()
  })

  it('renders as an input[type=checkbox]', () => {
    render(<Checkbox label="Opción" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('type', 'checkbox')
  })

  it('is unchecked by default', () => {
    render(<Checkbox label="Opción" />)
    expect(screen.getByLabelText('Opción')).not.toBeChecked()
  })

  it('renders checked when defaultChecked is set', () => {
    render(<Checkbox label="Opción" defaultChecked />)
    expect(screen.getByLabelText('Opción')).toBeChecked()
  })

  it('renders checked when checked prop is true', () => {
    render(<Checkbox label="Opción" checked onChange={() => {}} />)
    expect(screen.getByLabelText('Opción')).toBeChecked()
  })

  it('is unchecked when checked prop is false', () => {
    render(<Checkbox label="Opción" checked={false} onChange={() => {}} />)
    expect(screen.getByLabelText('Opción')).not.toBeChecked()
  })

  it('sets indeterminate via ref when indeterminate prop is true', () => {
    render(<Checkbox label="Seleccionar todo" indeterminate />)
    const cb = screen.getByLabelText('Seleccionar todo') as HTMLInputElement
    expect(cb.indeterminate).toBe(true)
  })

  it('clears indeterminate when indeterminate prop is false', () => {
    const { rerender } = render(<Checkbox label="Opción" indeterminate />)
    rerender(<Checkbox label="Opción" indeterminate={false} />)
    const cb = screen.getByLabelText('Opción') as HTMLInputElement
    expect(cb.indeterminate).toBe(false)
  })

  it('disables the checkbox when disabled prop is set', () => {
    render(<Checkbox label="Opción" disabled />)
    expect(screen.getByLabelText('Opción')).toBeDisabled()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" onChange={onChange} />)
    await user.click(screen.getByLabelText('Opción'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" disabled onChange={onChange} />)
    await user.click(screen.getByLabelText('Opción'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Opción" onChange={onChange} />)
    screen.getByLabelText('Opción').focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders hint text', () => {
    render(<Checkbox label="Acepto términos" hint="Lee los términos antes de aceptar" />)
    expect(screen.getByText('Lee los términos antes de aceptar')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Checkbox label="Acepto términos" error="Debes aceptar los términos" />)
    expect(screen.getByText('Debes aceptar los términos')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Checkbox label="Opción" error="Error" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards name to the input element', () => {
    render(<Checkbox label="Opción" name="acepto" />)
    expect(screen.getByLabelText('Opción')).toHaveAttribute('name', 'acepto')
  })

  it('passes data-testid to root element', () => {
    render(<Checkbox label="Opción" data-testid="cb-acepto" />)
    expect(screen.getByTestId('cb-acepto')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test src/components/Checkbox
```

Expected: `FAIL` — "Cannot find module './Checkbox'".

- [ ] **Step 4: Implement Checkbox**

Create `src/components/Checkbox/Checkbox.module.css`:

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--yes-size-field-gap);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--yes-space-2);
}

.checkbox {
  width: var(--yes-size-checkbox);
  height: var(--yes-size-checkbox);
  flex-shrink: 0;
  accent-color: var(--yes-color-primary);
  cursor: pointer;
}

.checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-medium);
  color: var(--yes-color-field-label);
  line-height: 1.4;
  cursor: pointer;
}

.labelDisabled {
  color: var(--yes-color-text-disabled);
  cursor: not-allowed;
}

.hint {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-hint);
  line-height: 1.4;
  padding-left: calc(var(--yes-size-checkbox) + var(--yes-space-2));
}

.error {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-error);
  line-height: 1.4;
  padding-left: calc(var(--yes-size-checkbox) + var(--yes-space-2));
}
```

Create `src/components/Checkbox/Checkbox.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Checkbox.module.css'

interface CheckboxProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | keyof BaseProps> {
  label: string
  indeterminate?: boolean
  hint?: string
  error?: string
}

export function Checkbox({
  label,
  indeterminate = false,
  disabled = false,
  hint,
  error,
  id: idProp,
  name,
  className,
  style,
  'data-testid': testId,
  ...rest
}: CheckboxProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div
      className={cn(styles.wrapper, className)}
      style={style}
      data-testid={testId}
    >
      <div className={styles.row}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={styles.checkbox}
          {...rest}
        />
        <label
          htmlFor={id}
          className={cn(styles.label, disabled && styles.labelDisabled)}
        >
          {label}
        </label>
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
```

Create `src/components/Checkbox/index.ts`:

```typescript
export { Checkbox } from './Checkbox'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test src/components/Checkbox
```

Expected: `PASS src/components/Checkbox/Checkbox.test.tsx` — 18 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Checkbox/Checkbox.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Wave 2 — Form Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Casilla de verificación con soporte de estado indeterminado (usado en DataTable Wave 6). Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { label: 'Seleccionar fila' },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Sin marcar" />
      <Checkbox label="Marcado" defaultChecked />
      <Checkbox label="Indeterminado" indeterminate />
      <Checkbox label="Deshabilitado sin marcar" disabled />
      <Checkbox label="Deshabilitado marcado" defaultChecked disabled />
      <Checkbox label="Con error" error="Debes aceptar los términos" />
      <Checkbox label="Con hint" hint="Marca esta opción para continuar" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label={checked ? 'Seleccionado' : 'Sin seleccionar'}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cb = canvas.getByRole('checkbox')
    await expect(cb).not.toBeChecked()
    await userEvent.click(cb)
    await expect(cb).toBeChecked()
  },
}

export const IndeterminateDemo: Story = {
  render: () => {
    const [allChecked, setAllChecked] = useState(false)
    const [items, setItems] = useState([false, false, false])
    const someChecked = items.some(Boolean)
    const allItemsChecked = items.every(Boolean)
    const indeterminate = someChecked && !allItemsChecked

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      setAllChecked(checked)
      setItems(items.map(() => checked))
    }
    const handleItem = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = items.map((v, idx) => (idx === i ? e.target.checked : v))
      setItems(next)
      setAllChecked(next.every(Boolean))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox
          label="Seleccionar todo"
          checked={allItemsChecked}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
        {['Fila 1', 'Fila 2', 'Fila 3'].map((row, i) => (
          <div key={i} style={{ paddingLeft: 24 }}>
            <Checkbox label={row} checked={items[i]} onChange={handleItem(i)} />
          </div>
        ))}
      </div>
    )
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 2 — Form Controls / Checkbox / AllStates`.
Verify:
- Unchecked: browser default unchecked appearance with blue accent
- Checked: checkmark in primary blue (#2B52A0)
- Indeterminate: dash/partial fill (browser native indeterminate rendering)
- Disabled: muted opacity, not-allowed cursor

Open `IndeterminateDemo` story. Click individual items — verify the "Seleccionar todo" checkbox transitions through unchecked → indeterminate → checked correctly.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Checkbox/Checkbox.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as CheckboxStories from './Checkbox.stories'

<Meta of={CheckboxStories} />

# Checkbox

Casilla de verificación con soporte de estado indeterminado. El estado `indeterminate` se aplica
vía `ref.current.indeterminate` — es una propiedad DOM, no un atributo HTML.

**Referencia:** Wave 6 DataTable usa `indeterminate` para el checkbox "Seleccionar todo"
cuando solo algunas filas están seleccionadas.

## Uso básico

```tsx
import { Checkbox } from '@yes/ui'

<Checkbox label="Aceptar términos" />
```

## Estado indeterminado

```tsx
<Checkbox
  label="Seleccionar todo"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={handleSelectAll}
/>
```

<Canvas of={CheckboxStories.IndeterminateDemo} />
<Controls of={CheckboxStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Checkbox } from './components/Checkbox'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Checkbox/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-2): agregar componente Checkbox con estado indeterminado"
```

---

## Task 5: Toggle

**Reference:** `design-system-reference/preview/components-inputs.html` — "Notificaciones activas" field (toggle + label)
**Translation passes:** all resolved in Task 0.
- Track: `width: 40px; height: 22px; border-radius: 11px` → `--yes-size-toggle-w`, `--yes-size-toggle-h`, `--yes-radius-toggle` ✓
- Knob: `width: 18px; height: 18px; top: 2px; right: 2px (on) / left: 2px (off)` → `--yes-size-toggle-knob`, `--yes-size-toggle-knob-offset` ✓
- Active (on): bg `#8CBC39` → `--yes-color-toggle-on` ✓
- Inactive (off): bg `#D1D5DB` → `--yes-color-toggle-off` ✓
- Knob shadow: `0 1px 3px rgba(0,0,0,0.2)` → use `--yes-shadow-xs` if it exists, else inline (add token if needed)
- Label: 14px / weight 500 / #374151 → `--yes-text-sm` + `--yes-weight-medium` + `--yes-color-field-label` ✓
- Toggle is implemented as a visually styled `<button role="switch">` or as a hidden `<input type="checkbox">` + custom `<span>` track. Use the checkbox pattern for native accessibility.
- Transition: `150ms` smooth on knob position → `var(--yes-duration-base)` ✓

- [ ] **Step 1: Add Toggle shadow token if missing**

Open `src/tokens/semantic.css`. Verify `--yes-shadow-xs` exists. If not, add:

```css
  --yes-shadow-toggle-knob: 0 1px 3px rgba(0, 0, 0, 0.2);
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Toggle/Toggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders a switch role element', () => {
    render(<Toggle label="Notificaciones" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders the label text', () => {
    render(<Toggle label="Recibir alertas en tiempo real" />)
    expect(screen.getByText('Recibir alertas en tiempo real')).toBeInTheDocument()
  })

  it('is off by default', () => {
    render(<Toggle label="Activar" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('is on when defaultChecked is true', () => {
    render(<Toggle label="Activar" defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects controlled checked state', () => {
    render(<Toggle label="Activar" checked onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" disabled onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    screen.getByRole('switch').focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('activates on Enter key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Activar" onChange={onChange} />)
    screen.getByRole('switch').focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Toggle label="Activar" disabled />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true')
  })

  it('toggles from off to on on click (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Toggle label="Activar" />)
    const sw = screen.getByRole('switch')
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await user.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards name to the underlying hidden input', () => {
    render(<Toggle label="Activar" name="notificaciones" />)
    expect(document.querySelector('input[name="notificaciones"]')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<Toggle label="Activar" data-testid="tgl-notif" />)
    expect(screen.getByTestId('tgl-notif')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test src/components/Toggle
```

Expected: `FAIL` — "Cannot find module './Toggle'".

- [ ] **Step 4: Implement Toggle**

Create `src/components/Toggle/Toggle.module.css`:

```css
.wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--yes-space-2);
}

.hiddenInput {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.track {
  position: relative;
  width: var(--yes-size-toggle-w);
  height: var(--yes-size-toggle-h);
  border-radius: var(--yes-radius-toggle);
  background: var(--yes-color-toggle-off);
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--yes-duration-base) var(--yes-ease);
  outline: none;
}

.track:focus-visible {
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring);
}

.trackOn {
  background: var(--yes-color-toggle-on);
}

.trackDisabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.knob {
  position: absolute;
  top: var(--yes-size-toggle-knob-offset);
  left: var(--yes-size-toggle-knob-offset);
  width: var(--yes-size-toggle-knob);
  height: var(--yes-size-toggle-knob);
  background: var(--yes-color-surface);
  border-radius: 50%;
  box-shadow: var(--yes-shadow-toggle-knob);
  transition: transform var(--yes-duration-base) var(--yes-ease);
}

.knobOn {
  transform: translateX(
    calc(
      var(--yes-size-toggle-w) -
      var(--yes-size-toggle-knob) -
      2 * var(--yes-size-toggle-knob-offset)
    )
  );
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-medium);
  color: var(--yes-color-field-label);
  cursor: pointer;
  line-height: 1.4;
}

.labelDisabled {
  color: var(--yes-color-text-disabled);
  cursor: not-allowed;
}
```

Create `src/components/Toggle/Toggle.tsx`:

```tsx
import { useState } from 'react'
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Toggle.module.css'

interface ToggleProps extends BaseProps {
  label: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string
  onChange?: (checked: boolean) => void
}

export function Toggle({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  name,
  onChange,
  id: idProp,
  className,
  style,
  'data-testid': testId,
}: ToggleProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isOn = isControlled ? controlledChecked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    const next = !isOn
    if (!isControlled) setInternalChecked(next)
    onChange?.(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div
      className={cn(styles.wrapper, className)}
      style={style}
      data-testid={testId}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={isOn ? '1' : '0'}
          className={styles.hiddenInput}
        />
      )}
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={isOn}
        aria-disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          styles.track,
          isOn && styles.trackOn,
          disabled && styles.trackDisabled,
        )}
      >
        <span className={cn(styles.knob, isOn && styles.knobOn)} />
      </button>
      <label
        htmlFor={id}
        className={cn(styles.label, disabled && styles.labelDisabled)}
        onClick={handleToggle}
      >
        {label}
      </label>
    </div>
  )
}
```

Create `src/components/Toggle/index.ts`:

```typescript
export { Toggle } from './Toggle'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test src/components/Toggle
```

Expected: `PASS src/components/Toggle/Toggle.test.tsx` — 14 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Toggle/Toggle.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Wave 2 — Form Controls/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interruptor binario (track + knob). Implementado con role="switch" para accesibilidad. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: { label: 'Recibir alertas en tiempo real' },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle label="Desactivado (off)" checked={false} onChange={() => {}} />
      <Toggle label="Activado (on)" checked onChange={() => {}} />
      <Toggle label="Deshabilitado off" disabled />
      <Toggle label="Deshabilitado on" defaultChecked disabled />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <Toggle
        label={on ? 'Activado' : 'Desactivado'}
        checked={on}
        onChange={setOn}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sw = canvas.getByRole('switch')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 2 — Form Controls / Toggle / AllStates`.
Open `design-system-reference/preview/components-inputs.html` — "Notificaciones activas" field.

Verify:
- Track: 40×22px, border-radius 11px (pill)
- Inactive: gray track (#D1D5DB), knob on the left
- Active: green track (#8CBC39), knob slides to the right with smooth 150ms transition
- Knob: 18×18px, white, subtle shadow
- Label: 14px, weight 500, #374151

Open `Interactive` story — click the toggle. Verify smooth knob animation.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Toggle/Toggle.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ToggleStories from './Toggle.stories'

<Meta of={ToggleStories} />

# Toggle

Interruptor binario. Usa `role="switch"` y `aria-checked` para accesibilidad completa.

**Referencia:** `design-system-reference/preview/components-inputs.html` — campo "Notificaciones activas"

## Uso

```tsx
import { Toggle } from '@yes/ui'

// No controlado
<Toggle label="Recibir alertas" defaultChecked />

// Controlado
<Toggle label="Recibir alertas" checked={on} onChange={setOn} />
```

<Canvas of={ToggleStories.AllStates} />
<Controls of={ToggleStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Toggle } from './components/Toggle'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Toggle/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-2): agregar componente Toggle"
```

---

## Task 6: SearchInput

**Reference:** `design-system-reference/preview/components-inputs.html` — "Buscar contacto" field
**Translation passes:** all resolved in Task 0.
- Uses `Icon` from Wave 1: `import { Icon } from '../Icon/Icon'`
- Uses lucide icons: `import { Search, X } from 'lucide-react'`
- Search icon: `color: #9CA3AF` → `--yes-color-text-subtle` ✓, `left: 10px` → `--yes-size-search-icon-left` ✓, `size: 14` (Icon prop)
- Input `padding-left: 34px` → `--yes-size-search-pl` ✓
- Clear button: appears when value is non-empty, calls `onClear` prop
- Clear button uses `Icon` with `X` lucide icon, `size: 14`, same color as search icon
- Clear button is absolutely positioned right side, same spacing as icon
- No additional tokens needed beyond Task 0

**Files:**
- Create: `src/components/SearchInput/SearchInput.tsx`
- Create: `src/components/SearchInput/SearchInput.module.css`
- Create: `src/components/SearchInput/SearchInput.test.tsx`
- Create: `src/components/SearchInput/SearchInput.stories.tsx`
- Create: `src/components/SearchInput/SearchInput.mdx`
- Create: `src/components/SearchInput/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/components/SearchInput/SearchInput.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders a labeled search input', () => {
    render(<SearchInput label="Buscar contacto" />)
    expect(screen.getByLabelText('Buscar contacto')).toBeInTheDocument()
  })

  it('renders input with type=search', () => {
    render(<SearchInput label="Buscar" />)
    expect(screen.getByLabelText('Buscar')).toHaveAttribute('type', 'search')
  })

  it('renders a search icon', () => {
    render(<SearchInput label="Buscar" />)
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput label="Buscar" value="" onClear={() => {}} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument()
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchInput label="Buscar" value="Carlos" onClear={() => {}} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchInput label="Buscar" value="Carlos" onClear={onClear} onChange={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput label="Buscar" onChange={onChange} />)
    await user.type(screen.getByLabelText('Buscar'), 'test')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders hint text', () => {
    render(<SearchInput label="Buscar" hint="Nombre, teléfono o ID" />)
    expect(screen.getByText('Nombre, teléfono o ID')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<SearchInput label="Buscar" error="Búsqueda inválida" />)
    expect(screen.getByText('Búsqueda inválida')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<SearchInput label="Buscar" error="Error" />)
    expect(screen.getByLabelText('Buscar')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the input when disabled prop is set', () => {
    render(<SearchInput label="Buscar" disabled />)
    expect(screen.getByLabelText('Buscar')).toBeDisabled()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crashing',
    (size) => {
      render(<SearchInput label="Buscar" size={size} />)
      expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
    }
  )

  it('passes data-testid to root element', () => {
    render(<SearchInput label="Buscar" data-testid="search-field" />)
    expect(screen.getByTestId('search-field')).toBeInTheDocument()
  })

  it('forwards placeholder to the input', () => {
    render(<SearchInput label="Buscar" placeholder="Nombre, teléfono o ID…" />)
    expect(screen.getByPlaceholderText('Nombre, teléfono o ID…')).toBeInTheDocument()
  })

  it('does not show clear button when disabled even with value', () => {
    render(<SearchInput label="Buscar" value="Carlos" disabled onClear={() => {}} onChange={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify RED**

```bash
pnpm test src/components/SearchInput
```

Expected: `FAIL` — "Cannot find module './SearchInput'".

- [ ] **Step 3: Implement SearchInput**

Create `src/components/SearchInput/SearchInput.module.css`:

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--yes-size-field-gap);
  width: 100%;
}

.label {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-label-text);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-field-label);
  line-height: 1.4;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.wrapper {
  position: relative;
  width: 100%;
}

.searchIcon {
  position: absolute;
  left: var(--yes-size-search-icon-left);
  top: 50%;
  transform: translateY(-50%);
  color: var(--yes-color-text-subtle);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.input {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border-strong);
  border-radius: var(--yes-radius-field);
  padding: 0 var(--yes-space-3) 0 var(--yes-size-search-pl);
  width: 100%;
  outline: none;
  transition: border-color var(--yes-duration-base) var(--yes-ease),
              box-shadow var(--yes-duration-base) var(--yes-ease);
  line-height: 1;
}

/* ── Sizes ─────────────────────────────────────────────────── */
.sm { height: var(--yes-size-height-sm); }
.md { height: var(--yes-size-height-md); }
.lg { height: var(--yes-size-height-lg); }

/* ── States ────────────────────────────────────────────────── */
.input:focus {
  border-color: var(--yes-color-border-focus);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring);
}

.input:disabled {
  background: var(--yes-color-surface-disabled);
  color: var(--yes-color-text-disabled);
  border-color: var(--yes-color-border-disabled);
  cursor: not-allowed;
}

.inputError {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.inputError:focus {
  border-color: var(--yes-color-border-error);
  box-shadow: 0 0 0 3px var(--yes-color-focus-ring-error);
}

.inputWithClear {
  padding-right: calc(var(--yes-space-3) + 24px);
}

.clearButton {
  position: absolute;
  right: var(--yes-size-search-icon-left);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--yes-color-text-subtle);
  line-height: 1;
  border-radius: var(--yes-radius-sm);
  transition: color var(--yes-duration-base) var(--yes-ease);
}

.clearButton:hover {
  color: var(--yes-color-text);
}

.clearButton:focus-visible {
  outline: 2px solid var(--yes-color-border-focus);
  outline-offset: 1px;
}

.hint {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-hint);
  line-height: 1.4;
}

.error {
  font-family: var(--yes-font-sans);
  font-size: var(--yes-size-field-hint-text);
  color: var(--yes-color-field-error);
  line-height: 1.4;
}
```

Create `src/components/SearchInput/SearchInput.tsx`:

```tsx
import { Search, X } from 'lucide-react'
import { Icon } from '../Icon/Icon'
import { useId } from '../../hooks/useId'
import { cn } from '../../utils/cn'
import type { FieldProps, Size } from '../../types/shared'
import styles from './SearchInput.module.css'

interface SearchInputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof FieldProps | 'size' | 'type'> {
  size?: Size
  placeholder?: string
  onClear?: () => void
}

export function SearchInput({
  label,
  hideLabel = false,
  name,
  disabled = false,
  required = false,
  error,
  hint,
  id: idProp,
  size = 'md',
  value,
  onClear,
  className,
  style,
  'data-testid': testId,
  ...rest
}: SearchInputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  const hasValue = typeof value === 'string' ? value.length > 0 : false
  const showClear = hasValue && !disabled && !!onClear

  return (
    <div
      className={cn(styles.field, className)}
      style={style}
      data-testid={testId}
    >
      <label
        htmlFor={id}
        className={cn(styles.label, hideLabel && styles.srOnly)}
      >
        {label}
      </label>
      <div className={styles.wrapper}>
        <span className={styles.searchIcon}>
          <Icon icon={Search} size={14} aria-hidden />
        </span>
        <input
          id={id}
          type="search"
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            styles.input,
            styles[size],
            error && styles.inputError,
            showClear && styles.inputWithClear,
          )}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={onClear}
            className={styles.clearButton}
          >
            <Icon icon={X} size={14} aria-hidden />
          </button>
        )}
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
```

Create `src/components/SearchInput/index.ts`:

```typescript
export { SearchInput } from './SearchInput'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test src/components/SearchInput
```

Expected: `PASS src/components/SearchInput/SearchInput.test.tsx` — 16 tests passing.

- [ ] **Step 5: Write stories**

Create `src/components/SearchInput/SearchInput.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Wave 2 — Form Controls/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de búsqueda con ícono Search a la izquierda y botón de limpiar (×) cuando hay valor. Usa el componente Icon de Wave 1. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof SearchInput>

export const Default: Story = {
  args: {
    label: 'Buscar contacto',
    placeholder: 'Nombre, teléfono o ID…',
    hideLabel: false,
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('Carlos Rodríguez')
    return (
      <SearchInput
        label="Buscar contacto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="Nombre, teléfono o ID…"
      />
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <SearchInput label="Normal" placeholder="Nombre, teléfono o ID…" />
      <SearchInput
        label="Con valor y clear"
        value="Carlos"
        onClear={() => {}}
        onChange={() => {}}
      />
      <SearchInput label="Con error" error="Búsqueda inválida" />
      <SearchInput label="Deshabilitado" disabled />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <SearchInput label="Tamaño sm" size="sm" placeholder="Pequeño" />
      <SearchInput label="Tamaño md" size="md" placeholder="Mediano" />
      <SearchInput label="Tamaño lg" size="lg" placeholder="Grande" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        label="Buscar contacto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="Nombre, teléfono o ID…"
        hint="Presiona × para limpiar"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Buscar contacto')
    await userEvent.type(input, 'Carlos')
    await expect(input).toHaveValue('Carlos')
    const clearBtn = canvas.getByRole('button', { name: 'Limpiar búsqueda' })
    await expect(clearBtn).toBeVisible()
    await userEvent.click(clearBtn)
    await expect(input).toHaveValue('')
  },
}
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

Open Storybook → `Wave 2 — Form Controls / SearchInput / AllStates`.
Open `design-system-reference/preview/components-inputs.html` — "Buscar contacto" field.

Verify:
- Search icon: positioned at left:10px, vertically centered, gray (#9CA3AF)
- Input left padding: 34px (icon does not overlap text)
- Clear (×) button appears when value is non-empty, positioned at right
- Same border/height/radius/font as Input
- Icon is a lucide SVG (stroke, not fill)

Open `Interactive` story — type text, verify × appears, click ×, verify input clears.

**Sign off before continuing.**

- [ ] **Step 7: Write MDX docs**

Create `src/components/SearchInput/SearchInput.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as SearchInputStories from './SearchInput.stories'

<Meta of={SearchInputStories} />

# SearchInput

Campo de búsqueda con ícono `Search` de Lucide a la izquierda y botón `×` para limpiar
cuando hay valor. Compone el componente `Icon` de Wave 1.

**Referencia:** `design-system-reference/preview/components-inputs.html` — campo "Buscar contacto"

## Uso

```tsx
import { SearchInput } from '@yes/ui'

const [value, setValue] = useState('')

<SearchInput
  label="Buscar contacto"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onClear={() => setValue('')}
  placeholder="Nombre, teléfono o ID…"
/>
```

- `onClear` es requerido para que aparezca el botón `×`.
- Sin `onClear`, el componente opera como campo de búsqueda de solo lectura sin limpieza.

<Canvas of={SearchInputStories.Interactive} />
<Controls of={SearchInputStories.Default} />
```

- [ ] **Step 8: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { SearchInput } from './components/SearchInput'
```

```bash
pnpm build && pnpm check-dist
```

- [ ] **Step 9: Commit**

```bash
git add src/components/SearchInput/ src/index.ts
git commit -m "feat(wave-2): agregar componente SearchInput (Icon + Search + Clear)"
```

---

## Task 7: Wave 2 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all test files passing (Wave 1 + Wave 2), 0 failures.
Paste the complete vitest output as evidence before marking done.

- [ ] **Step 2: Full build and dist check**

```bash
pnpm build && pnpm check-dist
```

Expected:
```
✓ dist/index.js
✓ dist/index.cjs
✓ dist/index.d.ts
✓ dist/tokens/primitives.css
✓ dist/tokens/semantic.css
✓ dist/tokens/themes/light.css
✓ dist/tokens/themes/dark.css
All dist files present.
```

- [ ] **Step 3: Verify all Wave 2 exports are present**

```bash
node -e "
const exports = require('./dist/index.cjs');
const wave2 = ['Input', 'Select', 'Textarea', 'Checkbox', 'Toggle', 'SearchInput'];
const missing = wave2.filter(n => !exports[n]);
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 2 exports present');
"
```

Expected: `All Wave 2 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
pnpm dev
```

Open each story group in order:
- Wave 2 — Form Controls / Input / AllStates
- Wave 2 — Form Controls / Input / AllSizes
- Wave 2 — Form Controls / Select / AllStates
- Wave 2 — Form Controls / Select / AllSizes
- Wave 2 — Form Controls / Textarea / AllStates
- Wave 2 — Form Controls / Checkbox / AllStates
- Wave 2 — Form Controls / Checkbox / IndeterminateDemo
- Wave 2 — Form Controls / Toggle / AllStates
- Wave 2 — Form Controls / SearchInput / AllStates
- Wave 2 — Form Controls / SearchInput / Interactive

Verify no console errors. Every `Interactive` story play function runs without failures.

- [ ] **Step 5: Tag Wave 2 release**

```bash
git tag v0.2.0
git commit --allow-empty -m "chore(release): wave 2 form controls — v0.2.0"
```

---

## Self-review notes

**Spec coverage check:**
- ✅ Wave 2 field tokens (label, hint, error, focus-ring, disabled) → Task 0
- ✅ Input (label + error + hint + 3 sizes + focus/error/disabled states) → Task 1
- ✅ Select (native dropdown, custom chevron, same state system as Input) → Task 2
- ✅ Textarea (multiline, resize: vertical, same state system) → Task 3
- ✅ Checkbox (unchecked/checked/indeterminate via ref, disabled, error) → Task 4
- ✅ Toggle (track/knob, role=switch, aria-checked, uncontrolled+controlled) → Task 5
- ✅ SearchInput (Icon Wave 1, Search lucide, clear ×, all sizes + states) → Task 6
- ✅ Wave 2 integration verify → Task 7

**Type consistency:**
- `FieldProps` (from `src/types/shared.ts`) is the base for Input, Select, Textarea, SearchInput.
- Checkbox and Toggle use `BaseProps` + local props (they are not classic form fields with a text input structure, so FieldProps doesn't fit directly).
- `SelectOption` is exported from Select's index so consuming code can import the type.
- Toggle's `onChange` receives `boolean` (not `React.ChangeEvent`) — this is intentional; Toggle is a switch, not a traditional input.

**Placeholder scan:** Clean — all steps have complete code.

**Wave 6 note:** Checkbox `indeterminate` prop + `IndeterminateDemo` story is the exact pattern DataTable will use for row selection. The DOM property approach (`ref.current.indeterminate`) is the only correct implementation — there is no HTML attribute equivalent.
