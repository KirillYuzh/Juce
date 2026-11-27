import { useMemo, type ReactNode } from 'react';
import styles from './Table.module.css';
import { Checkbox, Input } from '../Fields';
import { Icon } from '../Icon';
import { cx } from '../../../lib/cx';

export type TableAlign = 'start' | 'center' | 'end';
export type TableDensity = 's' | 'm' | 'l';
export type TableSortDirection = 'asc' | 'desc';
export type TableFilters = Record<string, string>;
export type TableValue = string | number | boolean | Date | null | undefined;

export interface TableSort {
  columnId: string;
  direction: TableSortDirection;
}

export interface TableColumnBase<Row> {
  id: string;
  header: ReactNode;
  align?: TableAlign;
  width?: string;
  cell?: (row: Row, index: number) => ReactNode;
}

export interface TableValueColumn<Row> extends TableColumnBase<Row> {
  kind: 'value';
  value: (row: Row, index: number) => TableValue;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableNodeColumn<Row> extends TableColumnBase<Row> {
  kind: 'node';
  cell: (row: Row, index: number) => ReactNode;
  value?: never;
  sortable?: never;
  filterable?: never;
}

export type TableColumn<Row> = TableValueColumn<Row> | TableNodeColumn<Row>;

export interface TableProps<Row> {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  rowKey: (row: Row) => string | number;
  caption?: ReactNode;
  density?: TableDensity;
  align?: TableAlign;
  empty?: ReactNode;
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  filters?: TableFilters;
  onFiltersChange?: (filters: TableFilters) => void;
  selectable?: boolean;
  selectedKeys?: ReadonlySet<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
  onRowClick?: (row: Row) => void;
  rowLabel?: (row: Row) => string;
  className?: string;
}

function isValueColumn<Row>(column: TableColumn<Row>): column is TableValueColumn<Row> {
  return column.kind === 'value';
}

function isNumericValue(value: NonNullable<TableValue>): boolean {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') return value.trim() !== '' && Number.isFinite(Number(value));
  return false;
}

function compareValues(
  a: NonNullable<TableValue>,
  b: NonNullable<TableValue>,
  numeric: boolean
): number {
  if (numeric) return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return String(a).localeCompare(String(b), 'ru');
}

function isNestedControl(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('button, a, input, label') !== null;
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  density = 'm',
  align = 'start',
  empty = 'Нет данных',
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  selectable,
  selectedKeys,
  onSelectionChange,
  onRowClick,
  rowLabel,
  className,
}: TableProps<Row>) {
  const withSelection = Boolean(selectable && onSelectionChange);

  const visible = useMemo(() => {
    const entries = rows.map((row, index) => ({ row, index }));
    const activeFilters = filters
      ? Object.entries(filters).filter(([, query]) => query.trim() !== '')
      : [];
    const filterColumns = columns.filter(
      (column): column is TableValueColumn<Row> =>
        isValueColumn(column) && Boolean(column.filterable)
    );

    let result = entries;

    if (activeFilters.length > 0 && filterColumns.length > 0) {
      result = result.filter(({ row, index }) =>
        activeFilters.every(([columnId, query]) => {
          const column = filterColumns.find((item) => item.id === columnId);
          if (!column) return true;
          const value = column.value(row, index);
          return String(value ?? '')
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        })
      );
    }

    const sortColumn = sort
      ? columns.find(
          (column): column is TableValueColumn<Row> =>
            isValueColumn(column) && column.id === sort.columnId
        )
      : undefined;

    if (sort && sortColumn) {
      const direction = sort.direction;
      const values = result
        .map(({ row, index }) => sortColumn.value(row, index))
        .filter((value): value is NonNullable<TableValue> => value != null);
      const numeric =
        values.some((value) => typeof value === 'number') && values.every(isNumericValue);
      result = [...result].sort((left, right) => {
        const a = sortColumn.value(left.row, left.index);
        const b = sortColumn.value(right.row, right.index);
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        const order = compareValues(a, b, numeric);
        return direction === 'asc' ? order : -order;
      });
    }

    return result;
  }, [columns, filters, rows, sort]);

  const allVisibleSelected =
    withSelection &&
    visible.length > 0 &&
    visible.every(({ row }) => selectedKeys?.has(rowKey(row)));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys ?? []);
    for (const { row } of visible) {
      const key = rowKey(row);
      if (allVisibleSelected) next.delete(key);
      else next.add(key);
    }
    onSelectionChange(next);
  };

  const handleToggleRow = (key: string | number) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys ?? []);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  };

  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const current = sort?.columnId === columnId ? sort.direction : null;
    const direction: TableSortDirection | null =
      current === null ? 'asc' : current === 'asc' ? 'desc' : null;
    onSortChange(direction ? { columnId, direction } : null);
  };

  const headerAriaSort = (column: TableValueColumn<Row>) => {
    if (!sort) return undefined;
    if (sort.columnId !== column.id) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className={cx('tb-scroll-fade-x', styles.wrapper, className)}>
      <table className={styles.table} data-density={density} data-align={align}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {withSelection && (
              <th scope="col" className={cx(styles.cell, styles.headCell, styles.select)}>
                <span className={styles.selectInner}>
                  <Checkbox
                    checked={allVisibleSelected}
                    onChange={handleSelectAll}
                    onClick={(event) => event.stopPropagation()}
                    label={<span className="tb-visually-hidden">Выбрать все</span>}
                  />
                </span>
              </th>
            )}
            {columns.map((column) => {
              const canSort =
                isValueColumn(column) && Boolean(onSortChange) && (column.sortable ?? true);
              const active = Boolean(sort && sort.columnId === column.id);
              const ariaSort =
                canSort && isValueColumn(column) ? headerAriaSort(column) : undefined;

              return (
                <th
                  key={column.id}
                  scope="col"
                  className={cx(styles.cell, styles.headCell)}
                  data-align={column.align ?? align}
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={ariaSort}
                >
                  {canSort ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      data-active={active || undefined}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.header}
                      <span className={styles.sortIcon} data-active={active || undefined}>
                        <Icon
                          name={active && sort?.direction === 'asc' ? 'chevronUp' : 'chevronDown'}
                          size={16}
                        />
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
          {onFiltersChange && (
            <tr>
              {withSelection && (
                <td className={cx(styles.cell, styles.filterCell, styles.select)} />
              )}
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cx(styles.cell, styles.filterCell)}
                  data-align={column.align ?? align}
                >
                  {isValueColumn(column) && column.filterable && (
                    <Input
                      size="s"
                      placeholder="Фильтр"
                      aria-label={`Фильтр: ${column.id}`}
                      value={filters?.[column.id] ?? ''}
                      onChange={(event) =>
                        onFiltersChange({ ...filters, [column.id]: event.target.value })
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length + (withSelection ? 1 : 0)}>
                {empty}
              </td>
            </tr>
          ) : (
            visible.map(({ row, index }) => {
              const key = rowKey(row);
              const selected = selectedKeys?.has(key) ?? false;

              return (
                <tr
                  key={key}
                  className={styles.row}
                  data-interactive={onRowClick ? true : undefined}
                  data-selected={selected || undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-label={rowLabel?.(row)}
                  onClick={(event) => {
                    if (!onRowClick || isNestedControl(event.target)) return;
                    onRowClick(row);
                  }}
                  onKeyDown={(event) => {
                    if (!onRowClick || event.target !== event.currentTarget) return;
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    onRowClick(row);
                  }}
                >
                  {withSelection && (
                    <td className={cx(styles.cell, styles.select)}>
                      <span className={styles.selectInner}>
                        <Checkbox
                          checked={selected}
                          onChange={() => handleToggleRow(key)}
                          onClick={(event) => event.stopPropagation()}
                          label={
                            <span className="tb-visually-hidden">
                              {rowLabel?.(row) ?? 'Выбрать строку'}
                            </span>
                          }
                        />
                      </span>
                    </td>
                  )}
                  {columns.map((column) => {
                    const content = column.cell
                      ? column.cell(row, index)
                      : isValueColumn(column)
                        ? String(column.value(row, index) ?? '')
                        : null;

                    return (
                      <td
                        key={column.id}
                        className={styles.cell}
                        data-align={column.align ?? align}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
