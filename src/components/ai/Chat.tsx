import { useState } from 'react';
import styles from './Chat.module.css';
import { MessageScroller } from './MessageScroller';
import { Bubble, BubbleContent, Message, MessageContent, MessageFooter } from './Message';
import { PromptInput, type PromptInputPayload, type PromptInputStatus } from './PromptInput';
import { Suggestions, Suggestion } from './Suggestion';
import { Reasoning } from './Reasoning';
import { Sources, type SourceItem } from './Sources';
import { Avatar, Spinner } from '../ui/Display';
import { IconButton } from '../ui/Button';
import { Icon } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  reasoningDuration?: number | null;
  reasoningStreaming?: boolean;
  sources?: SourceItem[];
  streaming?: boolean;
  error?: boolean;
}

export interface ChatProps {
  messages: ChatMessage[];
  onSend: (payload: PromptInputPayload) => void;
  onStop?: () => void;
  onRetry?: (id: string) => void;
  status?: PromptInputStatus;
  suggestions?: string[];
  title?: string;
  subtitle?: string;
  placeholder?: string;
  emptyTitle?: string;
  emptyText?: string;
  className?: string;
  footnote?: string;
}

const statusLabel: Record<PromptInputStatus, string> = {
  ready: 'Готов',
  submitted: 'Отправлено',
  streaming: 'Печатает…',
  error: 'Ошибка',
};

export function Chat({
  messages,
  onSend,
  onStop,
  onRetry,
  status = 'ready',
  suggestions = [],
  title = 'Джупсик',
  subtitle = 'ИИ-ассистент для научных исследований',
  placeholder = 'Спросите про статьи, методы или данные…',
  emptyTitle = 'Чем помочь?',
  emptyText = 'Найдите источники, соберите обзор литературы или проверьте гипотезу.',
  className,
  footnote = 'Джупсик может ошибаться. Проверяйте цитаты и числа по первоисточникам.',
}: ChatProps) {
  return (
    <div className={cx(styles.chat, className)}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
        <span className={styles.status} aria-live="polite">
          {status === 'streaming' && <Spinner size={12} />}
          {status !== 'streaming' && (
            <span
              className={cx(
                styles.dot,
                status === 'error' && styles.dotError,
                status === 'ready' && styles.dot
              )}
            />
          )}
          {statusLabel[status]}
        </span>
      </div>

      <MessageScroller.Provider autoScroll defaultScrollPosition="end">
        <MessageScroller.Root className={styles.scroller}>
          <MessageScroller.Viewport className={styles.viewport}>
            <MessageScroller.Content className={styles.content}>
              {messages.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>
                    <Icon name="shield" size={28} />
                  </span>
                  <span className={styles.emptyTitle}>{emptyTitle}</span>
                  <span className={styles.emptyText}>{emptyText}</span>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageScroller.Item
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    {message.role === 'user' ? (
                      <UserMessage message={message} />
                    ) : (
                      <AssistantMessage
                        message={message}
                        onRetry={onRetry ? () => onRetry(message.id) : undefined}
                      />
                    )}
                  </MessageScroller.Item>
                ))
              )}
            </MessageScroller.Content>
          </MessageScroller.Viewport>
          <MessageScroller.Button />
        </MessageScroller.Root>
      </MessageScroller.Provider>

      <div className={styles.composer}>
        {suggestions.length > 0 && (
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => onSend({ text: suggestion, files: [] })}
                disabled={status !== 'ready'}
              >
                {suggestion}
              </Suggestion>
            ))}
          </Suggestions>
        )}
        <PromptInput onSubmit={onSend} onStop={onStop} status={status} placeholder={placeholder} />
        {footnote && <p className={styles.footnote}>{footnote}</p>}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble align="end" variant="muted">
          <BubbleContent>{message.content}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}

function AssistantMessage({ message, onRetry }: { message: ChatMessage; onRetry?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const paragraphs = message.content.split(/\n{2,}/).filter(Boolean);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Message>
      <span className={styles.author}>
        <Avatar initials="Дж" size="s" />
        Джупсик
      </span>
      <MessageContent>
        {message.reasoning !== undefined && (
          <Reasoning
            text={message.reasoning}
            isStreaming={message.reasoningStreaming}
            duration={message.reasoningDuration}
          />
        )}
        {paragraphs.length > 0 && (
          <div className={styles.messageText}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
                {message.streaming && index === paragraphs.length - 1 && (
                  <span className={styles.cursor} aria-hidden="true" />
                )}
              </p>
            ))}
          </div>
        )}
        {message.error && (
          <span className={styles.subtitle}>Не удалось получить ответ. Попробуйте ещё раз.</span>
        )}
        {message.sources && message.sources.length > 0 && <Sources sources={message.sources} />}
        <MessageFooter>
          <IconButton
            icon={copied ? 'check' : 'copy'}
            label={copied ? 'Скопировано' : 'Скопировать ответ'}
            size="s"
            variant="plain"
            onClick={copy}
          />
          <IconButton
            icon="thumbsUp"
            label="Полезный ответ"
            size="s"
            variant="plain"
            aria-pressed={vote === 'up'}
            onClick={() => setVote(vote === 'up' ? null : 'up')}
          />
          <IconButton
            icon="thumbsDown"
            label="Неполезный ответ"
            size="s"
            variant="plain"
            aria-pressed={vote === 'down'}
            onClick={() => setVote(vote === 'down' ? null : 'down')}
          />
          {onRetry && (
            <IconButton
              icon="refresh"
              label="Повторить ответ"
              size="s"
              variant="plain"
              onClick={onRetry}
            />
          )}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}
