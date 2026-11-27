import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { MessageScroller } from './MessageScroller';

type ResizeCallback = ConstructorParameters<typeof ResizeObserver>[0];

const originalResizeObserver = globalThis.ResizeObserver;
let callbacks: ResizeCallback[] = [];

class ResizeObserverProbe {
  constructor(callback: ResizeCallback) {
    callbacks.push(callback);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

const tree = (autoScroll: boolean) => (
  <MessageScroller.Provider autoScroll={autoScroll}>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        <MessageScroller.Item messageId="one">Первый</MessageScroller.Item>
      </MessageScroller.Content>
    </MessageScroller.Viewport>
  </MessageScroller.Provider>
);

const flush = (ms = 64) => act(() => vi.advanceTimersByTime(ms));

const mountScroller = (autoScroll: boolean) => {
  const result = render(tree(autoScroll));
  const viewport = result.getByRole('region', { name: 'Сообщения' });
  const scrollTo = vi.fn();
  let height = 0;
  Object.defineProperty(viewport, 'scrollTo', { configurable: true, value: scrollTo });
  Object.defineProperty(viewport, 'scrollHeight', { configurable: true, get: () => height });
  Object.defineProperty(viewport, 'clientHeight', { configurable: true, get: () => 100 });
  const resize = (next: number) => {
    height = next;
    act(() => {
      for (const callback of callbacks) callback([], {} as ResizeObserver);
    });
  };
  const setHeight = (next: number) => {
    height = next;
  };
  return { ...result, viewport, scrollTo, resize, setHeight };
};

describe('MessageScroller', () => {
  beforeEach(() => {
    callbacks = [];
    globalThis.ResizeObserver = ResizeObserverProbe as unknown as typeof ResizeObserver;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('follows new content when autoScroll is switched on after mount', () => {
    const { rerender, scrollTo, resize } = mountScroller(false);
    flush();

    rerender(tree(true));
    resize(500);

    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'instant' });
  });

  it('keeps the user position when autoScroll stays on after scrolling up', () => {
    const { rerender, viewport, scrollTo, resize, setHeight } = mountScroller(true);
    flush();

    setHeight(400);
    fireEvent.scroll(viewport);
    flush();

    rerender(tree(true));
    resize(600);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
