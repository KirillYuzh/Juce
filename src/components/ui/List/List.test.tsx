import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CollapsibleList, List, ListRow } from './List';

describe('List', () => {
  it('renders a ul with rows and a divided marker', () => {
    render(
      <List divided>
        <ListRow title="Первый" />
        <ListRow title="Второй" />
      </List>
    );

    const list = screen.getByRole('list');

    expect(list.tagName).toBe('UL');
    expect(list.getAttribute('data-divided')).toBe('true');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders a row with href as a link', () => {
    render(
      <List>
        <ListRow title="Документация" description="Гайд по компонентам" href="/docs" />
      </List>
    );

    const link = screen.getByRole('link', { name: /Документация/ });

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(screen.getByText('Гайд по компонентам')).toBeTruthy();
  });

  it('renders a row with onClick as a button and calls the handler', () => {
    const onClick = vi.fn();

    render(
      <List>
        <ListRow title="Открыть" onClick={onClick} />
      </List>
    );

    const button = screen.getByRole('button', { name: 'Открыть' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders leading, meta and trailing slots', () => {
    render(
      <List>
        <ListRow
          leading={<span>01</span>}
          title="Задача"
          meta="2 минуты назад"
          trailing={<span>Готово</span>}
        />
      </List>
    );

    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('2 минуты назад')).toBeTruthy();
    expect(screen.getByText('Готово')).toBeTruthy();
  });

  it('renders a row without href or onClick as static content', () => {
    render(
      <List>
        <ListRow title="Статичная строка" meta="Без действия" />
      </List>
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Статичная строка')).toBeTruthy();
  });
});

describe('CollapsibleList', () => {
  const items = ['Первый', 'Второй', 'Третий', 'Четвёртый'].map((title) => (
    <ListRow key={title} title={title} />
  ));

  it('shows only the first items until expanded', () => {
    render(<CollapsibleList items={items} initial={2} moreLabel="Ещё" lessLabel="Меньше" />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Ещё' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals all items and collapses back', () => {
    render(<CollapsibleList items={items} initial={2} moreLabel="Ещё" lessLabel="Меньше" />);

    fireEvent.click(screen.getByRole('button', { name: 'Ещё' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    const collapse = screen.getByRole('button', { name: 'Меньше' });
    expect(collapse.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(collapse);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('points aria-controls at the list container', () => {
    render(<CollapsibleList items={items} initial={2} moreLabel="Ещё" />);

    const toggle = screen.getByRole('button', { name: 'Ещё' });
    const controlled = document.getElementById(toggle.getAttribute('aria-controls') ?? '');

    expect(controlled).toBeTruthy();
    expect(controlled?.contains(screen.getByText('Первый'))).toBe(true);
  });

  it('hides the toggle when there is nothing to expand', () => {
    render(<CollapsibleList items={items.slice(0, 2)} initial={2} />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
