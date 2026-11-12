import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import styles from './CodeBlock.module.css';
import { Icon } from '../Icon';
import { useHighlightedCode, type CodeLanguage, type CodeTokenKind } from './highlight';

export { useHighlightedCode, tokenizeCode } from './highlight';
export type { CodeLanguage, CodeLine, CodeToken, CodeTokenKind } from './highlight';

// The scroll-fade mask lives in the shared utilities stylesheet, which is
// imported once by the app and Storybook entry points.

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

const TOKEN_CLASS: Record<CodeTokenKind, string> = {
  plain: '',
  keyword: 'tkKeyword',
  string: 'tkString',
  comment: 'tkComment',
  number: 'tkNumber',
  function: 'tkFunction',
  tag: 'tkTag',
  attr: 'tkAttr',
  property: 'tkProperty',
  key: 'tkKey',
};

export type CodeBlockVariant = 'default' | 'destructive';
export type CodeBlockSize = 'default' | 'sm';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CodeBlockVariant;
  size?: CodeBlockSize;
}

export function CodeBlock({
  variant = 'default',
  size = 'default',
  className,
  ...rest
}: CodeBlockProps) {
  return (
    <div
      className={cx(
        styles.surface,
        size === 'sm' && styles.sm,
        variant === 'destructive' && styles.destructive,
        className
      )}
      data-variant={variant}
      data-size={size}
      {...rest}
    />
  );
}

export function CodeBlockHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.header, className)} {...rest} />;
}

export function CodeBlockTitle({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx(styles.title, className)} {...rest} />;
}

export function CodeBlockActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}

export function CodeBlockFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API blocked (insecure context, denied permission): fall back.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    return copied;
  }
}

export interface CodeBlockCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label?: string;
  copiedLabel?: string;
}

export function CodeBlockCopyButton({
  value,
  label = 'Скопировать код',
  copiedLabel = 'Скопировано',
  className,
  onClick,
  ...rest
}: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!(await writeClipboard(value))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        data-copied={copied}
        className={cx(styles.actionButton, className)}
        onClick={handleClick}
        {...rest}
      >
        <Icon name={copied ? 'check' : 'copy'} size={16} />
      </button>
      <span className="tb-visually-hidden" role="status" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </>
  );
}

export type CodeBlockLineVariant = 'default' | 'added' | 'removed' | 'highlighted';

export interface CodeBlockLine {
  code: string;
  variant?: CodeBlockLineVariant;
}

export interface CodeBlockLineProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: CodeBlockLineVariant;
  number?: number;
}

export function CodeBlockLine({
  variant = 'default',
  number,
  className,
  children,
  ...rest
}: CodeBlockLineProps) {
  const variantClass =
    variant === 'default'
      ? undefined
      : styles[`line${variant[0].toUpperCase()}${variant.slice(1)}`];

  return (
    <span className={cx(styles.line, variantClass, className)} {...rest}>
      {number !== undefined && (
        <span className={styles.lineNumber} aria-hidden="true">
          {number}
        </span>
      )}
      {(variant === 'added' || variant === 'removed') && (
        <span className={styles.marker} aria-hidden="true">
          {variant === 'added' ? '+' : '−'}
        </span>
      )}
      <span className={styles.lineText}>{children}</span>
    </span>
  );
}

export interface CodeBlockContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: string | CodeBlockLine[];
  language?: CodeLanguage;
  lineNumbers?: boolean;
  startLine?: number;
  wrap?: boolean;
  /** Accessible name of the scroll region. */
  ariaLabel?: string;
}

export function CodeBlockContent({
  children,
  language = 'text',
  lineNumbers,
  startLine = 1,
  wrap,
  ariaLabel,
  className,
  ...rest
}: CodeBlockContentProps) {
  const lines = Array.isArray(children) ? children : undefined;
  const source = Array.isArray(children) ? children.map((line) => line.code).join('\n') : children;
  const highlighted = useHighlightedCode(source, language);

  const renderTokens = (tokens: (typeof highlighted)[number]) =>
    tokens.map((token, index) => {
      const tokenClass = TOKEN_CLASS[token.kind];
      if (!tokenClass) return token.text;
      return (
        <span key={index} className={styles[tokenClass]}>
          {token.text}
        </span>
      );
    });

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? (language === 'text' ? 'Код' : `Код: ${language}`)}
      tabIndex={0}
      className={cx('tb-scroll-fade-x', styles.scroller, wrap && styles.wrap, className)}
      {...rest}
    >
      <pre className={styles.pre}>
        <code className={styles.code}>
          {highlighted.map((tokens, index) => (
            <CodeBlockLine
              key={index}
              variant={lines?.[index]?.variant}
              number={lineNumbers ? startLine + index : undefined}
            >
              {renderTokens(tokens)}
            </CodeBlockLine>
          ))}
        </code>
      </pre>
    </div>
  );
}
