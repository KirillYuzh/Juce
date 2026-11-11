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

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

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

/**
 * Headless popover: positions Content under the Trigger, handles open state,
 * Escape, outside clicks and moving focus in/out.
 */
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

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  // Content focuses itself unless a child already claimed focus (e.g. Calendar does).
  useEffect(() => {
    if (!open) return;
    const content = contentRef.current;
    if (!content || content.contains(document.activeElement)) return;
    const target = content.querySelector<HTMLElement>('[data-popover-autofocus]') ?? content;
    target.focus();
  }, [open]);

  // Return focus to the trigger only when focus was lost with the closed content.
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

export interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PopoverTrigger({
  className,
  children,
  onClick,
  ...rest
}: PopoverTriggerProps) {
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

export function PopoverContent({ className, children, ...rest }: PopoverContentProps) {
  const popover = usePopover('PopoverContent');
  if (!popover.open) return null;

  return (
    <div
      {...rest}
      ref={popover.contentRef}
      id={popover.contentId}
      tabIndex={-1}
      className={cx(styles.content, className)}
    >
      {children}
    </div>
  );
}
