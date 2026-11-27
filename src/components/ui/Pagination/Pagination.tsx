import { useEffect, useRef } from 'react';
import styles from './Pagination.module.css';
import { Button, IconButton } from '../Button';
import { cx } from '../../../lib/cx';
import { clamp } from '../../../lib/clamp';

export interface PaginationLabels {
  previous?: string;
  next?: string;
  page?: (page: number) => string;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: 1;
  labels?: PaginationLabels;
  className?: string;
}

type PageEntry = number | 'start-gap' | 'end-gap';

function buildPages(current: number, total: number, siblingCount: number): PageEntry[] {
  const start = Math.max(2, current - siblingCount);
  const end = Math.min(total - 1, current + siblingCount);
  const pages = [1];

  for (let value = start; value <= end; value += 1) pages.push(value);
  if (total > 1) pages.push(total);

  const entries: PageEntry[] = [];
  pages.forEach((value, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && value - previous > 1) {
      entries.push(previous === 1 ? 'start-gap' : 'end-gap');
    }
    entries.push(value);
  });

  return entries;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  labels,
  className,
}: PaginationProps) {
  const total = Math.max(1, Math.floor(pageCount));
  const current = clamp(Math.floor(page), 1, total);
  const reported = useRef(page);

  useEffect(() => {
    if (page === current || reported.current === current) return;
    reported.current = current;
    onPageChange(current);
  }, [current, onPageChange, page]);

  const entries = buildPages(current, total, siblingCount);
  const previousLabel = labels?.previous ?? 'Предыдущая страница';
  const nextLabel = labels?.next ?? 'Следующая страница';
  const pageLabel = (value: number) => labels?.page?.(value) ?? `Страница ${value}`;

  return (
    <nav aria-label="Пагинация" className={cx(styles.pagination, className)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <IconButton
            icon="chevronLeft"
            label={previousLabel}
            size="s"
            variant="ghost"
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          />
        </li>
        {entries.map((entry, index) =>
          typeof entry === 'number' ? (
            <li key={entry} className={styles.item}>
              <Button
                size="s"
                variant={entry === current ? 'primary' : 'ghost'}
                aria-label={pageLabel(entry)}
                aria-current={entry === current ? 'page' : undefined}
                onClick={() => {
                  if (entry !== current) onPageChange(entry);
                }}
              >
                {entry}
              </Button>
            </li>
          ) : (
            <li key={`${entry}-${index}`} className={styles.item}>
              <span className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            </li>
          )
        )}
        <li className={styles.item}>
          <IconButton
            icon="chevronRight"
            label={nextLabel}
            size="s"
            variant="ghost"
            disabled={current >= total}
            onClick={() => onPageChange(current + 1)}
          />
        </li>
      </ul>
    </nav>
  );
}
