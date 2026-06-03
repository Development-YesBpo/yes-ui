// src/charts/ComboChart/ComboChart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@ant-design/plots', () => ({
  DualAxes: (props: Record<string, unknown>) => (
    <div data-testid="plots-dualaxes" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { ComboChart } from './ComboChart'

const DATA = [
  { dia: 'Lun', llamadas: 892, nivel: 87 },
  { dia: 'Mar', llamadas: 1240, nivel: 82 },
  { dia: 'Mié', llamadas: 1087, nivel: 85 },
]

describe('ComboChart', () => {
  it('renders a role=img frame with ariaLabel', () => {
    render(
      <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
        ariaLabel="Volumen vs nivel de servicio" />,
    )
    expect(screen.getByRole('img', { name: 'Volumen vs nivel de servicio' })).toBeInTheDocument()
  })

  it('forwards xField, children config, autoFit and theme to DualAxes', () => {
    render(
      <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
        ariaLabel="x" />,
    )
    const props = JSON.parse(screen.getByTestId('plots-dualaxes').dataset.props!)
    expect(props.xField).toBe('dia')
    expect(props.autoFit).toBe(true)
    expect(props.theme.type).toBe('classic')
    expect(Array.isArray(props.children)).toBe(true)
    expect(props.children).toHaveLength(2)
    expect(props.children[0].type).toBe('interval')
    expect(props.children[0].yField).toBe('llamadas')
    expect(props.children[1].type).toBe('line')
    expect(props.children[1].yField).toBe('nivel')
  })

  it('shows Skeleton when loading', () => {
    render(
      <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
        ariaLabel="x" loading data-testid="cc" />,
    )
    expect(screen.queryByTestId('plots-dualaxes')).not.toBeInTheDocument()
    expect(screen.getByTestId('cc')).toBeInTheDocument()
  })

  it('shows EmptyState when data is empty', () => {
    render(
      <ComboChart data={[]} xField="dia" barField="llamadas" lineField="nivel"
        ariaLabel="x" />,
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('builds srTable with xField, barField, lineField headers', () => {
    render(
      <ComboChart data={DATA} xField="dia" barField="llamadas" lineField="nivel"
        ariaLabel="x" />,
    )
    expect(screen.getByRole('columnheader', { name: 'dia' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'llamadas' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '892' })).toBeInTheDocument()
  })
})
