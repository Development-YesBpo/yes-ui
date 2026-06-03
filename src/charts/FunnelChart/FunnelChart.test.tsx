// src/charts/FunnelChart/FunnelChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Funnel: (props: Record<string, unknown>) => (
    <div data-testid="plots-funnel" data-props={JSON.stringify(props)} />
  ),
}))

import { FunnelChart } from './FunnelChart'

const DATA = [
  { etapa: 'Contactos recibidos',   total: 12847 },
  { etapa: 'Asignados al agente',   total: 11023 },
  { etapa: 'Resuelto 1er contacto', total: 7854  },
  { etapa: 'Cerrado satisfactorio', total: 6432  },
]

describe('FunnelChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(<FunnelChart data={DATA} xField="etapa" yField="total" ariaLabel="Embudo de resolución" />)
    expect(screen.getByRole('img', { name: 'Embudo de resolución' })).toBeInTheDocument()
  })

  it('forwards xField, yField, autoFit and theme to Funnel', () => {
    render(<FunnelChart data={DATA} xField="etapa" yField="total" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-funnel').dataset.props!)
    expect(props.xField).toBe('etapa')
    expect(props.yField).toBe('total')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(<FunnelChart data={DATA} xField="etapa" yField="total" ariaLabel="x" loading data-testid="fc" />)
    expect(screen.queryByTestId('plots-funnel')).not.toBeInTheDocument()
    expect(screen.getByTestId('fc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<FunnelChart data={[]} xField="etapa" yField="total" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField + yField headers', () => {
    render(<FunnelChart data={DATA} xField="etapa" yField="total" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'etapa' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '12847' })).toBeInTheDocument()
  })

  it('omits conversionTag when showConversion is false', () => {
    render(
      <FunnelChart data={DATA} xField="etapa" yField="total"
        showConversion={false} ariaLabel="x" />,
    )
    const raw = screen.getByTestId('plots-funnel').dataset.props!
    const props = JSON.parse(raw)
    // conversionTag should be falsy or absent
    expect(props.conversionTag).toBeFalsy()
  })
})
