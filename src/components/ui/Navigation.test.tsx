import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from './Navigation';

const items = [
  { id: 'java', label: 'Java', content: 'Первый раздел' },
  { id: 'go', label: 'Go', content: 'Второй раздел' },
  { id: 'math', label: 'Математика', content: 'Третий раздел' },
];

describe('Tabs', () => {
  it('переключает табы стрелками и синхронизирует панель', () => {
    render(<Tabs items={items} label="Разделы" />);
    const [first, second, third] = screen.getAllByRole('tab');

    expect(first.getAttribute('tabindex')).toBe('0');
    expect(second.getAttribute('tabindex')).toBe('-1');

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });

    expect(document.activeElement).toBe(second);
    expect(second.getAttribute('aria-selected')).toBe('true');
    expect(first.getAttribute('tabindex')).toBe('-1');

    const panel = screen.getByRole('tabpanel');
    expect(panel.textContent).toBe('Второй раздел');
    expect(panel.getAttribute('aria-labelledby')).toBe(second.id);
    expect(second.getAttribute('aria-controls')).toBe(panel.id);

    fireEvent.keyDown(second, { key: 'End' });
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: 'Home' });
    expect(document.activeElement).toBe(first);
  });
});
