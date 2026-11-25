import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chat, type ChatMessage } from './Chat';

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
});
