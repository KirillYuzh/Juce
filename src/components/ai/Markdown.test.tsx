import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Markdown } from './Markdown';
import type { LinkRendererProps } from '../../lib/link';

function StubLink({ href, children }: LinkRendererProps) {
  return (
    <span data-testid="stub" data-href={href}>
      {children}
    </span>
  );
}

describe('Markdown', () => {
  it('renders headings, lists and tables', () => {
    const { container } = render(
      <Markdown>{'# Заголовок\n\n- один\n- два\n\n| a | b |\n| --- | --- |\n| 1 | 2 |'}</Markdown>
    );
    expect(container.querySelector('h1')?.textContent).toBe('Заголовок');
    expect(container.querySelectorAll('ul li')).toHaveLength(2);
    expect(container.querySelector('table th')?.textContent).toBe('a');
  });

  it('loads images lazily and without a referrer', () => {
    const { container } = render(<Markdown>![схема](https://go.dev/logo.png)</Markdown>);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://go.dev/logo.png');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
    expect(img?.getAttribute('referrerpolicy')).toBe('no-referrer');
  });

  it('drops images with an unsafe source', () => {
    const { container } = render(<Markdown>![схема](javascript:alert(1))</Markdown>);
    expect(container.querySelector('img')).toBeNull();
  });

  it('drops javascript: links', () => {
    render(<Markdown>[опасно](javascript:alert(1))</Markdown>);
    expect(screen.getByText('опасно').closest('a')?.getAttribute('href')).toBeNull();
  });

  it('renders links through a custom link component', () => {
    render(<Markdown linkComponent={StubLink}>[документация](https://go.dev/)</Markdown>);
    const stub = screen.getByTestId('stub');
    expect(stub.getAttribute('data-href')).toBe('https://go.dev/');
    expect(stub.textContent).toBe('документация');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('never passes an empty href to the link component', () => {
    render(<Markdown linkComponent={StubLink}>[опасно](javascript:alert(1))</Markdown>);
    expect(screen.queryByTestId('stub')).toBeNull();
    expect(screen.getByText('опасно')).toBeTruthy();
  });

  it('calls onLinkClick and prevents the default navigation', () => {
    const onClick = vi.fn();
    render(<Markdown onLinkClick={onClick}>[документация](https://go.dev/)</Markdown>);
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBe('https://go.dev/');
    expect(onClick.mock.calls[0][1].defaultPrevented).toBe(true);
  });

  it('opens in a new tab by default and keeps the target off for _self', () => {
    const { rerender } = render(<Markdown>[документация](https://go.dev/)</Markdown>);
    expect(screen.getByRole('link').getAttribute('target')).toBe('_blank');

    rerender(<Markdown linkTarget="_self">[документация](https://go.dev/)</Markdown>);
    expect(screen.getByRole('link').hasAttribute('target')).toBe(false);
  });

  it('lets consumer components win over the default link renderer', () => {
    render(
      <Markdown
        linkComponent={StubLink}
        components={{ a: ({ children }) => <b data-testid="own">{children}</b> }}
      >
        [документация](https://go.dev/)
      </Markdown>
    );
    expect(screen.getByTestId('own').textContent).toBe('документация');
    expect(screen.queryByTestId('stub')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
