import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('has type="button" by default', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it.each(['primary', 'secondary', 'ghost', 'green', 'danger'] as const)(
    'renders %s tone without crashing',
    (tone) => {
      render(<Button tone={tone}>Acción</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md', 'lg'] as const)(
    'renders %s size without crashing',
    (size) => {
      render(<Button size={size}>Acción</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it('calls onClick exactly once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Button disabled>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('sets aria-disabled when loading', () => {
    render(<Button isLoading>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('sets aria-busy when loading', () => {
    render(<Button isLoading>Acción</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button isLoading onClick={onClick}>Clic</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders spinner when loading', () => {
    render(<Button isLoading>Procesando</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('passes data-testid to root element', () => {
    render(<Button data-testid="my-btn">Acción</Button>)
    expect(screen.getByTestId('my-btn')).toBeInTheDocument()
  })

  it('appends className to root', () => {
    render(<Button className="custom">Acción</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom')
  })

  it('activates on Enter key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Acción</Button>)
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('activates on Space key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Acción</Button>)
    screen.getByRole('button').focus()
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as anchor when as="a"', () => {
    render(<Button as="a" href="/test">Enlace</Button>)
    expect(screen.getByRole('link', { name: 'Enlace' })).toBeInTheDocument()
  })

  it('renders icon-only variant with correct aria-label', () => {
    render(<Button iconOnly aria-label="Cerrar" />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })
})
