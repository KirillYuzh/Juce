import type { ReactNode } from 'react';
import styles from './InlineCitation.module.css';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/HoverCard';
import { cx } from '../../lib/cx';
import { hostOf, safeHref } from '../../lib/url';
import type { LinkRenderer } from '../../lib/link';

export interface CitationSource {
  url: string;
  title?: string;
  host?: string;
  description?: ReactNode;
  icon?: ReactNode;
  href?: string;
  onOpen?: (source: CitationSource) => void;
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

export interface InlineCitationSourceProps extends CitationSource {
  linkComponent?: LinkRenderer;
}

export function InlineCitationSource({
  url,
  title,
  host,
  description,
  icon,
  href,
  onOpen,
  linkComponent: Link,
}: InlineCitationSourceProps) {
  const source: CitationSource = { url, title, host, description, icon, href, onOpen };
  const target = safeHref(href ?? url);
  const external = href === undefined && onOpen === undefined;
  const label = title ?? sourceHost({ url, host });

  const content = (
    <>
      {icon !== undefined && <span className={styles.sourceIcon}>{icon}</span>}
      {label}
      {external && target && (
        <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
      )}
    </>
  );

  return (
    <span className={styles.source}>
      {onOpen ? (
        <button type="button" className={styles.sourceLink} onClick={() => onOpen(source)}>
          {content}
        </button>
      ) : !target ? (
        <span className={styles.sourceLink}>{content}</span>
      ) : Link ? (
        <Link
          className={styles.sourceLink}
          href={target}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer noopener' : undefined}
        >
          {content}
        </Link>
      ) : (
        <a
          className={styles.sourceLink}
          href={target}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer noopener' : undefined}
        >
          {content}
        </a>
      )}
      {description !== undefined && <span className={styles.sourceDescription}>{description}</span>}
      <span className={styles.sourceHost}>{sourceHost({ url, host })}</span>
    </span>
  );
}

export function InlineCitationQuote({ children }: { children: ReactNode }) {
  return <span className={styles.quote}>{children}</span>;
}
