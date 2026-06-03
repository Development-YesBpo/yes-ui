// src/charts/PieChart/PieChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Pie: (props: Record<string, unknown>) => (
    <div data-testid="plots-pie" data-props={JSON.stringify(props, (_k, v) => typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { PieChart } from './PieChart'

const DATA = [
  { canal: 'Teléfono', valor: 4312 },
  { canal: 'WhatsApp', valor: 3156 },
  { canal: 'Chat',     valor: 1893 },
]

describe('PieChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(<PieChart data={DATA} angleField="valor" colorField="canal" ariaLabel="Distribución por canal" />)
    expect(screen.getByRole('img', { name: 'Distribución por canal' })).toBeInTheDocument()
  })

  it('forwards angleField, colorField, autoFit and theme to Pie', () => {
    render(<PieChart data={DATA} angleField="valor" colorField="canal" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-pie').dataset.props!)
    expect(props.angleField).toBe('valor')
    expect(props.colorField).toBe('canal')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(<PieChart data={DATA} angleField="valor" colorField="canal" ariaLabel="x" loading data-testid="pc" />)
    expect(screen.queryByTestId('plots-pie')).not.toBeInTheDocument()
    expect(screen.getByTestId('pc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<PieChart data={[]} angleField="valor" colorField="canal" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with colorField + angleField headers', () => {
    render(<PieChart data={DATA} angleField="valor" colorField="canal" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'canal' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '4312' })).toBeInTheDocument()
  })
})
