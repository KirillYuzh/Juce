import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chat, type ChatMessage } from './Chat';

const { messageContentSpy } = vi.hoisted(() => ({ messageContentSpy: vi.fn() }));

vi.mock('./Message', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./Message')>();
  return {
    ...actual,
    MessageContent: (props: ComponentProps<typeof actual.MessageContent>) => {
      messageContentSpy();
      return <actual.MessageContent {...props} />;
    },
  };
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

  it('renders the title as a heading of the requested level', () => {
    const { rerender } = render(<Chat title="Ассистент" messages={[]} onSend={noop} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Ассистент');

    rerender(<Chat title="Ассистент" titleLevel={3} messages={[]} onSend={noop} />);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Ассистент');
  });

  it('labels every message as an article', () => {
    render(
      <Chat
        messages={[
          { id: 'u1', role: 'user', content: 'Вопрос' },
          { id: 'a1', role: 'assistant', content: 'Ответ' },
        ]}
        onSend={noop}
      />
    );
    expect(screen.getByRole('article', { name: 'Ваше сообщение' })).toBeTruthy();
    expect(screen.getByRole('article', { name: 'Джупсик' })).toBeTruthy();
  });

  it('marks the log busy while streaming and clears it afterwards', () => {
    const { rerender } = render(
      <Chat
        messages={[{ id: 'a1', role: 'assistant', content: 'Печатаю', streaming: true }]}
        onSend={noop}
      />
    );
    expect(screen.getByRole('log').getAttribute('aria-busy')).toBe('true');

    rerender(
      <Chat messages={[{ id: 'a1', role: 'assistant', content: 'Готово' }]} onSend={noop} />
    );
    expect(screen.getByRole('log').hasAttribute('aria-busy')).toBe(false);
  });

  it('shows retry only on the last message and passes its id', () => {
    const onRetry = vi.fn();
    render(
      <Chat
        messages={[
          { id: 'a1', role: 'assistant', content: 'Первый' },
          { id: 'a2', role: 'assistant', content: 'Второй' },
        ]}
        onSend={noop}
        onRetry={onRetry}
      />
    );
    const retryButtons = screen.getAllByLabelText('Повторить ответ');
    expect(retryButtons).toHaveLength(1);
    fireEvent.click(retryButtons[0]);
    expect(onRetry).toHaveBeenCalledWith('a2');
  });

  it('renders extra instead of markdown and without a streaming caret', () => {
    const { container } = render(
      <Chat
        messages={[
          {
            id: 'x1',
            role: 'assistant',
            content: '**markdown**',
            extra: <span data-testid="a2ui">Форма заказа</span>,
            streaming: true,
          },
        ]}
        onSend={noop}
      />
    );
    const item = container.querySelector('[data-message-id="x1"]');
    expect(item?.querySelector('[data-testid="a2ui"]')).toBeTruthy();
    expect(item?.querySelector('[data-streaming]')).toBeNull();
    expect(screen.queryByText('markdown')).toBeNull();
  });

  it('replaces the default empty state', () => {
    render(<Chat messages={[]} onSend={noop} emptyState={<p>С чего начнём?</p>} />);
    expect(screen.getByText('С чего начнём?')).toBeTruthy();
    expect(screen.queryByText('Чем помочь?')).toBeNull();
  });

  it('replaces the default actions with messageActions', () => {
    render(
      <Chat
        messages={[{ id: 'm1', role: 'assistant', content: 'Ответ' }]}
        onSend={noop}
        messageActions={() => <button type="button">Своё действие</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Своё действие' })).toBeTruthy();
    expect(screen.queryByLabelText('Скопировать ответ')).toBeNull();
  });

  it('renders node suggestions as is and sends string suggestions', () => {
    const onSend = vi.fn();
    render(
      <Chat
        messages={[]}
        onSend={onSend}
        suggestions={[
          <span key="node" data-testid="node">
            Карточка
          </span>,
          'Строка',
        ]}
      />
    );
    expect(screen.getByTestId('node')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Строка' }));
    expect(onSend).toHaveBeenCalledWith({ text: 'Строка', files: [] });
  });

  it('does not warn about duplicate suggestion keys', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<Chat messages={[]} onSend={noop} suggestions={['Дубликат', 'Дубликат']} />);
      expect(screen.getAllByRole('button', { name: 'Дубликат' })).toHaveLength(2);
      const keyWarnings = consoleError.mock.calls.filter((call) => String(call[0]).includes('key'));
      expect(keyWarnings).toHaveLength(0);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('does not re-render the message history when the chat re-renders', () => {
    messageContentSpy.mockClear();
    const { rerender } = render(<Chat title="Ассистент" messages={[message]} onSend={noop} />);
    const initial = messageContentSpy.mock.calls.length;
    expect(initial).toBeGreaterThan(0);

    rerender(
      <Chat title="Ассистент" subtitle="Другая подпись" messages={[message]} onSend={noop} />
    );
    expect(messageContentSpy.mock.calls.length).toBe(initial);
  });
});
