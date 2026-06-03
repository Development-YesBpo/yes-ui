// src/charts/AreaChart/AreaChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Area: (props: Record<string, unknown>) => (
    <div data-testid="plots-area" data-props={JSON.stringify(props)} />
  ),
}))

import { AreaChart } from './AreaChart'

const DATA = [
  { day: 'Lun', channel: 'Teléfono', value: 510 },
  { day: 'Lun', channel: 'WhatsApp', value: 230 },
  { day: 'Mar', channel: 'Teléfono', value: 698 },
]

describe('AreaChart', () => {
  it('renders a role=img frame', () => {
    render(<AreaChart data={DATA} xField="day" yField="value" seriesField="channel" ariaLabel="Volumen" />)
    expect(screen.getByRole('img', { name: 'Volumen' })).toBeInTheDocument()
  })
  it('forwards stack + colorField for stacked areas', () => {
    render(<AreaChart data={DATA} xField="day" yField="value" seriesField="channel" stacked ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-area').dataset.props!)
    expect(props.colorField).toBe('channel')
    expect(props.stack).toBe(true)
    expect(props.autoFit).toBe(true)
  })
  it('shows EmptyState when empty', () => {
    render(<AreaChart data={[]} xField="day" yField="value" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
})
