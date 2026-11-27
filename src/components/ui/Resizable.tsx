import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import styles from './Resizable.module.css';
import { cx } from '../../lib/cx';
import { clamp } from '../../lib/clamp';

export type ResizableOrientation = 'horizontal' | 'vertical';

type SizeMap = Record<string, number>;
type PanelElement = ReactElement<{
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  index?: number;
}>;

export interface ResizableLimits {
  min: number;
  max: number;
}

interface ResizableContextValue {
  orientation: ResizableOrientation;
  sizes: number[];
  setSizes: (sizes: number[]) => void;
  limits: ResizableLimits[];
  panelCount: number;
  register: (index: number, element: HTMLDivElement | null) => void;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizable(component: string): ResizableContextValue {
  const context = useContext(ResizableContext);
  if (!context) throw new Error(`${component} must be used inside <ResizablePanelGroup>`);
  return context;
}

const KEYBOARD_STEP = 4;

export function pairRange(sizes: number[], index: number, limits: ResizableLimits[]) {
  const pair = (sizes[index] ?? 0) + (sizes[index + 1] ?? 0);
  const minStart = limits[index]?.min ?? 0;
  const maxStart = limits[index]?.max ?? 100;
  const minEnd = limits[index + 1]?.min ?? 0;
  const maxEnd = limits[index + 1]?.max ?? 100;
  const lower = Math.max(minStart, pair - maxEnd);
  const upper = Math.min(maxStart, pair - minEnd);
  return { min: Math.min(lower, upper), max: Math.max(lower, upper) };
}

export function drag(
  sizes: number[],
  index: number,
  delta: number,
  limits: ResizableLimits[]
): number[] {
  const end = index + 1;
  const startSize = sizes[index];
  const endSize = sizes[end];
  if (startSize === undefined || endSize === undefined) return sizes;
  const pair = startSize + endSize;
  const { min, max } = pairRange(sizes, index, limits);
  const left = clamp(startSize + delta, min, max);
  const next = [...sizes];
  next[index] = left;
  next[end] = pair - left;
  return next;
}

const isPanel = (child: ReactNode): child is PanelElement =>
  isValidElement(child) && Boolean((child.type as { isResizablePanel?: boolean }).isResizablePanel);

const isHandle = (child: ReactNode): child is ReactElement<{ index?: number }> =>
  isValidElement(child) &&
  Boolean((child.type as { isResizableHandle?: boolean }).isResizableHandle);

function distributeSizes(panels: PanelElement[], ids: string[]): SizeMap {
  const explicit = panels.map((panel) =>
    typeof panel.props.defaultSize === 'number' ? panel.props.defaultSize : null
  );
  const fixed = explicit.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const flexible = explicit.filter((value) => value === null).length;
  const rest = flexible ? Math.max(100 - fixed, 0) / flexible : 0;
  const raw = explicit.map((value) => value ?? rest);
  const total = raw.reduce((sum, value) => sum + value, 0) || 1;
  const sizes: SizeMap = {};
  ids.forEach((id, index) => {
    sizes[id] = ((raw[index] ?? 0) / total) * 100;
  });
  return sizes;
}

function reconcileSizes(previous: SizeMap, panels: PanelElement[], ids: string[]): SizeMap {
  if (ids.length === Object.keys(previous).length && ids.every((id) => id in previous)) {
    return previous;
  }
  const next: SizeMap = {};
  ids.forEach((id, index) => {
    if (id in previous) {
      next[id] = previous[id];
      return;
    }
    const panel = panels[index];
    next[id] =
      typeof panel?.props.defaultSize === 'number'
        ? panel.props.defaultSize
        : 100 / Math.max(ids.length, 1);
  });
  const total = ids.reduce((sum, id) => sum + next[id], 0);
  if (total <= 0) {
    const equal = 100 / Math.max(ids.length, 1);
    ids.forEach((id) => {
      next[id] = equal;
    });
    return next;
  }
  ids.forEach((id) => {
    next[id] = (next[id] / total) * 100;
  });
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
  const panels = items.filter(isPanel);
  const panelIds = panels.map((panel, index) => String(panel.key ?? index));
  const signature = panelIds.join('\u0000');

  const [layout, setLayout] = useState(() => ({
    signature,
    sizes: distributeSizes(panels, panelIds),
  }));

  let sizeMap = layout.sizes;
  if (layout.signature !== signature) {
    sizeMap = reconcileSizes(layout.sizes, panels, panelIds);
    setLayout({ signature, sizes: sizeMap });
  }

  const sizes = panelIds.map((id) => sizeMap[id] ?? 0);
  const limits = panels.map((panel) => ({
    min: panel.props.minSize ?? 0,
    max: panel.props.maxSize ?? 100,
  }));

  const elements = useRef(new Map<number, HTMLDivElement>());
  const register = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) elements.current.set(index, element);
    else elements.current.delete(index);
  }, []);

  const update = (next: number[]) => {
    const nextMap: SizeMap = {};
    panelIds.forEach((id, index) => {
      nextMap[id] = next[index] ?? 0;
    });
    setLayout({ signature, sizes: nextMap });
    onLayoutChange?.(next);
  };

  let panelIndex = 0;
  let handleIndex = 0;
  const mapped = items.map((child) => {
    if (isPanel(child)) return cloneElement(child, { index: panelIndex++ });
    if (isHandle(child)) return cloneElement(child, { index: handleIndex++ });
    return child;
  });

  return (
    <ResizableContext.Provider
      value={{ orientation, sizes, setSizes: update, limits, panelCount: panels.length, register }}
    >
      <div
        className={cx(styles.group, className)}
        data-orientation={orientation}
        style={{ ...style, '--panel-count': panels.length } as CSSProperties}
      >
        {mapped}
      </div>
    </ResizableContext.Provider>
  );
}

export interface ResizablePanelProps {
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  style?: CSSProperties;
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
  index?: number;
}

function HandleImpl({ withHandle, className, index = 0 }: ResizableHandleProps) {
  const { orientation, sizes, setSizes, limits, panelCount } = useResizable('ResizableHandle');
  const detach = useRef<(() => void) | null>(null);
  const valid = index + 1 < panelCount;

  useEffect(() => () => detach.current?.(), []);

  const stop = () => {
    detach.current?.();
    detach.current = null;
  };

  if (!valid) return null;

  const range = pairRange(sizes, index, limits);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const group = event.currentTarget.parentElement;
    if (!group) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const rect = group.getBoundingClientRect();
    const total = orientation === 'horizontal' ? rect.width : rect.height;
    const start = orientation === 'horizontal' ? event.clientX : event.clientY;
    const initial = sizes;

    const move = (moveEvent: PointerEvent) => {
      if (!total) return;
      const position = orientation === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = ((position - start) / total) * 100;
      setSizes(drag(initial, index, delta, limits));
    };

    const end = () => stop();

    stop();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    detach.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const back = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const current = sizes[index] ?? 0;
    let delta: number | null = null;
    if (event.key === back) delta = -KEYBOARD_STEP;
    else if (event.key === forward) delta = KEYBOARD_STEP;
    else if (event.key === 'Home') delta = range.min - current;
    else if (event.key === 'End') delta = range.max - current;
    if (delta === null) return;
    event.preventDefault();
    setSizes(drag(sizes, index, delta, limits));
  };

  return (
    <div
      className={cx(styles.handle, className)}
      role="separator"
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(sizes[index] ?? 0)}
      aria-valuemin={Math.round(range.min)}
      aria-valuemax={Math.round(range.max)}
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
