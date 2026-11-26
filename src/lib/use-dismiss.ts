import type { RefObject } from 'react';
import { useEffect } from 'react';

export interface UseDismissOptions {
  onDismiss: () => void;
  enabled?: boolean;
  escape?: boolean;
  pointer?: boolean;
}

export function useDismiss<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { onDismiss, enabled = true, escape = true, pointer = true }: UseDismissOptions
) {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = ref.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    if (pointer) document.addEventListener('pointerdown', onPointerDown);
    if (escape) document.addEventListener('keydown', onKeyDown);
    return () => {
      if (pointer) document.removeEventListener('pointerdown', onPointerDown);
      if (escape) document.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, escape, onDismiss, pointer, ref]);
}
