import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './use-controllable-state';

describe('useControllableState', () => {
  it('keeps its own state when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a' }));

    act(() => result.current[1]('b'));

    expect(result.current[0]).toBe('b');
  });

  it('follows the value prop when controlled', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) =>
        useControllableState({ value, defaultValue: 'a', onChange }),
      { initialProps: { value: 'a' } }
    );

    act(() => result.current[1]('b'));

    expect(result.current[0]).toBe('a');
    expect(onChange).toHaveBeenCalledWith('b');

    rerender({ value: 'b' });
    expect(result.current[0]).toBe('b');
  });

  it('reports every change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

    act(() => result.current[1](1));
    act(() => result.current[1](2));

    expect(onChange.mock.calls).toEqual([[1], [2]]);
  });

  it('applies an updater to its own state when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

    act(() => result.current[1]((prev) => prev + 1));
    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(2);
  });

  it('applies an updater to the value prop when controlled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 5, defaultValue: 0, onChange })
    );

    act(() => result.current[1]((prev) => prev * 2));

    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('keeps the setter identity stable when onChange changes', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onChange }: { onChange: (next: number) => void }) =>
        useControllableState({ defaultValue: 0, onChange }),
      { initialProps: { onChange: first } }
    );
    const setBefore = result.current[1];

    rerender({ onChange: second });

    expect(result.current[1]).toBe(setBefore);

    act(() => result.current[1](1));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(1);
  });
});
