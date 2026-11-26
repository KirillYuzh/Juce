import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tooltip } from './Feedback';

describe('Tooltip', () => {
  it('показывает подсказку при фокусе на вложенной кнопке', () => {
    const { container } = render(
      <Tooltip text="Подсказка">
        <button type="button">Кнопка</button>
      </Tooltip>
    );
    const tooltip = container.querySelector('[role="tooltip"]');

    expect(tooltip?.getAttribute('aria-hidden')).toBe('true');

    fireEvent.focus(screen.getByRole('button', { name: 'Кнопка' }));
    expect(tooltip?.hasAttribute('aria-hidden')).toBe(false);

    fireEvent.blur(screen.getByRole('button', { name: 'Кнопка' }), {
      relatedTarget: document.body,
    });
    expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
  });
});
