import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input, Select, Textarea } from './Fields';

describe('поля', () => {
  it('берёт placeholder как доступное имя и помечает обязательное поле', () => {
    const { container } = render(<Input placeholder="Почта" required />);
    const input = screen.getByRole('textbox', { name: 'Почта' });

    expect(input.hasAttribute('required')).toBe(true);
    expect(container.textContent).toContain('Почта*');
  });

  it('убирает звёздочку по requiredMark={false}', () => {
    const { container } = render(
      <Textarea placeholder="Сообщение" required requiredMark={false} />
    );

    expect(screen.getByRole('textbox', { name: 'Сообщение' }).hasAttribute('required')).toBe(true);
    expect(container.textContent).not.toContain('*');
  });

  it('делает placeholder плавающим по умолчанию', () => {
    const { container } = render(<Input placeholder="Команда" />);
    const input = screen.getByRole('textbox', { name: 'Команда' });

    expect(input.getAttribute('placeholder')).toBe(' ');
    expect(container.textContent).toContain('Команда');
  });

  it('сохраняет подпись, если передан label', () => {
    render(<Input label="Почта" placeholder="you@example.com" required />);

    expect(screen.getByLabelText(/Почта/).hasAttribute('required')).toBe(true);
  });

  it('связывает подсказку, ошибку и aria-invalid с полем', () => {
    const { rerender } = render(<Input label="Почта" hint="Рабочая почта" />);
    const input = screen.getByLabelText('Почта');

    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-hint`);
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    rerender(<Input label="Почта" hint="Рабочая почта" error="Нужен адрес" />);
    const invalid = screen.getByLabelText('Почта');

    expect(invalid.getAttribute('aria-invalid')).toBe('true');
    expect(invalid.getAttribute('aria-describedby')).toBe(`${invalid.id}-error`);
    expect(screen.getByRole('alert').textContent).toBe('Нужен адрес');
  });

  it('связывает ошибку с textarea', () => {
    render(<Textarea placeholder="Сообщение" error="Слишком коротко" />);
    const textarea = screen.getByRole('textbox', { name: 'Сообщение' });

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toBe(`${textarea.id}-error`);
  });
});

describe('Select', () => {
  const options = [
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
  ];

  const scrollCalls: { target: Element; options?: ScrollIntoViewOptions }[] = [];

  beforeEach(() => {
    scrollCalls.length = 0;
    Element.prototype.scrollIntoView = function (
      this: Element,
      options?: boolean | ScrollIntoViewOptions
    ) {
      scrollCalls.push({
        target: this,
        options: typeof options === 'object' ? options : undefined,
      });
    };
  });

  it('возвращает фокус на триггер после Escape', () => {
    render(<Select label="Язык" options={options} />);
    const trigger = screen.getByRole('button', { name: 'Язык' });

    fireEvent.click(trigger);
    const list = screen.getByRole('listbox');
    expect(document.activeElement).toBe(list);

    fireEvent.keyDown(list, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('не отбирает фокус у поля, в которое кликнули', () => {
    render(
      <>
        <Select label="Язык" options={options} />
        <Input placeholder="Почта" />
      </>
    );
    const trigger = screen.getByRole('button', { name: 'Язык' });

    fireEvent.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole('listbox'));

    const input = screen.getByRole('textbox', { name: 'Почта' });
    input.focus();
    fireEvent.pointerDown(input);

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(input);
  });

  it('не возвращает фокус на триггер при закрытии по Tab', () => {
    render(<Select label="Язык" options={options} />);
    const trigger = screen.getByRole('button', { name: 'Язык' });

    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Tab' });

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).not.toBe(trigger);
  });

  it('прокручивает список к активному пункту', () => {
    const many = Array.from({ length: 20 }, (_, index) => ({
      value: `v${index}`,
      label: `Опция ${index}`,
    }));
    render(<Select label="Язык" options={many} />);
    const trigger = screen.getByRole('button', { name: 'Язык' });

    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

    const last = scrollCalls[scrollCalls.length - 1];
    expect(last.target).toBe(document.getElementById(`${trigger.id}-1`));
    expect(last.options).toEqual({ block: 'nearest' });
  });

  it('отправляет значение в форме через hidden input', () => {
    render(
      <form data-testid="form">
        <Select name="lang" label="Язык" options={options} defaultValue="go" />
      </form>
    );
    const form = screen.getByTestId('form') as HTMLFormElement;

    expect(new FormData(form).get('lang')).toBe('go');
    expect(screen.getByRole('button', { name: 'Язык' }).hasAttribute('name')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Язык' }));
    fireEvent.click(screen.getByRole('option', { name: 'Java' }));

    expect(new FormData(form).get('lang')).toBe('java');
  });

  it('не открывает пустой список', () => {
    render(<Select label="Язык" options={[]} />);
    const trigger = screen.getByRole('button', { name: 'Язык' });

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('сбрасывает выбранное значение, которого больше нет в опциях', () => {
    const { rerender } = render(<Select label="Язык" options={options} defaultValue="go" />);
    expect(screen.getByRole('button', { name: 'Язык' }).textContent).toContain('Go');

    rerender(<Select label="Язык" options={[options[0]]} defaultValue="go" />);

    expect(screen.getByRole('button', { name: 'Язык' }).textContent).toContain('Java');
  });
});
