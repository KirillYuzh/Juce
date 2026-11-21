import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Message, MessageReactions } from './Message';

function renderReactions(onRetry?: () => void) {
  render(
    <Message>
      <MessageReactions content="Ответ" onRetry={onRetry} />
    </Message>
  );
}

describe('MessageReactions', () => {
  it('toggles the vote on click', () => {
    renderReactions();
    const like = screen.getByLabelText('Полезный ответ');
    expect(like.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(like);
    expect(like.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(like);
    expect(like.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows retry only when a handler is passed', () => {
    renderReactions();
    expect(screen.queryByLabelText('Повторить ответ')).toBeNull();
  });

  it('calls retry', () => {
    const onRetry = vi.fn();
    renderReactions(onRetry);
    fireEvent.click(screen.getByLabelText('Повторить ответ'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
