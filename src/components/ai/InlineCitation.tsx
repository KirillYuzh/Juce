import type { ReactNode } from 'react';
import styles from './InlineCitation.module.css';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/HoverCard';
import { cx } from '../../lib/cx';
import { hostOf, safeHref } from '../../lib/url';

export interface CitationSource {
  url: string;
  title?: string;
  host?: string;
}

const sourceHost = (source: CitationSource) => source.host ?? hostOf(source.url);

export function InlineCitation({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(styles.citation, className)}>{children}</span>;
}

export function InlineCitationText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(styles.text, className)}>{children}</span>;
}

export function InlineCitationCard({ children }: { children: ReactNode }) {
  return (
    <HoverCard delay={80} closeDelay={120}>
      {children}
    </HoverCard>
  );
}

export function InlineCitationCardTrigger({
  sources,
  label,
}: {
  sources: CitationSource[];
  label?: string;
}) {
  const first = sources[0];
  if (!first) return null;
  const extra = sources.length - 1;
  return (
    <HoverCardTrigger>
      <button type="button" className={styles.cardTrigger}>
        {label ?? sourceHost(first)}
        {extra > 0 && <span className={styles.cardTriggerCount}>+{extra}</span>}
      </button>
    </HoverCardTrigger>
  );
}

export function InlineCitationCardBody({ children }: { children: ReactNode }) {
  return (
    <HoverCardContent>
      <span className={styles.cardBody}>{children}</span>
    </HoverCardContent>
  );
}

export function InlineCitationSource({ url, title, host }: CitationSource) {
  const href = safeHref(url);
  const label = title ?? sourceHost({ url, host });
  return (
    <span className={styles.source}>
      {href ? (
        <a className={styles.sourceLink} href={href} target="_blank" rel="noreferrer">
          {label}
          <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
        </a>
      ) : (
        <span className={styles.sourceLink}>{label}</span>
      )}
      <span className={styles.sourceHost}>{sourceHost({ url, host })}</span>
    </span>
  );
}

export function InlineCitationQuote({ children }: { children: ReactNode }) {
  return <span className={styles.quote}>{children}</span>;
}
