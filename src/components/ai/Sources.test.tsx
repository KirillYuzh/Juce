import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sources } from './Sources';
import type { LinkRendererProps } from '../../lib/link';

function StubLink({ href, children }: LinkRendererProps) {
  return (
    <span data-testid="stub" data-href={href}>
      {children}
    </span>
  );
}

describe('Sources', () => {
  it('renders the description under the title', () => {
    render(
      <Sources
        defaultOpen
        sources={[
          { url: 'https://go.dev/', title: 'go.dev', description: 'Документация по Go' },
        ]}
      />
    );
    expect(screen.getByText('Документация по Go')).toBeTruthy();
  });

  it('renders a custom icon instead of the globe', () => {
    render(
      <Sources
        defaultOpen
        sources={[
          { url: 'https://go.dev/', title: 'go.dev', icon: <span data-testid="star">★</span> },
        ]}
      />
    );
    expect(screen.getByTestId('star')).toBeTruthy();
  });

  it('keeps internal href links in the same tab', () => {
    render(
      <Sources
        defaultOpen
        sources={[{ url: 'https://go.dev/', title: 'go.dev', href: '/docs/go' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'go.dev' });
    expect(link.getAttribute('href')).toBe('/docs/go');
    expect(link.hasAttribute('target')).toBe(false);
  });

  it('renders a button when onOpen is given and calls it', () => {
    const onOpen = vi.fn();
    render(
      <Sources
        defaultOpen
        sources={[{ url: 'https://go.dev/', title: 'go.dev', onOpen }]}
      />
    );
    expect(screen.queryByRole('link')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'go.dev' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen.mock.calls[0][0].url).toBe('https://go.dev/');
  });

  it('uses the link component for external links', () => {
    render(
      <Sources
        defaultOpen
        linkComponent={StubLink}
        sources={[{ url: 'https://go.dev/', title: 'go.dev' }]}
      />
    );
    expect(screen.getByTestId('stub').getAttribute('data-href')).toBe('https://go.dev/');
    expect(screen.queryByRole('link')).toBeNull();
  });
});
