import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InlineCitationSource } from './InlineCitation';

describe('InlineCitationSource', () => {
  it('renders the description', () => {
    render(
      <InlineCitationSource
        url="https://go.dev/"
        title="go.dev"
        description="Документация по Go"
      />
    );
    expect(screen.getByText('Документация по Go')).toBeTruthy();
  });

  it('renders a custom icon', () => {
    render(
      <InlineCitationSource
        url="https://go.dev/"
        title="go.dev"
        icon={<span data-testid="star">★</span>}
      />
    );
    expect(screen.getByTestId('star')).toBeTruthy();
  });

  it('keeps internal href links in the same tab', () => {
    render(<InlineCitationSource url="https://go.dev/" title="go.dev" href="/docs/go" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/docs/go');
    expect(link.hasAttribute('target')).toBe(false);
  });

  it('renders a button when onOpen is given and calls it', () => {
    const onOpen = vi.fn();
    render(<InlineCitationSource url="https://go.dev/" title="go.dev" onOpen={onOpen} />);
    expect(screen.queryByRole('link')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen.mock.calls[0][0].url).toBe('https://go.dev/');
  });
});
