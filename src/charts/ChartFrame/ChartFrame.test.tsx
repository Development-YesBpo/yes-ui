import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChartFrame } from './ChartFrame'

describe('ChartFrame', () => {
  it('renders children with role=img and the aria-label', () => {
    render(
      <ChartFrame ariaLabel="Conversaciones por día">
        <svg data-testid="chart" />
      </ChartFrame>,
    )
    const root = screen.getByRole('img', { name: 'Conversaciones por día' })
    expect(root).toBeInTheDocument()
    expect(screen.getByTestId('chart')).toBeInTheDocument()
  })

  it('shows a Skeleton and hides children when loading', () => {
    render(
      <ChartFrame ariaLabel="Cargando" loading data-testid="frame">
        <svg data-testid="chart" />
      </ChartFrame>,
    )
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument()
    expect(screen.getByTestId('frame')).toBeInTheDocument()
  })

  it('shows an EmptyState when isEmpty', () => {
    render(
      <ChartFrame ariaLabel="Vacío" isEmpty emptyTitle="Sin datos">
        <svg data-testid="chart" />
      </ChartFrame>,
    )
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument()
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('renders a visually-hidden data table from srTable', () => {
    render(
      <ChartFrame
        ariaLabel="Tabla"
        srTable={{ headers: ['Día', 'Valor'], rows: [['Lun', 892], ['Mar', 1240]] }}
      >
        <svg />
      </ChartFrame>,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Día' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '892' })).toBeInTheDocument()
  })

  it('forwards data-testid to the root', () => {
    render(
      <ChartFrame ariaLabel="x" data-testid="frame">
        <svg />
      </ChartFrame>,
    )
    expect(screen.getByTestId('frame')).toBeInTheDocument()
  })
})
