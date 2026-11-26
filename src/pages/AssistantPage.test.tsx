import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AssistantPage } from './AssistantPage';

const typeQuestion = (text: string) =>
  fireEvent.change(screen.getByLabelText('Сообщение ассистенту'), { target: { value: text } });

describe('AssistantPage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resends the previous question after stop instead of dropping it', async () => {
    render(<AssistantPage />);

    typeQuestion('Как планировщик выбирает горутину?');
    fireEvent.click(screen.getByLabelText('Отправить сообщение'));
    fireEvent.click(screen.getByLabelText('Остановить ответ'));

    expect(screen.getByRole('alert').textContent).toBe('Остановлено. Ответ можно повторить.');

    const retryButtons = screen.getAllByLabelText('Повторить ответ');
    fireEvent.click(retryButtons[retryButtons.length - 1]);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getAllByText('Как планировщик выбирает горутину?')).toHaveLength(1);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getAllByText(/демонстрационный ответ/i)).toHaveLength(1);
    expect(screen.getByLabelText('Отправить сообщение')).toBeTruthy();
  });

  it('answers once when two sends land in the same tick', async () => {
    render(<AssistantPage />);
    const suggestion = screen.getByText('Почему утекает горутина?').closest('button');
    if (!suggestion) throw new Error('suggestion is missing');

    act(() => {
      suggestion.click();
      suggestion.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getAllByText(/демонстрационный ответ/i)).toHaveLength(1);
  });

  it('does not write to state after unmount', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const view = render(<AssistantPage />);
    typeQuestion('Вопрос');
    fireEvent.click(screen.getByLabelText('Отправить сообщение'));

    view.unmount();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
