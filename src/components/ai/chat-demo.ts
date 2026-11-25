export interface DemoChatReply {
  content: string;
  reasoning: string;
  reasoningDuration: number;
  sources: Array<{ url: string; title: string }>;
}

export const demoChatReply: DemoChatReply = {
  content:
    'Это демонстрационный ответ. В реальном приложении сюда приходит поток от модели.\n\nМожно передать рассуждения, источники и действия под сообщением.',
  reasoning: 'Разбираю условие задачи и вспоминаю, какой термин здесь нужен.',
  reasoningDuration: 2,
  sources: [{ url: 'https://dev.java/', title: 'dev.java: документация JDK' }],
};

export const demoChatReplyDelay = 900;

export function demoAssistantMessage(id: string) {
  return { id, role: 'assistant' as const, ...demoChatReply };
}
