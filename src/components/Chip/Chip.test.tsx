import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renders children', () => { render(<Chip>Filtro</Chip>); expect(screen.getByText('Filtro')).toBeInTheDocument() })
  it('no dismiss button without onDismiss', () => { render(<Chip>X</Chip>); expect(screen.queryByRole('button')).not.toBeInTheDocument() })
  it('renders dismiss button', () => { render(<Chip onDismiss={() => {}}>X</Chip>); expect(screen.getByRole('button', { name:'Eliminar filtro' })).toBeInTheDocument() })
  it('calls onDismiss once', async () => {
    const fn = vi.fn()
    render(<Chip onDismiss={fn}>X</Chip>)
    await userEvent.click(screen.getByRole('button', { name:'Eliminar filtro' }))
    expect(fn).toHaveBeenCalledTimes(1)
  })
  it('passes data-testid', () => { render(<Chip data-testid="c">X</Chip>); expect(screen.getByTestId('c')).toBeInTheDocument() })
  it('appends className', () => { render(<Chip className="x" data-testid="c">X</Chip>); expect(screen.getByTestId('c')).toHaveClass('x') })
})
