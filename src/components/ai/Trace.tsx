import type { ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/Collapsible';
import type { CollapsibleProps } from '../ui/Collapsible';
import styles from './Trace.module.css';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type TraceStatus = 'running' | 'error';

export function Trace({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="list" className={cx(styles.trace, className)}>
      {children}
    </div>
  );
}

export function TraceLine({
  children,
  status,
  className,
}: {
  children: ReactNode;
  status?: TraceStatus;
  className?: string;
}) {
  return (
    <span role="listitem" className={cx(styles.line, className)} data-status={status}>
      {children}
    </span>
  );
}

export function TraceIcon({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.icon, className)}>{children}</span>;
}

export function TraceTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.title, className)}>{children}</span>;
}

export function TraceDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(styles.description, className)}>{children}</span>;
}

export function TraceCollapsible(props: CollapsibleProps) {
  return <Collapsible {...props} className={cx(styles.collapsible, props.className)} />;
}

export function TraceCollapsibleTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <CollapsibleTrigger className={cx(styles.trigger, className)}>{children}</CollapsibleTrigger>
  );
}

export function TraceCollapsibleContent({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  hidden?: boolean;
  id?: string;
}) {
  return (
    <CollapsibleContent className={cx(styles.content, className)} {...rest}>
      {children}
    </CollapsibleContent>
  );
}
