import { memo, useMemo, type MouseEvent } from 'react';
import ReactMarkdown, { type Components, type UrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';
import { cx } from '../../lib/cx';
import { safeHref } from '../../lib/url';
import type { LinkRenderer } from '../../lib/link';

export type MarkdownComponents = Components;

export type MarkdownLinkTarget = '_blank' | '_self';

export interface MarkdownProps {
  children: string;
  streaming?: boolean;
  className?: string;
  linkComponent?: LinkRenderer;
  onLinkClick?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  linkTarget?: MarkdownLinkTarget;
  components?: Components;
}

const remarkPlugins = [remarkGfm];

const transformUrl: UrlTransform = (url) => safeHref(url) ?? null;

interface LinkOptions {
  linkComponent?: LinkRenderer;
  onLinkClick?: MarkdownProps['onLinkClick'];
  linkTarget: MarkdownLinkTarget;
}

function buildComponents({
  linkComponent: Link,
  onLinkClick,
  linkTarget,
}: LinkOptions): Components {
  return {
    a: ({ href, children }) => {
      const onClick = onLinkClick
        ? (event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onLinkClick(href ?? '', event);
          }
        : undefined;

      if (!href) {
        return <a onClick={onClick}>{children}</a>;
      }

      if (Link) {
        return (
          <Link href={href} onClick={onClick}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target={linkTarget === '_blank' ? '_blank' : undefined}
          rel={linkTarget === '_blank' ? 'noreferrer noopener' : undefined}
          onClick={onClick}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => {
      const safe = typeof src === 'string' ? safeHref(src) : undefined;
      if (!safe) return null;
      return (
        <img
          src={safe}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      );
    },
    table: ({ children: rows }) => (
      <div className={styles.table}>
        <table>{rows}</table>
      </div>
    ),
  };
}

export const Markdown = memo(function Markdown({
  children,
  streaming,
  className,
  linkComponent,
  onLinkClick,
  linkTarget = '_blank',
  components,
}: MarkdownProps) {
  const mergedComponents = useMemo(
    () => ({ ...buildComponents({ linkComponent, onLinkClick, linkTarget }), ...components }),
    [linkComponent, onLinkClick, linkTarget, components]
  );

  return (
    <div
      className={cx(styles.markdown, 'tb-motion-decorative', className)}
      data-streaming={streaming || undefined}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={mergedComponents}
        urlTransform={transformUrl}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});
