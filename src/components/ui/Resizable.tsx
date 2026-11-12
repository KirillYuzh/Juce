import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import styles from './Resizable.module.css';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type ResizableOrientation = 'horizontal' | 'vertical';

interface ResizableContextValue {
  orientation: ResizableOrientation;
  sizes: number[];
  setSizes: (sizes: number[]) => void;
  limits: Array<{ min: number; max: number }>;
  register: (index: number, element: HTMLDivElement | null) => void;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizable(component: string): ResizableContextValue {
  const context = useContext(ResizableContext);
  if (!context) throw new Error(`${component} must be used inside <ResizablePanelGroup>`);
  return context;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Moves the divider between two neighbours by `delta` percent. */
function drag(sizes: number[], index: number, delta: number, limits: ResizableContextValue['limits']) {
  const next = [...sizes];
  const start = index;
  const end = index + 1;
  const pair = next[start] + next[end];
  const minStart = limits[start]?.min ?? 0;
  const minEnd = limits[end]?.min ?? 0;
  const maxStart = limits[start]?.max ?? 100;
  const maxEnd = limits[end]?.max ?? 100;
  const left = clamp(next[start] + delta, Math.max(minStart, pair - maxEnd), Math.min(maxStart, pair - minEnd));
  next[start] = left;
  next[end] = pair - left;
  return next;
}

export interface ResizablePanelGroupProps {
  children: ReactNode;
  orientation?: ResizableOrientation;
  onLayoutChange?: (sizes: number[]) => void;
  className?: string;
  style?: CSSProperties;
}

export function ResizablePanelGroup({
  children,
  orientation = 'horizontal',
  onLayoutChange,
  className,
  style,
}: ResizablePanelGroupProps) {
  const items = Children.toArray(children);
  const panelCount = items.filter(
    (child) => isValidElement(child) && (child.type as { isResizablePanel?: boolean }).isResizablePanel
  ).length;

  const [sizes, setSizes] = useState<number[]>(() => {
    const explicit = items
      .filter((child) => isValidElement(child) && (child.type as { isResizablePanel?: boolean }).isResizablePanel)
      .map((child) => {
        const props = (child as ReactElement<{ defaultSize?: number }>).props;
        return typeof props.defaultSize === 'number' ? props.defaultSize : null;
      });
    const fixed = explicit.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const flexible = explicit.filter((value) => value === null).length;
    const rest = flexible ? Math.max(100 - fixed, 0) / flexible : 0;
    const raw = explicit.map((value) => value ?? rest);
    const total = raw.reduce((sum, value) => sum + value, 0) || 1;
    return raw.map((value) => (value / total) * 100);
  });

  const limits = useMemo(() => {
    return items
      .filter((child) => isValidElement(child) && (child.type as { isResizablePanel?: boolean }).isResizablePanel)
      .map((child) => {
        const props = (child as ReactElement<{ minSize?: number; maxSize?: number }>).props;
        return { min: props.minSize ?? 0, max: props.maxSize ?? 100 };
      });
  }, [items]);

  const elements = useRef(new Map<number, HTMLDivElement>());
  const register = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) elements.current.set(index, element);
    else elements.current.delete(index);
  }, []);

  const update = (next: number[]) => {
    setSizes(next);
    onLayoutChange?.(next);
  };

  let panelIndex = 0;
  let handleIndex = 0;
  const mapped = items.map((child) => {
    if (!isValidElement(child)) return child;
    const type = child.type as { isResizablePanel?: boolean; isResizableHandle?: boolean };
    if (type.isResizablePanel) {
      return cloneElement(child as ReactElement<{ index?: number }>, { index: panelIndex++ });
    }
    if (type.isResizableHandle) {
      return cloneElement(child as ReactElement<{ index?: number }>, { index: handleIndex++ });
    }
    return child;
  });

  return (
    <ResizableContext.Provider value={{ orientation, sizes, setSizes: update, limits, register }}>
      <div
        className={cx(styles.group, className)}
        data-orientation={orientation}
        style={{ ...style, '--panel-count': panelCount } as CSSProperties}
      >
        {mapped}
      </div>
    </ResizableContext.Provider>
  );
}

export interface ResizablePanelProps {
  children: ReactNode;
  /** Share of the group, in percent. */
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  style?: CSSProperties;
  /** @internal set by the group */
  index?: number;
}

function PanelImpl({
  children,
  minSize,
  maxSize,
  className,
  style,
  index = 0,
}: ResizablePanelProps) {
  const { sizes, register } = useResizable('ResizablePanel');
  const size = sizes[index] ?? 100 / Math.max(sizes.length, 1);

  return (
    <div
      ref={(element) => register(index, element)}
      className={cx(styles.panel, className)}
      style={{ flexBasis: `${size}%`, ...style }}
      data-min-size={minSize}
      data-max-size={maxSize}
    >
      {children}
    </div>
  );
}
export const ResizablePanel = Object.assign(PanelImpl, { isResizablePanel: true });

export interface ResizableHandleProps {
  withHandle?: boolean;
  className?: string;
  /** @internal set by the group */
  index?: number;
}

function HandleImpl({ withHandle, className, index = 0 }: ResizableHandleProps) {
  const { orientation, sizes, setSizes, limits } = useResizable('ResizableHandle');
  const dragging = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const group = (event.currentTarget.parentElement as HTMLElement | null) ?? null;
    if (!group) return;
    event.preventDefault();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);

    const rect = group.getBoundingClientRect();
    const total = orientation === 'horizontal' ? rect.width : rect.height;
    const start = orientation === 'horizontal' ? event.clientX : event.clientY;
    const initial = sizes;

    const move = (moveEvent: PointerEvent) => {
      if (!dragging.current || !total) return;
      const position = orientation === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = ((position - start) / total) * 100;
      setSizes(drag(initial, index, delta, limits));
    };

    const up = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const back = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === back) {
      event.preventDefault();
      setSizes(drag(sizes, index, -4, limits));
    }
    if (event.key === forward) {
      event.preventDefault();
      setSizes(drag(sizes, index, 4, limits));
    }
  };

  return (
    <div
      className={cx(styles.handle, className)}
      role="separator"
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(sizes[index] ?? 0)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      {withHandle && (
        <span className={styles.grip} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
    </div>
  );
}
export const ResizableHandle = Object.assign(HandleImpl, { isResizableHandle: true });
