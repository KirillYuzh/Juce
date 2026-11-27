import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StateMessage } from './StateMessage';

describe('StateMessage', () => {
  it('renders a neutral message as a status', () => {
    render(<StateMessage title="Пока пусто" text="Добавьте первый проект" />);

    const status = screen.getByRole('status');

    expect(status.getAttribute('data-tone')).toBe('neutral');
    expect(status.textContent).toContain('Пока пусто');
    expect(screen.getByText('Добавьте первый проект')).toBeTruthy();
  });

  it('renders an error message as an alert with the action', () => {
    render(
      <StateMessage
        tone="error"
        title="Не удалось загрузить данные"
        text="Проверьте соединение"
        action={<button type="button">Повторить</button>}
      />
    );

    const alert = screen.getByRole('alert');

    expect(alert.getAttribute('data-tone')).toBe('error');
    expect(alert.textContent).toContain('Не удалось загрузить данные');
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeTruthy();
  });

  it('renders the default icon', () => {
    const { container } = render(<StateMessage title="Стандартная иконка" />);

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('replaces the default icon with the given one', () => {
    const { container } = render(
      <StateMessage icon={<span data-testid="own-icon" />} title="Своя иконка" />
    );

    expect(screen.getByTestId('own-icon')).toBeTruthy();
    expect(container.querySelector('svg')).toBeNull();
  });
});
