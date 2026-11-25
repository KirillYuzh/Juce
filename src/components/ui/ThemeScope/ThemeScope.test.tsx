import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeScope } from './ThemeScope';
import styles from './ThemeScope.module.css';

describe('ThemeScope', () => {
  it('renders a div with the light theme and the default skin', () => {
    render(<ThemeScope>Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.tagName).toBe('DIV');
    expect(scope.getAttribute('data-theme')).toBe('light');
    expect(scope.getAttribute('data-skin')).toBe('default');
  });

  it('sets the blueprint skin', () => {
    render(<ThemeScope skin="blueprint">Содержимое</ThemeScope>);
    const scope = screen.getByText('Содержимое');

    expect(scope.getAttribute('data-skin')).toBe('blueprint');
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

  it('keeps its own theme and resets the inherited skin when nested', () => {
    const { container } = render(
      <ThemeScope skin="blueprint">
        <ThemeScope theme="light">Вложенный</ThemeScope>
      </ThemeScope>
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = outer.firstElementChild as HTMLElement;

    expect(outer.getAttribute('data-skin')).toBe('blueprint');
    expect(inner.getAttribute('data-theme')).toBe('light');
    expect(inner.getAttribute('data-skin')).toBe('default');
  });
});
