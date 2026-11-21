import { useState, type ReactNode } from 'react';
import styles from './Message.module.css';
import { IconButton } from '../ui/Button';
import { useCopy } from '../ui/clipboard';
import { cx } from '../../lib/cx';

export type MessageAlign = 'start' | 'end';
export type BubbleVariant = 'muted' | 'accent' | 'outline';

export function Message({
  align = 'start',
  children,
  className,
}: {
  align?: MessageAlign;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.message, className)} data-align={align}>
      {children}
    </div>
  );
}

export function MessageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export function MessageFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}

export interface MessageReactionsProps {
  content: string;
  onRetry?: () => void;
  className?: string;
}

export function MessageReactions({ content, onRetry, className }: MessageReactionsProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const { copied, copy } = useCopy(content);

  return (
    <MessageFooter className={className}>
      <IconButton
        icon={copied ? 'check' : 'copy'}
        label={copied ? 'Скопировано' : 'Скопировать ответ'}
        size="xs"
        variant="ghost"
        onClick={copy}
      />
      <IconButton
        icon={vote === 'up' ? 'thumbsUpFilled' : 'thumbsUp'}
        label="Полезный ответ"
        size="xs"
        variant="ghost"
        aria-pressed={vote === 'up'}
        onClick={() => setVote(vote === 'up' ? null : 'up')}
      />
      <IconButton
        icon={vote === 'down' ? 'thumbsDownFilled' : 'thumbsDown'}
        label="Неполезный ответ"
        size="xs"
        variant="ghost"
        aria-pressed={vote === 'down'}
        onClick={() => setVote(vote === 'down' ? null : 'down')}
      />
      {onRetry && (
        <IconButton
          icon="refresh"
          label="Повторить ответ"
          size="xs"
          variant="ghost"
          onClick={onRetry}
        />
      )}
    </MessageFooter>
  );
}

export function Bubble({
  align = 'start',
  variant = 'muted',
  children,
  className,
}: {
  align?: MessageAlign;
  variant?: BubbleVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.bubble, className)} data-align={align} data-variant={variant}>
      {children}
    </div>
  );
}

export function BubbleContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.bubbleContent, className)}>{children}</div>;
}
