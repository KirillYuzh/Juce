import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Calendar } from './Calendar';

const dayButtons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>('[role="gridcell"] button'));

describe('Calendar roving tabindex', () => {
  it('оставляет ровно одну кнопку с tabIndex=0 в отрисованном месяце', () => {
    const { container } = render(<Calendar defaultMonth={new Date(2024, 5, 1)} />);

    const active = dayButtons(container).filter((day) => day.getAttribute('tabindex') === '0');

    expect(active).toHaveLength(1);
    expect(active[0].getAttribute('aria-label')).toContain('июня 2024');
  });

  it('переключает месяц стрелкой с последнего дня месяца', () => {
    const { container } = render(
      <Calendar value={new Date(2024, 5, 30)} defaultMonth={new Date(2024, 5, 1)} />
    );

    fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowRight' });

    expect(screen.getByText('Июль 2024')).toBeTruthy();
    const active = dayButtons(container).filter((day) => day.getAttribute('tabindex') === '0');
    expect(active).toHaveLength(1);
    expect(active[0].getAttribute('aria-label')).toContain('1 июля 2024');
  });

  it('не оставляет tabIndex=0, если весь месяц недоступен', () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2024, 5, 1)}
        min={new Date(2024, 6, 1)}
        max={new Date(2024, 11, 31)}
      />
    );

    const active = dayButtons(container).filter((day) => day.getAttribute('tabindex') === '0');

    expect(active).toHaveLength(0);
  });
});
