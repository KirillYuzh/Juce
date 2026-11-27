import type { ReactNode } from 'react';
import styles from './Timeline.module.css';
import { cx } from '../../../lib/cx';
import { Text } from '../Typography';

export type TimelineTone = 'neutral' | 'accent' | 'success' | 'error';

export interface TimelineItem {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  tone?: TimelineTone;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx(styles.timeline, className)} data-slot="timeline">
      {items.map((item, index) => (
        <li
          key={item.id ?? index}
          className={styles.item}
          data-slot="timeline-item"
          data-tone={item.tone ?? 'neutral'}
        >
          <div className={styles.markerColumn}>
            <span className={styles.marker} data-slot="timeline-marker" aria-hidden="true">
              {item.icon ?? <span className={styles.dot} data-slot="timeline-dot" />}
            </span>
            {index < items.length - 1 ? (
              <span className={styles.line} data-slot="timeline-line" aria-hidden="true" />
            ) : null}
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <Text weight="medium" data-slot="timeline-title">
                {item.title}
              </Text>
              {item.time ? (
                <Text
                  as="span"
                  size="s"
                  tone="secondary"
                  className={styles.time}
                  data-slot="timeline-time"
                >
                  {item.time}
                </Text>
              ) : null}
            </div>
            {item.description ? (
              <Text size="s" tone="secondary" data-slot="timeline-description">
                {item.description}
              </Text>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
