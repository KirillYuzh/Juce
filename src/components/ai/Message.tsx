import type { ReactNode } from 'react';
import styles from './Message.module.css';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type MessageAlign = 'start' | 'end';
export type BubbleVariant = 'muted' | 'accent' | 'outline';

export function Message({
  align = 'start',
  children,
  className,
}: {
  align?: MessageAlign;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.message, className)} data-align={align}>
      {children}
    </div>
  );
}

export function MessageContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export function MessageFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}

export function Bubble({
  align = 'start',
  variant = 'muted',
  children,
  className,
}: {
  align?: MessageAlign;
  variant?: BubbleVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.bubble, className)} data-align={align} data-variant={variant}>
      {children}
    </div>
  );
}

export function BubbleContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.bubbleContent, className)}>{children}</div>;
}
