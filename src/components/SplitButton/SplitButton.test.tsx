import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SplitButton } from './SplitButton'

const items = [
  { label: 'Guardar y cerrar', onClick: vi.fn() },
  { label: 'Guardar y crear nuevo', onClick: vi.fn() },
  { label: 'Guardar copia', onClick: vi.fn() },
  { label: 'Descartar cambios', onClick: vi.fn(), danger: true },
]

describe('SplitButton', () => {
  it('renders main label', () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('calls onMainClick when main button clicked', async () => {
    const onMainClick = vi.fn()
    render(<SplitButton label="Guardar cambios" onMainClick={onMainClick} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(onMainClick).toHaveBeenCalledOnce()
  })

  it('dropdown is hidden by default', () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens dropdown on arrow click', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Guardar y cerrar')).toBeInTheDocument()
  })

  it('closes dropdown on Escape', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('calls item onClick and closes dropdown', async () => {
    const onClick = vi.fn()
    const testItems = [{ label: 'Opción A', onClick }]
    render(<SplitButton label="Guardar" onMainClick={() => {}} items={testItems} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    await userEvent.click(screen.getByText('Opción A'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('applies danger class to danger items', async () => {
    render(<SplitButton label="Guardar cambios" onMainClick={() => {}} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir opciones' }))
    const dangerItem = screen.getByText('Descartar cambios')
    expect(dangerItem.closest('[data-danger="true"]')).toBeInTheDocument()
  })
})
