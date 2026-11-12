import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface MarkdownProps {
  /** Markdown source. Safe by default: raw HTML is not rendered. */
  children: string;
  /** Shows the caret after the last block while the answer is still streaming. */
  streaming?: boolean;
  className?: string;
}

/**
 * Markdown for chat answers: headings, lists, tables, quotes and fenced code.
 * Links open in a new tab, tables scroll on their own.
 */
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
