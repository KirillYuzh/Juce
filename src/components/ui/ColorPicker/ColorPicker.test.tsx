import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { normalizeHex, ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('рисует палитру как radiogroup и отмечает выбранный цвет', () => {
    render(<ColorPicker defaultValue="#ff6574" />);

    expect(screen.getByRole('radiogroup', { name: 'Цвет' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: '#ff6574' }).getAttribute('aria-checked')).toBe('true');
  });

  it('вызывает onChange при клике по свотчу', () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#ff6574" onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: '#006fee' }));

    expect(onChange).toHaveBeenCalledWith('#006fee');
  });

  it('принимает сокращённый HEX и разворачивает его', () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#ff6574" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'HEX-код цвета' }), {
      target: { value: '#abc' },
    });

    expect(onChange).toHaveBeenCalledWith('#aabbcc');
  });

  it('не отправляет невалидный HEX', () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#ff6574" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'HEX-код цвета' }), {
      target: { value: 'nope' },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('двигает выбор стрелками', () => {
    const onChange = vi.fn();
    render(
      <ColorPicker value="#ff6574" onChange={onChange} colors={['#ff6574', '#006fee']} />
    );

    fireEvent.keyDown(screen.getByRole('radio', { name: '#ff6574' }), { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith('#006fee');
  });

  it('нормализует HEX', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc');
    expect(normalizeHex('ff6574')).toBe('#ff6574');
    expect(normalizeHex('nope')).toBeNull();
  });
});
