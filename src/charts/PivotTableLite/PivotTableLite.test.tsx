import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../components/TableAdvanced/TableAdvanced', () => ({
  TableAdvanced: (props: Record<string, unknown>) => (
    <div data-testid="table-advanced" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { PivotTableLite } from './PivotTableLite'

const DATA = [
  { agente: 'Carlos R.', cobranza: 234, soporte: 145, total: 379 },
  { agente: 'Ana P.',    cobranza: 198, soporte: 167, total: 365 },
  { agente: 'Luis G.',   cobranza: 312, soporte: 89,  total: 401 },
]

describe('PivotTableLite', () => {
  it('renders a TableAdvanced', () => {
    render(
      <PivotTableLite data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']} />,
    )
    expect(screen.getByTestId('table-advanced')).toBeInTheDocument()
  })

  it('builds columns with sortable=false', () => {
    render(
      <PivotTableLite data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']} />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.columns.every((c: { sortable: boolean }) => !c.sortable)).toBe(true)
  })

  it('appends totals row when showTotals is true', () => {
    render(
      <PivotTableLite data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        showTotals />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.data).toHaveLength(4)
    const totalRow = (props.data as Array<Record<string, unknown>>).find(
      (r) => r.__pivot_total === true,
    )
    expect(totalRow!.cobranza).toBe(744)
  })

  it('passes isLoading to TableAdvanced', () => {
    render(
      <PivotTableLite data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        isLoading />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.isLoading).toBe(true)
  })

  it('limits data to 3 rows when maxRows is set', () => {
    const bigData = [...DATA, { agente: 'Extra', cobranza: 100, soporte: 50, total: 150 }]
    render(
      <PivotTableLite data={bigData} rowField="agente" valueFields={['cobranza']}
        maxRows={3} />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.data).toHaveLength(3)
  })
})
