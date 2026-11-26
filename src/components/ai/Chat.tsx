import { memo, useCallback, useId, type ReactNode } from 'react';
import styles from './Chat.module.css';
import { MessageScroller } from './MessageScroller';
import { Bubble, BubbleContent, Message, MessageContent, MessageReactions } from './Message';
import { PromptInput, type PromptInputPayload, type PromptInputStatus } from './PromptInput';
import { Suggestions, Suggestion } from './Suggestion';
import { Reasoning } from './Reasoning';
import { Sources, type SourceItem } from './Sources';
import { Markdown } from './Markdown';
import { Avatar } from '../ui/Display';
import { cx } from '../../lib/cx';

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
  errorText?: string;
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
  headerLeading?: ReactNode;
  headerTrailing?: ReactNode;
  framed?: boolean;
  showAuthor?: boolean;
  showReasoning?: boolean;
  showSources?: boolean;
  authorName?: string;
  authorInitials?: string;
  conversationKey?: string | number;
  titleLevel?: 2 | 3 | 4;
}

export function Chat({
  messages,
  onSend,
  onStop,
  onRetry,
  status = 'ready',
  suggestions = [],
  title = 'Джупсик',
  subtitle = 'ИИ-ассистент по Java, Go и математике',
  placeholder = 'Спросите про код, алгоритм или теорему…',
  emptyTitle = 'Чем помочь?',
  emptyText = 'Разберите код, объясните алгоритм или проверьте доказательство.',
  className,
  footnote = 'Джупсик может ошибаться. Проверяйте код и выкладки по первоисточникам.',
  headerLeading,
  headerTrailing,
  framed = true,
  showAuthor = false,
  showReasoning = false,
  showSources = false,
  authorName = 'Джупсик',
  authorInitials = 'Дж',
  conversationKey,
  titleLevel = 2,
}: ChatProps) {
  const emptyKey = useId();
  const scrollKey =
    conversationKey !== undefined ? String(conversationKey) : (messages[0]?.id ?? emptyKey);
  const anyStreaming = messages.some((message) => message.streaming);
  const retry = useCallback((id: string) => onRetry?.(id), [onRetry]);
  const Heading = `h${titleLevel}` as 'h2' | 'h3' | 'h4';
  const lastIndex = messages.length - 1;

  return (
    <div className={cx(styles.chat, !framed && styles.plain, className)}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          {headerLeading}
          <div className={styles.headerText}>
            <Heading className={styles.title}>{title}</Heading>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
        </div>
        {headerTrailing}
      </div>

      <div className={styles.body}>
        <MessageScroller.Provider autoScroll defaultScrollPosition="end" resetKey={scrollKey}>
          <MessageScroller.Root className={styles.scroller}>
            <MessageScroller.Viewport className={styles.viewport}>
              <MessageScroller.Content className={styles.content} busy={anyStreaming}>
                {messages.length === 0 ? (
                  <div className={styles.empty}>
                    <span className={styles.emptyTitle}>{emptyTitle}</span>
                    <span className={styles.emptyText}>{emptyText}</span>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <MessageScroller.Item
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === 'user'}
                      role="article"
                      aria-label={message.role === 'user' ? 'Ваше сообщение' : authorName}
                    >
                      {message.role === 'user' ? (
                        <UserMessage message={message} />
                      ) : (
                        <AssistantMessage
                          message={message}
                          showAuthor={showAuthor}
                          showReasoning={showReasoning}
                          showSources={showSources}
                          onRetry={
                            onRetry && (message.error || index === lastIndex) ? retry : undefined
                          }
                          authorName={authorName}
                          authorInitials={authorInitials}
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
      </div>

      <div className={styles.composer}>
        {suggestions.length > 0 && (
          <Suggestions>
            {suggestions.map((suggestion, index) => (
              <Suggestion
                key={`${index}-${suggestion}`}
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

const UserMessage = memo(function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble align="end" variant="muted">
          <BubbleContent>{message.content}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
});

const AssistantMessage = memo(function AssistantMessage({
  message,
  showAuthor,
  showReasoning,
  showSources,
  onRetry,
  authorName,
  authorInitials,
}: {
  message: ChatMessage;
  showAuthor: boolean;
  showReasoning: boolean;
  showSources: boolean;
  onRetry?: (id: string) => void;
  authorName: string;
  authorInitials: string;
}) {
  return (
    <Message>
      {showAuthor && (
        <span className={styles.author}>
          <Avatar initials={authorInitials} size="s" />
          {authorName}
        </span>
      )}
      <MessageContent>
        {showReasoning && message.reasoning !== undefined && (
          <Reasoning
            text={message.reasoning}
            isStreaming={message.reasoningStreaming}
            duration={message.reasoningDuration}
          />
        )}
        {message.content.trim() && (
          <Markdown streaming={message.streaming}>{message.content}</Markdown>
        )}
        {message.error && (
          <span role="alert" className={styles.subtitle}>
            {message.errorText ?? 'Не удалось получить ответ. Попробуйте ещё раз.'}
          </span>
        )}
        {showSources && message.sources && message.sources.length > 0 && (
          <Sources sources={message.sources} />
        )}
        {!message.streaming && (
          <MessageReactions
            content={message.content}
            onRetry={onRetry ? () => onRetry(message.id) : undefined}
            retryOnly={message.error}
          />
        )}
      </MessageContent>
    </Message>
  );
});
