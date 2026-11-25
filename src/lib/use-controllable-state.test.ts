import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './use-controllable-state';

describe('useControllableState', () => {
  it('keeps its own state when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'a' })
    );

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
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 0, onChange })
    );

    act(() => result.current[1](1));
    act(() => result.current[1](2));

    expect(onChange.mock.calls).toEqual([[1], [2]]);
  });
});
