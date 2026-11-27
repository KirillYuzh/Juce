import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat, type ChatMessage } from './Chat';
import { ChatLayout, ChatSidebarToggle } from './ChatLayout';
import { ChatList, type ChatListItem } from './ChatList';
import type { PromptInputPayload } from './PromptInput';
import { demoAssistantMessage, demoChatReplyDelay } from './chat-demo';
import { Callout, Heading, Text } from '../ui/Typography';
import { Grid, Stack } from '../ui/Layout';
import { Avatar, Badge, Chip, type BadgeTone } from '../ui/Display';
import { Button } from '../ui/Button';
import { Checkbox, Input, Select, Switch } from '../ui/Fields';
import { DatePicker } from '../ui/date-picker';
import { Table, type TableColumn } from '../ui/Table';

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

function WorkspaceDemo({
  initialOpen = true,
  side = 'right',
}: {
  initialOpen?: boolean;
  side?: 'left' | 'right';
}) {
  const [items, setItems] = useState(chats);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState(threads);

  const active = items.find((chat) => chat.id === activeId);
  const toggle = <ChatSidebarToggle />;

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
        sidebarSide={side}
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
          headerLeading={side === 'left' ? toggle : undefined}
          headerTrailing={side === 'left' ? undefined : toggle}
          title={active?.title ?? 'Диалог'}
          subtitle="ИИ-ассистент по Java, Go и математике"
          conversationKey={activeId}
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
    headerTrailing={<ChatSidebarToggle />}
  />
</ChatLayout>`;

function ChatDemo({
  initial = startMessages,
  suggestions = [],
  withSimulation = true,
  showAuthor = false,
  showReasoning = false,
  showSources = false,
  height = 680,
}: {
  initial?: ChatMessage[];
  suggestions?: string[];
  withSimulation?: boolean;
  showAuthor?: boolean;
  showReasoning?: boolean;
  showSources?: boolean;
  height?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const busy = messages.some((message) => message.streaming);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const send = ({ text }: PromptInputPayload) => {
    if (busy) return;
    const userId = `u-${Date.now()}`;
    if (!withSimulation) {
      setMessages((current) => [...current, { id: userId, role: 'user', content: text }]);
      return;
    }
    const replyId = `a-${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', content: text },
      { id: replyId, role: 'assistant', content: '', streaming: true },
    ]);
    timer.current = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) => (message.id === replyId ? demoAssistantMessage(replyId) : message))
      );
      timer.current = null;
    }, demoChatReplyDelay);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setMessages((current) => current.filter((message) => !message.streaming));
  };

  return (
    <div style={{ width: 620, height }}>
      <Chat
        messages={messages}
        onSend={send}
        onStop={stop}
        suggestions={suggestions}
        showAuthor={showAuthor}
        showReasoning={showReasoning}
        showSources={showSources}
        onRetry={(id) => setMessages((current) => current.filter((message) => message.id !== id))}
      />
    </div>
  );
}

const conversationSource = `<Chat
  messages={messages}
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

export const SidebarLeft: Story = {
  name: 'Sidebar left',
  render: () => <WorkspaceDemo side="left" />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `<ChatLayout sidebarSide="left" sidebar={<ChatList ... />}>
  <Chat messages={messages} onSend={handleSend} headerLeading={<ChatSidebarToggle />} />
</ChatLayout>`,
      },
    },
  },
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

export const WithDetails: Story = {
  name: 'With author, reasoning and sources',
  render: () => <ChatDemo withSimulation={false} showAuthor showReasoning showSources />,
  parameters: {
    docs: {
      source: {
        code: `<Chat
  messages={messages}
  onSend={handleSend}
  showAuthor
  showReasoning
  showSources
/>`,
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
  render: () => <ChatDemo initial={markdownMessages} withSimulation={false} />,
  parameters: {
    docs: {
      source: {
        code: `<Chat messages={messages} onSend={handleSend} />`,
      },
    },
  },
};

const formatOptions = [
  { value: 'tech', label: 'Техническое интервью' },
  { value: 'system', label: 'Системный дизайн' },
  { value: 'final', label: 'Финальная встреча' },
];

const topicOptions = [
  { value: 'go', label: 'Go' },
  { value: 'algorithms', label: 'Алгоритмы' },
  { value: 'system', label: 'Системный дизайн' },
];

interface InterviewStage {
  id: string;
  stage: string;
  length: string;
  status: string;
  tone: BadgeTone;
}

const interviewStages: InterviewStage[] = [
  { id: 'intro', stage: 'Знакомство', length: '30 минут', status: 'Готово', tone: 'success' },
  { id: 'code', stage: 'Код на Go', length: '60 минут', status: 'В работе', tone: 'accent' },
  {
    id: 'system',
    stage: 'Системный дизайн',
    length: '45 минут',
    status: 'Дальше',
    tone: 'neutral',
  },
];

const interviewColumns: TableColumn<InterviewStage>[] = [
  { id: 'stage', kind: 'value', header: 'Этап', value: (row) => row.stage },
  { id: 'length', kind: 'value', header: 'Длительность', value: (row) => row.length },
  {
    id: 'status',
    kind: 'node',
    header: 'Статус',
    cell: (row) => <Badge tone={row.tone}>{row.status}</Badge>,
  },
];

function InterviewResponse() {
  const [format, setFormat] = useState('tech');
  const [topics, setTopics] = useState<string[]>(['go']);
  const [record, setRecord] = useState(true);

  const toggleTopic = (topic: string) =>
    setTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );

  return (
    <Stack gap="4">
      <Stack direction="row" gap="3" align="center" wrap>
        <Avatar size="l" initials="АК" />
        <Stack gap="1">
          <Heading level={3}>Собеседование по Go</Heading>
          <Text size="s" tone="secondary">
            Анна Ковалёва · кандидат на позицию Backend
          </Text>
        </Stack>
        <Badge tone="accent">Senior</Badge>
      </Stack>

      <Text size="s" tone="secondary">
        Проверьте формат и темы — расписание и этапы обновятся ниже.
      </Text>

      <Grid columns={2} gap="3">
        <Input label="Имя" defaultValue="Анна Ковалёва" />
        <Input label="Почта" type="email" defaultValue="anna@juce.dev" />
      </Grid>

      <Grid columns={2} gap="3">
        <Select label="Формат" value={format} onChange={setFormat} options={formatOptions} />
        <Stack gap="1">
          <Text as="span" size="s" tone="secondary">
            Дата
          </Text>
          <DatePicker placeholder="Дата интервью" />
        </Stack>
      </Grid>

      <Stack gap="2">
        <Text as="span" size="s" tone="secondary">
          Темы
        </Text>
        <Stack direction="row" gap="2" wrap>
          {topicOptions.map((topic) => (
            <Chip
              key={topic.value}
              variant="outline"
              active={topics.includes(topic.value)}
              onClick={() => toggleTopic(topic.value)}
            >
              {topic.label}
            </Chip>
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" gap="6" wrap>
        <Checkbox label="Прислать тестовое задание" defaultChecked />
        <Switch
          label="Записать встречу"
          checked={record}
          onChange={(event) => setRecord(event.target.checked)}
        />
      </Stack>

      <Callout tone="note" title="Что взять на встречу">
        <Text size="s">Ноутбук, доступ к репозиторию и 20 минут на разбор решения.</Text>
      </Callout>

      <Table
        columns={interviewColumns}
        rows={interviewStages}
        rowKey={(row) => row.id}
        density="s"
        caption="Этапы интервью"
      />

      <Stack direction="row" gap="2" wrap>
        <Button size="s">Подтвердить слот</Button>
        <Button size="s" variant="secondary">
          Перенести
        </Button>
        <Button size="s" variant="ghost">
          Отклонить
        </Button>
      </Stack>
    </Stack>
  );
}

const a2uiMessages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content: 'Собери план подготовки к интервью по Go',
  },
  {
    id: 'a1',
    role: 'assistant',
    extra: <InterviewResponse />,
  },
];

export const A2UI: Story = {
  name: 'A2UI response',
  render: () => <ChatDemo initial={a2uiMessages} withSimulation={false} height={1080} />,
  parameters: {
    docs: {
      source: {
        code: `const stageColumns: TableColumn<InterviewStage>[] = [
  { id: 'stage', kind: 'value', header: 'Этап', value: (row) => row.stage },
  { id: 'length', kind: 'value', header: 'Длительность', value: (row) => row.length },
  {
    id: 'status',
    kind: 'node',
    header: 'Статус',
    cell: (row) => <Badge tone={row.tone}>{row.status}</Badge>,
  },
];

function InterviewResponse() {
  const [format, setFormat] = useState('tech');
  const [topics, setTopics] = useState<string[]>(['go']);
  const [record, setRecord] = useState(true);

  const toggleTopic = (topic: string) =>
    setTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );

  return (
    <Stack gap="4">
      <Stack direction="row" gap="3" align="center" wrap>
        <Avatar size="l" initials="АК" />
        <Stack gap="1">
          <Heading level={3}>Собеседование по Go</Heading>
          <Text size="s" tone="secondary">
            Анна Ковалёва · кандидат на позицию Backend
          </Text>
        </Stack>
        <Badge tone="accent">Senior</Badge>
      </Stack>

      <Grid columns={2} gap="3">
        <Input label="Имя" defaultValue="Анна Ковалёва" />
        <Input label="Почта" type="email" defaultValue="anna@juce.dev" />
      </Grid>

      <Grid columns={2} gap="3">
        <Select label="Формат" value={format} onChange={setFormat} options={formatOptions} />
        <Stack gap="1">
          <Text as="span" size="s" tone="secondary">
            Дата
          </Text>
          <DatePicker placeholder="Дата интервью" />
        </Stack>
      </Grid>

      <Stack direction="row" gap="2" wrap>
        {topicOptions.map((topic) => (
          <Chip
            key={topic.value}
            variant="outline"
            active={topics.includes(topic.value)}
            onClick={() => toggleTopic(topic.value)}
          >
            {topic.label}
          </Chip>
        ))}
      </Stack>

      <Stack direction="row" gap="6" wrap>
        <Checkbox label="Прислать тестовое задание" defaultChecked />
        <Switch
          label="Записать встречу"
          checked={record}
          onChange={(event) => setRecord(event.target.checked)}
        />
      </Stack>

      <Callout tone="note" title="Что взять на встречу">
        <Text size="s">Ноутбук, доступ к репозиторию и 20 минут на разбор решения.</Text>
      </Callout>

      <Table
        columns={stageColumns}
        rows={interviewStages}
        rowKey={(row) => row.id}
        density="s"
        caption="Этапы интервью"
      />

      <Stack direction="row" gap="2" wrap>
        <Button size="s">Подтвердить слот</Button>
        <Button size="s" variant="secondary">
          Перенести
        </Button>
        <Button size="s" variant="ghost">
          Отклонить
        </Button>
      </Stack>
    </Stack>
  );
}

const messages: ChatMessage[] = [
  { id: 'u1', role: 'user', content: 'Собери план подготовки к интервью по Go' },
  { id: 'a1', role: 'assistant', extra: <InterviewResponse /> },
];

<Chat messages={messages} onSend={handleSend} />`,
      },
    },
  },
};
