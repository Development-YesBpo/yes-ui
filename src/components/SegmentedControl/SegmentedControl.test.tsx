import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'list', label: 'Lista' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'table', label: 'Tabla' },
]

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl options={options} value="list" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Lista' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tarjeta' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tabla' })).toBeInTheDocument()
  })

  it('marks active option with aria-pressed', () => {
    render(<SegmentedControl options={options} value="card" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Tarjeta' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with correct value on click', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="list" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tabla' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('table')
  })

  it('does not call onChange when clicking already-active option', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="list" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Lista' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes data-testid to root', () => {
    render(<SegmentedControl options={options} value="list" onChange={() => {}} data-testid="seg" />)
    expect(screen.getByTestId('seg')).toBeInTheDocument()
  })
})
