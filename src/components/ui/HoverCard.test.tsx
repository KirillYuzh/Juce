import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

const DELAY = 300;
const CLOSE_DELAY = 200;

function renderCard() {
  return render(
    <HoverCard delay={DELAY} closeDelay={CLOSE_DELAY}>
      <HoverCardTrigger>
        <span>Правила</span>
      </HoverCardTrigger>
      <HoverCardContent aria-label="Подсказка">Текст подсказки</HoverCardContent>
    </HoverCard>
  );
}

describe('HoverCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('открывает по hover только после delay', () => {
    const { container } = renderCard();
    const root = container.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });
    expect(screen.queryByRole('dialog', { name: 'Подсказка' })).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('dialog', { name: 'Подсказка' })).toBeTruthy();
  });

  it('закрывает после closeDelay на mouseleave', () => {
    const { container } = renderCard();
    const root = container.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.mouseLeave(root);
    act(() => {
      vi.advanceTimersByTime(CLOSE_DELAY - 1);
    });
    expect(screen.queryByRole('dialog')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('открывает сразу по фокусу, без таймера', () => {
    const { container } = renderCard();
    const trigger = container.querySelector<HTMLElement>('[id$="-trigger"]');
    expect(trigger).not.toBeNull();

    fireEvent.focus(trigger as HTMLElement);

    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('не вешает role="button" на span с фокусируемым ребёнком', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>
          <button type="button">Открыть</button>
        </HoverCardTrigger>
        <HoverCardContent>Текст</HoverCardContent>
      </HoverCard>
    );
    const trigger = container.querySelector<HTMLElement>('[id$="-trigger"]');

    expect(trigger?.hasAttribute('role')).toBe(false);
    expect(trigger?.hasAttribute('tabindex')).toBe(false);
  });
});
