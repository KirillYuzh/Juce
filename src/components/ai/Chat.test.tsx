import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Chat, type ChatMessage } from './Chat';
import type { MessageReactionsProps } from './Message';

const { reactionsSpy } = vi.hoisted(() => ({ reactionsSpy: vi.fn() }));

vi.mock('./Message', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./Message')>();
  function SpyReactions(props: MessageReactionsProps) {
    reactionsSpy(props);
    return actual.MessageReactions(props);
  }
  return { ...actual, MessageReactions: SpyReactions };
});

const message: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  content: 'Ответ без деталей',
  reasoning: 'Проверяю контекст',
  reasoningDuration: 2,
  sources: [{ url: 'https://go.dev/', title: 'go.dev' }],
};

const noop = () => {};

beforeEach(() => {
  reactionsSpy.mockClear();
});

describe('Chat', () => {
  it('hides author, reasoning and sources by default', () => {
    render(<Chat title="Ассистент" messages={[message]} onSend={noop} />);
    expect(screen.queryByText('Джупсик')).toBeNull();
    expect(screen.queryByText('Размышления')).toBeNull();
    expect(screen.queryByText(/Использовано/)).toBeNull();
    expect(screen.getByText('Ответ без деталей')).toBeTruthy();
  });

  it('shows them when the flags are set', () => {
    render(
      <Chat
        title="Ассистент"
        messages={[message]}
        onSend={noop}
        showAuthor
        showReasoning
        showSources
      />
    );
    expect(screen.getByText('Джупсик')).toBeTruthy();
    expect(screen.getByText('Размышления')).toBeTruthy();
    expect(screen.getByText('Использовано 1 источник')).toBeTruthy();
  });

  it('hides actions while the answer is streaming', () => {
    render(
      <Chat
        messages={[{ id: 's1', role: 'assistant', content: 'Печатаю', streaming: true }]}
        onSend={noop}
        onRetry={noop}
      />
    );
    expect(screen.queryByLabelText('Скопировать ответ')).toBeNull();
    expect(screen.queryByLabelText('Повторить ответ')).toBeNull();
  });

  it('keeps only retry for an error and announces it', () => {
    render(
      <Chat
        messages={[
          { id: 'e1', role: 'assistant', content: '', error: true, errorText: 'Остановлено' },
        ]}
        onSend={noop}
        onRetry={noop}
      />
    );
    expect(screen.getByRole('alert').textContent).toBe('Остановлено');
    expect(screen.getByLabelText('Повторить ответ')).toBeTruthy();
    expect(screen.queryByLabelText('Скопировать ответ')).toBeNull();
  });

  it('marks every message as an article named after its author', () => {
    render(
      <Chat
        messages={[
          { id: 'u1', role: 'user', content: 'Вопрос' },
          { id: 'a1', role: 'assistant', content: 'Ответ' },
        ]}
        onSend={noop}
      />
    );
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('article', { name: 'Ваше сообщение' })).toBeTruthy();
    expect(screen.getByRole('article', { name: 'Джупсик' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Джупсик' })).toBeTruthy();
  });

  it('announces the message log as busy while streaming', () => {
    const view = render(
      <Chat
        messages={[{ id: 'a1', role: 'assistant', content: 'Печатаю', streaming: true }]}
        onSend={noop}
      />
    );
    expect(document.querySelector('[role="log"]')?.getAttribute('aria-busy')).toBe('true');

    view.rerender(
      <Chat messages={[{ id: 'a1', role: 'assistant', content: 'Готово' }]} onSend={noop} />
    );
    expect(document.querySelector('[role="log"]')?.getAttribute('aria-busy')).toBeNull();
  });

  it('survives equal suggestions without key warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Chat messages={[]} onSend={noop} suggestions={['Повторить', 'Повторить']} />);
    const duplicate = error.mock.calls.some(
      ([message]) => typeof message === 'string' && message.includes('same key')
    );
    error.mockRestore();
    expect(duplicate).toBe(false);
  });

  it('offers retry only on the last message', () => {
    render(
      <Chat
        messages={[
          { id: 'a1', role: 'assistant', content: 'Первый' },
          { id: 'u1', role: 'user', content: 'Ещё' },
          { id: 'a2', role: 'assistant', content: 'Второй' },
        ]}
        onSend={noop}
        onRetry={noop}
      />
    );
    expect(screen.getAllByLabelText('Повторить ответ')).toHaveLength(1);
  });

  it('calls retry with the message id', () => {
    const onRetry = vi.fn();
    render(
      <Chat
        messages={[{ id: 'a1', role: 'assistant', content: 'Ответ' }]}
        onSend={noop}
        onRetry={onRetry}
      />
    );
    fireEvent.click(screen.getByLabelText('Повторить ответ'));
    expect(onRetry).toHaveBeenCalledWith('a1');
  });

  it('does not re-render the history when the chat re-renders', () => {
    const answer: ChatMessage = { id: 'a1', role: 'assistant', content: 'Ответ' };
    const view = render(<Chat messages={[answer]} onSend={noop} onRetry={noop} />);
    const before = reactionsSpy.mock.calls.length;

    view.rerender(<Chat messages={[answer]} onSend={noop} onRetry={noop} />);
    expect(reactionsSpy.mock.calls.length).toBe(before);
  });
});
