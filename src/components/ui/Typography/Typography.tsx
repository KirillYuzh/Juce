import type { ElementType, ReactNode } from 'react';
import styles from './Typography.module.css';
import { Icon, type IconName } from '../Icon';
import { Button } from '../Button';
import { cx } from '../../../lib/cx';

export type TextSize = 'm' | 's' | 'xs' | 'l' | 'xl';
export type TextTone =
  'primary' | 'secondary' | 'tertiary' | 'muted' | 'inverse' | 'error' | 'link';
export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextLinkVariant = 'underline' | 'hover';

const textSize: Record<TextSize, string> = {
  m: styles.sizeM,
  s: styles.sizeS,
  xs: styles.sizeXs,
  l: styles.sizeL,
  xl: styles.sizeXl,
};

const textTone: Record<TextTone, string> = {
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  tertiary: styles.toneTertiary,
  muted: styles.toneMuted,
  inverse: styles.toneInverse,
  error: styles.toneError,
  link: styles.toneLink,
};

const textWeight: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  bold: styles.weightBold,
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  href?: string;
  /** Ссылка: подчёркивание всегда или только при наведении */
  variant?: TextLinkVariant;
}

export function Text({
  as,
  size = 'm',
  tone,
  weight = 'regular',
  href,
  variant = 'underline',
  className,
  children,
  ...rest
}: TextProps) {
  const Tag: ElementType = as ?? (href ? 'a' : 'p');
  const isAnchor = Tag === 'a';
  const resolvedTone: TextTone = tone ?? (href ? 'link' : 'primary');

  return (
    <Tag
      className={cx(
        styles.text,
        textSize[size],
        textTone[resolvedTone],
        textWeight[weight],
        isAnchor && styles.linkText,
        isAnchor && variant === 'hover' && styles.linkTextHover,
        className
      )}
      href={isAnchor ? href : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingTag: Record<HeadingLevel, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const headingLevel: Record<HeadingLevel, string> = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
  4: styles.level4,
  5: styles.level5,
  6: styles.level6,
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: ElementType;
}

export function Heading({ level = 2, as, className, children, ...rest }: HeadingProps) {
  const Tag: ElementType = as ?? headingTag[level];

  return (
    <Tag className={cx(styles.heading, headingLevel[level], className)} {...rest}>
      {children}
    </Tag>
  );
}

export interface QuoteProps extends React.HTMLAttributes<HTMLElement> {
  cite?: string;
}

export function Quote({ cite, className, children, ...rest }: QuoteProps) {
  return (
    <blockquote className={cx(styles.quote, className)} {...rest}>
      {children}
      {cite ? (
        <footer className={styles.quoteFooter}>
          <cite>{cite}</cite>
        </footer>
      ) : null}
    </blockquote>
  );
}

export type CalloutTone = 'note' | 'important' | 'warning' | 'error' | 'success';

const calloutIcon: Record<CalloutTone, IconName> = {
  note: 'info',
  important: 'alertCircle',
  warning: 'alertCircle',
  error: 'alertCircle',
  success: 'checkCircle',
};

export interface CalloutAction {
  label: ReactNode;
  onClick: () => void;
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutTone;
  title?: ReactNode;
  icon?: ReactNode;
  action?: CalloutAction;
}

export function Callout({
  tone = 'note',
  title,
  icon,
  action,
  className,
  children,
  ...rest
}: CalloutProps) {
  return (
    <div
      {...rest}
      className={cx(styles.callout, className)}
      data-tone={tone}
      role={tone === 'error' ? 'alert' : 'note'}
    >
      <span className={styles.calloutIcon}>
        {icon ?? <Icon name={calloutIcon[tone]} size={20} />}
      </span>
      <div className={styles.calloutBody}>
        {title ? <p className={styles.calloutTitle}>{title}</p> : null}
        <div className={styles.calloutRow}>
          <div className={styles.calloutContent}>{children}</div>
          {action ? (
            <Button
              variant="outline"
              size="s"
              className={styles.calloutAction}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function OrderedList({
  start,
  className,
  children,
  ...rest
}: React.OlHTMLAttributes<HTMLOListElement>) {
  return (
    <ol start={start} className={cx(styles.list, styles.ordered, className)} {...rest}>
      {children}
    </ol>
  );
}

export function UnorderedList({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cx(styles.list, styles.unordered, className)} {...rest}>
      {children}
    </ul>
  );
}

export function ListItem({ className, children, ...rest }: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cx(styles.item, className)} {...rest}>
      {children}
    </li>
  );
}

export function InlineCode({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code className={cx(styles.inlineCode, className)} {...rest}>
      {children}
    </code>
  );
}
