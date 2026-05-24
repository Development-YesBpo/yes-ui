import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const base = { page: 1, pageSize: 20, total: 248, onPageChange: vi.fn() }

  it('renders without crashing', () => {
    render(<Pagination {...base} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows correct record info text', () => {
    render(<Pagination {...base} />)
    expect(screen.getByText(/1–20 de 248/)).toBeInTheDocument()
  })

  it('prev/first buttons disabled on page 1', () => {
    render(<Pagination {...base} />)
    expect(screen.getByLabelText('Primera página')).toBeDisabled()
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
  })

  it('next/last buttons disabled on last page', () => {
    render(<Pagination {...base} page={13} />)
    expect(screen.getByLabelText('Página siguiente')).toBeDisabled()
    expect(screen.getByLabelText('Última página')).toBeDisabled()
  })

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination {...base} page={2} onPageChange={onPageChange} />)
    await user.click(screen.getByLabelText('Página siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('calls onPageSizeChange when select changes', async () => {
    const user = userEvent.setup()
    const onPageSizeChange = vi.fn()
    render(<Pagination {...base} pageSizeOptions={[20, 50, 100]} onPageSizeChange={onPageSizeChange} />)
    await user.selectOptions(screen.getByRole('combobox'), '50')
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })

  it('renders page size selector only when pageSizeOptions provided', () => {
    render(<Pagination {...base} />)
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('has correct aria-label on nav', () => {
    render(<Pagination {...base} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Paginación')
  })
})
