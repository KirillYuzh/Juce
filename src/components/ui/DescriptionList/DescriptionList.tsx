import type { ReactNode } from 'react';
import styles from './DescriptionList.module.css';
import { Text } from '../Typography';
import { cx } from '../../../lib/cx';

export interface DescriptionListItem {
  id?: string;
  label: ReactNode;
  value: ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionListItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function DescriptionList({ items, columns = 1, className }: DescriptionListProps) {
  return (
    <dl className={cx(styles.list, className)} data-columns={columns}>
      {items.map((item, index) => (
        <div key={item.id ?? index} className={styles.pair}>
          <Text as="dt" size="s" tone="secondary">
            {item.label}
          </Text>
          <Text as="dd" className={styles.value}>
            {item.value}
          </Text>
        </div>
      ))}
    </dl>
  );
}
