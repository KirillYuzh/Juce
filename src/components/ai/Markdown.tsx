import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';
import { cx } from '../../lib/cx';

export interface MarkdownProps {
  children: string;
  streaming?: boolean;
  className?: string;
}

const remarkPlugins = [remarkGfm];

const components: Components = {
  a: ({ href, children: label }) => (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {label}
    </a>
  ),
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
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
});
