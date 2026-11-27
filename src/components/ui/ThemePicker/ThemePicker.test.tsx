import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemePicker } from './ThemePicker';
import { ThemeProvider } from '../ThemeProvider';

afterEach(() => {
  delete document.documentElement.dataset.theme;
  window.localStorage.clear();
});

describe('ThemePicker', () => {
  it('переключает тему по клику и не пишет акцент', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemePicker />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe('true');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ocean' }));
      await Promise.resolve();
    });

    expect(document.documentElement.dataset.theme).toBe('ocean');
    expect(screen.getByRole('button', { name: 'Ocean' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe(
      'false'
    );
    expect(document.documentElement.style.getPropertyValue('--tb-accent')).toBe('');
  });

  it('подписывает группу и называет кнопки в варианте named', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemePicker label="Оформление" />
      </ThemeProvider>
    );

    expect(screen.getByRole('group', { name: 'Оформление' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Dark' }).textContent).toBe('Dark');
  });

  it('рисует только кружки с доступными именами в варианте dots', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemePicker variant="dots" label="Оформление" />
      </ThemeProvider>
    );

    expect(screen.getByRole('group', { name: 'Оформление' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Ocean' }).getAttribute('title')).toBe('Ocean');
    expect(screen.queryByText('Ocean')).toBeNull();
    expect(screen.queryByText('Оформление')).toBeNull();
  });
});
