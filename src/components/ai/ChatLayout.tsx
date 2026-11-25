import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './ChatLayout.module.css';
import { IconButton } from '../ui/Button';
import { cx } from '../../lib/cx';

export type ChatSidebarSide = 'left' | 'right';

interface ChatLayoutContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: ChatSidebarSide;
}

const ChatLayoutContext = createContext<ChatLayoutContextValue | null>(null);

export function useChatLayout() {
  const context = useContext(ChatLayoutContext);
  if (!context) throw new Error('useChatLayout must be used inside <ChatLayout>');
  return context;
}

export interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarSide?: ChatSidebarSide;
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  sidebarWidth?: number;
  className?: string;
}

export function ChatLayout({
  sidebar,
  children,
  sidebarSide = 'right',
  sidebarOpen,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  sidebarWidth = 240,
  className,
}: ChatLayoutProps) {
  const [innerOpen, setInnerOpen] = useState(defaultSidebarOpen);
  const open = sidebarOpen ?? innerOpen;

  const setOpen = (next: boolean) => {
    if (sidebarOpen === undefined) setInnerOpen(next);
    onSidebarOpenChange?.(next);
  };

  return (
    <ChatLayoutContext.Provider value={{ open, setOpen, side: sidebarSide }}>
      <div
        className={cx(styles.layout, className)}
        data-open={open}
        data-side={sidebarSide}
        style={{ '--tb-chat-sidebar-width': `${sidebarWidth}px` } as CSSProperties}
      >
        <div className={styles.sidebar} data-chat-sidebar inert={!open}>
          {sidebar}
        </div>
        <div className={styles.main}>{children}</div>
      </div>
    </ChatLayoutContext.Provider>
  );
}

export function ChatSidebarToggle({ className }: { className?: string }) {
  const { open, setOpen, side } = useChatLayout();
  const collapse = side === 'left' ? 'chevronLeft' : 'chevronRight';
  const expand = side === 'left' ? 'chevronRight' : 'chevronLeft';

  return (
    <IconButton
      icon={open ? collapse : expand}
      label={open ? 'Скрыть список диалогов' : 'Показать список диалогов'}
      aria-expanded={open}
      variant="plain"
      size="xs"
      className={className}
      onClick={() => setOpen(!open)}
    />
  );
}
