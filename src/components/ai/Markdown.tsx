import { memo } from 'react';
import ReactMarkdown, { type Components, type UrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';
import { cx } from '../../lib/cx';
import { safeHref } from '../../lib/url';

export interface MarkdownProps {
  children: string;
  streaming?: boolean;
  className?: string;
}

const remarkPlugins = [remarkGfm];

const transformUrl: UrlTransform = (url) => safeHref(url) ?? null;

const components: Components = {
  a: ({ href, children: label }) => (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {label}
    </a>
  ),
  img: ({ src, alt }) => {
    const href = typeof src === 'string' ? safeHref(src) : undefined;
    if (!href) return null;
    return (
      <img
        src={href}
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

export const Markdown = memo(function Markdown({ children, streaming, className }: MarkdownProps) {
  return (
    <div
      className={cx(styles.markdown, 'tb-motion-decorative', className)}
      data-streaming={streaming || undefined}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={components}
        urlTransform={transformUrl}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});
