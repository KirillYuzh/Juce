import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PromptInput } from './PromptInput';

const type = (value: string) =>
  fireEvent.change(screen.getByLabelText('Сообщение ассистенту'), { target: { value } });

const pressEnter = () =>
  fireEvent.keyDown(screen.getByLabelText('Сообщение ассистенту'), { key: 'Enter' });

describe('PromptInput', () => {
  it('blocks Enter while streaming', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} onStop={() => {}} status="streaming" />);

    type('Второй вопрос');
    expect(screen.getByLabelText('Остановить ответ')).toBeTruthy();
    expect(screen.queryByLabelText('Отправить сообщение')).toBeNull();

    pressEnter();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('blocks Enter and disables the send button while submitted', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} status="submitted" />);

    type('Вопрос');
    const button = screen.getByLabelText('Отправить сообщение') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    pressEnter();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('hides the stop button when there is no onStop', () => {
    render(<PromptInput status="streaming" />);

    expect(screen.queryByLabelText('Остановить ответ')).toBeNull();
    expect(screen.getByLabelText('Отправить сообщение')).toBeTruthy();
  });

  it('submits once when ready', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} />);

    type('Вопрос');
    pressEnter();
    expect(onSubmit).toHaveBeenCalledWith({ text: 'Вопрос', files: [] });
  });
});
