import { describe, expect, it } from 'vitest';
import type { ChatMessage } from './Chat';
import { planRetry } from './chat-retry';

const messages: ChatMessage[] = [
  { id: 'greeting', role: 'assistant', content: 'Привет' },
  { id: 'ask', role: 'user', content: 'Почему утекает горутина?' },
  { id: 'broken', role: 'assistant', content: '', error: true },
];

describe('planRetry', () => {
  it('returns the previous question and drops the broken answer', () => {
    const plan = planRetry(messages, 'broken');
    expect(plan).toEqual({
      prompt: 'Почему утекает горутина?',
      messages: messages.filter((message) => message.id !== 'broken'),
    });
  });

  it('uses the nearest user message and keeps the rest of the thread', () => {
    const thread: ChatMessage[] = [
      { id: 'q1', role: 'user', content: 'Первый вопрос' },
      { id: 'a1', role: 'assistant', content: 'Ответ' },
      { id: 'q2', role: 'user', content: 'Второй вопрос' },
      { id: 'a2', role: 'assistant', content: '', error: true },
    ];
    expect(planRetry(thread, 'a2')?.prompt).toBe('Второй вопрос');
    expect(planRetry(thread, 'a2')?.messages.map((message) => message.id)).toEqual([
      'q1',
      'a1',
      'q2',
    ]);
  });

  it('returns null for an unknown id or a thread without a question', () => {
    expect(planRetry(messages, 'missing')).toBeNull();
    expect(planRetry([{ id: 'a', role: 'assistant', content: 'Один' }], 'a')).toBeNull();
  });
});
