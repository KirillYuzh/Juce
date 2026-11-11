import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat, type ChatMessage } from './Chat';
import type { PromptInputPayload, PromptInputStatus } from './PromptInput';

const meta: Meta = {
  title: 'AI/Chat',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const startMessages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content: 'Какая дебетовая карта подойдёт для путешествий?',
  },
  {
    id: 'a1',
    role: 'assistant',
    content:
      'Для путешествий подойдёт дебетовая карта Black: кэшбэк рублями до 30% и бесплатные переводы клиентам Т-Банка.\n\nОформление занимает несколько минут, карту привезёт курьер.',
    reasoning:
      'Сравниваю условия дебетовых карт: кэшбэк, стоимость обслуживания, снятие наличных и переводы.',
    reasoningDuration: 4,
    sources: [
      { url: 'https://www.tbank.ru/cards/debit-cards/', title: 'Дебетовые карты Т-Банка' },
      { url: 'https://www.tbank.ru/tpay/', title: 'T-Pay' },
    ],
  },
];

function ChatDemo({
  initial = startMessages,
  suggestions = [],
  withSimulation = true,
}: {
  initial?: ChatMessage[];
  suggestions?: string[];
  withSimulation?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [status, setStatus] = useState<PromptInputStatus>('ready');
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const send = ({ text }: PromptInputPayload) => {
    if (status === 'streaming') return;
    setMessages((current) => [...current, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    if (!withSimulation) return;
    setStatus('streaming');
    timer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content:
            'Это демонстрационный ответ. В реальном приложении сюда приходит поток от модели.\n\nМожно передать reasoning, источники и действия под сообщением.',
          reasoning: 'Проверяю контекст диалога и подбираю подходящий ответ.',
          reasoningDuration: 2,
          sources: [{ url: 'https://www.tbank.ru/', title: 'Т-Банк' }],
        },
      ]);
      setStatus('ready');
      timer.current = null;
    }, 900);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setStatus('ready');
  };

  return (
    <div style={{ width: 620, height: 680 }}>
      <Chat
        messages={messages}
        onSend={send}
        onStop={stop}
        status={status}
        suggestions={suggestions}
        onRetry={(id) =>
          setMessages((current) => current.filter((message) => message.id !== id))
        }
      />
    </div>
  );
}

export const Conversation: Story = {
  render: () => <ChatDemo />,
};

export const Empty: Story = {
  render: () => (
    <ChatDemo
      initial={[]}
      suggestions={[
        'Как оформить карту?',
        'Какие условия по вкладам?',
        'Как перевести деньги другу?',
      ]}
    />
  ),
};

export const WithoutSimulation: Story = {
  render: () => <ChatDemo initial={startMessages} withSimulation={false} />,
};
