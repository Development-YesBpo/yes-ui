import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AdminBanner } from './AdminBanner'

describe('AdminBanner', () => {
  it('renders amber variant', () => {
    render(
      <AdminBanner
        variant="amber"
        message="Viendo como Laura Cifuentes · Bogotá"
        badge="Asesora CRM"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByText('Viendo como Laura Cifuentes · Bogotá')).toBeInTheDocument()
    expect(screen.getByText('Asesora CRM')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument()
  })

  it('renders blue variant', () => {
    render(
      <AdminBanner
        variant="blue"
        message="Acceso limitado · 18 agentes visibles"
        badge="Coordinador"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'blue')
  })

  it('renders neutral variant', () => {
    render(
      <AdminBanner
        variant="neutral"
        message="Sin permisos de escritura · activo hasta las 18:00"
        badge="LECTURA"
        onAction={() => {}}
        actionLabel="Volver"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'neutral')
    expect(screen.getByText('LECTURA')).toBeInTheDocument()
  })

  it('renders red variant', () => {
    render(
      <AdminBanner
        variant="red"
        message="Acceso irrestricto al sistema · 234 usuarios en línea"
        badge="SUPERADMIN"
        onAction={() => {}}
        actionLabel="Salir"
      />
    )
    expect(screen.getByTestId('banner-root')).toHaveAttribute('data-variant', 'red')
  })

  it('calls onAction exactly once on button click', async () => {
    const onAction = vi.fn()
    render(
      <AdminBanner
        variant="amber"
        message="Mensaje de prueba"
        onAction={onAction}
        actionLabel="Salir"
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('renders message text', () => {
    render(
      <AdminBanner variant="red" message="Acceso irrestricto" onAction={() => {}} />
    )
    expect(screen.getByText('Acceso irrestricto')).toBeInTheDocument()
  })

  it('renders without badge when omitted', () => {
    render(
      <AdminBanner variant="neutral" message="Solo lectura" onAction={() => {}} actionLabel="Volver" />
    )
    expect(screen.queryByTestId('banner-pill')).toBeNull()
  })
})
