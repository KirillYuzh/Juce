import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './Reasoning';

const expanded = () => screen.getByRole('button').getAttribute('aria-expanded');

describe('Reasoning', () => {
  it('opens itself when a new reasoning stream starts', () => {
    const view = render(<Reasoning text="Первый разбор" />);
    expect(expanded()).toBe('false');

    view.rerender(<Reasoning text="Второй разбор" isStreaming />);
    expect(expanded()).toBe('true');
  });

  it('forgets a user toggle when the text restarts', () => {
    const view = render(<Reasoning text="Первый разбор" defaultOpen={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(expanded()).toBe('true');
    fireEvent.click(screen.getByRole('button'));
    expect(expanded()).toBe('false');

    view.rerender(<Reasoning text="Второй разбор" isStreaming />);
    expect(expanded()).toBe('true');
  });

  it('respects a user collapse inside the same stream', () => {
    const view = render(<Reasoning text="Разбор" isStreaming />);
    expect(expanded()).toBe('true');
    fireEvent.click(screen.getByRole('button'));
    expect(expanded()).toBe('false');

    view.rerender(<Reasoning text="Разбор" isStreaming duration={2} />);
    expect(expanded()).toBe('false');
  });
});
