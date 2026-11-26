import { describe, expect, it } from 'vitest';
import type { ChatMessage } from './Chat';
import { planRetry } from './chat-retry';

const messages: ChatMessage[] = [
  { id: 'greeting', role: 'assistant', content: 'Привет' },
  { id: 'ask', role: 'user', content: 'Почему утекает горутина?' },
  { id: 'broken', role: 'assistant', content: '', error: true },
];

describe('planRetry', () => {
  it('returns the previous question and cuts the thread before the target', () => {
    const plan = planRetry(messages, 'broken');
    expect(plan?.prompt).toBe('Почему утекает горутина?');
    expect(plan?.messages.map((message) => message.id)).toEqual(['greeting', 'ask']);
    expect(plan?.message.id).toBe('broken');
  });

  it('drops everything after the target so the tail cannot survive a retry', () => {
    const thread: ChatMessage[] = [
      { id: 'q1', role: 'user', content: 'Первый вопрос' },
      { id: 'a1', role: 'assistant', content: 'Ответ' },
      { id: 'q2', role: 'user', content: 'Второй вопрос' },
      { id: 'a2', role: 'assistant', content: '', error: true },
      { id: 'q3', role: 'user', content: 'Третий вопрос' },
      { id: 'a3', role: 'assistant', content: 'Ответ' },
    ];
    const plan = planRetry(thread, 'a1');
    expect(plan?.prompt).toBe('Первый вопрос');
    expect(plan?.messages.map((message) => message.id)).toEqual(['q1']);
  });

  it('returns null for an unknown id or a thread without a question', () => {
    expect(planRetry(messages, 'missing')).toBeNull();
    expect(planRetry([{ id: 'a', role: 'assistant', content: 'Один' }], 'a')).toBeNull();
  });
});
