import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import styles from './Carousel.module.css';
import { IconButton } from './Button';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselOptions {
  align?: 'start' | 'center' | 'end';
  loop?: boolean;
}

export interface CarouselApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  on: (event: 'select', handler: () => void) => () => void;
  off: (event: 'select', handler: () => void) => void;
}

interface CarouselContextValue {
  orientation: CarouselOrientation;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  api: CarouselApi;
  atStart: boolean;
  atEnd: boolean;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel(component: string): CarouselContextValue {
  const context = useContext(CarouselContext);
  if (!context) throw new Error(`${component} must be used inside <Carousel>`);
  return context;
}

const ITEM_SELECTOR = '[data-carousel-item]';

export interface CarouselProps {
  children: ReactNode;
  orientation?: CarouselOrientation;
  opts?: CarouselOptions;
  /** Called once with the imperative api, like Embla's setApi. */
  setApi?: (api: CarouselApi) => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Scroll-snap carousel: native scrolling, keyboard arrows and an imperative
 * api, with no carousel dependency. Slides size themselves with `basis`.
 */
export function Carousel({
  children,
  orientation = 'horizontal',
  opts,
  setApi,
  className,
  'aria-label': ariaLabel = 'Карусель',
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handlers = useRef(new Set<() => void>());
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const loop = opts?.loop ?? false;

  const items = useCallback(
    () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []),
    []
  );

  const offset = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    return orientation === 'horizontal' ? viewport.scrollLeft : viewport.scrollTop;
  }, [orientation]);

  const itemStart = useCallback(
    (item: HTMLElement) => (orientation === 'horizontal' ? item.offsetLeft : item.offsetTop),
    [orientation]
  );

  const currentIndex = useCallback(() => {
    const list = items();
    if (!list.length) return 0;
    const position = offset();
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    list.forEach((item, index) => {
      const delta = Math.abs(itemStart(item) - position);
      if (delta < distance) {
        distance = delta;
        closest = index;
      }
    });
    return closest;
  }, [items, itemStart, offset]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const list = items();
      const viewport = viewportRef.current;
      if (!list.length || !viewport) return;
      const target = Math.min(Math.max(index, 0), list.length - 1);
      const start = itemStart(list[target]);
      viewport.scrollTo(orientation === 'horizontal' ? { left: start } : { top: start });
    },
    [items, itemStart, orientation]
  );

  const api = useMemo<CarouselApi>(() => {
    const canScrollNext = () => {
      const viewport = viewportRef.current;
      if (!viewport) return false;
      if (loop) return true;
      const size = orientation === 'horizontal' ? viewport.clientWidth : viewport.clientHeight;
      const total = orientation === 'horizontal' ? viewport.scrollWidth : viewport.scrollHeight;
      return offset() + size < total - 4;
    };
    const canScrollPrev = () => loop || offset() > 4;

    return {
      scrollPrev: () => {
        const list = items();
        if (!list.length) return;
        const index = currentIndex();
        if (index === 0) {
          if (loop) scrollToIndex(list.length - 1);
          return;
        }
        scrollToIndex(index - 1);
      },
      scrollNext: () => {
        const list = items();
        if (!list.length) return;
        const index = currentIndex();
        if (index >= list.length - 1) {
          if (loop) scrollToIndex(0);
          return;
        }
        scrollToIndex(index + 1);
      },
      scrollTo: scrollToIndex,
      selectedScrollSnap: currentIndex,
      scrollSnapList: () => items().map((_, index) => index),
      canScrollPrev,
      canScrollNext,
      on: (_event, handler) => {
        handlers.current.add(handler);
        return () => handlers.current.delete(handler);
      },
      off: (_event, handler) => {
        handlers.current.delete(handler);
      },
    };
  }, [currentIndex, items, loop, offset, orientation, scrollToIndex]);

  useEffect(() => {
    setApi?.(api);
  }, [api, setApi]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let frame = 0;
    const notify = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setAtStart(!api.canScrollPrev());
        setAtEnd(!api.canScrollNext());
        handlers.current.forEach((handler) => handler());
      });
    };
    notify();
    viewport.addEventListener('scroll', notify, { passive: true });
    const observer = new ResizeObserver(notify);
    observer.observe(viewport);
    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener('scroll', notify);
      observer.disconnect();
    };
  }, [api]);

  return (
    <CarouselContext.Provider value={{ orientation, viewportRef, trackRef, api, atStart, atEnd }}>
      <div
        className={cx(styles.root, className)}
        data-orientation={orientation}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps {
  children: ReactNode;
  className?: string;
}

export function CarouselContent({ children, className }: CarouselContentProps) {
  const { orientation, viewportRef, trackRef, api } = useCarousel('CarouselContent');

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === previous) {
      event.preventDefault();
      api.scrollPrev();
    }
    if (event.key === next) {
      event.preventDefault();
      api.scrollNext();
    }
  };

  return (
    <div
      ref={viewportRef}
      className={cx(styles.viewport, className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div ref={trackRef} className={styles.track}>
        {children}
      </div>
    </div>
  );
}

export interface CarouselItemProps {
  children: ReactNode;
  /** Width of the slide, e.g. "100%", "50%", "320px". */
  basis?: string;
  className?: string;
  style?: CSSProperties;
}

export function CarouselItem({ children, basis = '100%', className, style }: CarouselItemProps) {
  return (
    <div
      data-carousel-item
      className={cx(styles.item, className)}
      style={{ flexBasis: basis, ...style }}
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  );
}

export function CarouselPrevious({
  label = 'Предыдущий слайд',
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { api, atStart, orientation } = useCarousel('CarouselPrevious');
  return (
    <IconButton
      icon="chevronLeft"
      label={label}
      className={cx(styles.nav, styles.prev, className)}
      data-orientation={orientation}
      disabled={atStart}
      onClick={api.scrollPrev}
    />
  );
}

export function CarouselNext({
  label = 'Следующий слайд',
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { api, atEnd, orientation } = useCarousel('CarouselNext');
  return (
    <IconButton
      icon="chevronRight"
      label={label}
      className={cx(styles.nav, styles.next, className)}
      data-orientation={orientation}
      disabled={atEnd}
      onClick={api.scrollNext}
    />
  );
}

/** Dots that mirror the slides; handy under short card carousels. */
export function CarouselDots({ className }: { className?: string }) {
  const { api } = useCarousel('CarouselDots');
  const [state, setState] = useState({ index: 0, count: 0 });

  useEffect(() => {
    const sync = () =>
      setState({ index: api.selectedScrollSnap(), count: api.scrollSnapList().length });
    sync();
    return api.on('select', sync);
  }, [api]);

  if (state.count < 2) return null;

  return (
    <div className={cx(styles.dots, className)}>
      {Array.from({ length: state.count }, (_, dot) => (
        <button
          key={dot}
          type="button"
          className={cx(styles.dot, dot === state.index && styles.dotActive)}
          aria-label={`Слайд ${dot + 1}`}
          aria-current={dot === state.index}
          onClick={() => api.scrollTo(dot)}
        />
      ))}
    </div>
  );
}
