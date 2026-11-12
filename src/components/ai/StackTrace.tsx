import { useState } from 'react';
import styles from './StackTrace.module.css';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';
import { Icon } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface StackFrame {
  raw: string;
  path?: string;
  line?: number;
  column?: number;
  internal: boolean;
}

export function parseStackTrace(stack: string) {
  const lines = stack
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const error = lines[0] ?? 'Неизвестная ошибка';
  const frames: StackFrame[] = lines.slice(1).map((raw) => {
    const match = raw.match(/([^()\s]+):(\d+):(\d+)\)?\s*$/);
    return {
      raw,
      path: match?.[1],
      line: match ? Number(match[2]) : undefined,
      column: match ? Number(match[3]) : undefined,
      internal: raw.includes('node_modules'),
    };
  });
  return { error, frames };
}

export interface StackTraceProps {
  stack: string;
  defaultOpen?: boolean;
  onFilePathClick?: (path: string, line?: number, column?: number) => void;
  className?: string;
  title?: string;
}

export function StackTrace({
  stack,
  defaultOpen = false,
  onFilePathClick,
  className,
  title,
}: StackTraceProps) {
  const { error, frames } = parseStackTrace(stack);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(stack);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Trace className={className}>
      <TraceCollapsible defaultOpen={defaultOpen}>
        <div className={styles.header}>
          <TraceCollapsibleTrigger className={styles.trigger}>
            <TraceLine status="error">
              <TraceIcon>
                <Icon name="alertCircle" size={16} />
              </TraceIcon>
              <TraceTitle>{title ?? `Ошибка: ${error}`}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <button
            type="button"
            className={styles.copy}
            aria-label={copied ? 'Скопировано' : 'Скопировать стек'}
            onClick={copy}
          >
            <Icon name={copied ? 'check' : 'copy'} size={16} />
          </button>
        </div>
        <TraceCollapsibleContent>
          <div className={styles.block}>
            <p className={styles.error}>{error}</p>
            <ol className={styles.frames}>
              {frames.map((frame, index) => (
                <li
                  key={`${frame.raw}-${index}`}
                  className={cx(styles.frame, frame.internal && styles.frameInternal)}
                >
                  {frame.path && onFilePathClick ? (
                    <button
                      type="button"
                      className={styles.frameButton}
                      onClick={() => onFilePathClick(frame.path!, frame.line, frame.column)}
                    >
                      {frame.raw}
                    </button>
                  ) : (
                    frame.raw
                  )}
                </li>
              ))}
            </ol>
          </div>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <span aria-live="polite" className="tb-visually-hidden">
        {copied ? 'Скопировано' : ''}
      </span>
    </Trace>
  );
}
