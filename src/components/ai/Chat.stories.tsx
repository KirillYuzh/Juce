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
    content: 'Почему горутина утекает, если писать в небуферизованный канал?',
  },
  {
    id: 'a1',
    role: 'assistant',
    content:
      'Отправка в небуферизованный канал блокирует горутину, пока её никто не прочитает. Если получатель уже вышел, горутина остаётся ждать навсегда.\n\nЛечится тремя способами:\n\n1. Буфер: `make(chan int, 1)`.\n2. `select` вместе с `ctx.Done()`.\n3. Закрытие канала со стороны отправителя.',
    reasoning:
      'Вспоминаю, как устроена очередь при отправке в канал, и какие способы выхода из блокировки есть в стандартной библиотеке.',
    reasoningDuration: 4,
    sources: [
      { url: 'https://pkg.go.dev/', title: 'pkg.go.dev: документация Go' },
      { url: 'https://go.dev/blog/', title: 'go.dev: блог о горутинах' },
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
          reasoning: 'Проверяю контекст и подбираю подходящий раздел документации.',
          reasoningDuration: 2,
          sources: [{ url: 'https://dev.java/', title: 'dev.java: документация JDK' }],
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
        onRetry={(id) => setMessages((current) => current.filter((message) => message.id !== id))}
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
      suggestions={['Почему утекает горутина?', 'Объясни ранг матрицы', 'Что нового в Java 21']}
    />
  ),
};

export const WithoutSimulation: Story = {
  render: () => <ChatDemo initial={startMessages} withSimulation={false} />,
};

const markdownMessages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content: 'Объясни разницу между процессом и потоком и покажи таблицу',
  },
  {
    id: 'a1',
    role: 'assistant',
    content:
      '## Процесс и поток\n\n**Процесс** — своё адресное пространство, **поток** — общая память внутри процесса.\n\n| | Процесс | Поток |\n| --- | --- | --- |\n| Память | своя | общая |\n| Переключение | дороже | дешевле |\n| Падение | изолировано | роняет процесс |\n\nВ Java поток — это `Thread`, в Go — горутина:\n\n```go\ngo func() { fmt.Println(\"привет\") }()\n```\n\n> Горутина дешевле потока ОС примерно на два порядка.',
    reasoningDuration: 3,
  },
];

export const MarkdownAnswer: Story = {
  name: 'Markdown answer',
  render: () => <ChatDemo initial={markdownMessages} withSimulation={false} />,
};
