import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tabs } from './Tabs'

const ITEMS = [
  { id: 'mis', label: 'Mis conversaciones' },
  { id: 'sin', label: 'Sin asignar' },
  { id: 'todas', label: 'Todas' },
  { id: 'arch', label: 'Archivadas', count: 3 },
]

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Mis conversaciones' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sin asignar' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Todas' })).toBeInTheDocument()
  })

  it('renders count badge when provided', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('active tab has aria-selected="true"', () => {
    render(<Tabs items={ITEMS} activeId="sin" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Sin asignar' })).toHaveAttribute('aria-selected', 'true')
  })

  it('inactive tabs have aria-selected="false"', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Todas' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange exactly once with correct id when tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Todas' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('todas')
  })

  it('does not call onChange when already-active tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Mis conversaciones' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders tablist with correct role', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders underline variant by default', () => {
    const { container } = render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'underline')
  })

  it('renders contained variant when specified', () => {
    const { container } = render(
      <Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} variant="contained" />
    )
    expect(container.firstChild).toHaveAttribute('data-variant', 'contained')
  })

  it('keyboard Enter activates tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    const tab = screen.getByRole('tab', { name: 'Sin asignar' })
    tab.focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('sin')
  })

  it('keyboard Space activates tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} activeId="mis" onChange={onChange} />)
    const tab = screen.getByRole('tab', { name: 'Todas' })
    tab.focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith('todas')
  })

  it('passes data-testid to root element', () => {
    render(<Tabs items={ITEMS} activeId="mis" onChange={vi.fn()} data-testid="my-tabs" />)
    expect(screen.getByTestId('my-tabs')).toBeInTheDocument()
  })
})
