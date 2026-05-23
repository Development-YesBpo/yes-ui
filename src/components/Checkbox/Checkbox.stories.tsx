import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Wave 2 — Form Controls/Checkbox',
  component: Checkbox,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Casilla de verificación con soporte de estado indeterminado (usado en DataTable Wave 6). Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { label: 'Seleccionar fila' },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Sin marcar" />
      <Checkbox label="Marcado" defaultChecked />
      <Checkbox label="Indeterminado" indeterminate />
      <Checkbox label="Deshabilitado sin marcar" disabled />
      <Checkbox label="Deshabilitado marcado" defaultChecked disabled />
      <Checkbox label="Con error" error="Debes aceptar los términos" />
      <Checkbox label="Con hint" hint="Marca esta opción para continuar" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label={checked ? 'Seleccionado' : 'Sin seleccionar'}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cb = canvas.getByRole('checkbox')
    await expect(cb).not.toBeChecked()
    await userEvent.click(cb)
    await expect(cb).toBeChecked()
  },
}

export const IndeterminateDemo: Story = {
  render: () => {
    const [items, setItems] = useState([false, false, false])
    const someChecked = items.some(Boolean)
    const allItemsChecked = items.every(Boolean)
    const indeterminate = someChecked && !allItemsChecked

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      setItems(items.map(() => checked))
    }
    const handleItem = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = items.map((v, idx) => (idx === i ? e.target.checked : v))
      setItems(next)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox
          label="Seleccionar todo"
          checked={allItemsChecked}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
        {['Fila 1', 'Fila 2', 'Fila 3'].map((row, i) => (
          <div key={i} style={{ paddingLeft: 24 }}>
            <Checkbox label={row} checked={items[i]} onChange={handleItem(i)} />
          </div>
        ))}
      </div>
    )
  },
}
