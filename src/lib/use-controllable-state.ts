import { useCallback, useRef, useState } from 'react';

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export type ControllableStateUpdater<T> = T | ((prev: T) => T);

export type ControllableState<T> = [current: T, set: (next: ControllableStateUpdater<T>) => void];

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): ControllableState<T> {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const currentRef = useRef(current);
  currentRef.current = current;
  const controlledRef = useRef(controlled);
  controlledRef.current = controlled;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const set = useCallback((next: ControllableStateUpdater<T>) => {
    const resolved =
      typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next;
    currentRef.current = resolved;
    if (!controlledRef.current) setInner(resolved);
    onChangeRef.current?.(resolved);
  }, []);

  return [current, set];
}
