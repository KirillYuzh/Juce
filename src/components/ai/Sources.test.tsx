import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sources } from './Sources';

describe('Sources', () => {
  it('deduplicates sources by url', () => {
    render(
      <Sources
        defaultOpen
        sources={[
          { url: 'https://go.dev/', title: 'go.dev' },
          { url: 'https://go.dev/', title: 'go.dev' },
          { url: 'https://dev.java/', title: 'dev.java' },
        ]}
      />
    );
    expect(screen.getByText('Использовано 2 источника')).toBeTruthy();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('renders an unsafe source without a link', () => {
    render(<Sources defaultOpen sources={[{ url: 'javascript:alert(1)', title: 'Ловушка' }]} />);
    expect(screen.getByText('Ловушка')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
