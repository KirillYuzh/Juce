import type { ChatMessage } from './Chat';

export interface RetryPlan {
  prompt: string;
  messages: ChatMessage[];
  message: ChatMessage;
}

export function planRetry(messages: ChatMessage[], id: string): RetryPlan | null {
  const index = messages.findIndex((message) => message.id === id);
  if (index === -1) return null;

  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const message = messages[cursor];
    if (message.role === 'user' && message.content.trim()) {
      return {
        prompt: message.content,
        messages: messages.slice(0, index),
        message: messages[index],
      };
    }
  }

  return null;
}
