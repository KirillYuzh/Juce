import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input, Textarea } from './Fields';

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

  it('сохраняет подпись, если передан label', () => {
    render(<Input label="Почта" placeholder="you@example.com" required />);

    expect(screen.getByLabelText(/Почта/).hasAttribute('required')).toBe(true);
  });
});
