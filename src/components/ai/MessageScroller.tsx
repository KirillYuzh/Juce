import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import styles from './MessageScroller.module.css';
import { Icon } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

type ScrollPosition = 'start' | 'end' | 'last-anchor';
type ScrollAlign = 'start' | 'center' | 'end' | 'nearest';

interface ScrollCommandOptions {
  align?: ScrollAlign;
  behavior?: ScrollBehavior;
  scrollMargin?: number;
}

interface ScrollerContextValue {
  autoScroll: boolean;
  defaultScrollPosition: ScrollPosition;
  scrollEdgeThreshold: number;
  scrollMargin: number;
  scrollPreviousItemPeek: number;
  viewport: HTMLDivElement | null;
  registerViewport: (element: HTMLDivElement | null, preserve: boolean) => void;
  scrollable: { start: boolean; end: boolean };
  autoscrolling: boolean;
  pendingScroll: boolean;
  scrollToMessage: (id: string, options?: ScrollCommandOptions) => boolean;
  scrollToEnd: (options?: ScrollCommandOptions) => boolean;
  scrollToStart: (options?: ScrollCommandOptions) => boolean;
  visibleIds: string[];
  currentAnchorId: string | null;
}

const ScrollerContext = createContext<ScrollerContextValue | null>(null);

export interface MessageScrollerProviderProps {
  autoScroll?: boolean;
  defaultScrollPosition?: ScrollPosition;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
  children: ReactNode;
}

export function MessageScrollerProvider({
  autoScroll = false,
  defaultScrollPosition = 'end',
  scrollEdgeThreshold = 8,
  scrollMargin = 0,
  scrollPreviousItemPeek = 64,
  children,
}: MessageScrollerProviderProps) {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [scrollable, setScrollable] = useState({ start: false, end: false });
  const [autoscrolling, setAutoscrolling] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(defaultScrollPosition !== 'start');
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [currentAnchorId, setCurrentAnchorId] = useState<string | null>(null);
  const followRef = useRef(autoScroll);
  const preserveRef = useRef(true);
  const lastMetrics = useRef({ scrollHeight: 0, scrollTop: 0 });
  const autoscrollTimer = useRef<number | null>(null);

  const registerViewport = useCallback((element: HTMLDivElement | null, preserve: boolean) => {
    preserveRef.current = preserve;
    setViewport(element);
  }, []);

  const updateScrollState = useCallback(() => {
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const start = scrollTop > scrollEdgeThreshold;
    const end = scrollHeight - scrollTop - clientHeight > scrollEdgeThreshold;
    setScrollable((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    const anchors = viewport.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]');
    let anchor: string | null = null;
    for (const node of anchors) {
      if (node.getBoundingClientRect().top <= viewport.getBoundingClientRect().top + 48) {
        anchor = node.dataset.messageId ?? null;
      } else {
        break;
      }
    }
    setCurrentAnchorId((prev) => (prev === anchor ? prev : anchor));
  }, [scrollEdgeThreshold, viewport]);

  const flashAutoscrolling = useCallback(() => {
    setAutoscrolling(true);
    if (autoscrollTimer.current) window.clearTimeout(autoscrollTimer.current);
    autoscrollTimer.current = window.setTimeout(() => setAutoscrolling(false), 500);
  }, []);

  const scrollToEnd = useCallback(
    (options: ScrollCommandOptions = {}) => {
      if (!viewport) return false;
      const behavior = options.behavior ?? 'auto';
      flashAutoscrolling();
      viewport.scrollTo({ top: viewport.scrollHeight, behavior });
      followRef.current = autoScroll;
      return true;
    },
    [autoScroll, flashAutoscrolling, viewport]
  );

  const scrollToStart = useCallback(
    (options: ScrollCommandOptions = {}) => {
      if (!viewport) return false;
      const behavior = options.behavior ?? 'auto';
      flashAutoscrolling();
      viewport.scrollTo({ top: 0, behavior });
      followRef.current = false;
      return true;
    },
    [flashAutoscrolling, viewport]
  );

  const scrollToMessage = useCallback(
    (id: string, options: ScrollCommandOptions = {}) => {
      if (!viewport) return false;
      const node = viewport.querySelector<HTMLElement>(`[data-message-id="${CSS.escape(id)}"]`);
      if (!node) return false;
      const align = options.align ?? 'start';
      const behavior = options.behavior ?? 'auto';
      const margin = options.scrollMargin ?? scrollMargin;
      flashAutoscrolling();
      if (margin) {
        const top =
          node.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top +
          viewport.scrollTop -
          margin;
        viewport.scrollTo({ top, behavior });
      } else {
        node.scrollIntoView({ block: align, behavior, inline: 'nearest' });
      }
      followRef.current = false;
      return true;
    },
    [flashAutoscrolling, scrollMargin, viewport]
  );

  // Initial position, applied once the viewport and rows are mounted.
  useEffect(() => {
    if (!viewport) return;
    let frame = 0;
    let second = 0;
    const apply = () => {
      if (defaultScrollPosition === 'end') {
        viewport.scrollTop = viewport.scrollHeight;
      } else if (defaultScrollPosition === 'last-anchor') {
        const anchors = viewport.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]');
        const last = anchors.item(anchors.length - 1);
        if (last) {
          const top =
            last.getBoundingClientRect().top -
            viewport.getBoundingClientRect().top +
            viewport.scrollTop -
            scrollMargin -
            scrollPreviousItemPeek;
          viewport.scrollTop = Math.max(0, top);
        } else {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
      followRef.current = autoScroll;
      setPendingScroll(false);
      updateScrollState();
    };
    frame = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(apply);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(second);
    };
    // Runs on viewport mount only; later renders should not reset the position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport]);

  // Track position, release follow on real user input, follow growth.
  useEffect(() => {
    if (!viewport) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const atEnd = scrollHeight - scrollTop - clientHeight <= scrollEdgeThreshold;
        if (autoScroll && atEnd) followRef.current = true;
        if (!atEnd && followRef.current) followRef.current = false;
        updateScrollState();
      });
    };
    const release = () => {
      followRef.current = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key)) release();
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    viewport.addEventListener('wheel', release, { passive: true });
    viewport.addEventListener('touchmove', release, { passive: true });
    viewport.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener('scroll', onScroll);
      viewport.removeEventListener('wheel', release);
      viewport.removeEventListener('touchmove', release);
      viewport.removeEventListener('keydown', onKey);
    };
  }, [autoScroll, scrollEdgeThreshold, updateScrollState, viewport]);

  useEffect(() => {
    if (!viewport) return;
    const content = viewport.firstElementChild;
    if (!content) return;
    lastMetrics.current = { scrollHeight: viewport.scrollHeight, scrollTop: viewport.scrollTop };
    const observer = new ResizeObserver(() => {
      const { scrollHeight, scrollTop, clientHeight } = viewport;
      const previous = lastMetrics.current;
      const grew = scrollHeight > previous.scrollHeight;
      const atEnd = scrollHeight - scrollTop - clientHeight <= scrollEdgeThreshold;
      if (followRef.current && grew) {
        viewport.scrollTo({ top: scrollHeight, behavior: 'auto' });
      } else if (
        preserveRef.current &&
        grew &&
        !atEnd &&
        scrollTop < 48 &&
        previous.scrollHeight > 0
      ) {
        viewport.scrollTop = scrollTop + (scrollHeight - previous.scrollHeight);
      }
      lastMetrics.current = { scrollHeight: viewport.scrollHeight, scrollTop: viewport.scrollTop };
      updateScrollState();
    });
    observer.observe(content);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [scrollEdgeThreshold, updateScrollState, viewport]);

  useEffect(() => {
    if (!viewport) return;
    const elements = viewport.querySelectorAll<HTMLElement>('[data-message-id]');
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.messageId;
            if (!id) continue;
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
          }
          return [...next];
        });
      },
      { root: viewport, threshold: 0 }
    );
    elements.forEach((element) => observer.observe(element));
    const mutation = new MutationObserver(() => {
      viewport
        .querySelectorAll<HTMLElement>('[data-message-id]')
        .forEach((element) => observer.observe(element));
    });
    mutation.observe(viewport, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [viewport]);

  useEffect(() => {
    return () => {
      if (autoscrollTimer.current) window.clearTimeout(autoscrollTimer.current);
    };
  }, []);

  const value = useMemo<ScrollerContextValue>(
    () => ({
      autoScroll,
      defaultScrollPosition,
      scrollEdgeThreshold,
      scrollMargin,
      scrollPreviousItemPeek,
      viewport,
      registerViewport,
      scrollable,
      autoscrolling,
      pendingScroll,
      scrollToMessage,
      scrollToEnd,
      scrollToStart,
      visibleIds,
      currentAnchorId,
    }),
    [
      autoScroll,
      defaultScrollPosition,
      scrollEdgeThreshold,
      scrollMargin,
      scrollPreviousItemPeek,
      viewport,
      registerViewport,
      scrollable,
      autoscrolling,
      pendingScroll,
      scrollToMessage,
      scrollToEnd,
      scrollToStart,
      visibleIds,
      currentAnchorId,
    ]
  );

  return <ScrollerContext.Provider value={value}>{children}</ScrollerContext.Provider>;
}

function useScrollerContext() {
  const context = useContext(ScrollerContext);
  if (!context)
    throw new Error('MessageScroller parts must be used inside <MessageScroller.Provider>');
  return context;
}

export function useMessageScroller() {
  const { scrollToMessage, scrollToEnd, scrollToStart } = useScrollerContext();
  return useMemo(
    () => ({ scrollToMessage, scrollToEnd, scrollToStart }),
    [scrollToEnd, scrollToMessage, scrollToStart]
  );
}

export function useMessageScrollerScrollable() {
  const { scrollable } = useScrollerContext();
  return scrollable;
}

export function useMessageScrollerVisibility() {
  const { visibleIds, currentAnchorId } = useScrollerContext();
  return { visibleIds, currentAnchorId };
}

function scrollerData(context: ReturnType<typeof useScrollerContext>) {
  const scrollableValue = [context.scrollable.start && 'start', context.scrollable.end && 'end']
    .filter(Boolean)
    .join(' ');
  return {
    'data-scrollable': scrollableValue || undefined,
    'data-autoscrolling': context.autoscrolling || undefined,
    'data-pending-scroll': context.pendingScroll || undefined,
  };
}

function ScrollerRoot({ children, className, ...rest }: ComponentProps<'div'>) {
  const context = useScrollerContext();
  return (
    <div className={cx(styles.root, className)} {...scrollerData(context)} {...rest}>
      {children}
    </div>
  );
}

function ScrollerViewport({
  children,
  className,
  preserveScrollOnPrepend = true,
  role = 'region',
  'aria-label': ariaLabel = 'Сообщения',
  tabIndex = 0,
  ...rest
}: ComponentProps<'div'> & { preserveScrollOnPrepend?: boolean }) {
  const context = useScrollerContext();
  const { registerViewport } = context;
  const setRef = useCallback(
    (element: HTMLDivElement | null) => registerViewport(element, preserveScrollOnPrepend),
    [preserveScrollOnPrepend, registerViewport]
  );
  return (
    <div
      {...scrollerData(context)}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={cx(styles.viewport, 'tb-scroll-fade-y', className)}
      ref={setRef}
      {...rest}
    >
      {children}
    </div>
  );
}

function ScrollerContent({
  children,
  className,
  role = 'log',
  'aria-relevant': ariaRelevant = 'additions',
  ...rest
}: ComponentProps<'div'>) {
  return (
    <div
      role={role}
      aria-relevant={ariaRelevant}
      className={cx(styles.content, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

function ScrollerItem({
  messageId,
  scrollAnchor = false,
  children,
  className,
  ...rest
}: ComponentProps<'div'> & { messageId?: string; scrollAnchor?: boolean }) {
  return (
    <div
      className={cx(styles.item, className)}
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor ? 'true' : 'false'}
      {...rest}
    >
      {children}
    </div>
  );
}

function ScrollerButton({
  children,
  className,
  behavior = 'smooth',
  direction = 'end',
  ...rest
}: ComponentProps<'button'> & { behavior?: ScrollBehavior; direction?: 'start' | 'end' }) {
  const context = useScrollerContext();
  const active = direction === 'end' ? context.scrollable.end : context.scrollable.start;
  const label = direction === 'end' ? 'Прокрутить к последнему сообщению' : 'Прокрутить к началу';
  return (
    <button
      type="button"
      className={cx(styles.button, className)}
      data-direction={direction}
      data-active={active}
      disabled={!active}
      aria-label={label}
      onClick={() =>
        direction === 'end'
          ? context.scrollToEnd({ behavior })
          : context.scrollToStart({ behavior })
      }
      {...rest}
    >
      {children ?? <Icon name={direction === 'end' ? 'chevronDown' : 'chevronUp'} size={20} />}
    </button>
  );
}

export const MessageScroller = {
  Provider: MessageScrollerProvider,
  Root: ScrollerRoot,
  Viewport: ScrollerViewport,
  Content: ScrollerContent,
  Item: ScrollerItem,
  Button: ScrollerButton,
};
