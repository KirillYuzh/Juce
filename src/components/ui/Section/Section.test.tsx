import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('is a named section with a second level heading', () => {
    render(
      <Section title="Результаты" description="Данные за неделю">
        <p>Тело секции</p>
      </Section>
    );

    const region = screen.getByRole('region', { name: 'Результаты' });

    expect(region.tagName).toBe('SECTION');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Результаты');
    expect(region.textContent).toContain('Данные за неделю');
    expect(region.textContent).toContain('Тело секции');
  });

  it('links the section to its heading through aria-labelledby', () => {
    render(
      <Section title="Отчёт">
        <p>Тело секции</p>
      </Section>
    );

    const region = screen.getByRole('region', { name: 'Отчёт' });
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading.id).not.toBe('');
    expect(region.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('renders actions', () => {
    render(
      <Section title="Отчёт" actions={<button type="button">Фильтр</button>}>
        <p>Тело секции</p>
      </Section>
    );

    expect(screen.getByRole('button', { name: 'Фильтр' })).toBeTruthy();
  });
});
