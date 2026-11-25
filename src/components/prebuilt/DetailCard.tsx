import type { ReactNode } from 'react';
import styles from './Prebuilt.module.css';
import {
  Card,
  CardAction,
  CardBody,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
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
  href,
  children,
  className,
}: DetailCardProps) {
  return (
    <Card
      as={href ? 'a' : 'article'}
      href={href}
      interactive={Boolean(href)}
      tone="secondary"
      className={className}
    >
      {media && <CardMedia>{media}</CardMedia>}
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
              <span className={styles.metaItem} key={item.id ?? index}>
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
