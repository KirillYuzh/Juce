import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';

export interface RovingFocusOptions {
  count: number;
  index: number;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onMove: (index: number) => void;
}

export function useRovingFocus({
  count,
  index,
  orientation = 'horizontal',
  loop = true,
  onMove,
}: RovingFocusOptions): (event: KeyboardEvent) => void {
  const moveRef = useRef(onMove);
  useEffect(() => {
    moveRef.current = onMove;
  }, [onMove]);

  return useCallback(
    (event: KeyboardEvent) => {
      if (count === 0) return;
      const base = index >= 0 ? index : 0;
      const step = (delta: number) => {
        const next = base + delta;
        return loop ? (next + count) % count : Math.min(Math.max(next, 0), count - 1);
      };

      let next: number;
      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'vertical') return;
          next = step(1);
          break;
        case 'ArrowLeft':
          if (orientation === 'vertical') return;
          next = step(-1);
          break;
        case 'ArrowDown':
          if (orientation === 'horizontal') return;
          next = step(1);
          break;
        case 'ArrowUp':
          if (orientation === 'horizontal') return;
          next = step(-1);
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = count - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      moveRef.current(next);
    },
    [count, index, orientation, loop]
  );
}
