import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

function Card() {
  return (
    <HoverCard delay={300}>
      <HoverCardTrigger>
        <button>Наведи</button>
      </HoverCardTrigger>
      <HoverCardContent>Подсказка</HoverCardContent>
    </HoverCard>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('HoverCard', () => {
  it('открывается на HoverCardTrigger только после delay', () => {
    render(<Card />);
    const button = screen.getByRole('button', { name: 'Наведи' });

    fireEvent.mouseEnter(button);
    expect(screen.queryByText('Подсказка')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.queryByText('Подсказка')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('Подсказка')).toBeTruthy();
  });
});
