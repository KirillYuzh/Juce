import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn, type TableFilters, type TableSort } from './Table';
import { Badge, type BadgeTone } from '../Display';
import { Button } from '../Button';

interface User {
  id: number;
  name: string;
  role: string;
  score: number;
  status: 'Активен' | 'Отпуск' | 'Заблокирован';
}

const users: User[] = [
  { id: 1, name: 'Ада Лавлейс', role: 'Инженер', score: 92, status: 'Активен' },
  { id: 2, name: 'Грейс Хоппер', role: 'Архитектор', score: 98, status: 'Активен' },
  { id: 3, name: 'Алан Тьюринг', role: 'Исследователь', score: 87, status: 'Отпуск' },
  { id: 4, name: 'Кэтрин Джонсон', role: 'Аналитик', score: 74, status: 'Заблокирован' },
];

const statusTone: Record<User['status'], BadgeTone> = {
  Активен: 'success',
  Отпуск: 'warning',
  Заблокирован: 'error',
};

function TableDemo() {
  const [sort, setSort] = useState<TableSort | null>({ columnId: 'score', direction: 'desc' });
  const [filters, setFilters] = useState<TableFilters>({});
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [lastClick, setLastClick] = useState('—');

  const columns: TableColumn<User>[] = [
    {
      kind: 'value',
      id: 'name',
      header: 'Имя',
      filterable: true,
      value: (row) => row.name,
      cell: (row) => <strong>{row.name}</strong>,
    },
    {
      kind: 'value',
      id: 'role',
      header: 'Роль',
      filterable: true,
      value: (row) => row.role,
    },
    {
      kind: 'value',
      id: 'score',
      header: 'Баллы',
      align: 'end',
      filterable: true,
      value: (row) => row.score,
    },
    {
      kind: 'node',
      id: 'status',
      header: 'Статус',
      cell: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
    },
    {
      kind: 'node',
      id: 'actions',
      header: '',
      align: 'end',
      cell: (row) => (
        <Button size="s" variant="ghost" onClick={() => setLastClick(row.name)}>
          Открыть
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <Table
        caption="Участники"
        columns={columns}
        rows={users}
        rowKey={(row) => row.id}
        rowLabel={(row) => row.name}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onFiltersChange={setFilters}
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        onRowClick={(row) => setLastClick(row.name)}
      />
      <p
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 24px',
          margin: 0,
          color: 'var(--tb-text-secondary)',
          font: '400 13px/18px var(--tb-font-text)',
        }}
      >
        <span>
          Сортировка: {sort ? `${sort.columnId} ${sort.direction === 'asc' ? '↑' : '↓'}` : 'нет'}
        </span>
        <span>Выбрано: {selected.size}</span>
        <span>Клик: {lastClick}</span>
      </p>
    </div>
  );
}

const meta = {
  title: 'Primitives/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <TableDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Table
  caption="Участники"
  columns={columns}
  rows={users}
  rowKey={(row) => row.id}
  rowLabel={(row) => row.name}
  sort={sort}
  onSortChange={setSort}
  filters={filters}
  onFiltersChange={setFilters}
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  onRowClick={(row) => setLastClick(row.name)}
/>`,
      },
    },
  },
};
