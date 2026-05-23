import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Drawer } from './Drawer'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Detalle del contacto',
  children: <p>Contenido del drawer</p>,
}

describe('Drawer', () => {
  it('renders children when open=true', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.getByText('Contenido del drawer')).toBeInTheDocument()
  })

  it('renders title in header', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.getByText('Detalle del contacto')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<Drawer {...defaultProps} open={false} />)
    expect(screen.queryByText('Detalle del contacto')).not.toBeInTheDocument()
  })

  it('calls onClose when × button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByTestId('drawer-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when panel content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByText('Contenido del drawer'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing to the title', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Detalle del contacto')
  })

  it('applies md size class by default', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/md/)
  })

  it('applies lg size class', () => {
    render(<Drawer {...defaultProps} size="lg" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toMatch(/lg/)
  })

  it('panel has translateX(0) transform when open', () => {
    render(<Drawer {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    // open class must be present so CSS applies translateX(0)
    expect(dialog.className).toMatch(/open/)
  })

  it('renders footer when footer prop is provided', () => {
    render(
      <Drawer {...defaultProps} footer={<button type="button">Guardar</button>} />
    )
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('does not render footer section when footer prop is omitted', () => {
    render(<Drawer {...defaultProps} />)
    expect(screen.queryByTestId('drawer-footer')).not.toBeInTheDocument()
  })
})
