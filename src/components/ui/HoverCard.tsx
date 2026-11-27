import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './HoverCard.module.css';
import { cx } from '../../lib/cx';
import { FOCUSABLE } from '../../lib/focus';

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openWithDelay: () => void;
  cancelClose: () => void;
  scheduleClose: () => void;
  openOnFocus: () => void;
  closeAndFocusTrigger: () => void;
  contentId: string;
  triggerId: string;
  triggerRef: React.RefObject<HTMLSpanElement | null>;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

export interface HoverCardProps {
  defaultOpen?: boolean;
  delay?: number;
  closeDelay?: number;
  children: ReactNode;
}

export function HoverCard({
  defaultOpen = false,
  delay = 100,
  closeDelay = 120,
  children,
}: HoverCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId().replace(/:/g, '');
  const contentId = `${reactId}-content`;
  const triggerId = `${reactId}-trigger`;
  const triggerRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const restoreFocus = useRef(false);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  const openWithDelay = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };
  const openOnFocus = () => {
    if (restoreFocus.current) return;
    clearTimers();
    setOpen(true);
  };
  const closeAndFocusTrigger = () => {
    clearTimers();
    setOpen(false);
    const root = triggerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(FOCUSABLE) ?? root;
    restoreFocus.current = true;
    target.focus();
    restoreFocus.current = false;
  };

  return (
    <HoverCardContext.Provider
      value={{
        open,
        setOpen,
        openWithDelay,
        cancelClose: clearTimers,
        scheduleClose,
        openOnFocus,
        closeAndFocusTrigger,
        contentId,
        triggerId,
        triggerRef,
      }}
    >
      <span
        className={styles.trigger}
        onMouseEnter={openWithDelay}
        onMouseLeave={scheduleClose}
        onFocus={openOnFocus}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            scheduleClose();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeAndFocusTrigger();
          }
        }}
      >
        {children}
      </span>
    </HoverCardContext.Provider>
  );
}

function useContextCard(component: string) {
  const context = useContext(HoverCardContext);
  if (!context) throw new Error(`${component} must be used inside <HoverCard>`);
  return context;
}

export function HoverCardTrigger({ children }: { children: ReactNode }) {
  const {
    open,
    setOpen,
    openWithDelay,
    cancelClose,
    scheduleClose,
    contentId,
    triggerId,
    triggerRef,
  } = useContextCard('HoverCardTrigger');
  const localRef = useRef<HTMLSpanElement>(null);
  const [ownsFocus, setOwnsFocus] = useState(false);

  useEffect(() => {
    setOwnsFocus(Boolean(localRef.current?.querySelector(FOCUSABLE)));
  }, [children]);

  return (
    <span
      ref={(node) => {
        localRef.current = node;
        triggerRef.current = node;
      }}
      id={triggerId}
      role={ownsFocus ? undefined : 'button'}
      tabIndex={ownsFocus ? undefined : 0}
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onMouseEnter={openWithDelay}
      onMouseLeave={scheduleClose}
      onClick={() => {
        cancelClose();
        setOpen(!open);
      }}
      onKeyDown={
        ownsFocus
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                cancelClose();
                setOpen(!open);
              }
            }
      }
    >
      {children}
    </span>
  );
}

export function HoverCardContent({
  children,
  className,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  const { open, contentId, triggerId, cancelClose, scheduleClose } =
    useContextCard('HoverCardContent');
  if (!open) return null;
  return (
    <span
      id={contentId}
      className={cx(styles.card, className)}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : triggerId}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      {children}
    </span>
  );
}
