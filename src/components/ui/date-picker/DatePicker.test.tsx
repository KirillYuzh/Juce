import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('объявляет диалог и даёт доступное имя из label', () => {
    render(<DatePicker label="Дата начала" />);
    const trigger = screen.getByRole('button', { name: 'Дата начала' });

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('предпочитает aria-label пропу label', () => {
    render(<DatePicker label="Дата" aria-label="Дедлайн" />);
    expect(screen.getByRole('button', { name: 'Дедлайн' })).toBeTruthy();
  });

  it('без label оставляет именем текущее значение', () => {
    render(<DatePicker value={new Date(2024, 0, 5)} />);
    expect(screen.getByRole('button', { name: '5 января 2024' })).toBeTruthy();
  });
});
