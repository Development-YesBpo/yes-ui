// src/charts/ScatterChart/ScatterChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Scatter: (props: Record<string, unknown>) => (
    <div data-testid="plots-scatter" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { ScatterChart } from './ScatterChart'

const DATA = [
  { tmo: 3.2, csat: 94, agente: 'Carlos'    },
  { tmo: 4.5, csat: 88, agente: 'Ana'       },
  { tmo: 6.3, csat: 75, agente: 'Valentina' },
  { tmo: 2.9, csat: 96, agente: 'Juan'      },
]

describe('ScatterChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat"
        ariaLabel="TMO vs CSAT por agente" />,
    )
    expect(screen.getByRole('img', { name: 'TMO vs CSAT por agente' })).toBeInTheDocument()
  })

  it('forwards xField, yField, autoFit and theme to Scatter', () => {
    render(<ScatterChart data={DATA} xField="tmo" yField="csat" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-scatter').dataset.props!)
    expect(props.xField).toBe('tmo')
    expect(props.yField).toBe('csat')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('forwards colorField when provided', () => {
    render(<ScatterChart data={DATA} xField="tmo" yField="csat" colorField="agente" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-scatter').dataset.props!)
    expect(props.colorField).toBe('agente')
  })

  it('shows Skeleton when loading', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat"
        ariaLabel="x" loading data-testid="sc" />,
    )
    expect(screen.queryByTestId('plots-scatter')).not.toBeInTheDocument()
    expect(screen.getByTestId('sc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<ScatterChart data={[]} xField="tmo" yField="csat" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable including colorField when provided', () => {
    render(
      <ScatterChart data={DATA} xField="tmo" yField="csat" colorField="agente" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'tmo' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'agente' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '94' })).toBeInTheDocument()
  })
})
