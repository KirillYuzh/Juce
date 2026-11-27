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

  it('ignores repeated Enter keydowns until the value changes', () => {
    const onSubmit = vi.fn();
    render(<PromptInput value="Вопрос" onSubmit={onSubmit} />);

    pressEnter();
    fireEvent.keyDown(screen.getByLabelText('Сообщение ассистенту'), {
      key: 'Enter',
      repeat: true,
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('blocks a second submit until the value changes', () => {
    const onSubmit = vi.fn();
    render(<PromptInput value="Вопрос" onSubmit={onSubmit} />);

    pressEnter();
    pressEnter();

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('asks the parent to clear the value in controlled mode', () => {
    const onSubmit = vi.fn();
    const onValueChange = vi.fn();
    render(<PromptInput value="Вопрос" onValueChange={onValueChange} onSubmit={onSubmit} />);

    pressEnter();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('submits the same text again after the value changes', () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<PromptInput value="Вопрос" onSubmit={onSubmit} />);

    pressEnter();
    rerender(<PromptInput value="" onSubmit={onSubmit} />);
    rerender(<PromptInput value="Вопрос" onSubmit={onSubmit} />);
    pressEnter();

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
});
