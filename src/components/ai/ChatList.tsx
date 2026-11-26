import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import styles from './ChatList.module.css';
import { IconButton } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Skeleton } from '../ui/Display';
import { Input } from '../ui/Fields';
import { AlertDialog } from '../ui/AlertDialog';
import { useCopy } from '../ui/clipboard';
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
  onCopy?: (chat: ChatListItem) => void;
  onDownload?: (chat: ChatListItem) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  newChatLabel?: string;
  emptyText?: string;
  className?: string;
  'aria-label'?: string;
}

const chatText = (chat: ChatListItem) => [chat.title, chat.preview].filter(Boolean).join('\n\n');

const chatFileName = (title: string) => {
  const cleaned = Array.from(title, (char) => {
    const code = char.codePointAt(0) ?? 0;
    return code < 0x20 || code === 0x7f || char === '/' || char === '\\' ? ' ' : char;
  })
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/^\.+/, '')
    .trim()
    .slice(0, 120)
    .trim();
  return `${cleaned || 'chat'}.txt`;
};

const downloadChat = (chat: ChatListItem) => {
  const url = URL.createObjectURL(new Blob([chatText(chat)], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = chatFileName(chat.title);
  link.rel = 'noopener';
  try {
    document.body.append(link);
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

interface ChatActionsProps {
  chat: ChatListItem;
  onCopy: (chat: ChatListItem) => void;
  onDownload?: (chat: ChatListItem) => void;
  onDelete?: (chat: ChatListItem, trigger: HTMLButtonElement | null) => void;
}

function ChatActions({ chat, onCopy, onDownload, onDelete }: ChatActionsProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const trigger = () =>
    rootRef.current?.querySelector<HTMLButtonElement>('[data-chat-actions-trigger]');

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) trigger()?.focus();
  };

  useEffect(() => {
    if (!open) return;
    itemsRef.current[0]?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = itemsRef.current.filter((item): item is HTMLButtonElement => item !== null);
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      close(false);
      return;
    }
    if (items.length === 0) return;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const current = items.indexOf(document.activeElement as HTMLButtonElement);
      const index =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? items.length - 1
            : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[index]?.focus();
    }
  };

  const actions: Array<{
    id: string;
    label: string;
    icon: IconName;
    danger?: boolean;
    run: () => void;
  }> = [
    {
      id: 'copy',
      label: 'Скопировать',
      icon: 'copy',
      run: () => onCopy(chat),
    },
    {
      id: 'download',
      label: 'Скачать',
      icon: 'download',
      run: () => (onDownload ? onDownload(chat) : downloadChat(chat)),
    },
  ];

  if (onDelete) {
    actions.push({
      id: 'delete',
      label: 'Удалить',
      icon: 'trash',
      danger: true,
      run: () => onDelete(chat, trigger() ?? null),
    });
  }

  return (
    <div className={styles.actions} ref={rootRef} onKeyDown={onKeyDown}>
      <IconButton
        icon="more"
        size="xs"
        variant="ghost"
        label={`Действия с чатом «${chat.title}»`}
        aria-haspopup="menu"
        aria-expanded={open}
        data-chat-actions-trigger
        onClick={() => setOpen((value) => !value)}
      />
      {open && (
        <div className={styles.menu} role="menu" aria-label={`Действия с чатом «${chat.title}»`}>
          {actions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              ref={(element) => {
                itemsRef.current[index] = element;
              }}
              className={cx(styles.menuItem, action.danger && styles.menuItemDanger)}
              onClick={() => {
                close(false);
                action.run();
              }}
            >
              <Icon name={action.icon} size={16} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatList({
  chats,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onCopy,
  onDownload,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Поиск',
  newChatLabel = 'Новый диалог',
  emptyText = 'Здесь будут диалоги с помощником',
  className,
  'aria-label': ariaLabel = 'Диалоги',
}: ChatListProps) {
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ChatListItem | null>(null);
  const [focusRequest, setFocusRequest] = useState<number | 'search' | null>(null);
  const [copySource, setCopySource] = useState<{ id: string; text: string } | null>(null);
  const copySourceRef = useRef<{ id: string; text: string } | null>(null);
  const deleteTrigger = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const { copy } = useCopy(copySource?.text ?? '');

  const texts = useMemo(() => {
    const map = new Map<string, string>();
    for (const chat of chats) map.set(chat.id, chatText(chat));
    return map;
  }, [chats]);

  useEffect(() => {
    if (!copySource || copySourceRef.current === copySource) return;
    copySourceRef.current = copySource;
    void copy();
  }, [copy, copySource]);

  const focusSearch = () => searchRef.current?.querySelector('input')?.focus();

  useEffect(() => {
    if (focusRequest === null) return;
    const items = itemsRef.current.filter((item): item is HTMLButtonElement => item !== null);
    const index = focusRequest === 'search' ? -1 : Math.min(focusRequest, items.length - 1);
    const item = index >= 0 ? (items[index] ?? items[index - 1] ?? null) : null;
    if (item) {
      setActiveIndex(index);
      item.focus();
    } else {
      focusSearch();
    }
    setFocusRequest(null);
  }, [focusRequest]);

  const copyChat = (chat: ChatListItem) => {
    if (onCopy) {
      onCopy(chat);
      return;
    }
    setCopySource({ id: chat.id, text: texts.get(chat.id) ?? chatText(chat) });
  };

  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? chats.filter((chat) => `${chat.title} ${chat.preview ?? ''}`.toLowerCase().includes(needle))
    : chats;

  const focusItem = (index: number) => {
    setActiveIndex(index);
    itemsRef.current[index]?.focus();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      if (filtered.length === 0) return;
      event.preventDefault();
      if (event.key === 'Home') {
        focusItem(0);
        return;
      }
      if (event.key === 'End') {
        focusItem(filtered.length - 1);
        return;
      }
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
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusItem(event.key === 'Home' ? 0 : filtered.length - 1);
      return;
    }

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
              <li key={chat.id} className={styles.row}>
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
                  onClick={() => onSelect?.(chat.id)}
                >
                  <span className={styles.title}>{chat.title}</span>
                  {chat.preview && <span className={styles.preview}>{chat.preview}</span>}
                </button>

                <ChatActions
                  chat={chat}
                  onCopy={copyChat}
                  onDownload={onDownload}
                  onDelete={
                    onDelete
                      ? (target, trigger) => {
                          deleteTrigger.current = trigger;
                          setPendingDelete(target);
                        }
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (open) return;
          setPendingDelete(null);
          const trigger = deleteTrigger.current;
          deleteTrigger.current = null;
          if (trigger?.isConnected) trigger.focus();
        }}
        title={pendingDelete ? `Удалить чат «${pendingDelete.title}»?` : ''}
        description="История переписки удалится без возможности восстановления."
        cancelLabel="Оставить"
        confirmLabel="Удалить"
        onConfirm={() => {
          if (!pendingDelete) return;
          const removed = filtered.findIndex((chat) => chat.id === pendingDelete.id);
          deleteTrigger.current = null;
          onDelete?.(pendingDelete.id);
          setFocusRequest(removed === -1 ? 'search' : removed);
        }}
      />
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
