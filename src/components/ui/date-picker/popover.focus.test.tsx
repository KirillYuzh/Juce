import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const rect = new DOMRect(0, 0, 10, 10);

function rectList(): DOMRectList {
  const list = [rect];
  return Object.assign(list, { item: (index: number) => list[index] ?? null });
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(() => rectList());
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderPopover(children?: ReactNode) {
  render(
    <Popover defaultOpen>
      <PopoverTrigger>Выбрать</PopoverTrigger>
      <PopoverContent aria-label="Выбор даты">
        {children ?? (
          <>
            <button type="button">Первый</button>
            <button type="button">Последний</button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
  return {
    trigger: screen.getByRole('button', { name: 'Выбрать' }),
    content: screen.getByRole('dialog'),
    first: screen.queryByRole('button', { name: 'Первый' }),
    last: screen.queryByRole('button', { name: 'Последний' }),
  };
}

describe('PopoverContent как модальный диалог', () => {
  it('объявляет себя модальным диалогом с доступным именем', () => {
    const { content } = renderPopover();

    expect(content.getAttribute('aria-modal')).toBe('true');
    expect(content.getAttribute('aria-label')).toBe('Выбор даты');
  });

  it('Tab с последнего элемента уходит на первый, Shift+Tab — обратно', () => {
    const { first, last } = renderPopover();
    if (!first || !last) throw new Error('фокусируемые элементы не отрендерились');

    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('оставляет фокус на контенте, когда внутри нечего фокусировать', () => {
    const { content } = renderPopover('Только текст');

    fireEvent.keyDown(content, { key: 'Tab' });
    expect(document.activeElement).toBe(content);
  });

  it('после Escape закрывается и возвращает фокус на триггер', () => {
    const { trigger } = renderPopover();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
