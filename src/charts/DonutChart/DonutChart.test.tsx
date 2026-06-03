// src/charts/DonutChart/DonutChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Pie: (props: Record<string, unknown>) => (
    <div data-testid="plots-donut" data-props={JSON.stringify(props, (_k, v) => typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { DonutChart } from './DonutChart'

const DATA = [
  { motivo: 'Consulta',  pct: 38 },
  { motivo: 'Reclamo',   pct: 24 },
  { motivo: 'Soporte',   pct: 19 },
  { motivo: 'Pago',      pct: 12 },
  { motivo: 'Otro',      pct: 7  },
]

describe('DonutChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(<DonutChart data={DATA} angleField="pct" colorField="motivo" ariaLabel="Motivos de contacto" />)
    expect(screen.getByRole('img', { name: 'Motivos de contacto' })).toBeInTheDocument()
  })

  it('passes innerRadius and angleField/colorField to Pie', () => {
    render(<DonutChart data={DATA} angleField="pct" colorField="motivo" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-donut').dataset.props!)
    expect(props.angleField).toBe('pct')
    expect(props.colorField).toBe('motivo')
    expect(typeof props.innerRadius).toBe('number')
    expect(props.innerRadius).toBeGreaterThan(0)
    expect(props.autoFit).toBe(true)
  })

  it('shows Skeleton when loading', () => {
    render(<DonutChart data={DATA} angleField="pct" colorField="motivo" ariaLabel="x" loading data-testid="dc" />)
    expect(screen.queryByTestId('plots-donut')).not.toBeInTheDocument()
    expect(screen.getByTestId('dc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<DonutChart data={[]} angleField="pct" colorField="motivo" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with colorField + angleField headers', () => {
    render(<DonutChart data={DATA} angleField="pct" colorField="motivo" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'motivo' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '38' })).toBeInTheDocument()
  })

  it('forwards statistic config when centerLabel and centerValue are set', () => {
    render(
      <DonutChart data={DATA} angleField="pct" colorField="motivo"
        centerLabel="MOTIVOS" centerValue="100%" ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-donut').dataset.props!)
    expect(props.statistic).toBeDefined()
  })
})
