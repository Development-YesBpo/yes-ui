import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ColumnManager } from './ColumnManager'

const columns = [
  { key: 'name', label: 'Contacto', visible: true, locked: true },
  { key: 'phone', label: 'Teléfono', visible: true },
  { key: 'campaign', label: 'Campaña', visible: true },
  { key: 'email', label: 'Correo electrónico', visible: false },
]

describe('ColumnManager', () => {
  it('renders panel header "Columnas visibles"', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByText('Columnas visibles')).toBeInTheDocument()
  })

  it('renders all column labels', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
  })

  it('locked column checkbox is disabled', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    const contactoCheckbox = screen.getByRole('checkbox', { name: 'Contacto' })
    expect(contactoCheckbox).toBeDisabled()
  })

  it('calls onVisibilityChange on checkbox toggle', async () => {
    const onVisibilityChange = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={onVisibilityChange} onApply={() => {}} onReset={() => {}} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Teléfono' }))
    expect(onVisibilityChange).toHaveBeenCalledOnce()
    expect(onVisibilityChange).toHaveBeenCalledWith('phone', false)
  })

  it('calls onApply when Aplicar clicked', async () => {
    const onApply = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={onApply} onReset={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(onApply).toHaveBeenCalledOnce()
  })

  it('calls onReset when Restablecer clicked', async () => {
    const onReset = vi.fn()
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: 'Restablecer' }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('unchecked column shows unchecked checkbox', () => {
    render(<ColumnManager columns={columns} onVisibilityChange={() => {}} onApply={() => {}} onReset={() => {}} />)
    expect(screen.getByRole('checkbox', { name: 'Correo electrónico' })).not.toBeChecked()
  })
})
