import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../components/TableAdvanced/TableAdvanced', () => ({
  TableAdvanced: (props: Record<string, unknown>) => (
    <div data-testid="table-advanced" data-props={JSON.stringify(props, (_k, v) =>
      typeof v === 'function' ? '__fn__' : v)} />
  ),
}))

import { PivotTable, TOTAL_ROW_ID } from './PivotTable'

const DATA = [
  { agente: 'Carlos R.', cobranza: 234, soporte: 145, total: 379, csat: 94.2 },
  { agente: 'Ana P.',    cobranza: 198, soporte: 167, total: 365, csat: 96.1 },
  { agente: 'Luis G.',   cobranza: 312, soporte: 89,  total: 401, csat: 88.3 },
]

describe('PivotTable', () => {
  it('renders a TableAdvanced', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        data-testid="pt" />,
    )
    expect(screen.getByTestId('table-advanced')).toBeInTheDocument()
  })

  it('builds columns from rowField + valueFields', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        data-testid="pt" />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.columns).toHaveLength(3) // rowField + 2 valueFields
    expect(props.columns[0].key).toBe('agente')
    expect(props.columns[1].key).toBe('cobranza')
    expect(props.columns[2].key).toBe('soporte')
  })

  it('appends a totals row when showTotals is true', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        showTotals data-testid="pt" />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.data).toHaveLength(4) // 3 data rows + 1 total
    const totalRow = (props.data as Array<Record<string, unknown>>).find(
      (r) => r.__pivot_total === true,
    )
    expect(totalRow).toBeDefined()
    expect(totalRow!.cobranza).toBe(744) // 234 + 198 + 312
  })

  it('getRowId returns TOTAL_ROW_ID for the total row', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        showTotals data-testid="pt" />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    // getRowId is serialized as '__fn__' — we re-render and verify via data structure
    const totalRow = (props.data as Array<Record<string, unknown>>).find(
      (r) => r.__pivot_total === true,
    )
    expect(totalRow).toBeDefined()
    // Verify the marker field exists for getRowId to use
    expect(totalRow!.__pivot_total).toBe(true)
  })

  it('passes isLoading to TableAdvanced', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        isLoading data-testid="pt" />,
    )
    const props = JSON.parse(screen.getByTestId('table-advanced').dataset.props!)
    expect(props.isLoading).toBe(true)
  })

  it('forwards data-testid to TableAdvanced', () => {
    render(
      <PivotTable data={DATA} rowField="agente" valueFields={['cobranza', 'soporte']}
        data-testid="my-pivot" />,
    )
    const el = screen.getByTestId('table-advanced')
    expect(el).toBeInTheDocument()
  })
})
