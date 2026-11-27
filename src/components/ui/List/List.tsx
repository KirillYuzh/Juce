import { Fragment, useState, type ElementType, type ReactNode } from 'react';
import styles from './List.module.css';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { Text } from '../Typography';
import { cx } from '../../../lib/cx';
import { useDomId } from '../../../lib/use-id';

export interface ListProps {
  children: ReactNode;
  divided?: boolean;
  className?: string;
}

export function List({ children, divided, className }: ListProps) {
  return (
    <ul className={cx(styles.list, className)} data-divided={divided || undefined}>
      {children}
    </ul>
  );
}

export interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ListRow({
  leading,
  title,
  description,
  meta,
  trailing,
  href,
  onClick,
  className,
}: ListRowProps) {
  const Tag: ElementType = href ? 'a' : onClick ? 'button' : 'div';
  const interactive = Boolean(href || onClick);

  return (
    <li className={cx(styles.row, className)}>
      <Tag
        className={cx(styles.content, interactive && styles.interactive)}
        href={href}
        type={Tag === 'button' ? 'button' : undefined}
        onClick={onClick}
        data-interactive={interactive || undefined}
      >
        {leading ? <span className={styles.leading}>{leading}</span> : null}
        <Stack as="span" gap="1" className={styles.body}>
          <Text as="span" weight="medium">
            {title}
          </Text>
          {description ? (
            <Text as="span" size="s" tone="secondary">
              {description}
            </Text>
          ) : null}
          {meta ? (
            <Text as="span" size="xs" tone="tertiary">
              {meta}
            </Text>
          ) : null}
        </Stack>
        {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
      </Tag>
    </li>
  );
}

export interface CollapsibleListProps {
  items: ReactNode[];
  initial?: number;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
}

export function CollapsibleList({
  items,
  initial = 5,
  moreLabel = 'Показать все',
  lessLabel = 'Свернуть',
  className,
}: CollapsibleListProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = `collapsible-list-${useDomId()}`;
  const visible = expanded ? items : items.slice(0, initial);
  const hidden = items.length - initial;

  return (
    <Stack gap="3" align="start" className={className}>
      <div id={listId} className={styles.group}>
        <List>
          {visible.map((item, index) => (
            <Fragment key={index}>{item}</Fragment>
          ))}
        </List>
      </div>
      {hidden > 0 ? (
        <Button
          variant="secondary"
          size="s"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? lessLabel : moreLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
