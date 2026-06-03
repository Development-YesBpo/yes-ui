// src/charts/BarChart/BarChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Column: (props: Record<string, unknown>) => (
    <div data-testid="plots-column" data-props={JSON.stringify(props)} />
  ),
}))

import { BarChart } from './BarChart'

const DATA = [
  { label: 'Cobranza', value: 2340 },
  { label: 'Soporte', value: 1876 },
]

describe('BarChart', () => {
  it('renders a role=img frame', () => {
    render(<BarChart data={DATA} xField="label" yField="value" ariaLabel="Campañas" />)
    expect(screen.getByRole('img', { name: 'Campañas' })).toBeInTheDocument()
  })
  it('uses AntV Column (vertical) and forwards fields', () => {
    render(<BarChart data={DATA} xField="label" yField="value" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-column').dataset.props!)
    expect(props.xField).toBe('label')
    expect(props.yField).toBe('value')
    expect(props.autoFit).toBe(true)
  })
  it('passes group when grouped + colorField set', () => {
    render(<BarChart data={DATA} xField="label" yField="value" colorByField="label" grouped ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-column').dataset.props!)
    expect(props.colorField).toBe('label')
    expect(props.group).toBe(true)
  })
  it('shows EmptyState when empty', () => {
    render(<BarChart data={[]} xField="label" yField="value" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
  it('shows a Skeleton and hides the chart when loading', () => {
    render(
      <BarChart
        data={DATA}
        xField="label"
        yField="value"
        ariaLabel="x"
        loading
        data-testid="bc"
      />,
    )
    expect(screen.queryByTestId('plots-column')).not.toBeInTheDocument()
    expect(screen.getByTestId('bc')).toBeInTheDocument()
  })
})
