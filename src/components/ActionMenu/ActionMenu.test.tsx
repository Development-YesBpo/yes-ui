import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ActionMenu } from './ActionMenu'
import type { ActionMenuItem } from './ActionMenu'

const items: ActionMenuItem[] = [
  { label: 'Editar', onClick: vi.fn() },
  { label: 'Duplicar', onClick: vi.fn() },
  { label: 'Ver historial', onClick: vi.fn(), section: 'Más acciones' },
  { label: 'Eliminar', onClick: vi.fn(), danger: true },
]

describe('ActionMenu', () => {
  it('renders trigger button', () => {
    render(<ActionMenu items={items} />)
    expect(screen.getByRole('button', { name: 'Más acciones' })).toBeInTheDocument()
  })

  it('menu is closed by default', () => {
    render(<ActionMenu items={items} />)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens menu on trigger click', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('renders all item labels', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Duplicar')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
  })

  it('renders section label', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByText('Más acciones')).toBeInTheDocument()
  })

  it('danger item has danger class', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    const eliminar = screen.getByRole('menuitem', { name: 'Eliminar' })
    expect(eliminar).toHaveAttribute('data-danger', 'true')
  })

  it('calls onClick exactly once per item click', async () => {
    const onClick = vi.fn()
    const testItems: ActionMenuItem[] = [{ label: 'Acción', onClick }]
    render(<ActionMenu items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('closes menu after item click', async () => {
    const testItems: ActionMenuItem[] = [{ label: 'Acción', onClick: vi.fn() }]
    render(<ActionMenu items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Acción' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes menu on Escape key', async () => {
    render(<ActionMenu items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes menu on outside click', async () => {
    render(
      <div>
        <ActionMenu items={items} />
        <button>Fuera</button>
      </div>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Más acciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Fuera' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
