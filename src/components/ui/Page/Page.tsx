import type { ReactNode } from 'react';
import styles from './Page.module.css';
import { Stack } from '../Layout';
import { Heading, Text } from '../Typography';
import type { LinkRenderer } from '../../../lib/link';
import { cx } from '../../../lib/cx';

export interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <Stack gap="none" className={cx(styles.page, className)}>
      {children}
    </Stack>
  );
}

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  /** Avatar or icon shown next to the title */
  leading?: ReactNode;
  /** Cover media shown as a banner above the title */
  media?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  leading,
  media,
  className,
}: PageHeaderProps) {
  return (
    <header className={cx('tb-container', styles.header, className)}>
      <Stack gap="4">
        {breadcrumbs ? <div className={styles.breadcrumbSlot}>{breadcrumbs}</div> : null}
        {media ? <div className={styles.media}>{media}</div> : null}
        <div className={styles.titleRow}>
          {leading ? (
            <div className={cx(styles.leading, media ? styles.leadingOverMedia : undefined)}>
              {leading}
            </div>
          ) : null}
          <Stack gap="2" className={styles.titleBlock}>
            <Heading level={1} className={styles.title}>
              {title}
            </Heading>
            {description ? <Text tone="secondary">{description}</Text> : null}
          </Stack>
        </div>
        {actions ? (
          <Stack direction="row" gap="3" wrap>
            {actions}
          </Stack>
        ) : null}
      </Stack>
    </header>
  );
}

export function PageContent({ children, className }: PageProps) {
  return <div className={cx('tb-container', styles.content, className)}>{children}</div>;
}

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  linkComponent?: LinkRenderer;
  label?: string;
}

export function Breadcrumbs({
  items,
  linkComponent: LinkComponent,
  label = 'Хлебные крошки',
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={styles.breadcrumbs}>
      <ol className={styles.crumbs}>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          let content: ReactNode;

          if (current) {
            content = (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            );
          } else if (item.href) {
            const handleClick = item.onClick
              ? (event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  item.onClick?.();
                }
              : undefined;

            content = LinkComponent ? (
              <LinkComponent href={item.href} onClick={handleClick} className={styles.link}>
                {item.label}
              </LinkComponent>
            ) : (
              <a className={styles.link} href={item.href} onClick={handleClick}>
                {item.label}
              </a>
            );
          } else if (item.onClick) {
            content = (
              <button type="button" className={styles.crumbButton} onClick={item.onClick}>
                {item.label}
              </button>
            );
          } else {
            content = <span>{item.label}</span>;
          }

          return (
            <li key={index} className={styles.crumb}>
              {content}
              {current ? null : (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
