import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Wave 2 — Form Controls/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo de búsqueda con ícono Search a la izquierda y botón de limpiar (×) cuando hay valor. Usa el componente Icon de Wave 1. Reference: `design-system-reference/preview/components-inputs.html`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof SearchInput>

export const Default: Story = {
  args: {
    label: 'Buscar contacto',
    placeholder: 'Nombre, teléfono o ID…',
    hideLabel: false,
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('Carlos Rodríguez')
    return (
      <SearchInput
        label="Buscar contacto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="Nombre, teléfono o ID…"
      />
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <SearchInput label="Normal" placeholder="Nombre, teléfono o ID…" />
      <SearchInput
        label="Con valor y clear"
        value="Carlos"
        onClear={() => {}}
        onChange={() => {}}
      />
      <SearchInput label="Con error" error="Búsqueda inválida" />
      <SearchInput label="Deshabilitado" disabled />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <SearchInput label="Tamaño sm" size="sm" placeholder="Pequeño" />
      <SearchInput label="Tamaño md" size="md" placeholder="Mediano" />
      <SearchInput label="Tamaño lg" size="lg" placeholder="Grande" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        label="Buscar contacto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="Nombre, teléfono o ID…"
        hint="Presiona × para limpiar"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Buscar contacto')
    await userEvent.type(input, 'Carlos')
    await expect(input).toHaveValue('Carlos')
    const clearBtn = canvas.getByRole('button', { name: 'Limpiar búsqueda' })
    await expect(clearBtn).toBeVisible()
    await userEvent.click(clearBtn)
    await expect(input).toHaveValue('')
  },
}
