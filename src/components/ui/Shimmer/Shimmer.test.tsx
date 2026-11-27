import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Shimmer } from './Shimmer';

const layer = (name: 'current' | 'previous') =>
  document.querySelector<HTMLElement>(`[data-shimmer-layer="${name}"]`);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('Shimmer', () => {
  it('adds the base class by default', () => {
    render(<Shimmer>Генерирую ответ…</Shimmer>);

    const shimmer = screen.getByText('Генерирую ответ…');
    expect(shimmer.classList.contains('tb-shimmer')).toBe(true);
    expect(shimmer.classList.contains('tb-shimmer-none')).toBe(false);
  });

  it('adds reverse and once classes', () => {
    render(
      <Shimmer reverse once>
        Думаю над задачей…
      </Shimmer>
    );

    const shimmer = screen.getByText('Думаю над задачей…');
    expect(shimmer.classList.contains('tb-shimmer-reverse')).toBe(true);
    expect(shimmer.classList.contains('tb-shimmer-once')).toBe(true);
  });

  it('adds the none class when inactive', () => {
    render(<Shimmer active={false}>Без эффекта</Shimmer>);

    expect(screen.getByText('Без эффекта').classList.contains('tb-shimmer-none')).toBe(true);
  });

  it('sets duration and angle as custom properties', () => {
    const { unmount } = render(
      <Shimmer duration="1s" angle="45deg">
        Быстрый вариант
      </Shimmer>
    );

    const shimmer = screen.getByText('Быстрый вариант');
    expect(shimmer.style.getPropertyValue('--tb-shimmer-duration')).toBe('1s');
    expect(shimmer.style.getPropertyValue('--tb-shimmer-angle')).toBe('45deg');

    unmount();

    render(<Shimmer duration="1s" angle="45deg" values={['Первый', 'Второй']} />);

    const wrapper = layer('current')?.parentElement;
    expect(wrapper?.style.getPropertyValue('--tb-shimmer-duration')).toBe('1s');
    expect(wrapper?.style.getPropertyValue('--tb-shimmer-angle')).toBe('45deg');
  });

  it('changes the rendered tag', () => {
    render(<Shimmer as="p">Абзац</Shimmer>);

    expect(screen.getByText('Абзац').tagName).toBe('P');
  });

  it('cycles values and removes the previous layer after the fade', () => {
    render(<Shimmer values={['Исследую источник 1', 'Исследую источник 2']} interval={1000} />);

    expect(layer('current')?.textContent).toBe('Исследую источник 1');
    expect(layer('current')?.classList.contains('tb-shimmer')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(layer('current')?.textContent).toBe('Исследую источник 2');
    expect(layer('previous')?.textContent).toBe('Исследую источник 1');
    expect(layer('previous')?.getAttribute('aria-hidden')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(layer('previous')).toBeNull();
  });

  it('cross-fades a directly controlled value', () => {
    const { rerender } = render(<Shimmer value="Исследую источник 1" />);

    expect(layer('current')?.textContent).toBe('Исследую источник 1');

    rerender(<Shimmer value="Исследую источник 2" />);

    expect(layer('current')?.textContent).toBe('Исследую источник 2');
    expect(layer('previous')?.textContent).toBe('Исследую источник 1');
    expect(layer('previous')?.getAttribute('aria-hidden')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(layer('previous')).toBeNull();
  });

  it('does not schedule an interval for a single value', () => {
    render(<Shimmer values={['Одна строка']} interval={1000} />);

    expect(layer('current')?.textContent).toBe('Одна строка');
    expect(vi.getTimerCount()).toBe(0);
  });
});
