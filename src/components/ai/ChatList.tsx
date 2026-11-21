import { useRef, useState, type KeyboardEvent } from 'react';
import styles from './ChatList.module.css';
import { IconButton } from '../ui/Button';
import { Skeleton } from '../ui/Display';
import { Input } from '../ui/Fields';
import { cx } from '../../lib/cx';

export interface ChatListItem {
  id: string;
  title: string;
  preview?: string;
}

export interface ChatListProps {
  chats: ChatListItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  onCreate?: () => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  newChatLabel?: string;
  emptyText?: string;
  deleteLabel?: (chat: ChatListItem) => string;
  className?: string;
  'aria-label'?: string;
}

const defaultDeleteLabel = (chat: ChatListItem) => `Удалить диалог «${chat.title}»`;

export function ChatList({
  chats,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Поиск',
  newChatLabel = 'Новый диалог',
  emptyText = 'Здесь будут диалоги с помощником',
  deleteLabel = defaultDeleteLabel,
  className,
  'aria-label': ariaLabel = 'Диалоги',
}: ChatListProps) {
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusSearch = () => searchRef.current?.querySelector('input')?.focus();

  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? chats.filter((chat) => `${chat.title} ${chat.preview ?? ''}`.toLowerCase().includes(needle))
    : chats;

  const focusItem = (index: number) => {
    setActiveIndex(index);
    itemsRef.current[index]?.focus();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (filtered.length === 0) return;
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        activeIndex === null
          ? step > 0
            ? 0
            : filtered.length - 1
          : Math.min(Math.max(activeIndex + step, 0), filtered.length - 1);
      focusItem(next);
    }

    if (event.key === 'Escape') setActiveIndex(null);
  };

  const handleItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' && index + 1 < filtered.length) {
      event.preventDefault();
      focusItem(index + 1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) {
        setActiveIndex(null);
        focusSearch();
      } else {
        focusItem(index - 1);
      }
    }

    if (event.key === 'Escape') {
      setActiveIndex(null);
      focusSearch();
    }
  };

  return (
    <aside
      className={cx(styles.list, className)}
      data-chat-list
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {(searchable || onCreate) && (
        <div className={styles.toolbar}>
          {searchable && (
            <div ref={searchRef} className={styles.search}>
              <Input
                size="s"
                radius="inset"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                aria-label="Поиск по диалогам"
              />
            </div>
          )}
          {onCreate && (
            <IconButton
              icon="plus"
              size="xs"
              variant="plain"
              label={newChatLabel}
              onClick={onCreate}
            />
          )}
        </div>
      )}

      <div className={cx(styles.scroll, 'tb-scroll-fade-y')} data-chat-list-scroll>
        {loading ? (
          <ul className={styles.items}>
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className={styles.row}>
                <ChatListItemSkeleton />
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <p className={styles.hint}>{needle ? 'Ничего не найдено' : emptyText}</p>
        ) : (
          <ul className={styles.items}>
            {filtered.map((chat, index) => (
              <li
                key={chat.id}
                className={styles.row}
                data-pending={pendingDelete === chat.id || undefined}
              >
                <button
                  type="button"
                  ref={(element) => {
                    itemsRef.current[index] = element;
                  }}
                  className={styles.item}
                  data-chat-item
                  aria-current={chat.id === activeId ? 'true' : undefined}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleItemKeyDown(event, index)}
                  onClick={() => {
                    setPendingDelete(null);
                    onSelect?.(chat.id);
                  }}
                >
                  <span className={styles.title}>{chat.title}</span>
                  {chat.preview && <span className={styles.preview}>{chat.preview}</span>}
                </button>

                {onDelete && (
                  <div className={styles.actions}>
                    {pendingDelete === chat.id ? (
                      <>
                        <IconButton
                          icon="check"
                          size="xs"
                          variant="plain"
                          label="Подтвердить удаление"
                          className={cx(styles.action, styles.confirm)}
                          onClick={() => {
                            setPendingDelete(null);
                            onDelete(chat.id);
                          }}
                        />
                        <IconButton
                          icon="close"
                          size="xs"
                          variant="plain"
                          label="Отменить удаление"
                          className={cx(styles.action, styles.cancel)}
                          onClick={() => setPendingDelete(null)}
                        />
                      </>
                    ) : (
                      <IconButton
                        icon="trash"
                        size="xs"
                        variant="ghost"
                        label={deleteLabel(chat)}
                        className={cx(styles.action, styles.delete)}
                        onClick={() => setPendingDelete(chat.id)}
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export function ChatListItemSkeleton({ className }: { className?: string }) {
  return (
    <span className={cx(styles.skeleton, className)} data-chat-skeleton aria-hidden="true">
      <Skeleton className={styles.skeletonBlock} height="100%" />
    </span>
  );
}
