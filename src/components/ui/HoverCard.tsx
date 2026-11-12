import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './HoverCard.module.css';

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  cancelClose: () => void;
  scheduleClose: () => void;
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
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

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

  return (
    <HoverCardContext.Provider value={{ open, setOpen, cancelClose: clearTimers, scheduleClose }}>
      <span
        className={styles.trigger}
        onMouseEnter={openWithDelay}
        onMouseLeave={scheduleClose}
        onFocus={() => {
          clearTimers();
          setOpen(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            scheduleClose();
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
  const { setOpen, cancelClose, scheduleClose } = useContextCard('HoverCardTrigger');
  return (
    <span
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      {children}
    </span>
  );
}

export function HoverCardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, cancelClose, scheduleClose } = useContextCard('HoverCardContent');
  if (!open) return null;
  return (
    <span
      className={[styles.card, className].filter(Boolean).join(' ')}
      role="dialog"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          scheduleClose();
          (event.target as HTMLElement).blur();
        }
      }}
    >
      {children}
    </span>
  );
}
