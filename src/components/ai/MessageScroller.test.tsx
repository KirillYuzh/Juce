import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef, type ReactNode } from 'react';
import { MessageScroller, useMessageScroller } from './MessageScroller';

function Provider({ resetKey = 'a', children }: { resetKey?: string; children: ReactNode }) {
  return (
    <MessageScroller.Provider autoScroll defaultScrollPosition="end" resetKey={resetKey}>
      <MessageScroller.Root>
        <MessageScroller.Viewport>{children}</MessageScroller.Viewport>
        <MessageScroller.Button />
      </MessageScroller.Root>
    </MessageScroller.Provider>
  );
}

const viewportOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[role="region"]') as HTMLElement;

async function flushFrames(count = 2) {
  for (let index = 0; index < count; index += 1) {
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  }
}

describe('MessageScroller', () => {
  it('clears the pending flag when the reset key flips back before a frame', async () => {
    const view = render(
      <Provider resetKey="a">
        <MessageScroller.Content>Привет</MessageScroller.Content>
      </Provider>
    );
    const viewport = viewportOf(view.container);
    await flushFrames();
    expect(viewport.hasAttribute('data-pending-scroll')).toBe(false);

    act(() => {
      view.rerender(
        <Provider resetKey="b">
          <MessageScroller.Content>Привет</MessageScroller.Content>
        </Provider>
      );
    });
    expect(viewport.hasAttribute('data-pending-scroll')).toBe(true);

    act(() => {
      view.rerender(
        <Provider resetKey="a">
          <MessageScroller.Content>Привет</MessageScroller.Content>
        </Provider>
      );
    });
    expect(viewport.hasAttribute('data-pending-scroll')).toBe(false);

    await flushFrames();
    expect(viewport.hasAttribute('data-pending-scroll')).toBe(false);
  });

  it('keeps the consumer ref working next to the internal one', async () => {
    const ref = createRef<HTMLDivElement>();
    const view = render(
      <MessageScroller.Provider autoScroll defaultScrollPosition="end" resetKey="a">
        <MessageScroller.Root>
          <MessageScroller.Viewport ref={ref}>
            <MessageScroller.Content>Привет</MessageScroller.Content>
          </MessageScroller.Viewport>
        </MessageScroller.Root>
      </MessageScroller.Provider>
    );
    const viewport = viewportOf(view.container);
    expect(ref.current).toBe(viewport);

    await flushFrames();
    expect(viewport.hasAttribute('data-pending-scroll')).toBe(false);
  });

  describe('programmatic scrolling', () => {
    class ResizeObserverMock {
      static callbacks: Array<() => void> = [];
      constructor(callback: () => void) {
        ResizeObserverMock.callbacks.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    beforeEach(() => {
      ResizeObserverMock.callbacks = [];
      vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('does not stop following when a scroll comes from the component itself', async () => {
      function Controls() {
        const scroller = useMessageScroller();
        return (
          <button type="button" onClick={() => scroller.scrollToEnd()}>
            К концу
          </button>
        );
      }

      const view = render(
        <Provider>
          <MessageScroller.Content>
            <Controls />
          </MessageScroller.Content>
        </Provider>
      );

      const viewport = viewportOf(view.container);
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 1000 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 100 });
      viewport.scrollTop = 0;

      const scrollTo = vi.fn(() => {
        viewport.dispatchEvent(new Event('scroll'));
      });
      Object.defineProperty(viewport, 'scrollTo', { configurable: true, value: scrollTo });

      act(() => ResizeObserverMock.callbacks[0]?.());
      await flushFrames();
      scrollTo.mockClear();

      act(() => {
        view.getByRole('button', { name: 'К концу' }).click();
      });
      await flushFrames();

      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 2000 });
      act(() => ResizeObserverMock.callbacks[0]?.());
      await flushFrames();

      expect(scrollTo).toHaveBeenCalled();
    });
  });
});
