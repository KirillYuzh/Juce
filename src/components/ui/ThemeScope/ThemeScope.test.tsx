import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeScope } from './ThemeScope';
import styles from './ThemeScope.module.css';

describe('ThemeScope', () => {
  it('renders a div with the light theme by default', () => {
    render(<ThemeScope>Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.tagName).toBe('DIV');
    expect(scope.getAttribute('data-theme')).toBe('light');
  });

  it('sets the requested theme', () => {
    render(<ThemeScope theme="ocean">Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.getAttribute('data-theme')).toBe('ocean');
  });

  it('changes the rendered tag', () => {
    render(<ThemeScope as="section">Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.tagName).toBe('SECTION');
  });

  it('merges the passed className with the module class', () => {
    render(<ThemeScope className="custom">Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.classList.contains(styles.scope)).toBe(true);
    expect(scope.classList.contains('custom')).toBe(true);
  });

  it('keeps its own theme when nested', () => {
    const { container } = render(
      <ThemeScope theme="dark">
        <ThemeScope theme="light">Вложенный</ThemeScope>
      </ThemeScope>
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = outer.firstElementChild as HTMLElement;

    expect(outer.getAttribute('data-theme')).toBe('dark');
    expect(inner.getAttribute('data-theme')).toBe('light');
  });
});
