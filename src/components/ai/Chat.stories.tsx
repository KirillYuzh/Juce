import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat, type ChatMessage } from './Chat';
import { ChatLayout, ChatSidebarToggle } from './ChatLayout';
import { ChatList, type ChatListItem } from './ChatList';
import type { PromptInputPayload, PromptInputStatus } from './PromptInput';

const meta: Meta = {
  title: 'Chat/Conversation',
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

const emptySuggestions = [
  'Почему утекает горутина?',
  'Объясни ранг матрицы',
  'Что нового в Java 21',
];

const chats: ChatListItem[] = [
  {
    id: 'c1',
    title: 'Утечка горутины',
    preview: 'Почему небуферизованный канал блокирует отправку?',
  },
  {
    id: 'c2',
    title: 'Ранг матрицы',
    preview: 'Объясни ранг матрицы на примере системы уравнений.',
  },
  {
    id: 'c3',
    title: 'Разбор задачи с интервью',
    preview: 'Найди пару с максимальной суммой без повторов.',
  },
];

const threads: Record<string, ChatMessage[]> = {
  c1: startMessages,
  c2: [
    {
      id: 'c2-a1',
      role: 'assistant',
      content:
        'Ранг — число линейно независимых строк. Приведите матрицу к ступенчатому виду: количество ненулевых строк и есть ранг.',
    },
  ],
  c3: [],
};

function WorkspaceDemo({ initialOpen = true }: { initialOpen?: boolean }) {
  const [items, setItems] = useState(chats);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState(threads);

  const active = items.find((chat) => chat.id === activeId);

  const create = () => {
    const id = `c-${Date.now()}`;
    setItems((current) => [{ id, title: 'Новый диалог', preview: '' }, ...current]);
    setMessages((current) => ({ ...current, [id]: [] }));
    setActiveId(id);
  };

  const remove = (id: string) => {
    setItems((current) => current.filter((chat) => chat.id !== id));
    setMessages((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    if (id === activeId) {
      setActiveId(items.find((chat) => chat.id !== id)?.id ?? '');
    }
  };

  const send = ({ text }: PromptInputPayload) => {
    if (!active) return;
    const message: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((current) => ({
      ...current,
      [active.id]: [...(current[active.id] ?? []), message],
    }));
    setItems((current) =>
      current.map((chat) => (chat.id === active.id ? { ...chat, preview: text } : chat))
    );
  };

  return (
    <div style={{ height: '100vh', maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <ChatLayout
        sidebarOpen={open}
        onSidebarOpenChange={setOpen}
        sidebar={
          <ChatList
            chats={items}
            activeId={activeId}
            onSelect={setActiveId}
            onCreate={create}
            onDelete={remove}
          />
        }
      >
        <Chat
          framed={false}
          headerLeading={<ChatSidebarToggle />}
          title={active?.title ?? 'Диалог'}
          subtitle="ИИ-ассистент по Java, Go и математике"
          messages={messages[activeId] ?? []}
          onSend={send}
          suggestions={activeId === 'c1' ? emptySuggestions : []}
        />
      </ChatLayout>
    </div>
  );
}

const workspaceSource = `<ChatLayout
  sidebar={
    <ChatList
      chats={chats}
      activeId={activeId}
      onSelect={setActiveId}
      onCreate={createChat}
      onDelete={deleteChat}
    />
  }
>
  <Chat
    messages={messages}
    onSend={handleSend}
    headerLeading={<ChatSidebarToggle />}
  />
</ChatLayout>`;

function ChatDemo({
  initial = startMessages,
  suggestions = [],
  withSimulation = true,
  showAuthor = true,
}: {
  initial?: ChatMessage[];
  suggestions?: string[];
  withSimulation?: boolean;
  showAuthor?: boolean;
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
        showAuthor={showAuthor}
        onRetry={(id) => setMessages((current) => current.filter((message) => message.id !== id))}
      />
    </div>
  );
}

const conversationSource = `<Chat
  messages={messages}
  status={status}
  onSend={handleSend}
  onStop={handleStop}
  onRetry={handleRetry}
/>`;

export const Conversation: Story = {
  render: () => <WorkspaceDemo />,
  parameters: { layout: 'fullscreen', docs: { source: { code: workspaceSource } } },
};

export const SidebarCollapsed: Story = {
  name: 'Sidebar collapsed',
  render: () => <WorkspaceDemo initialOpen={false} />,
  parameters: { layout: 'fullscreen' },
};

export const SingleChat: Story = {
  name: 'Single chat',
  render: () => <ChatDemo />,
  parameters: { docs: { source: { code: conversationSource } } },
};

export const Empty: Story = {
  render: () => <ChatDemo initial={[]} suggestions={emptySuggestions} />,
  parameters: {
    docs: {
      source: {
        code: `<Chat
  messages={[]}
  suggestions={['Почему утекает горутина?', 'Объясни ранг матрицы', 'Что нового в Java 21']}
  onSend={handleSend}
/>`,
      },
    },
  },
};

export const WithoutSimulation: Story = {
  render: () => <ChatDemo initial={startMessages} withSimulation={false} />,
  parameters: {
    docs: {
      source: {
        code: `<Chat messages={messages} onSend={handleSend} />`,
      },
    },
  },
};

export const WithoutAuthor: Story = {
  name: 'Without author',
  render: () => <ChatDemo withSimulation={false} showAuthor={false} />,
  parameters: {
    docs: {
      source: {
        code: `<Chat messages={messages} onSend={handleSend} showAuthor={false} />`,
      },
    },
  },
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
      '## Процесс и поток\n\n**Процесс** — своё адресное пространство, **поток** — общая память внутри процесса.\n\n| | Процесс | Поток |\n| --- | --- | --- |\n| Память | своя | общая |\n| Переключение | дороже | дешевле |\n| Падение | изолировано | роняет процесс |\n\nВ Java поток — это `Thread`, в Go — горутина:\n\n```go\ngo func() { fmt.Println("привет") }()\n```\n\n> Горутина дешевле потока ОС примерно на два порядка.',
    reasoningDuration: 3,
  },
];

export const MarkdownAnswer: Story = {
  name: 'Markdown answer',
  render: () => <ChatDemo initial={markdownMessages} withSimulation={false} showAuthor={false} />,
  parameters: {
    docs: {
      source: {
        code: `<Chat messages={messages} onSend={handleSend} showAuthor={false} />`,
      },
    },
  },
};
