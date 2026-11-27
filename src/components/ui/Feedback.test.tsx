import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Feedback';

const tooltip = () => {
  const element = document.querySelector('[role="tooltip"]');
  if (!element) throw new Error('Подсказка не отрендерена');
  return element;
};

describe('Tooltip', () => {
  it('закрывается по Escape и не уводит фокус', () => {
    render(
      <Tooltip text="Подсказка">
        <button>Кнопка</button>
      </Tooltip>
    );
    const button = screen.getByRole('button', { name: 'Кнопка' });
    act(() => {
      button.focus();
    });
    expect(tooltip().getAttribute('aria-hidden')).toBeNull();

    fireEvent.keyDown(button, { key: 'Escape' });

    expect(tooltip().getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(button);
  });
});
