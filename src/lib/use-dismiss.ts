import { useEffect, useRef, type RefObject } from 'react';

export interface DismissOptions {
  open: boolean;
  onDismiss: () => void;
  ref: RefObject<HTMLElement | null>;
  outside?: boolean;
  escape?: boolean;
}

export function useDismiss({
  open,
  onDismiss,
  ref,
  outside = true,
  escape = true,
}: DismissOptions): void {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) dismissRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissRef.current();
    };

    if (outside) document.addEventListener('pointerdown', handlePointerDown);
    if (escape) document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (outside) document.removeEventListener('pointerdown', handlePointerDown);
      if (escape) document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, ref, outside, escape]);
}
