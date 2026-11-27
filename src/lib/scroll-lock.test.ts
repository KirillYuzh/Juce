import { afterEach, describe, expect, it } from 'vitest';
import { lockScroll } from './scroll-lock';

function stubViewport(clientWidth: number, innerWidth: number) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: innerWidth });
}

afterEach(() => {
  Reflect.deleteProperty(document.documentElement, 'clientWidth');
  Reflect.deleteProperty(window, 'innerWidth');
  document.body.removeAttribute('style');
});

describe('lockScroll', () => {
  it('ставит overflow: hidden и снимает при отпускании', () => {
    const release = lockScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('');

    release();

    expect(document.body.style.overflow).toBe('');
  });

  it('держит блокировку, пока открыт хотя бы один слой', () => {
    const first = lockScroll();
    const second = lockScroll();

    first();
    expect(document.body.style.overflow).toBe('hidden');

    second();
    expect(document.body.style.overflow).toBe('');
  });

  it('компенсирует ширину скроллбара', () => {
    stubViewport(1000, 1015);

    const release = lockScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('15px');

    release();

    expect(document.body.style.paddingRight).toBe('');
  });

  it('возвращает прежний inline padding-right', () => {
    document.body.style.paddingRight = '7px';
    stubViewport(1000, 1015);

    const release = lockScroll();
    expect(document.body.style.paddingRight).toBe('22px');

    release();
    expect(document.body.style.paddingRight).toBe('7px');
  });

  it('переживает повторное отпускание', () => {
    const first = lockScroll();
    const second = lockScroll();

    first();
    first();
    expect(document.body.style.overflow).toBe('hidden');

    second();
    second();
    expect(document.body.style.overflow).toBe('');

    const again = lockScroll();
    expect(document.body.style.overflow).toBe('hidden');
    again();
    expect(document.body.style.overflow).toBe('');
  });
});
