import type { CSSProperties, ElementType, ReactNode } from 'react';
import styles from './Card.module.css';
import { cx } from '../../../lib/cx';
import { radiusStyle, type RadiusValue } from '../../../lib/radius';

export type CardTone = 'surface' | 'secondary' | 'inverse';
export type CardDensity = 'm' | 'l';
export type CardAs = 'article' | 'div' | 'section' | 'a';
export type CardMediaPosition = 'top' | 'bottom' | 'right' | 'back' | 'block' | 'side';

export interface CardBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  as?: CardAs;
  tone?: CardTone;
  density?: CardDensity;
  radius?: RadiusValue;
  mediaWidth?: string;
  ref?: React.Ref<HTMLElement>;
  children: ReactNode;
}

export type CardProps = CardBaseProps &
  ({ interactive?: false; href?: string } | { interactive: true; href: string });

export function Card({
  as = 'article',
  href,
  tone = 'surface',
  density = 'm',
  radius,
  mediaWidth,
  interactive,
  className,
  style,
  children,
  ref,
  ...rest
}: CardProps) {
  const Tag: ElementType = href ? 'a' : as;
  const sizing = mediaWidth
    ? ({ ...style, '--tb-card-media-width': mediaWidth } as CSSProperties)
    : style;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement> & React.Ref<HTMLDivElement> & React.Ref<HTMLAnchorElement>}
      className={cx(styles.card, className)}
      data-slot="card"
      data-tone={tone}
      data-density={density}
      data-interactive={interactive || undefined}
      href={href}
      style={radiusStyle(radius, sizing)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardMedia({
  position = 'block',
  className,
  children,
}: {
  position?: CardMediaPosition;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx(styles.media, className)} data-slot="card-media" data-position={position}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.body, className)} data-slot="card-body">
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.header, className)} data-slot="card-header">
      {children}
    </div>
  );
}

export function CardTitle({
  as: Heading = 'h3',
  className,
  children,
}: {
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Heading className={cx(styles.title, className)} data-slot="card-title">
      {children}
    </Heading>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cx(styles.description, className)} data-slot="card-description">
      {children}
    </p>
  );
}

export function CardAction({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.action, className)} data-slot="card-action">
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.content, className)} data-slot="card-content">
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(styles.footer, className)} data-slot="card-footer">
      {children}
    </div>
  );
}
