import type { ReactNode } from 'react';
import styles from './Prebuilt.module.css';
import { Button } from '../ui/Button';
import type { IconName } from '../ui/Icon';
import { Card, CardBody, CardDescription, CardMedia, CardTitle } from '../ui/Card';
import { safeHref } from '../../lib/url';

export interface MediaPanelLink {
  label: string;
  href: string;
  icon?: IconName;
}

export interface MediaPanelProps {
  title: ReactNode;
  text?: ReactNode;
  media?: ReactNode;
  mediaWidth?: string;
  links?: MediaPanelLink[];
  className?: string;
}

export function MediaPanel({ title, text, media, mediaWidth, links, className }: MediaPanelProps) {
  return (
    <Card tone="secondary" density="l" mediaWidth={mediaWidth} className={className}>
      <CardBody>
        <CardTitle as="h3">{title}</CardTitle>
        {text && <CardDescription>{text}</CardDescription>}
        {links && links.length > 0 && (
          <div className={styles.actions}>
            {links.map((link, index) => (
              <Button
                key={`${link.href}-${link.label}-${index}`}
                href={safeHref(link.href)}
                iconLeft={link.icon}
              >
                {link.label}
              </Button>
            ))}
          </div>
        )}
      </CardBody>
      {media && <CardMedia position="side">{media}</CardMedia>}
    </Card>
  );
}
