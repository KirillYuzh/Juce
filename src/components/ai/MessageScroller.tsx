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
import { cx } from '../../lib/cx';

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

function sameIds(a: string[], b: string[]): boolean {
  return a.length === b.length && b.every((id) => a.includes(id));
}

export interface MessageScrollerProviderProps {
  autoScroll?: boolean;
  defaultScrollPosition?: ScrollPosition;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
  resetKey?: string;
  children: ReactNode;
}

export function MessageScrollerProvider({
  autoScroll = false,
  defaultScrollPosition = 'end',
  scrollEdgeThreshold = 8,
  scrollMargin = 0,
  scrollPreviousItemPeek = 64,
  resetKey = '',
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
  const anchorsRef = useRef<HTMLElement[] | null>(null);
  const programmatic = useRef(false);
  const programmaticFrame = useRef(0);
  const mounted = useRef(true);
  const initialized = useRef<{ viewport: HTMLDivElement | null; key: string | null }>({
    viewport: null,
    key: null,
  });

  const registerViewport = useCallback((element: HTMLDivElement | null, preserve: boolean) => {
    preserveRef.current = preserve;
    setViewport(element);
  }, []);

  const runProgrammatic = useCallback((action: () => void) => {
    programmatic.current = true;
    window.cancelAnimationFrame(programmaticFrame.current);
    programmaticFrame.current = window.requestAnimationFrame(() => {
      programmaticFrame.current = 0;
      programmatic.current = false;
    });
    action();
  }, []);

  const updateScrollState = useCallback(() => {
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const start = scrollTop > scrollEdgeThreshold;
    const end = scrollHeight - scrollTop - clientHeight > scrollEdgeThreshold;
    setScrollable((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    if (anchorsRef.current === null) {
      anchorsRef.current = Array.from(
        viewport.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]')
      );
    }
    const viewportTop = viewport.getBoundingClientRect().top;
    let anchor: string | null = null;
    for (const node of anchorsRef.current) {
      if (!node.isConnected) continue;
      if (node.getBoundingClientRect().top <= viewportTop + 48) {
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
      const behavior = options.behavior ?? 'instant';
      flashAutoscrolling();
      followRef.current = autoScroll;
      runProgrammatic(() => viewport.scrollTo({ top: viewport.scrollHeight, behavior }));
      return true;
    },
    [autoScroll, flashAutoscrolling, runProgrammatic, viewport]
  );

  const scrollToStart = useCallback(
    (options: ScrollCommandOptions = {}) => {
      if (!viewport) return false;
      const behavior = options.behavior ?? 'instant';
      flashAutoscrolling();
      followRef.current = false;
      runProgrammatic(() => viewport.scrollTo({ top: 0, behavior }));
      return true;
    },
    [flashAutoscrolling, runProgrammatic, viewport]
  );

  const scrollToMessage = useCallback(
    (id: string, options: ScrollCommandOptions = {}) => {
      if (!viewport) return false;
      const node = viewport.querySelector<HTMLElement>(`[data-message-id="${CSS.escape(id)}"]`);
      if (!node) return false;
      const align = options.align ?? 'start';
      const behavior = options.behavior ?? 'smooth';
      const margin = options.scrollMargin ?? scrollMargin;
      flashAutoscrolling();
      followRef.current = false;
      runProgrammatic(() => {
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
      });
      return true;
    },
    [flashAutoscrolling, runProgrammatic, scrollMargin, viewport]
  );

  useEffect(() => {
    if (!viewport) return;
    if (initialized.current.viewport === viewport && initialized.current.key === resetKey) return;
    const target = { viewport, key: resetKey };
    let frame = 0;
    let second = 0;
    setPendingScroll(defaultScrollPosition !== 'start');
    const apply = () => {
      initialized.current = target;
      runProgrammatic(() => {
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
        } else {
          viewport.scrollTop = 0;
        }
      });
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
      if (initialized.current !== target && mounted.current) setPendingScroll(false);
    };
  }, [
    autoScroll,
    defaultScrollPosition,
    resetKey,
    runProgrammatic,
    scrollMargin,
    scrollPreviousItemPeek,
    updateScrollState,
    viewport,
  ]);

  useEffect(() => {
    if (!viewport) return;
    let frame = 0;
    const onScroll = () => {
      const programmaticEvent = programmatic.current;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!programmaticEvent) {
          const { scrollTop, scrollHeight, clientHeight } = viewport;
          const atEnd = scrollHeight - scrollTop - clientHeight <= scrollEdgeThreshold;
          if (autoScroll && atEnd) followRef.current = true;
          if (!atEnd && followRef.current) followRef.current = false;
        }
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
        runProgrammatic(() => viewport.scrollTo({ top: scrollHeight, behavior: 'instant' }));
      } else if (
        preserveRef.current &&
        grew &&
        !atEnd &&
        scrollTop < 48 &&
        previous.scrollHeight > 0
      ) {
        runProgrammatic(() => {
          viewport.scrollTop = scrollTop + (scrollHeight - previous.scrollHeight);
        });
      }
      lastMetrics.current = { scrollHeight: viewport.scrollHeight, scrollTop: viewport.scrollTop };
      updateScrollState();
    });
    observer.observe(content);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [runProgrammatic, scrollEdgeThreshold, updateScrollState, viewport]);

  useEffect(() => {
    if (!viewport) return;
    anchorsRef.current = null;
    const observed = new Set<HTMLElement>();
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
          const result = [...next];
          return sameIds(previous, result) ? previous : result;
        });
      },
      { root: viewport, threshold: 0 }
    );
    const sync = () => {
      anchorsRef.current = null;
      const live = new Set(viewport.querySelectorAll<HTMLElement>('[data-message-id]'));
      for (const element of observed) {
        if (live.has(element)) continue;
        observer.unobserve(element);
        observed.delete(element);
      }
      const ids = new Set<string>();
      for (const element of live) {
        if (!observed.has(element)) {
          observer.observe(element);
          observed.add(element);
        }
        const id = element.dataset.messageId;
        if (id) ids.add(id);
      }
      setVisibleIds((previous) => {
        const next = previous.filter((id) => ids.has(id));
        return sameIds(previous, next) ? previous : next;
      });
    };
    sync();
    const mutation = new MutationObserver(sync);
    mutation.observe(viewport, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [viewport]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (autoscrollTimer.current) window.clearTimeout(autoscrollTimer.current);
      window.cancelAnimationFrame(programmaticFrame.current);
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
  ref,
  ...rest
}: ComponentProps<'div'> & { preserveScrollOnPrepend?: boolean }) {
  const context = useScrollerContext();
  const { registerViewport } = context;
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      registerViewport(element, preserveScrollOnPrepend);
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    },
    [preserveScrollOnPrepend, ref, registerViewport]
  );
  return (
    <div
      {...scrollerData(context)}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={cx(styles.viewport, 'tb-scroll-fade-y', className)}
      {...rest}
      ref={setRef}
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
  busy,
  ...rest
}: ComponentProps<'div'> & { busy?: boolean }) {
  return (
    <div
      role={role}
      aria-relevant={ariaRelevant}
      aria-busy={busy || undefined}
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
