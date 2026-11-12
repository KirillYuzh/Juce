import type { ReactNode } from 'react';
import styles from './InlineCitation.module.css';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/HoverCard';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface CitationSource {
  url: string;
  title?: string;
  host?: string;
}

const hostOf = (source: CitationSource) => {
  if (source.host) return source.host;
  try {
    return new URL(source.url).hostname.replace(/^www\./, '');
  } catch {
    return source.url;
  }
};

export function InlineCitation({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.citation, className)}>{children}</span>;
}

export function InlineCitationText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.text, className)}>{children}</span>;
}

export function InlineCitationCard({ children }: { children: ReactNode }) {
  return <HoverCard delay={80} closeDelay={120}>{children}</HoverCard>;
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
        {label ?? hostOf(first)}
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
  return (
    <span className={styles.source}>
      <a className={styles.sourceLink} href={url} target="_blank" rel="noreferrer">
        {title ?? hostOf({ url, host })}
        <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
      </a>
      <span className={styles.sourceHost}>{hostOf({ url, host })}</span>
    </span>
  );
}

export function InlineCitationQuote({ children }: { children: ReactNode }) {
  return <span className={styles.quote}>{children}</span>;
}
