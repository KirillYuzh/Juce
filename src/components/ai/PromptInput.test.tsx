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

  it('keeps stop active while the input is disabled', () => {
    const onStop = vi.fn();
    render(<PromptInput disabled status="streaming" onStop={onStop} />);

    const field = screen.getByLabelText('Сообщение ассистенту') as HTMLTextAreaElement;
    expect(field.disabled).toBe(true);

    const stop = screen.getByLabelText('Остановить ответ') as HTMLButtonElement;
    expect(stop.disabled).toBe(false);
    fireEvent.click(stop);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('blocks sending while disabled', () => {
    const onSubmit = vi.fn();
    render(<PromptInput disabled onSubmit={onSubmit} defaultValue="Вопрос" />);

    const button = screen.getByLabelText('Отправить сообщение') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    pressEnter();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('links the hint to the field', () => {
    render(<PromptInput />);
    const field = screen.getByLabelText('Сообщение ассистенту');
    const describedBy = field.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? '')?.textContent).toBe(
      'Enter — отправить, Shift+Enter — новая строка'
    );
  });

  it('rejects a file above maxFileSize', () => {
    render(<PromptInput maxFileSize={3} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['abcd'], 'big.txt', { type: 'text/plain' })] },
    });

    expect(screen.getByRole('alert').textContent).toBe('Файл «big.txt» больше 3 Б');
    expect(screen.queryByText('big.txt')).toBeNull();
  });

  it('rejects a file outside accept', () => {
    render(<PromptInput accept="image/*" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'note.txt', { type: 'text/plain' })] },
    });

    expect(screen.getByRole('alert').textContent).toBe('Файл «note.txt» не подходит по типу');
    expect(screen.queryByText('note.txt')).toBeNull();
  });
});
