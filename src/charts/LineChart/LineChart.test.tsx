// src/charts/LineChart/LineChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Line: (props: { 'data-testid'?: string } & Record<string, unknown>) => (
    <div data-testid="plots-line" data-props={JSON.stringify(props)} />
  ),
}))

import { LineChart } from './LineChart'

const DATA = [
  { day: 'Lun', value: 892 },
  { day: 'Mar', value: 1240 },
]

describe('LineChart', () => {
  it('renders inside a role=img frame with the aria-label', () => {
    render(<LineChart data={DATA} xField="day" yField="value" ariaLabel="Conversaciones" />)
    expect(screen.getByRole('img', { name: 'Conversaciones' })).toBeInTheDocument()
  })

  it('forwards xField/yField/autoFit and theme to AntV Line', () => {
    render(<LineChart data={DATA} xField="day" yField="value" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-line').dataset.props!)
    expect(props.xField).toBe('day')
    expect(props.yField).toBe('value')
    expect(props.autoFit).toBe(true)
    expect(props.data).toHaveLength(2)
    expect(props.theme.type).toBe('classic')
  })

  it('shows a Skeleton when loading (no chart)', () => {
    render(<LineChart data={DATA} xField="day" yField="value" ariaLabel="x" loading data-testid="lc" />)
    expect(screen.queryByTestId('plots-line')).not.toBeInTheDocument()
    expect(screen.getByTestId('lc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<LineChart data={[]} xField="day" yField="value" ariaLabel="x" />)
    expect(screen.queryByTestId('plots-line')).not.toBeInTheDocument()
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds a screen-reader table from data', () => {
    render(<LineChart data={DATA} xField="day" yField="value" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'day' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '892' })).toBeInTheDocument()
  })
})
