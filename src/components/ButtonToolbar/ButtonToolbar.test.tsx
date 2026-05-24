import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ButtonToolbar, ToolbarButton } from './ButtonToolbar'

describe('ButtonToolbar', () => {
  it('renders children', () => {
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={() => {}}>Exportar</ToolbarButton>
        <ToolbarButton onClick={() => {}}>Filtrar</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument()
  })

  it('calls onClick on button click', async () => {
    const onClick = vi.fn()
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={onClick}>Acción</ToolbarButton>
      </ButtonToolbar>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders disabled button', () => {
    render(
      <ButtonToolbar>
        <ToolbarButton onClick={() => {}} disabled>Deshabilitado</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('button', { name: 'Deshabilitado' })).toBeDisabled()
  })

  it('renders toolbar with correct role', () => {
    render(
      <ButtonToolbar aria-label="Acciones de tabla">
        <ToolbarButton onClick={() => {}}>A</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByRole('toolbar', { name: 'Acciones de tabla' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(
      <ButtonToolbar data-testid="tb">
        <ToolbarButton onClick={() => {}}>B</ToolbarButton>
      </ButtonToolbar>
    )
    expect(screen.getByTestId('tb')).toBeInTheDocument()
  })
})
