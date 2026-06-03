// src/charts/BubbleChart/BubbleChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Scatter: (props: Record<string, unknown>) => (
    <div data-testid="plots-bubble" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { BubbleChart } from './BubbleChart'

const DATA = [
  { campaña: 'Cobranza',  volumen: 2340, csat: 78, costo: 38 },
  { campaña: 'Soporte',   volumen: 1876, csat: 88, costo: 30 },
  { campaña: 'Ventas',    volumen: 1543, csat: 92, costo: 25 },
  { campaña: 'Retención', volumen: 987,  csat: 85, costo: 20 },
]

describe('BubbleChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="Campañas: volumen × CSAT × costo" />,
    )
    expect(screen.getByRole('img', { name: 'Campañas: volumen × CSAT × costo' })).toBeInTheDocument()
  })

  it('forwards xField, yField, sizeField, colorField, autoFit and theme', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-bubble').dataset.props!)
    expect(props.xField).toBe('volumen')
    expect(props.yField).toBe('csat')
    expect(props.sizeField).toBe('costo')
    expect(props.colorField).toBe('campaña')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        ariaLabel="x" loading data-testid="bc" />,
    )
    expect(screen.queryByTestId('plots-bubble')).not.toBeInTheDocument()
    expect(screen.getByTestId('bc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(
      <BubbleChart data={[]} xField="volumen" yField="csat" sizeField="costo" ariaLabel="x" />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, yField, sizeField and colorField', () => {
    render(
      <BubbleChart data={DATA} xField="volumen" yField="csat" sizeField="costo"
        colorField="campaña" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'volumen' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'costo' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '2340' })).toBeInTheDocument()
  })
})
