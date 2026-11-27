import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar } from './Calendar';

const invalidDate = new Date('не дата');

describe('Calendar with invalid dates', () => {
  it('renders a month grid without throwing', () => {
    const { container } = render(
      <Calendar
        value={invalidDate}
        month={invalidDate}
        defaultMonth={invalidDate}
        min={invalidDate}
        max={invalidDate}
      />
    );

    expect(screen.getByRole('grid')).toBeTruthy();
    expect(container.querySelectorAll('[role="gridcell"]').length).toBeGreaterThan(0);
  });

  it('selects no day for an invalid single value', () => {
    const { container } = render(<Calendar value={invalidDate} />);

    expect(container.querySelector('[aria-selected="true"]')).toBeNull();
  });

  it('selects no day for a range with invalid bounds', () => {
    const { container } = render(
      <Calendar mode="range" value={{ from: invalidDate, to: invalidDate }} />
    );

    expect(container.querySelector('[aria-selected="true"]')).toBeNull();
  });
});
