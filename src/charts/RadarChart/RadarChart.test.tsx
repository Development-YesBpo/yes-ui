// src/charts/RadarChart/RadarChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Radar: (props: Record<string, unknown>) => (
    <div data-testid="plots-radar" data-props={JSON.stringify(props)} />
  ),
}))

import { RadarChart } from './RadarChart'

// Long-format data: one row per axis×series combination
const DATA = [
  { eje: 'TMO',     valor: 85, serie: 'Agente' },
  { eje: 'CSAT',    valor: 92, serie: 'Agente' },
  { eje: 'FCR',     valor: 78, serie: 'Agente' },
  { eje: 'Adher.',  valor: 94, serie: 'Agente' },
  { eje: 'TMO',     valor: 75, serie: 'Equipo' },
  { eje: 'CSAT',    valor: 82, serie: 'Equipo' },
  { eje: 'FCR',     valor: 72, serie: 'Equipo' },
  { eje: 'Adher.',  valor: 87, serie: 'Equipo' },
]

describe('RadarChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(<RadarChart data={DATA} xField="eje" yField="valor" colorField="serie"
      ariaLabel="KPIs del agente" />)
    expect(screen.getByRole('img', { name: 'KPIs del agente' })).toBeInTheDocument()
  })

  it('forwards xField, yField, colorField, autoFit and theme to Radar', () => {
    render(<RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" ariaLabel="x" />)
    const props = JSON.parse(screen.getByTestId('plots-radar').dataset.props!)
    expect(props.xField).toBe('eje')
    expect(props.yField).toBe('valor')
    expect(props.colorField).toBe('serie')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(<RadarChart data={DATA} xField="eje" yField="valor" colorField="serie"
      ariaLabel="x" loading data-testid="rc" />)
    expect(screen.queryByTestId('plots-radar')).not.toBeInTheDocument()
    expect(screen.getByTestId('rc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(<RadarChart data={[]} xField="eje" yField="valor" colorField="serie" ariaLabel="x" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, colorField, yField headers', () => {
    render(<RadarChart data={DATA} xField="eje" yField="valor" colorField="serie" ariaLabel="x" />)
    expect(screen.getByRole('columnheader', { name: 'eje' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '85' })).toBeInTheDocument()
  })
})
