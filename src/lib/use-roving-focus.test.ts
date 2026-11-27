import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRovingFocus, type RovingFocusOptions } from './use-roving-focus';

type Handler = (event: ReactKeyboardEvent) => void;

const press = (handler: Handler, key: string) => {
  const event = new KeyboardEvent('keydown', { key, cancelable: true });
  handler(event as unknown as ReactKeyboardEvent);
  return event;
};

function setup(options: Partial<RovingFocusOptions> = {}) {
  const onMove = vi.fn();
  const view = renderHook(
    (props: { index: number; onMove: (index: number) => void }) =>
      useRovingFocus({ count: 3, ...options, index: props.index, onMove: props.onMove }),
    { initialProps: { index: 0, onMove } }
  );

  return { ...view, onMove };
}

describe('useRovingFocus', () => {
  it('переносит фокус по кругу вперёд и назад', () => {
    const { result, rerender, onMove } = setup();

    press(result.current, 'ArrowRight');
    expect(onMove).toHaveBeenLastCalledWith(1);

    press(result.current, 'ArrowLeft');
    expect(onMove).toHaveBeenLastCalledWith(2);

    rerender({ index: 2, onMove });
    press(result.current, 'ArrowRight');
    expect(onMove).toHaveBeenLastCalledWith(0);
  });

  it('переводит на первый и последний элемент по Home и End', () => {
    const { result, onMove } = setup();

    press(result.current, 'End');
    expect(onMove).toHaveBeenLastCalledWith(2);

    press(result.current, 'Home');
    expect(onMove).toHaveBeenLastCalledWith(0);
  });

  it('клампит края при loop: false', () => {
    const { result, rerender, onMove } = setup({ loop: false });

    press(result.current, 'ArrowLeft');
    expect(onMove).toHaveBeenLastCalledWith(0);

    rerender({ index: 2, onMove });
    press(result.current, 'ArrowRight');
    expect(onMove).toHaveBeenLastCalledWith(2);
  });

  it('игнорирует горизонтальные стрелки при orientation: vertical', () => {
    const { result, onMove } = setup({ orientation: 'vertical' });

    const ignored = press(result.current, 'ArrowRight');
    expect(ignored.defaultPrevented).toBe(false);
    expect(onMove).not.toHaveBeenCalled();

    press(result.current, 'ArrowDown');
    expect(onMove).toHaveBeenLastCalledWith(1);
  });

  it('реагирует на все стрелки при orientation: both', () => {
    const { result, onMove } = setup({ orientation: 'both' });

    for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
      press(result.current, key);
    }

    expect(onMove).toHaveBeenCalledTimes(4);
  });

  it('ничего не делает при count: 0', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() => useRovingFocus({ count: 0, index: -1, onMove }));

    const event = press(result.current, 'ArrowRight');

    expect(event.defaultPrevented).toBe(false);
    expect(onMove).not.toHaveBeenCalled();
  });

  it('не перехватывает необработанную клавишу', () => {
    const { result, onMove } = setup();

    const event = press(result.current, 'Escape');

    expect(event.defaultPrevented).toBe(false);
    expect(onMove).not.toHaveBeenCalled();
  });

  it('держит обработчик стабильным и берёт новый onMove', () => {
    const { result, rerender, onMove } = setup();
    const handler = result.current;
    const next = vi.fn();

    rerender({ index: 0, onMove: next });

    expect(result.current).toBe(handler);
    press(result.current, 'ArrowRight');
    expect(onMove).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(1);
  });
});
