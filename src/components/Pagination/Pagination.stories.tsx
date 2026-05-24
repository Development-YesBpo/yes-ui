import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Wave 6a — Data Containers/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Control de navegación por páginas para tablas y listas. Referencia: `design-system-reference/preview/components-table-advanced.html` → sección Pagination.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: { page: 1, pageSize: 20, total: 248, onPageChange: () => {} },
}

export const WithPageSize: Story = {
  args: {
    page: 2,
    pageSize: 20,
    total: 248,
    pageSizeOptions: [20, 50, 100],
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
}

export const LastPage: Story = {
  args: { page: 13, pageSize: 20, total: 248, onPageChange: () => {} },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    return (
      <Pagination
        page={page}
        pageSize={size}
        total={248}
        pageSizeOptions={[20, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />
    )
  },
}
