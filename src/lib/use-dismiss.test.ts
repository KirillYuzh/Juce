import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RefObject } from 'react';
import { useDismiss } from './use-dismiss';

const pointerDown = (target: EventTarget) =>
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

const pressEscape = (target: EventTarget) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

function setup(options: { open?: boolean; outside?: boolean; escape?: boolean } = {}) {
  const { open = true, outside = true, escape = true } = options;
  const container = document.createElement('div');
  const elsewhere = document.createElement('div');
  document.body.append(container, elsewhere);

  const ref: RefObject<HTMLElement | null> = { current: container };
  const onDismiss = vi.fn();
  const view = renderHook(
    (props: { onDismiss: () => void }) =>
      useDismiss({ open, outside, escape, ref, onDismiss: props.onDismiss }),
    { initialProps: { onDismiss } }
  );

  return { ...view, container, elsewhere, onDismiss };
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('useDismiss', () => {
  it('keeps the surface open on a pointer down inside the container', () => {
    const { container, onDismiss } = setup();

    pointerDown(container);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses on a pointer down outside the container', () => {
    const { elsewhere, onDismiss } = setup();

    pointerDown(elsewhere);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses on Escape', () => {
    const { onDismiss } = setup();

    pressEscape(document);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ignores an outside pointer down when outside is false', () => {
    const { elsewhere, onDismiss } = setup({ outside: false });

    pointerDown(elsewhere);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('installs no listeners while closed', () => {
    const { container, onDismiss } = setup({ open: false });

    pointerDown(document);
    pressEscape(document);
    pointerDown(container);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('keeps the same document listeners when the callback identity changes', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const { onDismiss, rerender, elsewhere } = setup();
    const subscribed = (type: string) => add.mock.calls.filter(([event]) => event === type).length;
    const unsubscribed = (type: string) =>
      remove.mock.calls.filter(([event]) => event === type).length;

    const next = vi.fn();
    rerender({ onDismiss: next });

    expect(subscribed('pointerdown')).toBe(1);
    expect(subscribed('keydown')).toBe(1);
    expect(unsubscribed('pointerdown')).toBe(0);
    expect(unsubscribed('keydown')).toBe(0);

    pointerDown(elsewhere);

    expect(onDismiss).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('leaves the default action of Escape alone', () => {
    setup();
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
