# @yes/ui Wave 3 — Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 4 Wave 3 Feedback components — Alert, Toast, Skeleton, EmptyState — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Alert is built before Toast because Toast reuses the same variant logic. EmptyState imports `Button` from Wave 1 and `Icon` from Wave 1. Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Wave 1 dependencies:** `Button` from `../Button/Button` · `Icon` from `../Icon/Icon`

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add Alert, Toast, Skeleton, EmptyState tokens

src/components/
├── Alert/
│   ├── Alert.tsx
│   ├── Alert.module.css
│   ├── Alert.test.tsx
│   ├── Alert.stories.tsx
│   ├── Alert.mdx
│   └── index.ts
├── Toast/
│   ├── Toast.tsx
│   ├── Toast.module.css
│   ├── Toast.test.tsx
│   ├── Toast.stories.tsx
│   ├── Toast.mdx
│   ├── ToastContainer.tsx
│   ├── useToast.ts
│   └── index.ts
├── Skeleton/
│   ├── Skeleton.tsx
│   ├── Skeleton.module.css
│   ├── Skeleton.test.tsx
│   ├── Skeleton.stories.tsx
│   ├── Skeleton.mdx
│   └── index.ts
└── EmptyState/
    ├── EmptyState.tsx
    ├── EmptyState.module.css
    ├── EmptyState.test.tsx
    ├── EmptyState.stories.tsx
    ├── EmptyState.mdx
    └── index.ts

src/index.ts                         ← uncomment export per component
```

---

## Task 1: Alert

**Reference:** `preview/components-alerts.html` — inline alert block section
**Translation passes:**
- Background colors: success `#F0FDF4`, error `#FEF2F2`, warning `#FFFBEB`, info `#EFF6FF` → map to `--yes-color-success-subtle`, `--yes-color-danger-subtle`, `--yes-color-warning-subtle`, `--yes-color-info-subtle`
- Border colors: success `#BBF7D0`, error `#FECACA`, warning `#FDE68A`, info `#BFDBFE` → map to `--yes-color-success-border`, `--yes-color-danger-border`, `--yes-color-warning-border`, `--yes-color-info-border` (add missing ones)
- Title colors: success `#15803D`, error `#B91C1C`, warning `#92400E`, info `#1D4ED8` → map to `--yes-color-success-fg`, `--yes-color-danger` (with hover), `--yes-color-warning-fg`, `--yes-primitive-blue-700`
- Description colors: success `#166534`, error `#991B1B`, warning `#78350F`, info `#1E3A8A` → add `--yes-color-alert-desc-success`, etc.
- Left accent border: 4px solid matching variant border color
- padding: 16px → `--yes-space-4`
- border-radius: 8px → `--yes-radius-card`
- gap between icon and body: 12px → `--yes-space-3`
- Icon size: 16px → `--yes-size-icon-sm` (add if needed)
- dismiss button (×): top-right, no background, cursor pointer

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Alert/Alert.tsx`
- Create: `src/components/Alert/Alert.module.css`
- Create: `src/components/Alert/Alert.test.tsx`
- Create: `src/components/Alert/Alert.stories.tsx`
- Create: `src/components/Alert/Alert.mdx`
- Create: `src/components/Alert/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add Alert tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the existing `--yes-color-info` block:

```css
  /* ── Alert ───────────────────────────────────────────────── */
  --yes-color-alert-accent-success: var(--yes-primitive-success-300);
  --yes-color-alert-accent-error:   var(--yes-primitive-error-300);
  --yes-color-alert-accent-warning: var(--yes-primitive-warning-300);
  --yes-color-alert-accent-info:    var(--yes-primitive-blue-300);

  --yes-color-alert-desc-success: var(--yes-primitive-success-800);
  --yes-color-alert-desc-error:   var(--yes-primitive-error-800);
  --yes-color-alert-desc-warning: var(--yes-primitive-warning-900);
  --yes-color-alert-desc-info:    var(--yes-primitive-blue-900);

  --yes-color-alert-title-info:    var(--yes-primitive-blue-700);

  --yes-size-alert-accent: 4px;
  --yes-size-alert-icon:   16px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Alert/Alert.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders title', () => {
    render(<Alert variant="success" title="Operación completada" />)
    expect(screen.getByText('Operación completada')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Alert variant="info" title="Info" description="Más detalles aquí" />)
    expect(screen.getByText('Más detalles aquí')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<Alert variant="success" title="Solo título" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'renders %s variant without crashing',
    (variant) => {
      render(<Alert variant={variant} title="Prueba" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    }
  )

  it('has role="alert" for screen readers', () => {
    render(<Alert variant="warning" title="Advertencia" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders dismiss button when onDismiss provided', () => {
    const onDismiss = vi.fn()
    render(<Alert variant="success" title="Éxito" onDismiss={onDismiss} />)
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('does not render dismiss button when onDismiss omitted', () => {
    render(<Alert variant="success" title="Éxito" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert variant="error" title="Error" onDismiss={onDismiss} />)
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('passes data-testid to root element', () => {
    render(<Alert variant="info" title="Info" data-testid="my-alert" />)
    expect(screen.getByTestId('my-alert')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Alert variant="warning" title="Advertencia" className="extra" />)
    expect(screen.getByRole('alert')).toHaveClass('extra')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Alert'". Paste the full output.

- [ ] **Step 4: Implement Alert**

Create `src/components/Alert/Alert.module.css`:

```css
.alert {
  display: flex;
  gap: var(--yes-space-3);
  align-items: flex-start;
  padding: var(--yes-space-4);
  border-radius: var(--yes-radius-card);
  border: 1px solid;
  border-left-width: var(--yes-size-alert-accent);
  position: relative;
}

.icon {
  flex-shrink: 0;
  width: var(--yes-size-alert-icon);
  height: var(--yes-size-alert-icon);
  margin-top: 2px;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-1);
}

.title {
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  line-height: var(--yes-leading-snug);
}

.description {
  font-size: var(--yes-text-sm);
  line-height: var(--yes-leading-normal);
}

.dismiss {
  position: absolute;
  top: var(--yes-space-2);
  right: var(--yes-space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: var(--yes-radius-sm);
  line-height: 1;
  font-size: 18px;
  transition: opacity var(--yes-duration-fast) var(--yes-ease);
}

.dismiss:hover {
  opacity: 0.7;
}

/* ── Variants ── */
.success {
  background: var(--yes-color-success-subtle);
  border-color: var(--yes-color-success-border);
}
.success .title { color: var(--yes-color-success-fg); }
.success .description { color: var(--yes-color-alert-desc-success); }
.success .icon { color: var(--yes-color-success); }
.success .dismiss { color: var(--yes-color-success-fg); }

.error {
  background: var(--yes-color-danger-subtle);
  border-color: var(--yes-color-danger-border);
}
.error .title { color: var(--yes-color-danger); }
.error .description { color: var(--yes-color-alert-desc-error); }
.error .icon { color: var(--yes-color-danger); }
.error .dismiss { color: var(--yes-color-danger); }

.warning {
  background: var(--yes-color-warning-subtle);
  border-color: var(--yes-color-warning-border);
}
.warning .title { color: var(--yes-color-warning-fg); }
.warning .description { color: var(--yes-color-alert-desc-warning); }
.warning .icon { color: var(--yes-color-warning); }
.warning .dismiss { color: var(--yes-color-warning-fg); }

.info {
  background: var(--yes-color-info-subtle);
  border-color: var(--yes-color-info-border);
}
.info .title { color: var(--yes-color-alert-title-info); }
.info .description { color: var(--yes-color-alert-desc-info); }
.info .icon { color: var(--yes-color-info); }
.info .dismiss { color: var(--yes-color-alert-title-info); }
```

Create `src/components/Alert/Alert.tsx`:

```tsx
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Alert.module.css'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

const ICONS: Record<AlertVariant, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

interface AlertProps extends BaseProps {
  variant: AlertVariant
  title: string
  description?: string
  onDismiss?: () => void
}

export function Alert({
  variant,
  title,
  description,
  onDismiss,
  className,
  style,
  'data-testid': testId,
}: AlertProps) {
  const IconComponent = ICONS[variant]

  return (
    <div
      role="alert"
      className={cn(styles.alert, styles[variant], className)}
      style={style}
      data-testid={testId}
    >
      <IconComponent size={16} aria-hidden="true" className={styles.icon} />

      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Cerrar alerta"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
```

Create `src/components/Alert/index.ts`:

```typescript
export { Alert } from './Alert'
export type { } from './Alert'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Alert/Alert.test.tsx` — 10 tests passing. Paste the full output.

- [ ] **Step 6: Write stories**

Create `src/components/Alert/Alert.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Wave 3 — Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bloque de alerta semántica en línea. Reference: `preview/components-alerts.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    variant: 'success',
    title: 'Campaña enviada correctamente',
    description: 'Tu campaña fue programada para envío inmediato.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert
        variant="success"
        title="Campaña enviada correctamente"
        description="Tu campaña fue programada para envío inmediato."
      />
      <Alert
        variant="error"
        title="Error al procesar el pago"
        description="Verifica los datos de tu método de pago e intenta de nuevo."
      />
      <Alert
        variant="warning"
        title="Límite de contactos próximo"
        description="Has usado el 90 % de tu cuota mensual de contactos."
      />
      <Alert
        variant="info"
        title="Procesamiento en curso"
        description="El archivo se está cargando. Esto puede tomar unos minutos."
      />
    </div>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert variant="success" title="Registro guardado" />
      <Alert variant="error" title="No se pudo eliminar el contacto" />
    </div>
  ),
}

export const Dismissible: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Alert
        variant="warning"
        title="Límite de contactos próximo"
        description="Has usado el 90 % de tu cuota."
        onDismiss={() => {}}
      />
      <Alert
        variant="info"
        title="Procesamiento en curso"
        onDismiss={() => {}}
      />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    variant: 'success',
    title: 'Haz clic en × para cerrar',
    onDismiss: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dismissBtn = canvas.getByRole('button', { name: /cerrar/i })
    await expect(dismissBtn).toBeVisible()
    await userEvent.click(dismissBtn)
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
open design-system-reference/preview/components-alerts.html
```

Open Storybook → `Wave 3 — Feedback / Alert / AllVariants`.
Open `preview/components-alerts.html` at 700px.
Verify side-by-side:
- Left accent bar 4px solid, matches variant border color
- Background: success green-50, error red-50, warning amber-50, info blue-50
- Title: bold, variant-specific color
- Description: muted, darker variant-specific color
- Icon: matches variant (CheckCircle / XCircle / AlertTriangle / Info)
- Dismiss ×: top-right, small, same color as title

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Alert/Alert.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as AlertStories from './Alert.stories'

<Meta of={AlertStories} />

# Alert

Bloque de alerta semántica en línea. Comunica resultados de operaciones, advertencias
o información contextual. No desaparece automáticamente — usa `Toast` para notificaciones transitorias.

**Referencia:** `preview/components-alerts.html`

## Variantes

| Variante | Uso |
|----------|-----|
| `success` | Operación completada con éxito |
| `error` | Fallo que requiere atención |
| `warning` | Situación que puede requerir acción |
| `info` | Información contextual neutral |

## Cuándo usar Alert vs Toast

- **Alert:** el usuario necesita leer el mensaje antes de continuar; el mensaje es consecuencia de una acción de la página actual.
- **Toast:** notificación transitoria de fondo; el usuario no tiene que tomar acción.

<Canvas of={AlertStories.AllVariants} />
<Controls of={AlertStories.Default} />

## Accesibilidad

- `role="alert"` activa anuncio automático de lectores de pantalla.
- El botón de cierre tiene `aria-label="Cerrar alerta"`.
- El ícono es `aria-hidden="true"` — solo decorativo.

## Personalización de tokens

```css
/* Sobrescribir en la hoja de estilos del producto */
.my-page .alert-override {
  --yes-color-success-subtle: #F0FFF4;
  --yes-size-alert-accent: 6px;
}
```
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment or add:
```typescript
export { Alert } from './components/Alert'
```

```bash
pnpm build && pnpm check-dist
```

Expected: build succeeds, `dist/index.js` contains `Alert`.

- [ ] **Step 10: Commit**

```bash
git add src/components/Alert/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-3): agregar componente Alert"
```

---

## Task 2: Toast

**Reference:** `preview/components-alerts.html` — toast section (dark card, fixed position)
**Translation passes:**
- Toast background: `#1F2937` → `--yes-primitive-neutral-800` → add `--yes-color-toast-bg`
- Toast text: `#F9FAFB` → `--yes-primitive-neutral-50` → add `--yes-color-toast-fg`
- Toast padding: `12px 16px` → `--yes-space-3` / `--yes-space-4`
- Toast border-radius: `8px` → `--yes-radius-card`
- Toast shadow: `0 10px 15px -3px rgba(0,0,0,0.2)` → `--yes-shadow-lg`
- Max-width: `360px` → add `--yes-size-toast-max-width: 360px`
- font-size: `14px` → `--yes-text-sm`
- font-weight for message: `500` → `--yes-weight-medium`
- Close button color: `#6B7280` → `--yes-color-text-muted`
- Container: fixed, bottom-right, gap between toasts 8px
- Z-index: `--yes-z-toast` (already in semantic.css)
- Auto-dismiss: 4000ms default
- Max 3 toasts visible simultaneously

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Toast/Toast.tsx`
- Create: `src/components/Toast/Toast.module.css`
- Create: `src/components/Toast/ToastContainer.tsx`
- Create: `src/components/Toast/useToast.ts`
- Create: `src/components/Toast/Toast.test.tsx`
- Create: `src/components/Toast/Toast.stories.tsx`
- Create: `src/components/Toast/Toast.mdx`
- Create: `src/components/Toast/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add Toast tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the Alert block:

```css
  /* ── Toast ───────────────────────────────────────────────── */
  --yes-color-toast-bg:        var(--yes-primitive-neutral-800);
  --yes-color-toast-fg:        var(--yes-primitive-neutral-50);
  --yes-color-toast-close:     var(--yes-primitive-neutral-400);
  --yes-size-toast-max-width:  360px;
  --yes-size-toast-gap:        var(--yes-space-2);
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Toast/Toast.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Toast } from './Toast'
import { ToastContainer } from './ToastContainer'
import { useToast } from './useToast'
import { renderHook } from '@testing-library/react'

describe('Toast', () => {
  it('renders message', () => {
    render(
      <Toast id="t1" variant="success" title="Registro guardado" onDismiss={() => {}} />
    )
    expect(screen.getByText('Registro guardado')).toBeInTheDocument()
  })

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'renders %s variant without crashing',
    (variant) => {
      render(
        <Toast id="t1" variant={variant} title="Prueba" onDismiss={() => {}} />
      )
      expect(screen.getByRole('status')).toBeInTheDocument()
    }
  )

  it('has role="status"', () => {
    render(<Toast id="t1" variant="info" title="Info" onDismiss={() => {}} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders dismiss button', () => {
    render(<Toast id="t1" variant="success" title="Éxito" onDismiss={() => {}} />)
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Toast id="t1" variant="error" title="Error" onDismiss={onDismiss} />)
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onDismiss).toHaveBeenCalledWith('t1')
  })

  it('passes data-testid to root', () => {
    render(
      <Toast id="t1" variant="info" title="Info" onDismiss={() => {}} data-testid="my-toast" />
    )
    expect(screen.getByTestId('my-toast')).toBeInTheDocument()
  })
})

describe('Toast — auto-dismiss', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('calls onDismiss after default 4000ms', () => {
    const onDismiss = vi.fn()
    render(<Toast id="t1" variant="success" title="Auto" onDismiss={onDismiss} />)
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(4000) })
    expect(onDismiss).toHaveBeenCalledWith('t1')
  })

  it('calls onDismiss after custom duration', () => {
    const onDismiss = vi.fn()
    render(<Toast id="t1" variant="info" title="Custom" onDismiss={onDismiss} duration={2000} />)
    act(() => { vi.advanceTimersByTime(1999) })
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(1) })
    expect(onDismiss).toHaveBeenCalledWith('t1')
  })
})

describe('useToast', () => {
  it('adds a toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.toast({ variant: 'success', title: 'Hola' })
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Hola')
  })

  it('dismisses a toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.toast({ variant: 'success', title: 'Prueba' })
    })
    const id = result.current.toasts[0].id
    act(() => {
      result.current.dismiss(id)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('caps at 3 toasts — oldest removed when 4th arrives', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.toast({ variant: 'success', title: 'Primero' })
      result.current.toast({ variant: 'info', title: 'Segundo' })
      result.current.toast({ variant: 'warning', title: 'Tercero' })
      result.current.toast({ variant: 'error', title: 'Cuarto' })
    })
    expect(result.current.toasts).toHaveLength(3)
    expect(result.current.toasts[0].title).toBe('Segundo')
    expect(result.current.toasts[2].title).toBe('Cuarto')
  })
})

describe('ToastContainer', () => {
  it('renders no toasts when list is empty', () => {
    render(<ToastContainer toasts={[]} onDismiss={() => {}} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders all provided toasts', () => {
    const toasts = [
      { id: 't1', variant: 'success' as const, title: 'Uno' },
      { id: 't2', variant: 'error' as const, title: 'Dos' },
    ]
    render(<ToastContainer toasts={toasts} onDismiss={() => {}} />)
    expect(screen.getAllByRole('status')).toHaveLength(2)
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Toast'" (and similar). Paste the full output.

- [ ] **Step 4: Implement useToast**

Create `src/components/Toast/useToast.ts`:

```typescript
import { useState, useCallback } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

interface ToastInput {
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

const MAX_TOASTS = 3

let counter = 0
function nextId(): string {
  counter += 1
  return `toast-${counter}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((input: ToastInput) => {
    const item: ToastItem = { ...input, id: nextId() }
    setToasts((prev) => {
      const next = [...prev, item]
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
```

- [ ] **Step 5: Implement Toast**

Create `src/components/Toast/Toast.module.css`:

```css
.toast {
  display: flex;
  gap: var(--yes-space-3);
  align-items: center;
  padding: var(--yes-space-3) var(--yes-space-4);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-lg);
  font-size: var(--yes-text-sm);
  max-width: var(--yes-size-toast-max-width);
  width: 100%;
  position: relative;
  background: var(--yes-color-toast-bg);
  color: var(--yes-color-toast-fg);
  animation: slideIn var(--yes-duration-base) var(--yes-ease-out);
}

@keyframes slideIn {
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.message {
  flex: 1;
  font-weight: var(--yes-weight-medium);
}

.description {
  font-size: var(--yes-text-xs);
  opacity: 0.8;
  margin-top: 2px;
}

.dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: var(--yes-color-toast-close);
  border-radius: var(--yes-radius-sm);
  transition: color var(--yes-duration-fast) var(--yes-ease);
  flex-shrink: 0;
}

.dismiss:hover {
  color: var(--yes-color-toast-fg);
}

/* ── Variant accent strip (left border) ── */
.success { border-left: 3px solid var(--yes-color-success); }
.error   { border-left: 3px solid var(--yes-color-danger); }
.warning { border-left: 3px solid var(--yes-color-warning); }
.info    { border-left: 3px solid var(--yes-color-info); }

.success .icon { color: var(--yes-color-success); }
.error   .icon { color: var(--yes-color-danger); }
.warning .icon { color: var(--yes-color-warning); }
.info    .icon { color: var(--yes-color-info); }
```

Create `src/components/Toast/Toast.tsx`:

```tsx
import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import type { ToastVariant } from './useToast'
import styles from './Toast.module.css'

const ICONS: Record<ToastVariant, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' | 'false'; className?: string }>> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

interface ToastProps extends BaseProps {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
  onDismiss: (id: string) => void
}

export function Toast({
  id,
  variant,
  title,
  description,
  duration = 4000,
  onDismiss,
  className,
  style,
  'data-testid': testId,
}: ToastProps) {
  const IconComponent = ICONS[variant]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(styles.toast, styles[variant], className)}
      style={style}
      data-testid={testId}
    >
      <IconComponent size={16} aria-hidden="true" className={styles.icon} />

      <div className={styles.message}>
        <span>{title}</span>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      <button
        type="button"
        className={styles.dismiss}
        onClick={() => onDismiss(id)}
        aria-label="Cerrar notificación"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Implement ToastContainer**

Create `src/components/Toast/ToastContainer.tsx`:

```tsx
import styles from './Toast.module.css'
import { Toast } from './Toast'
import type { ToastItem } from './useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notificaciones"
      style={{
        position: 'fixed',
        bottom: 'var(--yes-space-6)',
        right: 'var(--yes-space-6)',
        zIndex: 'var(--yes-z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--yes-size-toast-gap)',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            id={t.id}
            variant={t.variant}
            title={t.title}
            description={t.description}
            duration={t.duration}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  )
}
```

Create `src/components/Toast/index.ts`:

```typescript
export { Toast } from './Toast'
export { ToastContainer } from './ToastContainer'
export { useToast } from './useToast'
export type { ToastItem, ToastVariant } from './useToast'
```

- [ ] **Step 7: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Toast/Toast.test.tsx` — all tests passing. Paste the full output.

- [ ] **Step 8: Write stories**

Create `src/components/Toast/Toast.stories.tsx`:

```tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { Toast } from './Toast'
import { ToastContainer } from './ToastContainer'
import { useToast } from './useToast'

const meta: Meta<typeof Toast> = {
  title: 'Wave 3 — Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Notificación flotante transitoria. Se apila en la esquina inferior derecha. Auto-cierre a los 4 segundos. Reference: `preview/components-alerts.html` — sección Toast.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  args: {
    id: 'demo',
    variant: 'success',
    title: 'Registro guardado correctamente',
    onDismiss: () => {},
    duration: 99999,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
      <Toast id="s" variant="success" title="Registro guardado" onDismiss={() => {}} duration={99999} />
      <Toast id="e" variant="error" title="Error al eliminar el contacto" onDismiss={() => {}} duration={99999} />
      <Toast id="w" variant="warning" title="Cuota casi agotada" onDismiss={() => {}} duration={99999} />
      <Toast id="i" variant="info" title="Sincronización en progreso" onDismiss={() => {}} duration={99999} />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
      <Toast
        id="s"
        variant="success"
        title="Campaña enviada"
        description="3.400 contactos recibirán el mensaje en los próximos minutos."
        onDismiss={() => {}}
        duration={99999}
      />
    </div>
  ),
}

function ToastDemo() {
  const { toasts, toast, dismiss } = useToast()
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" onClick={() => toast({ variant: 'success', title: 'Éxito', description: 'Operación completada.' })}>
          Éxito
        </button>
        <button type="button" onClick={() => toast({ variant: 'error', title: 'Error', description: 'Algo salió mal.' })}>
          Error
        </button>
        <button type="button" onClick={() => toast({ variant: 'warning', title: 'Advertencia' })}>
          Advertencia
        </button>
        <button type="button" onClick={() => toast({ variant: 'info', title: 'Información' })}>
          Info
        </button>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export const LiveDemo: Story = {
  render: () => <ToastDemo />,
  parameters: { layout: 'fullscreen' },
}

export const Interactive: Story = {
  args: {
    id: 'test-toast',
    variant: 'success',
    title: 'Registro guardado',
    onDismiss: () => {},
    duration: 99999,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toast = canvas.getByRole('status')
    await expect(toast).toBeVisible()
    const btn = canvas.getByRole('button', { name: /cerrar/i })
    await userEvent.click(btn)
  },
}
```

- [ ] **Step 9: VISUAL GATE — human checkpoint**

```bash
pnpm dev
open design-system-reference/preview/components-alerts.html
```

Open Storybook → `Wave 3 — Feedback / Toast / AllVariants`.
Open `preview/components-alerts.html` — scroll to toast section.
Verify side-by-side:
- Dark background `#1F2937`, light text
- Variant-colored left accent strip (3px)
- Variant-colored icon
- Close button (×) in muted gray
- Max-width ≈ 360px, padding 12px 16px, border-radius 8px
- Heavy shadow

**Sign off before continuing.**

- [ ] **Step 10: Write MDX docs**

Create `src/components/Toast/Toast.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ToastStories from './Toast.stories'

<Meta of={ToastStories} />

# Toast

Notificación flotante transitoria. Se posiciona en la esquina inferior derecha y desaparece automáticamente.
Para alertas persistentes que requieren atención del usuario, usa `Alert`.

**Referencia:** `preview/components-alerts.html` — sección Toast

## Cuándo usar Toast vs Alert

- **Toast:** notificación de fondo que no interrumpe el flujo; desaparece sola.
- **Alert:** mensaje que el usuario debe leer antes de continuar; persiste hasta que se descarte.

## Uso con useToast

```tsx
import { ToastContainer, useToast } from '@yes/ui'

function MyPage() {
  const { toasts, toast, dismiss } = useToast()

  return (
    <>
      <button onClick={() => toast({ variant: 'success', title: 'Guardado' })}>
        Guardar
      </button>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
```

## Límite de toasts

`useToast` mantiene un máximo de 3 toasts simultáneos. Al llegar el cuarto, el más antiguo se elimina automáticamente.

<Canvas of={ToastStories.AllVariants} />
<Controls of={ToastStories.Default} />

## Accesibilidad

- `role="status"` + `aria-live="polite"` anuncia el mensaje en lectores de pantalla sin interrumpir.
- El botón de cierre tiene `aria-label="Cerrar notificación"`.
```

- [ ] **Step 11: Export and build**

In `src/index.ts`, uncomment or add:
```typescript
export { Toast, ToastContainer, useToast } from './components/Toast'
export type { ToastItem, ToastVariant } from './components/Toast'
```

```bash
pnpm build && pnpm check-dist
```

Expected: build succeeds, `dist/index.js` contains `Toast`, `ToastContainer`, `useToast`.

- [ ] **Step 12: Commit**

```bash
git add src/components/Toast/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-3): agregar componentes Toast, ToastContainer y hook useToast"
```

---

## Task 3: Skeleton

**Reference:** *(no dedicated preview file)* — follow `spacing-scale.html` proportions.
**Design intent:** gray rectangle with shimmer animation (linear-gradient moving left-to-right). Used as a placeholder while content loads.
**Translation passes:**
- Background: `#E5E7EB` → `--yes-color-border` (neutral-200)
- Shimmer highlight: `rgba(255,255,255,0.6)` → inline in keyframe (no token needed)
- Default height: 16px → `--yes-space-4`
- Default border-radius: `--yes-radius-sm` (4px)
- Animation: `@keyframes shimmer` — background-position from `-200%` to `200%`, duration 1.5s, linear, infinite
- gradient: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/Skeleton/Skeleton.tsx`
- Create: `src/components/Skeleton/Skeleton.module.css`
- Create: `src/components/Skeleton/Skeleton.test.tsx`
- Create: `src/components/Skeleton/Skeleton.stories.tsx`
- Create: `src/components/Skeleton/Skeleton.mdx`
- Create: `src/components/Skeleton/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add Skeleton tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the Toast block:

```css
  /* ── Skeleton ────────────────────────────────────────────── */
  --yes-color-skeleton-base:    var(--yes-primitive-neutral-200);
  --yes-size-skeleton-height:   var(--yes-space-4);          /* 16px default */
  --yes-duration-skeleton:      1.5s;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Skeleton/Skeleton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders without crashing', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('defaults to 100% width and 16px height', () => {
    render(<Skeleton data-testid="sk" />)
    const el = screen.getByTestId('sk')
    expect(el).toHaveStyle({ width: '100%', height: '16px' })
  })

  it('accepts custom width as string', () => {
    render(<Skeleton width="200px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ width: '200px' })
  })

  it('accepts custom width as number (converts to px)', () => {
    render(<Skeleton width={120} data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ width: '120px' })
  })

  it('accepts custom height as string', () => {
    render(<Skeleton height="48px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ height: '48px' })
  })

  it('accepts custom height as number', () => {
    render(<Skeleton height={32} data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ height: '32px' })
  })

  it('accepts custom borderRadius', () => {
    render(<Skeleton borderRadius="9999px" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveStyle({ borderRadius: '9999px' })
  })

  it('applies custom className', () => {
    render(<Skeleton className="extra" data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveClass('extra')
  })

  it('has aria-hidden to exclude from screen readers', () => {
    render(<Skeleton data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Skeleton'". Paste the full output.

- [ ] **Step 4: Implement Skeleton**

Create `src/components/Skeleton/Skeleton.module.css`:

```css
.skeleton {
  display: block;
  background-color: var(--yes-color-skeleton-base);
  border-radius: var(--yes-radius-sm);
  overflow: hidden;
  position: relative;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer var(--yes-duration-skeleton) linear infinite;
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
```

Create `src/components/Skeleton/Skeleton.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './Skeleton.module.css'

interface SkeletonProps extends BaseProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
}

function toPx(val: string | number | undefined, defaultVal: string): string {
  if (val === undefined) return defaultVal
  return typeof val === 'number' ? `${val}px` : val
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className,
  style,
  'data-testid': testId,
}: SkeletonProps) {
  const computedStyle: React.CSSProperties = {
    width:  toPx(width, '100%'),
    height: toPx(height, '16px'),
    ...(borderRadius ? { borderRadius } : {}),
    ...style,
  }

  return (
    <span
      className={cn(styles.skeleton, className)}
      style={computedStyle}
      data-testid={testId}
      aria-hidden="true"
    />
  )
}
```

Create `src/components/Skeleton/index.ts`:

```typescript
export { Skeleton } from './Skeleton'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Skeleton/Skeleton.test.tsx` — 9 tests passing. Paste the full output.

- [ ] **Step 6: Write stories**

Create `src/components/Skeleton/Skeleton.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Wave 3 — Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Marcador de posición animado para contenido en carga. Rectángulo gris con efecto shimmer. No hay archivo de referencia dedicado — sigue las proporciones de `spacing-scale.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: { width: '100%', height: 16 },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Skeleton height={16} />
      <Skeleton height={12} width="60%" />
      <Skeleton height={40} borderRadius="8px" />
      <Skeleton height={120} borderRadius="8px" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={40} height={40} borderRadius="9999px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={14} />
          <Skeleton height={12} width="70%" />
        </div>
      </div>
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ width: 320, padding: 16, border: '1px solid #E5E7EB', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Skeleton width={48} height={48} borderRadius="9999px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={14} />
          <Skeleton height={12} width="50%" />
        </div>
      </div>
      <Skeleton height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={12} width="75%" />
    </div>
  ),
}

export const TableRowSkeleton: Story = {
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
          <Skeleton width={32} height={32} borderRadius="9999px" />
          <Skeleton height={12} width={160} />
          <Skeleton height={12} width={100} />
          <Skeleton height={12} width={80} />
          <Skeleton height={20} width={60} borderRadius="9999px" />
        </div>
      ))}
    </div>
  ),
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 3 — Feedback / Skeleton / AllVariants`.
Verify:
- Gray base color matches `#E5E7EB` (neutral-200)
- Shimmer animation plays smoothly left-to-right
- `CardSkeleton` story looks like a realistic loading card
- No animation jank or flicker

Open `Wave 3 — Feedback / Skeleton / CardSkeleton` — confirm it matches the proportions of a real card component.

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Skeleton/Skeleton.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as SkeletonStories from './Skeleton.stories'

<Meta of={SkeletonStories} />

# Skeleton

Marcador de posición animado con efecto shimmer. Sustituye visualmente el contenido mientras se carga.
Siempre debe tener las mismas dimensiones que el contenido que reemplaza.

## Uso básico

```tsx
import { Skeleton } from '@yes/ui'

// Placeholder para una línea de texto
<Skeleton height={14} />

// Placeholder para un avatar circular
<Skeleton width={40} height={40} borderRadius="9999px" />

// Placeholder para una card
<Skeleton height={120} borderRadius="8px" />
```

## Patrones comunes

Combina múltiples `Skeleton` para replicar la estructura del contenido real:

<Canvas of={SkeletonStories.CardSkeleton} />
<Canvas of={SkeletonStories.TableRowSkeleton} />
<Controls of={SkeletonStories.Default} />

## Accesibilidad

`aria-hidden="true"` — los lectores de pantalla ignoran el skeleton.
Asegúrate de que la región que contiene los skeletons tenga `aria-busy="true"` mientras carga.

```tsx
<section aria-busy={isLoading} aria-label="Tabla de contactos">
  {isLoading ? <TableRowSkeleton /> : <ContactsTable />}
</section>
```
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment or add:
```typescript
export { Skeleton } from './components/Skeleton'
```

```bash
pnpm build && pnpm check-dist
```

Expected: build succeeds, `dist/index.js` contains `Skeleton`.

- [ ] **Step 10: Commit**

```bash
git add src/components/Skeleton/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-3): agregar componente Skeleton con animación shimmer"
```

---

## Task 4: EmptyState

**Reference:** `preview/components-cards.html` — empty state card section
**Translation passes:**
- Container: centered, max-width 320px, padding `--yes-space-8` vertical
- Icon size: 40px → add `--yes-size-empty-icon: 40px`
- Icon color: muted → `--yes-color-text-subtle` (neutral-400, `#9CA3AF`)
- Title: `h3`, Barlow heading, font-weight 600, `--yes-text-base`, `--yes-color-text` (neutral-900)
- Description: `--yes-text-sm`, `--yes-color-text-muted` (neutral-500), max-width 280px
- Gap between icon / title / description / action: `--yes-space-3` (`12px`)
- Action: renders `Button` from Wave 1, tone `primary`, size `md`
- All elements centered (text-align center, flexbox column center)

**Files:**
- Modify: `src/tokens/semantic.css`
- Create: `src/components/EmptyState/EmptyState.tsx`
- Create: `src/components/EmptyState/EmptyState.module.css`
- Create: `src/components/EmptyState/EmptyState.test.tsx`
- Create: `src/components/EmptyState/EmptyState.stories.tsx`
- Create: `src/components/EmptyState/EmptyState.mdx`
- Create: `src/components/EmptyState/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add EmptyState tokens to semantic.css**

Open `src/tokens/semantic.css`. Add after the Skeleton block:

```css
  /* ── EmptyState ──────────────────────────────────────────── */
  --yes-size-empty-icon:    40px;
  --yes-size-empty-max-w:   320px;
  --yes-size-empty-desc-w:  280px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/EmptyState/EmptyState.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Inbox } from 'lucide-react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Sin contactos" />)
    expect(screen.getByRole('heading', { name: 'Sin contactos' })).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Sin resultados" description="Intenta con otro filtro." />)
    expect(screen.getByText('Intenta con otro filtro.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<EmptyState title="Sin datos" />)
    expect(screen.queryByText(/intenta/i)).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Sin datos" icon={Inbox} data-testid="es" />)
    const root = screen.getByTestId('es')
    expect(root.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render icon section when icon omitted', () => {
    render(<EmptyState title="Sin datos" data-testid="es" />)
    const root = screen.getByTestId('es')
    expect(root.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders action button when action provided', () => {
    render(
      <EmptyState
        title="Sin contactos"
        action={{ label: 'Importar contactos', onClick: () => {} }}
      />
    )
    expect(screen.getByRole('button', { name: 'Importar contactos' })).toBeInTheDocument()
  })

  it('does not render action button when action omitted', () => {
    render(<EmptyState title="Sin datos" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls action.onClick when button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <EmptyState
        title="Sin contactos"
        action={{ label: 'Importar', onClick }}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Importar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes data-testid to root element', () => {
    render(<EmptyState title="Sin datos" data-testid="my-empty" />)
    expect(screen.getByTestId('my-empty')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<EmptyState title="Sin datos" className="extra" data-testid="my-empty" />)
    expect(screen.getByTestId('my-empty')).toHaveClass('extra')
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './EmptyState'". Paste the full output.

- [ ] **Step 4: Implement EmptyState**

Create `src/components/EmptyState/EmptyState.module.css`:

```css
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: var(--yes-size-empty-max-w);
  gap: var(--yes-space-3);
  padding: var(--yes-space-8) var(--yes-space-4);
}

.iconWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--yes-color-text-subtle);
  width: var(--yes-size-empty-icon);
  height: var(--yes-size-empty-icon);
  flex-shrink: 0;
}

.title {
  font-family: var(--yes-font-heading);
  font-size: var(--yes-text-base);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text);
  margin: 0;
  line-height: var(--yes-leading-snug);
}

.description {
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-muted);
  max-width: var(--yes-size-empty-desc-w);
  line-height: var(--yes-leading-normal);
  margin: 0;
}
```

Create `src/components/EmptyState/EmptyState.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import { Button } from '../Button/Button'
import styles from './EmptyState.module.css'

interface EmptyStateProps extends BaseProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
  className,
  style,
  'data-testid': testId,
}: EmptyStateProps) {
  return (
    <div
      className={cn(styles.root, className)}
      style={style}
      data-testid={testId}
    >
      {IconComponent && (
        <div className={styles.iconWrap} aria-hidden="true">
          <IconComponent size={40} strokeWidth={1.5} />
        </div>
      )}

      <h3 className={styles.title}>{title}</h3>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      {action && (
        <Button tone="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

Create `src/components/EmptyState/index.ts`:

```typescript
export { EmptyState } from './EmptyState'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/EmptyState/EmptyState.test.tsx` — 10 tests passing. Paste the full output.

- [ ] **Step 6: Write stories**

Create `src/components/EmptyState/EmptyState.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Inbox, SearchX, Users, FileText, CloudOff } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Wave 3 — Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Estado vacío con ícono, título, descripción opcional y acción opcional. Reference: `preview/components-cards.html` — sección empty state.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: Inbox,
    title: 'Sin contactos',
    description: 'Importa tu lista de contactos para comenzar a enviar campañas.',
    action: { label: 'Importar contactos', onClick: () => {} },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
      <EmptyState
        icon={Inbox}
        title="Sin contactos"
        description="Importa tu lista de contactos para comenzar."
        action={{ label: 'Importar contactos', onClick: () => {} }}
      />
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description="Intenta con otros términos de búsqueda o ajusta los filtros."
      />
      <EmptyState
        icon={CloudOff}
        title="Sin conexión"
        description="Verifica tu conexión a internet e intenta de nuevo."
        action={{ label: 'Reintentar', onClick: () => {} }}
      />
      <EmptyState
        icon={FileText}
        title="Sin reportes"
        description="Los reportes aparecerán aquí cuando ejecutes una campaña."
      />
      <EmptyState
        title="Sin datos"
      />
    </div>
  ),
}

export const WithoutIcon: Story = {
  args: {
    title: 'Sin actividad reciente',
    description: 'Las interacciones de tus contactos aparecerán aquí.',
  },
}

export const WithoutAction: Story = {
  args: {
    icon: Users,
    title: 'Sin agentes asignados',
    description: 'Este grupo no tiene agentes. Contacta a tu administrador.',
  },
}

export const Interactive: Story = {
  args: {
    icon: Inbox,
    title: 'Sin contactos',
    description: 'Importa tu lista de contactos.',
    action: { label: 'Importar contactos', onClick: () => {} },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { name: 'Sin contactos' })
    await expect(heading).toBeVisible()
    const btn = canvas.getByRole('button', { name: 'Importar contactos' })
    await expect(btn).toBeVisible()
    await userEvent.click(btn)
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
open design-system-reference/preview/components-cards.html
```

Open Storybook → `Wave 3 — Feedback / EmptyState / AllVariants`.
Open `preview/components-cards.html` — scroll to the empty state section.
Verify side-by-side:
- All elements centered horizontally
- Icon: 40px, stroke-width thin (1.5), muted gray `#9CA3AF`
- Title: Barlow, semibold, neutral-900 text
- Description: 14px, muted neutral-500, max-width ≈ 280px
- Action button: YES primary blue, correct height 36px, radius 6px
- Comfortable vertical spacing between icon/title/description/button

**Sign off before continuing.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/EmptyState/EmptyState.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as EmptyStateStories from './EmptyState.stories'

<Meta of={EmptyStateStories} />

# EmptyState

Comunica al usuario que no hay datos que mostrar en una sección. Siempre incluye un título claro y,
cuando es posible, una descripción que explique qué hacer para poblar el espacio.

**Referencia:** `preview/components-cards.html` — sección empty state card

## Cuándo incluir cada elemento

| Elemento | Cuándo usar |
|----------|------------|
| `icon` | Siempre que tengas un ícono relevante. Ayuda a reconocer el contexto. |
| `description` | Cuando el estado vacío necesita explicación o instrucción. |
| `action` | Cuando existe una acción directa para resolver el estado vacío. |

## Uso

```tsx
import { EmptyState } from '@yes/ui'
import { Inbox } from 'lucide-react'

<EmptyState
  icon={Inbox}
  title="Sin contactos"
  description="Importa tu lista de contactos para comenzar a enviar campañas."
  action={{ label: 'Importar contactos', onClick: handleImport }}
/>
```

<Canvas of={EmptyStateStories.AllVariants} />
<Controls of={EmptyStateStories.Default} />

## Accesibilidad

- El título se renderiza como `<h3>`. Asegúrate de que sea coherente con la jerarquía de la página.
- El ícono es `aria-hidden="true"` — solo decorativo.
- El botón de acción sigue las reglas estándar de `Button`.
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment or add:
```typescript
export { EmptyState } from './components/EmptyState'
```

```bash
pnpm build && pnpm check-dist
```

Expected: build succeeds, `dist/index.js` contains `EmptyState`.

- [ ] **Step 10: Commit**

```bash
git add src/components/EmptyState/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-3): agregar componente EmptyState"
```

---

## Task 5: Wave 3 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all 4 Wave 3 component test files passing, 0 failures.
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

- [ ] **Step 3: Verify all Wave 3 exports are present**

```bash
node -e "
const lib = require('./dist/index.cjs');
const expected = ['Alert', 'Toast', 'ToastContainer', 'useToast', 'Skeleton', 'EmptyState'];
const missing = expected.filter(n => !lib[n]);
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 3 exports present');
"
```

Expected: `All Wave 3 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
pnpm dev
```

Open each story group in order:
- Wave 3 — Feedback / Alert / AllVariants
- Wave 3 — Feedback / Alert / Dismissible
- Wave 3 — Feedback / Toast / AllVariants
- Wave 3 — Feedback / Toast / LiveDemo (click all 4 buttons, verify stacking + auto-dismiss)
- Wave 3 — Feedback / Skeleton / CardSkeleton
- Wave 3 — Feedback / Skeleton / TableRowSkeleton
- Wave 3 — Feedback / EmptyState / AllVariants

Verify no console errors. Every `AllVariants` story renders without errors.
Verify Toast `LiveDemo`: add 4 toasts quickly — oldest should auto-remove, max 3 visible.

- [ ] **Step 5: Tag Wave 3 release**

```bash
git tag v0.3.0
git commit --allow-empty -m "chore(release): wave 3 feedback — v0.3.0"
```

---

## Self-review notes

**Token additions in this wave** (added to `semantic.css`):
- Alert: `--yes-color-alert-accent-*`, `--yes-color-alert-desc-*`, `--yes-color-alert-title-info`, `--yes-size-alert-accent`, `--yes-size-alert-icon`
- Toast: `--yes-color-toast-bg`, `--yes-color-toast-fg`, `--yes-color-toast-close`, `--yes-size-toast-max-width`, `--yes-size-toast-gap`
- Skeleton: `--yes-color-skeleton-base`, `--yes-size-skeleton-height`, `--yes-duration-skeleton`
- EmptyState: `--yes-size-empty-icon`, `--yes-size-empty-max-w`, `--yes-size-empty-desc-w`

**Cross-wave dependencies:**
- `Alert` and `Toast` import Lucide icons directly (CheckCircle, XCircle, AlertTriangle, Info, X) — no Wave 1 `Icon` wrapper needed since size is fixed
- `EmptyState` imports `Button` from `../Button/Button` — Wave 1 must be shipped first
- `ToastContainer` uses inline style for `position: fixed` to avoid CSS Module scoping issues with `var(--yes-z-toast)` in a portal-like pattern

**Fake timer pattern** (Toast tests):
```typescript
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })
// ...
act(() => { vi.advanceTimersByTime(4000) })
```
Always wrap timer advancement in `act()` to flush React state updates.

**Accessibility summary:**
- Alert: `role="alert"` → announces immediately on mount
- Toast: `role="status"` + `aria-live="polite"` → announces without interrupting
- Skeleton: `aria-hidden="true"` → excluded from screen reader tree
- EmptyState: `<h3>` for title, `aria-hidden` icon, standard Button for action
