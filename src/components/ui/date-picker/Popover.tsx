import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './Popover.module.css';
import { cx } from '../../../lib/cx';
import { focusablesWithin } from '../../../lib/focus';
import { useDismiss } from '../../../lib/use-dismiss';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(component: string): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) throw new Error(`${component} must be used inside <Popover>`);
  return context;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = openProp ?? innerOpen;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  useDismiss({ open, onDismiss: () => setOpen(false), ref: wrapperRef });

  useEffect(() => {
    if (!open) return;
    const content = contentRef.current;
    if (!content || content.contains(document.activeElement)) return;
    const target = content.querySelector<HTMLElement>('[data-popover-autofocus]') ?? content;
    target.focus();
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      const active = document.activeElement;
      if (!active || active === document.body || contentRef.current?.contains(active)) {
        triggerRef.current?.focus();
      }
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <PopoverContext.Provider
      value={{ open, setOpen, wrapperRef, triggerRef, contentRef, contentId }}
    >
      <div ref={wrapperRef} className={cx(styles.wrapper, className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PopoverTrigger({ className, children, onClick, ...rest }: PopoverTriggerProps) {
  const popover = usePopover('PopoverTrigger');
  return (
    <button
      {...rest}
      ref={popover.triggerRef}
      type="button"
      className={cx(styles.trigger, className)}
      aria-haspopup="dialog"
      aria-expanded={popover.open}
      aria-controls={popover.open ? popover.contentId : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) popover.setOpen(!popover.open);
      }}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PopoverContent({
  id,
  tabIndex,
  className,
  children,
  onKeyDown,
  ...rest
}: PopoverContentProps) {
  const popover = usePopover('PopoverContent');
  if (!popover.open) return null;

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Tab') return;

    const content = event.currentTarget;
    const focusable = focusablesWithin(content);
    if (focusable.length === 0) {
      event.preventDefault();
      content.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const index = active instanceof HTMLElement ? focusable.indexOf(active) : -1;
    if (event.shiftKey) {
      if (index <= 0) {
        event.preventDefault();
        last.focus();
      }
    } else if (index === -1 || index === focusable.length - 1) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      {...rest}
      ref={popover.contentRef}
      id={id ?? popover.contentId}
      role="dialog"
      aria-modal="true"
      tabIndex={tabIndex ?? -1}
      className={cx(styles.content, className)}
      onKeyDown={trapFocus}
    >
      {children}
    </div>
  );
}
