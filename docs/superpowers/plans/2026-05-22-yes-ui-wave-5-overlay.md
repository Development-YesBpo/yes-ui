# @yes/ui Wave 5 — Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the 3 Wave 5 Overlay components — Modal, Drawer, FilterPanel — as fully tested, Storybook-documented, visually validated `@yes/ui` exports.

**Architecture:** Each component lives in `src/components/{Name}/` with 6 required files (tsx, module.css, test, stories, mdx, index). All CSS values derive from `--yes-*` tokens only. Modal and Drawer use React Portal + `useFocusTrap`. FilterPanel is a floating panel (no focus trap, no portal required). Every component follows the translation passes → RED → GREEN → VISUAL gate protocol defined in CLAUDE.md.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Vitest 3 + RTL, Storybook 8, tsup (ESM+CJS), pnpm

**Dependencies:**
- `Modal` and `Drawer` import `useFocusTrap` from `../../hooks/useFocusTrap` (already built)
- `Modal` and `Drawer` import `Button` from Wave 1 for action buttons in stories
- `FilterPanel` imports `Checkbox` from Wave 2 (already available by Wave 5)

> **Node path note:** All `pnpm` commands require:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"
> ```
> Homebrew Node is broken (icu4c mismatch). Prefix every terminal session.

---

## File map

```
src/tokens/semantic.css              ← add --yes-color-scrim token (Task 1)

src/components/
├── Modal/
│   ├── Modal.tsx
│   ├── Modal.module.css
│   ├── Modal.test.tsx
│   ├── Modal.stories.tsx
│   ├── Modal.mdx
│   └── index.ts
├── Drawer/
│   ├── Drawer.tsx
│   ├── Drawer.module.css
│   ├── Drawer.test.tsx
│   ├── Drawer.stories.tsx
│   ├── Drawer.mdx
│   └── index.ts
└── FilterPanel/
    ├── FilterPanel.tsx
    ├── FilterPanel.module.css
    ├── FilterPanel.test.tsx
    ├── FilterPanel.stories.tsx
    ├── FilterPanel.mdx
    └── index.ts

src/index.ts                         ← uncomment exports per component
```

---

## Task 1: Modal

**Reference:** `design-system-reference/preview/components-modals.html` — confirmation modal section
**UI Kit reference:** none (pure design-system-reference)
**Translation passes:**
- Overlay: `rgba(0,0,0,0.45)` → `--yes-color-scrim` (add to semantic.css)
- Panel bg: `#fff` → `--yes-color-surface`
- Border radius: `12px` → `--yes-radius-modal`
- Shadow: `0 20px 25px -5px rgba(0,0,0,0.25)` → `--yes-shadow-xl`
- Header border: `#F3F4F6` → `--yes-color-border` (1px solid)
- Title: Barlow 17px 700 `#111827` → `--yes-font-heading`, `--yes-text-lg` (approx), `--yes-color-text`
- Close ×: 20px, `#9CA3AF` → `--yes-color-text-subtle`
- Body text: 14px, `#4B5563` → `--yes-color-text-secondary`
- Footer bg: `#FAFAFA` → `--yes-color-bg`
- Sizes: sm=400px, md=600px, lg=800px → `--yes-size-modal-sm/md/lg` (already in semantic.css)
- Z-index: `--yes-z-modal`

**Files:**
- Modify: `src/tokens/semantic.css` (add `--yes-color-scrim`)
- Create: `src/components/Modal/Modal.tsx`
- Create: `src/components/Modal/Modal.module.css`
- Create: `src/components/Modal/Modal.test.tsx`
- Create: `src/components/Modal/Modal.stories.tsx`
- Create: `src/components/Modal/Modal.mdx`
- Create: `src/components/Modal/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add scrim token to semantic.css**

Open `src/tokens/semantic.css`. Add after the `--yes-color-border-strong` line (or in the Colors section, with other scrim/overlay semantics):

```css
  /* ── Overlay / Scrim ─────────────────────────────────────── */
  --yes-color-scrim: rgba(0, 0, 0, 0.45);
```

- [ ] **Step 2: Write failing tests**

Create `src/components/Modal/Modal.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Eliminar registro',
  children: <p>Contenido del modal</p>,
}

describe('Modal', () => {
  it('renders children when open=true', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Contenido del modal')).toBeInTheDocument()
  })

  it('renders title in header', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Eliminar registro')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<Modal {...defaultProps} open={false} />)
    expect(screen.queryByText('Eliminar registro')).not.toBeInTheDocument()
  })

  it('calls onClose when × button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} data-testid="modal" />)
    await user.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when panel content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByText('Contenido del modal'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    render(<Modal {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing to the title', () => {
    render(<Modal {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Eliminar registro')
  })

  it('applies sm size class', () => {
    render(<Modal {...defaultProps} size="sm" data-testid="modal" />)
    const panel = screen.getByRole('dialog')
    expect(panel.className).toMatch(/sm/)
  })

  it('applies md size by default', () => {
    render(<Modal {...defaultProps} data-testid="modal" />)
    const panel = screen.getByRole('dialog')
    expect(panel.className).toMatch(/md/)
  })

  it('applies lg size class', () => {
    render(<Modal {...defaultProps} size="lg" data-testid="modal" />)
    const panel = screen.getByRole('dialog')
    expect(panel.className).toMatch(/lg/)
  })

  it('renders footer when footer prop is provided', () => {
    render(
      <Modal {...defaultProps} footer={<button type="button">Confirmar</button>} />
    )
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
  })

  it('does not render footer section when footer prop is omitted', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Modal'".

- [ ] **Step 4: Implement Modal**

Create `src/components/Modal/Modal.module.css`:

```css
.overlay {
  position: fixed;
  inset: 0;
  background: var(--yes-color-scrim);
  z-index: var(--yes-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--yes-space-6);
  /* Opacity + scale animation on open */
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--yes-duration-base) var(--yes-ease);
}

.overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.panel {
  background: var(--yes-color-surface);
  border-radius: var(--yes-radius-modal);
  box-shadow: var(--yes-shadow-xl);
  overflow: hidden;
  width: 100%;
  max-height: calc(100vh - var(--yes-space-12));
  display: flex;
  flex-direction: column;
  transform: scale(0.95);
  transition: transform var(--yes-duration-base) var(--yes-ease);
}

.overlay.open .panel {
  transform: scale(1);
}

.sm {
  max-width: var(--yes-size-modal-sm);
}

.md {
  max-width: var(--yes-size-modal-md);
}

.lg {
  max-width: var(--yes-size-modal-lg);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yes-space-4) var(--yes-space-5);
  border-bottom: 1px solid var(--yes-color-border);
  flex-shrink: 0;
}

.title {
  font-family: var(--yes-font-heading);
  font-size: 17px;
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text);
  line-height: 1.3;
}

.closeBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--yes-color-text-subtle);
  font-size: 20px;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: color var(--yes-duration-fast) var(--yes-ease);
}

.closeBtn:hover {
  color: var(--yes-color-text);
}

.body {
  padding: var(--yes-space-4) var(--yes-space-5);
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text-secondary);
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--yes-space-2);
  padding: var(--yes-space-3) var(--yes-space-5);
  border-top: 1px solid var(--yes-color-border);
  background: var(--yes-color-bg);
  flex-shrink: 0;
}
```

Create `src/components/Modal/Modal.tsx`:

```tsx
import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { BaseProps } from '../../types/shared'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps extends BaseProps {
  open: boolean
  onClose: () => void
  title: string
  size?: ModalSize
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
  style,
  'data-testid': testId,
}: ModalProps) {
  const titleId = useId()
  const panelRef = useFocusTrap(open) as React.RefObject<HTMLDivElement>

  // Escape key closes modal
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(styles.overlay, open && styles.open)}
      data-testid={testId ? `${testId}-overlay` : 'modal-overlay'}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(styles.panel, styles[size], className)}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer} data-testid="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
```

Create `src/components/Modal/index.ts`:

```typescript
export { Modal } from './Modal'
export type { ModalProps, ModalSize } from './Modal'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Modal/Modal.test.tsx` — 13 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/Modal/Modal.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta: Meta<typeof Modal> = {
  title: 'Wave 5 — Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Diálogo modal centrado con overlay. Cierra con Escape, clic en overlay o botón ×. Reference: `design-system-reference/preview/components-modals.html`',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button tone="primary" onClick={() => setOpen(true)}>Abrir modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Eliminar registro"
          footer={
            <>
              <Button tone="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button tone="danger" onClick={() => setOpen(false)}>Eliminar</Button>
            </>
          }
        >
          <p>
            Vas a eliminar el contacto <strong>Carlos Rodríguez</strong>. Esta acción no se
            puede deshacer y borrará todas las gestiones asociadas.
          </p>
        </Modal>
      </>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} tone="secondary" onClick={() => setSize(s)}>
            Abrir {s.toUpperCase()} ({s === 'sm' ? '400px' : s === 'md' ? '600px' : '800px'})
          </Button>
        ))}
        <Modal
          open={size !== null}
          onClose={() => setSize(null)}
          title={`Modal tamaño ${size?.toUpperCase() ?? ''}`}
          size={size ?? 'md'}
          footer={
            <Button tone="secondary" onClick={() => setSize(null)}>Cerrar</Button>
          }
        >
          <p>Contenido del modal con tamaño <strong>{size}</strong>.</p>
        </Modal>
      </div>
    )
  },
}

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button tone="danger" onClick={() => setOpen(true)}>Eliminar campaña</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Eliminar campaña"
          size="sm"
          footer={
            <>
              <Button tone="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button
                tone="danger"
                onClick={() => setOpen(false)}
                style={{ background: 'var(--yes-color-danger)' }}
              >
                Sí, eliminar
              </Button>
            </>
          }
        >
          <p>
            Esta acción es <strong>irreversible</strong>. Se eliminarán todos los contactos
            y registros de gestión asociados a esta campaña.
          </p>
        </Modal>
      </>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button tone="primary" onClick={() => setOpen(true)} data-testid="open-btn">
          Abrir modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal interactivo"
          data-testid="modal"
        >
          <p data-testid="modal-body">Contenido del modal de prueba.</p>
        </Modal>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open modal
    const openBtn = canvas.getByTestId('open-btn')
    await userEvent.click(openBtn)

    // Modal is visible
    await expect(canvas.getByTestId('modal-body')).toBeVisible()

    // Press Escape — modal closes
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByTestId('modal-body')).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 5 — Overlay / Modal / Default`.
Open `design-system-reference/preview/components-modals.html` in a browser.

Verify side-by-side:
- Overlay: `rgba(0,0,0,0.45)` dark scrim covers background
- Panel: white, 12px border radius, `box-shadow: 0 20px 25px -5px rgba(0,0,0,0.25)`
- Header: Barlow 17px bold title, `#9CA3AF` × close button
- Body: 14px Manrope, `#4B5563`
- Footer: `#FAFAFA` bg, buttons right-aligned with 8px gap
- sm/md/lg sizes visually distinct

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/Modal/Modal.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ModalStories from './Modal.stories'

<Meta of={ModalStories} />

# Modal

Diálogo modal centrado con overlay semitransparente. Atrapa el foco mientras está abierto
y cierra con Escape, clic en overlay, o botón ×.

**Referencia:** `design-system-reference/preview/components-modals.html`

## Cuándo usar

- Confirmaciones destructivas (eliminar, desactivar)
- Formularios breves que requieren contexto completo
- Alertas que necesitan respuesta inmediata

**No usar** para paneles laterales (usa `Drawer`) ni filtros flotantes (usa `FilterPanel`).

## Uso

```tsx
import { Modal, Button } from '@yes/ui'
import { useState } from 'react'

function EliminarContacto() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button tone="danger" onClick={() => setOpen(true)}>Eliminar</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Eliminar contacto"
        size="sm"
        footer={
          <>
            <Button tone="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button tone="danger" onClick={handleDelete}>Confirmar eliminación</Button>
          </>
        }
      >
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  )
}
```

## Accesibilidad

- `role="dialog"` + `aria-modal="true"` en el panel
- `aria-labelledby` apunta al `<h2>` del título
- Foco atrapado dentro del panel mientras está abierto (via `useFocusTrap`)
- Al cerrar, el foco regresa al elemento que abrió el modal
- Botón × tiene `aria-label="Cerrar"`

<Canvas of={ModalStories.Default} />
<Controls of={ModalStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Modal } from './components/Modal'
export type { ModalProps, ModalSize } from './components/Modal'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/Modal/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-5): agregar componente Modal"
```

---

## Task 2: Drawer

**Reference:** `design-system-reference/preview/components-modals.html` — panel lateral section
**UI Kit reference:** `crm/CRMApp.jsx` → `DetailPanel`
**Translation passes:**
- Slides from right: `transform: translateX(100%)` closed → `translateX(0)` open
- Same overlay as Modal: `--yes-color-scrim`, `--yes-z-modal`
- Panel bg: `#fff` → `--yes-color-surface`
- Border: `1px solid #E5E7EB` → `--yes-color-border`
- Border radius: `8px` on left corners only → `--yes-radius-card` (panel top-left + bottom-left)
- Shadow: `0 20px 25px -5px rgba(0,0,0,0.1)` → `--yes-shadow-xl`
- Header border: `#F3F4F6` → `--yes-color-border`
- Title: Barlow 15px 700 `#111827` → `--yes-font-heading`, `--yes-color-text`
- Footer border: `#F3F4F6` → `--yes-color-border`
- Sizes: md=480px, lg=640px → `--yes-size-drawer-md`, `--yes-size-drawer-lg` (already in semantic.css)

**Files:**
- Create: `src/components/Drawer/Drawer.tsx`
- Create: `src/components/Drawer/Drawer.module.css`
- Create: `src/components/Drawer/Drawer.test.tsx`
- Create: `src/components/Drawer/Drawer.stories.tsx`
- Create: `src/components/Drawer/Drawer.mdx`
- Create: `src/components/Drawer/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/components/Drawer/Drawer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Drawer } from './Drawer'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Detalle del contacto',
  children: <p>Contenido del drawer</p>,
}

describe('Drawer', () => {
  it('renders children when open=true', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.getByText('Contenido del drawer')).toBeInTheDocument()
  })

  it('renders title in header', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.getByText('Detalle del contacto')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<Drawer {...defaultProps} open={false} />)
    expect(screen.queryByText('Detalle del contacto')).not.toBeInTheDocument()
  })

  it('calls onClose when × button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByTestId('drawer-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when panel content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByText('Contenido del drawer'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing to the title', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Detalle del contacto')
  })

  it('applies md size class by default', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/md/)
  })

  it('applies lg size class', () => {
    render(<Drawer {...defaultProps} size="lg" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/lg/)
  })

  it('panel has translateX(0) transform when open', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    // open class must be present so CSS applies translateX(0)
    expect(dialog.className).toMatch(/open/)
  })

  it('renders footer when footer prop is provided', () => {
    render(
      <Drawer {...defaultProps} footer={<button type="button">Guardar</button>} />
    )
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('does not render footer section when footer prop is omitted', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.queryByTestId('drawer-footer')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './Drawer'".

- [ ] **Step 3: Implement Drawer**

Create `src/components/Drawer/Drawer.module.css`:

```css
.overlay {
  position: fixed;
  inset: 0;
  background: var(--yes-color-scrim);
  z-index: var(--yes-z-modal);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--yes-duration-base) var(--yes-ease);
}

.overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.panel {
  background: var(--yes-color-surface);
  border-left: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card) 0 0 var(--yes-radius-card);
  box-shadow: var(--yes-shadow-xl);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(100%);
  transition: transform var(--yes-duration-base) var(--yes-ease-out);
}

.panel.open {
  transform: translateX(0);
}

.md {
  width: var(--yes-size-drawer-md);
}

.lg {
  width: var(--yes-size-drawer-lg);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yes-space-3) var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-border);
  flex-shrink: 0;
}

.title {
  font-family: var(--yes-font-heading);
  font-size: 15px;
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text);
  line-height: 1.3;
}

.closeBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--yes-color-text-subtle);
  font-size: 18px;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: color var(--yes-duration-fast) var(--yes-ease);
}

.closeBtn:hover {
  color: var(--yes-color-text);
}

.body {
  padding: var(--yes-space-3) var(--yes-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-3);
  overflow-y: auto;
  flex: 1;
  font-size: var(--yes-text-sm);
  color: var(--yes-color-text);
}

.footer {
  display: flex;
  gap: var(--yes-space-2);
  padding: var(--yes-space-3) var(--yes-space-4);
  border-top: 1px solid var(--yes-color-border);
  flex-shrink: 0;
}
```

Create `src/components/Drawer/Drawer.tsx`:

```tsx
import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { BaseProps } from '../../types/shared'
import styles from './Drawer.module.css'

export type DrawerSize = 'md' | 'lg'

export interface DrawerProps extends BaseProps {
  open: boolean
  onClose: () => void
  title: string
  size?: DrawerSize
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Drawer({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
  style,
  'data-testid': testId,
}: DrawerProps) {
  const titleId = useId()
  const panelRef = useFocusTrap(open) as React.RefObject<HTMLDivElement>

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(styles.overlay, open && styles.open)}
      data-testid={testId ? `${testId}-overlay` : 'drawer-overlay'}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(styles.panel, styles[size], open && styles.open, className)}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer} data-testid="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
```

Create `src/components/Drawer/index.ts`:

```typescript
export { Drawer } from './Drawer'
export type { DrawerProps, DrawerSize } from './Drawer'
```

- [ ] **Step 4: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/Drawer/Drawer.test.tsx` — 14 tests passing.

- [ ] **Step 5: Write stories**

Create `src/components/Drawer/Drawer.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from '../Button'

const meta: Meta<typeof Drawer> = {
  title: 'Wave 5 — Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Panel lateral deslizante desde la derecha. Cierra con Escape, clic en overlay, o botón ×. Reference: `design-system-reference/preview/components-modals.html` → panel lateral.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ padding: 24 }}>
        <Button tone="secondary" onClick={() => setOpen(true)}>Ver detalle</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Detalle del contacto"
          footer={
            <>
              <Button tone="ghost" onClick={() => setOpen(false)}>Cerrar</Button>
              <Button tone="primary" onClick={() => setOpen(false)}>Guardar cambios</Button>
            </>
          }
        >
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>NOMBRE</p>
            <p style={{ fontWeight: 500 }}>Carlos Rodríguez</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>ESTADO</p>
            <p style={{ fontWeight: 500 }}>Activo</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--yes-color-text-subtle)', marginBottom: 4 }}>CAMPAÑA</p>
            <p style={{ fontWeight: 500 }}>Cobranza Junio 2026</p>
          </div>
        </Drawer>
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const [size, setSize] = useState<'md' | 'lg' | null>(null)
    return (
      <div style={{ padding: 24, display: 'flex', gap: 8 }}>
        {(['md', 'lg'] as const).map((s) => (
          <Button key={s} tone="secondary" onClick={() => setSize(s)}>
            Abrir {s.toUpperCase()} ({s === 'md' ? '480px' : '640px'})
          </Button>
        ))}
        <Drawer
          open={size !== null}
          onClose={() => setSize(null)}
          title={`Drawer ${size?.toUpperCase() ?? ''}`}
          size={size ?? 'md'}
          footer={
            <Button tone="ghost" onClick={() => setSize(null)}>Cerrar</Button>
          }
        >
          <p>Ancho del drawer: <strong>{size === 'md' ? '480px' : '640px'}</strong></p>
        </Drawer>
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: 24 }}>
        <Button
          tone="secondary"
          onClick={() => setOpen(true)}
          data-testid="open-drawer-btn"
        >
          Abrir drawer
        </Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Drawer interactivo"
          data-testid="drawer"
        >
          <p data-testid="drawer-body">Contenido del drawer de prueba.</p>
        </Drawer>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open drawer
    const openBtn = canvas.getByTestId('open-drawer-btn')
    await userEvent.click(openBtn)

    // Drawer is visible
    await expect(canvas.getByTestId('drawer-body')).toBeVisible()

    // Press Escape — drawer closes
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByTestId('drawer-body')).not.toBeInTheDocument()
  },
}
```

- [ ] **Step 6: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 5 — Overlay / Drawer / Default`.
Open `design-system-reference/preview/components-modals.html` in a browser → panel lateral section.

Verify side-by-side:
- Panel slides in from right (visible via Default story open state)
- Width: 480px (md) — matches reference
- Border radius only on left corners (8px)
- `box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)` — softer than modal
- Barlow 15px bold title
- Header/footer borders `#F3F4F6`
- Body sections: 11px uppercase labels, 14px 500 values

**Sign off before proceeding to Step 7.**

- [ ] **Step 7: Write MDX docs**

Create `src/components/Drawer/Drawer.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as DrawerStories from './Drawer.stories'

<Meta of={DrawerStories} />

# Drawer

Panel lateral deslizante desde la derecha. Muestra detalles de un registro o formularios
de edición sin abandonar el contexto de la lista.

**Referencia:** `design-system-reference/preview/components-modals.html` → panel lateral

## Cuándo usar

- Detalle de un contacto, campaña, o registro de tabla
- Edición de campos secundarios sin navegación completa
- Previsualización de contenido

**No usar** para confirmaciones (usa `Modal`) ni filtros (usa `FilterPanel`).

## Uso

```tsx
import { Drawer, Button } from '@yes/ui'
import { useState } from 'react'

function DetalleContacto({ contacto }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button tone="secondary" onClick={() => setOpen(true)}>Ver detalle</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={contacto.nombre}
        size="md"
        footer={
          <Button tone="primary" onClick={handleGuardar}>Guardar cambios</Button>
        }
      >
        {/* contenido del panel */}
      </Drawer>
    </>
  )
}
```

## Accesibilidad

- `role="dialog"` + `aria-modal="true"` en el panel
- `aria-labelledby` apunta al `<h2>` del título
- Foco atrapado dentro del panel mientras está abierto (via `useFocusTrap`)
- Al cerrar, el foco regresa al elemento que abrió el drawer

<Canvas of={DrawerStories.Default} />
<Controls of={DrawerStories.Default} />
```

- [ ] **Step 8: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { Drawer } from './components/Drawer'
export type { DrawerProps, DrawerSize } from './components/Drawer'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 9: Commit**

```bash
git add src/components/Drawer/ src/index.ts
git commit -m "feat(wave-5): agregar componente Drawer"
```

---

## Task 3: FilterPanel

**Reference:** `design-system-reference/preview/components-meta-filters.html` — FilterPanel section
**UI Kit reference:** `crm/CRMApp.jsx`
**Translation passes:**
- Panel bg: `#fff` → `--yes-color-surface`
- Panel border: `1px solid #E5E7EB` → `--yes-color-border`
- Border radius: `10px` → closest token is `--yes-radius-card` (8px, ±2px tolerance ✓)
- Box shadow: `0 10px 25px rgba(0,0,0,0.12)` → `--yes-shadow-lg`
- Panel width: `340px` → add new token `--yes-size-filter-panel-width: 340px`
- Header: `padding: 12px 16px`, `border-bottom: 1px solid #E5E7EB`
- Title: Barlow 13px 700 `#111827` → `--yes-font-heading`, `--yes-color-text`
- Close ×: 26×26px, border `1px solid #E5E7EB`, bg `#F9FAFB` → `--yes-color-bg`, `--yes-color-border`
- Group label: 11px 700 `#374151` → `--yes-color-text-secondary`
- Checkbox pill: border `1px solid #E5E7EB`, 4px 10px padding, 12px 600 `#374151`
- Checkbox pill checked: bg `#EEF3FA`, color `#2B52A0`, border `#B3C5E6` → `--yes-color-primary-subtle`, `--yes-color-primary`, `--yes-color-primary-border`
- Slider accent: `#2B52A0` → `--yes-color-primary`
- Footer: `padding: 12px 16px`, `border-top: 1px solid #F3F4F6`, bg `#FAFAFA`
- Limpiar btn: border `1px solid #D1D5DB`, 34px height → `--yes-color-border-strong`, secondary tone
- Aplicar btn: bg `#2B52A0`, 34px height → `--yes-color-primary`, primary tone
- Z-index: `--yes-z-dropdown` (floating, not modal)

**Files:**
- Modify: `src/tokens/semantic.css` (add `--yes-size-filter-panel-width`)
- Create: `src/components/FilterPanel/FilterPanel.tsx`
- Create: `src/components/FilterPanel/FilterPanel.module.css`
- Create: `src/components/FilterPanel/FilterPanel.test.tsx`
- Create: `src/components/FilterPanel/FilterPanel.stories.tsx`
- Create: `src/components/FilterPanel/FilterPanel.mdx`
- Create: `src/components/FilterPanel/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add FilterPanel token to semantic.css**

Open `src/tokens/semantic.css`. Add after `--yes-size-drawer-lg`:

```css
  --yes-size-filter-panel-width: 340px;
```

- [ ] **Step 2: Write failing tests**

Create `src/components/FilterPanel/FilterPanel.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterPanel } from './FilterPanel'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onApply: vi.fn(),
  onClear: vi.fn(),
  children: <p>Contenido del panel</p>,
}

describe('FilterPanel', () => {
  it('renders children when open=true', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument()
  })

  it('renders header title "Filtros avanzados"', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.getByText('Filtros avanzados')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<FilterPanel {...defaultProps} open={false} />)
    expect(screen.queryByText('Filtros avanzados')).not.toBeInTheDocument()
  })

  it('calls onClose when × close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<FilterPanel {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar filtros' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onApply when Aplicar filtros button is clicked', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<FilterPanel {...defaultProps} onApply={onApply} />)
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onClear when Limpiar button is clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<FilterPanel {...defaultProps} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('renders FilterPanel.Group with label', () => {
    render(
      <FilterPanel {...defaultProps}>
        <FilterPanel.Group label="Estado">
          <span>Activo</span>
        </FilterPanel.Group>
      </FilterPanel>
    )
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('has data-testid on root element', () => {
    render(<FilterPanel {...defaultProps} data-testid="fp" />)
    expect(screen.getByTestId('fp')).toBeInTheDocument()
  })

  it('does not use role="dialog" — it is not a modal', () => {
    render(<FilterPanel {...defaultProps} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — verify RED**

```bash
pnpm test
```

Expected: `FAIL` — "Cannot find module './FilterPanel'".

- [ ] **Step 4: Implement FilterPanel**

Create `src/components/FilterPanel/FilterPanel.module.css`:

```css
.panel {
  position: absolute;
  background: var(--yes-color-surface);
  border: 1px solid var(--yes-color-border);
  border-radius: var(--yes-radius-card);
  box-shadow: var(--yes-shadow-lg);
  width: var(--yes-size-filter-panel-width);
  overflow: hidden;
  z-index: var(--yes-z-dropdown);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yes-space-3) var(--yes-space-4);
  border-bottom: 1px solid var(--yes-color-border);
}

.title {
  font-family: var(--yes-font-heading);
  font-size: 13px;
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text);
}

.closeBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--yes-radius-sm);
  border: 1px solid var(--yes-color-border);
  background: var(--yes-color-bg);
  cursor: pointer;
  color: var(--yes-color-text-subtle);
  font-size: 16px;
  line-height: 1;
  transition: color var(--yes-duration-fast) var(--yes-ease);
}

.closeBtn:hover {
  color: var(--yes-color-text);
}

.body {
  padding: var(--yes-space-3) var(--yes-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-3);
}

.footer {
  display: flex;
  gap: var(--yes-space-2);
  padding: var(--yes-space-3) var(--yes-space-4);
  border-top: 1px solid var(--yes-color-border);
  background: var(--yes-color-bg);
}

.clearBtn {
  flex: 1;
  height: 34px;
  border-radius: var(--yes-radius-btn);
  border: 1px solid var(--yes-color-border-strong);
  background: transparent;
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-text-muted);
  cursor: pointer;
  transition: border-color var(--yes-duration-fast) var(--yes-ease);
}

.clearBtn:hover {
  border-color: var(--yes-color-text-muted);
}

.applyBtn {
  flex: 2;
  height: 34px;
  border-radius: var(--yes-radius-btn);
  border: none;
  background: var(--yes-color-primary);
  font-family: var(--yes-font-sans);
  font-size: var(--yes-text-sm);
  font-weight: var(--yes-weight-semibold);
  color: var(--yes-color-surface);
  cursor: pointer;
  transition: background var(--yes-duration-fast) var(--yes-ease);
}

.applyBtn:hover {
  background: var(--yes-color-primary-hover);
}

/* ── FilterPanel.Group ─────────────────────────────── */
.group {
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-1-5);
}

.groupLabel {
  font-size: 11px;
  font-weight: var(--yes-weight-bold);
  color: var(--yes-color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.groupContent {
  display: flex;
  flex-direction: column;
  gap: var(--yes-space-1);
}
```

Create `src/components/FilterPanel/FilterPanel.tsx`:

```tsx
import { cn } from '../../utils/cn'
import type { BaseProps } from '../../types/shared'
import styles from './FilterPanel.module.css'

export interface FilterPanelProps extends BaseProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  onClear: () => void
  children: React.ReactNode
}

interface FilterPanelGroupProps {
  label: string
  children: React.ReactNode
  className?: string
}

function FilterPanelGroup({ label, children, className }: FilterPanelGroupProps) {
  return (
    <div className={cn(styles.group, className)}>
      <div className={styles.groupLabel}>{label}</div>
      <div className={styles.groupContent}>{children}</div>
    </div>
  )
}

export function FilterPanel({
  open,
  onClose,
  onApply,
  onClear,
  children,
  className,
  style,
  'data-testid': testId,
}: FilterPanelProps) {
  if (!open) return null

  return (
    <div
      className={cn(styles.panel, className)}
      style={style}
      data-testid={testId}
    >
      <div className={styles.header}>
        <span className={styles.title}>Filtros avanzados</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar filtros"
        >
          ×
        </button>
      </div>

      <div className={styles.body}>
        {children}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={onClear}
          aria-label="Limpiar"
        >
          Limpiar
        </button>
        <button
          type="button"
          className={styles.applyBtn}
          onClick={onApply}
          aria-label="Aplicar filtros"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}

FilterPanel.Group = FilterPanelGroup
```

Create `src/components/FilterPanel/index.ts`:

```typescript
export { FilterPanel } from './FilterPanel'
export type { FilterPanelProps } from './FilterPanel'
```

- [ ] **Step 5: Run tests — verify GREEN**

```bash
pnpm test
```

Expected: `PASS src/components/FilterPanel/FilterPanel.test.tsx` — 9 tests passing.

- [ ] **Step 6: Write stories**

Create `src/components/FilterPanel/FilterPanel.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { FilterPanel } from './FilterPanel'
import { Checkbox } from '../Checkbox'

const meta: Meta<typeof FilterPanel> = {
  title: 'Wave 5 — Overlay/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Panel flotante de filtros avanzados. Agrupa checkboxes, selects, y sliders por categoría. Reference: `design-system-reference/preview/components-meta-filters.html`',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [applied, setApplied] = useState(false)
    return (
      <div style={{ position: 'relative', minHeight: 500, padding: 16 }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ marginBottom: 8, padding: '6px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontFamily: 'Manrope, sans-serif', fontWeight: 600, cursor: 'pointer' }}
        >
          {applied ? 'Filtros aplicados ✓' : 'Filtros avanzados'}
        </button>
        <FilterPanel
          open={open}
          onClose={() => setOpen(false)}
          onApply={() => { setApplied(true); setOpen(false) }}
          onClear={() => setApplied(false)}
          style={{ top: 48, left: 0 }}
        >
          <FilterPanel.Group label="Estado">
            <Checkbox label="Activo" defaultChecked />
            <Checkbox label="Pendiente" />
            <Checkbox label="Fallido" />
            <Checkbox label="Completado" />
          </FilterPanel.Group>

          <FilterPanel.Group label="Canal">
            <Checkbox label="WhatsApp" defaultChecked />
            <Checkbox label="SMS" defaultChecked />
            <Checkbox label="Correo" />
            <Checkbox label="Voz" />
          </FilterPanel.Group>

          <FilterPanel.Group label="Valor de deuda">
            <div style={{ padding: '0 2px' }}>
              <input type="range" min={0} max={100} defaultValue={70} style={{ width: '100%', accentColor: 'var(--yes-color-primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--yes-color-text-muted)', marginTop: 2 }}>
                <span>$0</span>
                <span>hasta $70.000.000</span>
              </div>
            </div>
          </FilterPanel.Group>
        </FilterPanel>
      </div>
    )
  },
}

export const AllGroups: Story = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <FilterPanel
        open
        onClose={() => {}}
        onApply={() => {}}
        onClear={() => {}}
        style={{ position: 'static' }}
      >
        <FilterPanel.Group label="Estado">
          <Checkbox label="Activo" defaultChecked />
          <Checkbox label="Pendiente" />
          <Checkbox label="Fallido" />
          <Checkbox label="Completado" />
        </FilterPanel.Group>

        <FilterPanel.Group label="Canal">
          <Checkbox label="WhatsApp" defaultChecked />
          <Checkbox label="SMS" defaultChecked />
          <Checkbox label="Correo" />
          <Checkbox label="Voz" />
        </FilterPanel.Group>

        <FilterPanel.Group label="Campaña">
          <select style={{ width: '100%', height: 30, borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, padding: '0 8px', fontFamily: 'Manrope, sans-serif' }}>
            <option>Cobranza Junio 2026</option>
            <option>Retención Q2</option>
          </select>
        </FilterPanel.Group>

        <FilterPanel.Group label="Última gestión">
          <select style={{ width: '100%', height: 30, borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13, padding: '0 8px', fontFamily: 'Manrope, sans-serif' }}>
            <option>En los últimos 7 días</option>
            <option>En los últimos 30 días</option>
          </select>
        </FilterPanel.Group>

        <FilterPanel.Group label="Valor de deuda">
          <div style={{ padding: '0 2px' }}>
            <input type="range" min={0} max={100} defaultValue={70} style={{ width: '100%', accentColor: 'var(--yes-color-primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--yes-color-text-muted)', marginTop: 2 }}>
              <span>$0</span>
              <span>hasta $70.000.000</span>
            </div>
          </div>
        </FilterPanel.Group>
      </FilterPanel>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastAction, setLastAction] = useState<string | null>(null)
    return (
      <div style={{ position: 'relative', minHeight: 400 }}>
        <button
          type="button"
          data-testid="open-fp-btn"
          onClick={() => setOpen(true)}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #D1D5DB', fontFamily: 'Manrope, sans-serif', fontWeight: 600, cursor: 'pointer' }}
        >
          Filtros avanzados
        </button>
        {lastAction && (
          <p data-testid="last-action" style={{ marginTop: 8, fontSize: 13 }}>
            Última acción: {lastAction}
          </p>
        )}
        <FilterPanel
          open={open}
          onClose={() => setOpen(false)}
          onApply={() => { setLastAction('aplicar'); setOpen(false) }}
          onClear={() => setLastAction('limpiar')}
          data-testid="filter-panel"
          style={{ top: 48, left: 0 }}
        >
          <FilterPanel.Group label="Estado">
            <Checkbox label="Activo" defaultChecked />
            <Checkbox label="Pendiente" />
          </FilterPanel.Group>
        </FilterPanel>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open panel
    await userEvent.click(canvas.getByTestId('open-fp-btn'))
    await expect(canvas.getByTestId('filter-panel')).toBeVisible()

    // Click Aplicar
    await userEvent.click(canvas.getByRole('button', { name: 'Aplicar filtros' }))
    await expect(canvas.getByTestId('last-action')).toHaveTextContent('aplicar')

    // Reopen and click Limpiar
    await userEvent.click(canvas.getByTestId('open-fp-btn'))
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar' }))
    await expect(canvas.getByTestId('last-action')).toHaveTextContent('limpiar')
  },
}
```

- [ ] **Step 7: VISUAL GATE — human checkpoint**

```bash
pnpm dev
```

Open Storybook → `Wave 5 — Overlay / FilterPanel / AllGroups`.
Open `design-system-reference/preview/components-meta-filters.html` in a browser → FilterPanel section.

Verify side-by-side:
- Panel: 340px wide, 10px radius (rendered as 8px via `--yes-radius-card`, within ±2px tolerance)
- Shadow: `0 10px 25px rgba(0,0,0,0.12)` — subtle depth
- Header: Barlow 13px bold "Filtros avanzados", 26×26 × close button with border
- Group label: 11px uppercase bold `#374151`
- Footer: Limpiar (ghost, full flex:1) + Aplicar filtros (primary blue, flex:2)
- Range slider accent: `#2B52A0` (primary blue)

**Sign off before proceeding to Step 8.**

- [ ] **Step 8: Write MDX docs**

Create `src/components/FilterPanel/FilterPanel.mdx`:

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as FilterPanelStories from './FilterPanel.stories'

<Meta of={FilterPanelStories} />

# FilterPanel

Panel flotante de filtros avanzados. Agrupa controles por categoría — checkboxes,
selects, y sliders — con acciones de limpiar y aplicar en el footer.

**Referencia:** `design-system-reference/preview/components-meta-filters.html` → FilterPanel

## Cuándo usar

- Filtros avanzados en tablas con múltiples dimensiones
- Combinado con `GroupFilter` (barra de búsqueda superior) + `FilterPanel` (panel avanzado)
- Cuando los filtros son opcionales y no necesitan estar siempre visibles

**No usar** para filtros inline simples — usa `GroupFilter`. No usar como diálogo — usa `Modal`.

## Uso

```tsx
import { FilterPanel, Checkbox } from '@yes/ui'
import { useState } from 'react'

function TablaContactos() {
  const [fpOpen, setFpOpen] = useState(false)
  const [filters, setFilters] = useState({ estados: [] })

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setFpOpen(true)}>Filtros avanzados</button>

      <FilterPanel
        open={fpOpen}
        onClose={() => setFpOpen(false)}
        onApply={handleApply}
        onClear={handleClear}
        style={{ top: 44, right: 0 }}
      >
        <FilterPanel.Group label="Estado">
          <Checkbox label="Activo" />
          <Checkbox label="Pendiente" />
        </FilterPanel.Group>

        <FilterPanel.Group label="Canal">
          <Checkbox label="WhatsApp" />
          <Checkbox label="SMS" />
        </FilterPanel.Group>
      </FilterPanel>
    </div>
  )
}
```

## Posicionamiento

`FilterPanel` es `position: absolute` — el contenedor padre debe ser `position: relative`.
Usa el prop `style` para ajustar `top`, `right`, `left`, `bottom` según el trigger.

## Subcomponente: FilterPanel.Group

Agrupa controles bajo un label de sección:

```tsx
<FilterPanel.Group label="Estado">
  <Checkbox label="Activo" />
</FilterPanel.Group>
```

<Canvas of={FilterPanelStories.AllGroups} />
<Controls of={FilterPanelStories.Default} />
```

- [ ] **Step 9: Export and build**

In `src/index.ts`, uncomment:
```typescript
export { FilterPanel } from './components/FilterPanel'
export type { FilterPanelProps } from './components/FilterPanel'
```

```bash
pnpm build && pnpm check-dist
```

Expected: `All dist files present.`

- [ ] **Step 10: Commit**

```bash
git add src/components/FilterPanel/ src/tokens/semantic.css src/index.ts
git commit -m "feat(wave-5): agregar componente FilterPanel"
```

---

## Task 4: Wave 5 integration verify

**Files:** None created — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all 3 Wave 5 component test files passing, 0 failures.
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

- [ ] **Step 3: Verify all Wave 5 exports are present**

```bash
node -e "
const { Modal, Drawer, FilterPanel } = require('./dist/index.cjs');
const missing = ['Modal','Drawer','FilterPanel'].filter(n => !eval(n));
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All Wave 5 exports present');
"
```

Expected: `All Wave 5 exports present`

- [ ] **Step 4: Start Storybook and do final sweep**

```bash
pnpm dev
```

Open each story group in order:
- Wave 5 — Overlay / Modal / Default
- Wave 5 — Overlay / Modal / AllSizes
- Wave 5 — Overlay / Modal / Destructive
- Wave 5 — Overlay / Modal / Interactive (run play())
- Wave 5 — Overlay / Drawer / Default
- Wave 5 — Overlay / Drawer / AllSizes
- Wave 5 — Overlay / Drawer / Interactive (run play())
- Wave 5 — Overlay / FilterPanel / Default
- Wave 5 — Overlay / FilterPanel / AllGroups
- Wave 5 — Overlay / FilterPanel / Interactive (run play())

Verify no console errors. Every story renders without errors.

- [ ] **Step 5: Tag Wave 5 release**

```bash
git tag v0.5.0
git commit --allow-empty -m "chore(release): wave 5 overlay — v0.5.0"
```

---

## Self-review notes

Before handing off, verify:

**Modal:**
- [ ] Portal renders in `document.body` — inspect DOM to confirm `.modal-overlay` is a direct child of `<body>`
- [ ] SSR guard: `typeof document === 'undefined'` check present before `createPortal`
- [ ] Escape listener added on `open=true`, removed on cleanup
- [ ] Body scroll locked (`overflow: hidden`) while open, restored on close
- [ ] `stopPropagation` on panel click prevents overlay close when clicking content
- [ ] `useId()` generates stable title ID for `aria-labelledby`
- [ ] No `addEventListener` in component body — only inside `useEffect`

**Drawer:**
- [ ] Same Portal + SSR guard pattern as Modal
- [ ] `translateX(0)` / `translateX(100%)` applied via CSS class — not inline style
- [ ] Panel border radius only on left corners (`--yes-radius-card 0 0 --yes-radius-card`)
- [ ] Overlay flex-end alignment pushes panel to right edge

**FilterPanel:**
- [ ] `role="dialog"` absent — FilterPanel is NOT a modal
- [ ] No focus trap — tab navigation flows naturally through the panel
- [ ] No Portal — positioned relative to parent via `position: absolute`
- [ ] `FilterPanel.Group` exposed as static property (compound pattern)
- [ ] Title "Filtros avanzados" hardcoded in Colombian Spanish
- [ ] `z-index: var(--yes-z-dropdown)` — below modals, above content

**All three:**
- [ ] Zero hardcoded color/size values in CSS modules
- [ ] All `<button>` elements have `type="button"`
- [ ] All UI text is Colombian Spanish
- [ ] `data-testid` reaches the root element
