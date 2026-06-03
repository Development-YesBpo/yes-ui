// src/charts/WaterfallChart/WaterfallChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Waterfall: (props: Record<string, unknown>) => (
    <div data-testid="plots-waterfall" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { WaterfallChart } from './WaterfallChart'

const DATA = [
  { etapa: 'Base S1',   valor: 7240, esTotal: true  },
  { etapa: '+Campañas', valor: 340,  esTotal: false },
  { etapa: '−Incid.',   valor: -95,  esTotal: false },
  { etapa: 'S2 Total',  valor: 7485, esTotal: true  },
]

describe('WaterfallChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(<WaterfallChart data={DATA} xField="etapa" yField="valor" ariaLabel="Variación semanal" />)
    expect(screen.getByRole('img', { name: 'Variación semanal' })).toBeInTheDocument()
  })

  it('forwards xField, yField, autoFit and theme to Waterfall', () => {
    render(<WaterfallChart data={DATA} xField="etapa" yField="valor" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-waterfall').dataset.props!)
    expect(props.xField).toBe('etapa')
    expect(props.yField).toBe('valor')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(<WaterfallChart data={DATA} xField="etapa" yField="valor" ariaLabel="x" loading data-testid="wf" />)
    expect(screen.queryByTestId('plots-waterfall')).not.toBeInTheDocument()
    expect(screen.getByTestId('wf')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<WaterfallChart data={[]} xField="etapa" yField="valor" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField + yField headers', () => {
    render(<WaterfallChart data={DATA} xField="etapa" yField="valor" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'etapa' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '7240' })).toBeInTheDocument()
  })
})
