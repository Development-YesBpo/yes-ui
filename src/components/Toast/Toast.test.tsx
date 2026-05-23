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
