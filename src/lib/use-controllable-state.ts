import { useCallback, useState } from 'react';

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export type ControllableState<T> = [current: T, set: (next: T) => void];

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): ControllableState<T> {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [current, set];
}
