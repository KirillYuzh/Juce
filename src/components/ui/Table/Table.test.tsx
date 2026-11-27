import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
  Table,
  type TableColumn,
  type TableFilters,
  type TableNodeColumn,
  type TableSort,
  type TableValueColumn,
} from './Table';

interface User {
  id: number;
  name: string;
  score: number | null;
  status: string;
}

const rows: User[] = [
  { id: 1, name: 'Ада', score: 30, status: 'Активен' },
  { id: 2, name: 'Грейс', score: null, status: 'Отпуск' },
  { id: 3, name: 'Алан', score: 10, status: 'Активен' },
];

const rowKey = (row: User) => row.id;

function makeColumns(): TableColumn<User>[] {
  return [
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
      id: 'score',
      header: 'Баллы',
      filterable: true,
      value: (row) => row.score,
    },
    {
      kind: 'node',
      id: 'status',
      header: 'Статус',
      cell: (row) => <span>{row.status}</span>,
    },
  ];
}

function SortableTable() {
  const [sort, setSort] = useState<TableSort | null>(null);
  return (
    <Table columns={makeColumns()} rows={rows} rowKey={rowKey} sort={sort} onSortChange={setSort} />
  );
}

function FilterableTable() {
  const [filters, setFilters] = useState<TableFilters>({});
  return (
    <Table
      columns={makeColumns()}
      rows={rows}
      rowKey={rowKey}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}

function SelectableTable() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  return (
    <Table
      columns={makeColumns()}
      rows={rows}
      rowKey={rowKey}
      rowLabel={(row) => row.name}
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
    />
  );
}

describe('Table', () => {
  it('renders caption, column scopes, rows and both cell kinds', () => {
    render(<Table caption="Команда" columns={makeColumns()} rows={rows} rowKey={rowKey} />);

    expect(screen.getByText('Команда')).toBeTruthy();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(3);
    expect(headers.every((header) => header.getAttribute('scope') === 'col')).toBe(true);
    expect(screen.getByText('Ада').tagName).toBe('STRONG');
    expect(screen.getByText('30')).toBeTruthy();
    expect(screen.getByText('Отпуск')).toBeTruthy();
  });

  it('cycles sorting asc, desc, null and reports aria-sort', () => {
    render(<SortableTable />);
    const nameHeader = () => screen.getByRole('columnheader', { name: 'Имя' });

    expect(nameHeader().getAttribute('aria-sort')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Имя' }));
    expect(nameHeader().getAttribute('aria-sort')).toBe('ascending');

    fireEvent.click(screen.getByRole('button', { name: 'Имя' }));
    expect(nameHeader().getAttribute('aria-sort')).toBe('descending');

    fireEvent.click(screen.getByRole('button', { name: 'Имя' }));
    expect(nameHeader().getAttribute('aria-sort')).toBeNull();
  });

  it('calls onSortChange only when a handler is provided', () => {
    const onSortChange = vi.fn();
    const { unmount } = render(
      <Table
        columns={makeColumns()}
        rows={rows}
        rowKey={rowKey}
        sort={null}
        onSortChange={onSortChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Баллы' }));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'score', direction: 'asc' });
    unmount();

    render(<Table columns={makeColumns()} rows={rows} rowKey={rowKey} />);
    expect(screen.queryByRole('button', { name: 'Баллы' })).toBeNull();
  });

  it('filters value columns and gives node columns no filter input', () => {
    render(<FilterableTable />);

    expect(screen.getByLabelText('Фильтр: name')).toBeTruthy();
    expect(screen.getByLabelText('Фильтр: score')).toBeTruthy();
    expect(screen.queryByLabelText('Фильтр: status')).toBeNull();

    fireEvent.change(screen.getByLabelText('Фильтр: name'), { target: { value: 'ал' } });

    expect(screen.getByText('Алан')).toBeTruthy();
    expect(screen.queryByText('Ада')).toBeNull();
    expect(screen.queryByText('Грейс')).toBeNull();
  });

  it('selects a row and all rows through onSelectionChange', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={makeColumns()}
        rows={rows}
        rowKey={rowKey}
        rowLabel={(row) => row.name}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={onSelectionChange}
      />
    );

    const [selectAll, firstRow] = screen.getAllByRole('checkbox');
    fireEvent.click(firstRow);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set([1]));

    fireEvent.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set([1, 2, 3]));
  });

  it('marks every row and the header checkbox when all are selected', () => {
    render(<SelectableTable />);
    const [selectAll] = screen.getAllByRole('checkbox');

    fireEvent.click(selectAll);

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(checkboxes.every((checkbox) => checkbox.checked)).toBe(true);

    fireEvent.click(selectAll);
    expect(
      (screen.getAllByRole('checkbox') as HTMLInputElement[]).every((box) => !box.checked)
    ).toBe(true);
  });

  it('renders the empty state with a matching colSpan', () => {
    render(<Table columns={makeColumns()} rows={[]} rowKey={rowKey} />);
    const empty = screen.getByText('Нет данных');
    expect(empty.tagName).toBe('TD');
    expect(empty.getAttribute('colspan')).toBe('3');
  });

  it('counts the selection column in the empty colSpan', () => {
    render(
      <Table
        columns={makeColumns()}
        rows={[]}
        rowKey={rowKey}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText('Нет данных').getAttribute('colspan')).toBe('4');
  });

  it('activates a row on click and Enter but not through its checkbox', () => {
    const onRowClick = vi.fn();
    render(
      <Table
        columns={makeColumns()}
        rows={rows}
        rowKey={rowKey}
        rowLabel={(row) => row.name}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={() => {}}
        onRowClick={onRowClick}
      />
    );

    const row = screen.getAllByRole('row')[2];
    fireEvent.click(screen.getByText('Отпуск'));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);

    fireEvent.keyDown(row, { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledTimes(2);

    const [, firstRowCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.click(firstRowCheckbox);
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it('sorts a column of mixed numbers and numeric strings as numbers', () => {
    interface Metric {
      id: number;
      label: string;
      amount: number | string;
    }

    const metricRows: Metric[] = [
      { id: 1, label: 'Десять', amount: 10 },
      { id: 2, label: 'Девять', amount: '9' },
      { id: 3, label: 'Два', amount: 2 },
    ];
    const metricColumns: TableColumn<Metric>[] = [
      { kind: 'value', id: 'label', header: 'Метка', value: (row) => row.label },
      { kind: 'value', id: 'amount', header: 'Значение', value: (row) => row.amount },
    ];

    render(
      <Table
        columns={metricColumns}
        rows={metricRows}
        rowKey={(row) => row.id}
        sort={{ columnId: 'amount', direction: 'asc' }}
      />
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent)
    ).toEqual(['Два2', 'Девять9', 'Десять10']);
  });

  it('keeps an all-string column lexicographic', () => {
    interface Code {
      id: number;
      code: string;
    }

    const codeRows: Code[] = [
      { id: 1, code: '9' },
      { id: 2, code: '10' },
      { id: 3, code: '2' },
    ];
    const codeColumns: TableColumn<Code>[] = [
      { kind: 'value', id: 'code', header: 'Код', value: (row) => row.code },
    ];

    render(
      <Table
        columns={codeColumns}
        rows={codeRows}
        rowKey={(row) => row.id}
        sort={{ columnId: 'code', direction: 'asc' }}
      />
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent)
    ).toEqual(['10', '2', '9']);
  });

  it('keeps null values last in both directions', () => {
    const names = () =>
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent ?? '');

    const { rerender } = render(
      <Table
        columns={makeColumns()}
        rows={rows}
        rowKey={rowKey}
        sort={{ columnId: 'score', direction: 'asc' }}
      />
    );
    expect(names()[0]).toContain('Алан');
    expect(names()[2]).toContain('Грейс');

    rerender(
      <Table
        columns={makeColumns()}
        rows={rows}
        rowKey={rowKey}
        sort={{ columnId: 'score', direction: 'desc' }}
      />
    );
    expect(names()[0]).toContain('Ада');
    expect(names()[2]).toContain('Грейс');
  });

  it('types node columns without value accessors', () => {
    expectTypeOf<TableNodeColumn<User>['value']>().toEqualTypeOf<undefined>();
    expectTypeOf<TableColumn<User>>().toEqualTypeOf<
      TableValueColumn<User> | TableNodeColumn<User>
    >();
  });
});
