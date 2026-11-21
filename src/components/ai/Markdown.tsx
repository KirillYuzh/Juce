import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';
import { cx } from '../../lib/cx';

export interface MarkdownProps {
  children: string;
  streaming?: boolean;
  className?: string;
}

export function Markdown({ children, streaming, className }: MarkdownProps) {
  return (
    <div className={cx(styles.markdown, className)} data-streaming={streaming || undefined}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
