import { afterEach, describe, expect, it, vi } from 'vitest';
import { focusablesWithin } from './focus';

const rect = new DOMRect(0, 0, 10, 10);

function rectList(count: number): DOMRectList {
  const list = Array.from({ length: count }, () => rect);
  return Object.assign(list, { item: (index: number) => list[index] ?? null });
}

function stubLayout() {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (
    this: HTMLElement
  ) {
    return rectList(this.hasAttribute('data-collapsed') ? 0 : 1);
  });
}

function mount(markup: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = markup;
  document.body.append(root);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('focusablesWithin', () => {
  it('returns an empty list without a root', () => {
    expect(focusablesWithin(null)).toEqual([]);
  });

  it('skips hidden, aria-hidden, disabled and zero-sized elements', () => {
    stubLayout();
    const root = mount(`
      <button data-id="button">кнопка</button>
      <button data-id="hidden" hidden>скрытая</button>
      <div aria-hidden="true"><button data-id="aria-hidden">внутри скрытого</button></div>
      <button data-id="disabled" disabled>недоступная</button>
      <a data-id="link" href="#x">ссылка</a>
      <span data-id="tabbable" tabindex="0">в порядке Tab</span>
      <span data-id="untabbable" tabindex="-1">вне порядка Tab</span>
      <input data-id="input" />
      <button data-id="collapsed" data-collapsed>нулевой размер</button>
    `);

    expect(focusablesWithin(root).map((element) => element.dataset.id)).toEqual([
      'button',
      'link',
      'tabbable',
      'input',
    ]);
  });
});
