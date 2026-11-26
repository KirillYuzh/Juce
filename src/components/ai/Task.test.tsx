import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Task } from './Task';

const expanded = () => screen.getByRole('button').getAttribute('aria-expanded');

describe('Task', () => {
  it('expands when the task moves from pending to running', () => {
    const view = render(<Task title="Сборка" />);
    expect(expanded()).toBe('false');

    view.rerender(<Task title="Сборка" status="running" />);
    expect(expanded()).toBe('true');
  });

  it('keeps an explicit defaultOpen closed', () => {
    const view = render(<Task title="Сборка" defaultOpen={false} />);
    view.rerender(<Task title="Сборка" status="running" defaultOpen={false} />);
    expect(expanded()).toBe('false');
  });

  it('does not reopen after the user collapsed the task', () => {
    const view = render(<Task title="Сборка" />);
    fireEvent.click(screen.getByRole('button'));
    expect(expanded()).toBe('true');
    fireEvent.click(screen.getByRole('button'));
    expect(expanded()).toBe('false');

    view.rerender(<Task title="Сборка" status="running" />);
    expect(expanded()).toBe('false');
  });
});
