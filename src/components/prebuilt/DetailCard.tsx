import type { ReactNode } from 'react';
import styles from './Prebuilt.module.css';
import { safeHref } from '../../lib/url';
import {
  Card,
  CardAction,
  CardBody,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
  type CardMediaPosition,
} from '../ui/Card';

export interface DetailCardMeta {
  id?: string;
  label?: ReactNode;
  value: ReactNode;
}

export interface DetailCardProps {
  title: ReactNode;
  description?: ReactNode;
  tags?: ReactNode;
  meta?: DetailCardMeta[];
  media?: ReactNode;
  mediaPosition?: CardMediaPosition;
  href?: string;
  children?: ReactNode;
  className?: string;
}

export function DetailCard({
  title,
  description,
  tags,
  meta,
  media,
  mediaPosition = 'top',
  href,
  children,
  className,
}: DetailCardProps) {
  const link = href ? safeHref(href) : undefined;
  const cardLink = link
    ? { as: 'a' as const, href: link, interactive: true as const }
    : { as: 'article' as const };

  return (
    <Card {...cardLink} tone="secondary" className={className}>
      {media && <CardMedia position={mediaPosition}>{media}</CardMedia>}
      <CardBody>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {tags && <CardAction className={styles.tags}>{tags}</CardAction>}
        </CardHeader>
        {description && <CardDescription>{description}</CardDescription>}
        {children}
        {meta && meta.length > 0 && (
          <div className={styles.meta}>
            {meta.map((item, index) => (
              <span className={styles.metaItem} key={`${item.id ?? 'meta'}-${index}`}>
                {item.label && <span className={styles.metaLabel}>{item.label}</span>}
                <span>{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
