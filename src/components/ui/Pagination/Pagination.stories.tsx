import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta: Meta = {
  title: 'Primitives/Pagination',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function PaginationExample() {
  const [page, setPage] = useState(5);

  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <PaginationExample />,
  parameters: {
    docs: {
      source: { code: '<Pagination page={page} pageCount={12} onPageChange={setPage} />' },
    },
  },
};
