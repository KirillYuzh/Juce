import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

const noop = () => undefined;

describe('Pagination', () => {
  it('is a named navigation with the current page marked', () => {
    render(<Pagination page={2} pageCount={5} onPageChange={noop} />);

    const nav = screen.getByRole('navigation', { name: 'Пагинация' });

    expect(nav.tagName).toBe('NAV');
    expect(nav.querySelector('ul')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Страница 2' }).getAttribute('aria-current')).toBe(
      'page'
    );
    expect(
      screen.getByRole('button', { name: 'Страница 3' }).getAttribute('aria-current')
    ).toBeNull();
  });

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} pageCount={4} onPageChange={noop} />);

    expect(
      screen.getByRole('button', { name: 'Предыдущая страница' }).hasAttribute('disabled')
    ).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Следующая страница' }).hasAttribute('disabled')
    ).toBe(false);

    rerender(<Pagination page={4} pageCount={4} onPageChange={noop} />);

    expect(
      screen.getByRole('button', { name: 'Предыдущая страница' }).hasAttribute('disabled')
    ).toBe(false);
    expect(
      screen.getByRole('button', { name: 'Следующая страница' }).hasAttribute('disabled')
    ).toBe(true);
  });

  it('calls onPageChange for previous and next', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Следующая страница' }));
    fireEvent.click(screen.getByRole('button', { name: 'Предыдущая страница' }));

    expect(onPageChange.mock.calls).toEqual([[4], [2]]);
  });

  it('calls onPageChange when another page is pressed', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Страница 3' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('clamps the page into the available range', () => {
    render(<Pagination page={99} pageCount={5} onPageChange={noop} />);

    expect(screen.getByRole('button', { name: 'Страница 5' }).getAttribute('aria-current')).toBe(
      'page'
    );
    expect(
      screen.getByRole('button', { name: 'Следующая страница' }).hasAttribute('disabled')
    ).toBe(true);
  });

  it('reports the clamped page to the consumer once', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={99} pageCount={5} onPageChange={onPageChange} />);

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenLastCalledWith(5);

    rerender(<Pagination page={99} pageCount={5} onPageChange={onPageChange} />);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it('does not report a page that is already inside the range', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('lets a stateful parent recover from an out-of-range page', () => {
    function Harness() {
      const [page, setPage] = useState(99);
      return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
    }

    render(<Harness />);

    expect(screen.getByRole('button', { name: 'Страница 5' }).getAttribute('aria-current')).toBe(
      'page'
    );
  });

  it('shows ellipses for distant gaps', () => {
    render(<Pagination page={5} pageCount={10} onPageChange={noop} />);

    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Страница 1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Страница 10' })).toBeTruthy();
  });

  it('takes labels from props', () => {
    render(
      <Pagination
        page={1}
        pageCount={2}
        onPageChange={noop}
        labels={{ previous: 'Назад', next: 'Вперёд', page: (value) => `Стр. ${value}` }}
      />
    );

    expect(screen.getByRole('button', { name: 'Назад' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Стр. 1' }).getAttribute('aria-current')).toBe(
      'page'
    );
  });
});
