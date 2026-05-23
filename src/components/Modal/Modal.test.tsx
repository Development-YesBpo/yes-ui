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
