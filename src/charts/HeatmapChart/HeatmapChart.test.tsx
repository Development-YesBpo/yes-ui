// src/charts/HeatmapChart/HeatmapChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  Heatmap: (props: Record<string, unknown>) => (
    <div data-testid="plots-heatmap" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { HeatmapChart } from './HeatmapChart'

const DATA = [
  { hora: '8h',  dia: 'Lun', llamadas: 68  },
  { hora: '9h',  dia: 'Lun', llamadas: 132 },
  { hora: '10h', dia: 'Lun', llamadas: 187 },
  { hora: '8h',  dia: 'Mar', llamadas: 72  },
  { hora: '9h',  dia: 'Mar', llamadas: 145 },
]

describe('HeatmapChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        ariaLabel="Volumen de llamadas por hora y día" />,
    )
    expect(screen.getByRole('img', { name: 'Volumen de llamadas por hora y día' })).toBeInTheDocument()
  })

  it('forwards xField, yField, colorField, autoFit and theme to Heatmap', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-heatmap').dataset.props!)
    expect(props.xField).toBe('hora')
    expect(props.yField).toBe('dia')
    expect(props.colorField).toBe('llamadas')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
  })

  it('shows Skeleton when loading', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas"
        ariaLabel="x" loading data-testid="hc" />,
    )
    expect(screen.queryByTestId('plots-heatmap')).not.toBeInTheDocument()
    expect(screen.getByTestId('hc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(
      <HeatmapChart data={[]} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, yField, colorField headers', () => {
    render(
      <HeatmapChart data={DATA} xField="hora" yField="dia" colorField="llamadas" ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'hora' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'llamadas' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '68' })).toBeInTheDocument()
  })
})
