// src/charts/HorizontalBarChart/HorizontalBarChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Bar: (props: Record<string, unknown>) => (
    <div data-testid="plots-bar" data-props={JSON.stringify(props)} />
  ),
}))

import { HorizontalBarChart } from './HorizontalBarChart'
import { applySortAndLimit } from './HorizontalBarChart'

const DATA = [
  { agent: 'Carlos R.', value: 192 },
  { agent: 'Felipe C.', value: 402 },
  { agent: 'María C.', value: 306 },
]

describe('applySortAndLimit', () => {
  it('sorts descending and limits to maxItems', () => {
    const out = applySortAndLimit(DATA, 'value', 'desc', 2)
    expect(out.map((d) => d.value)).toEqual([402, 306])
  })
  it('sorts ascending', () => {
    const out = applySortAndLimit(DATA, 'value', 'asc')
    expect(out[0].value).toBe(192)
  })
})

describe('HorizontalBarChart', () => {
  it('renders a role=img frame and uses AntV Bar (horizontal)', () => {
    render(<HorizontalBarChart data={DATA} xField="value" yField="agent" ariaLabel="Ranking" />)
    expect(screen.getByRole('img', { name: 'Ranking' })).toBeInTheDocument()
    expect(screen.getByTestId('plots-bar')).toBeInTheDocument()
  })
  it('forwards top-N sorted data to Bar', () => {
    render(<HorizontalBarChart data={DATA} xField="value" yField="agent" sort="desc" maxItems={2} ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-bar').dataset.props!)
    expect(props.data).toHaveLength(2)
    expect(props.data[0].value).toBe(402)
  })
  it('shows EmptyState when empty', () => {
    render(<HorizontalBarChart data={[]} xField="value" yField="agent" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
  it('shows a Skeleton and hides the chart when loading', () => {
    render(
      <HorizontalBarChart
        data={DATA}
        xField="value"
        yField="agent"
        ariaLabel="x"
        loading
        data-testid="hbc"
      />,
    )
    expect(screen.queryByTestId('plots-bar')).not.toBeInTheDocument()
    expect(screen.getByTestId('hbc')).toBeInTheDocument()
  })
})
