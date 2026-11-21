import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatList, type ChatListItem } from './ChatList';

const chats: ChatListItem[] = [
  {
    id: 'c1',
    title: 'Утечка горутины',
    preview: 'Почему небуферизованный канал блокирует отправку и куда девается горутина?',
  },
  {
    id: 'c2',
    title: 'Ранг матрицы',
    preview: 'Объясни ранг матрицы на примере системы из трёх уравнений.',
  },
  {
    id: 'c3',
    title: 'Разбор задачи с интервью',
    preview: 'Дан массив чисел, найди пару с максимальной суммой без повторов.',
  },
  {
    id: 'c4',
    title: 'Конспект лекции',
    preview: 'Собери тезисы по дискретной математике: отношения и графы.',
  },
];

const meta: Meta<typeof ChatList> = {
  title: 'Chat/Sidebar',
  component: ChatList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: 520, width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatList>;

export const Default: Story = {
  args: { chats, activeId: 'c2', onCreate: () => undefined, onDelete: () => undefined },
  parameters: {
    docs: {
      source: {
        code: `<ChatList
  chats={chats}
  activeId={activeId}
  onSelect={setActiveId}
  onCreate={createChat}
  onDelete={deleteChat}
/>`,
      },
    },
  },
};

export const Empty: Story = {
  args: { chats: [], onCreate: () => undefined },
  parameters: {
    docs: {
      source: {
        code: `<ChatList chats={[]} onCreate={createChat} />`,
      },
    },
  },
};

export const Loading: Story = {
  name: 'Skeleton',
  args: { chats: [], loading: true, onCreate: () => undefined },
  parameters: {
    docs: {
      source: {
        code: `<ChatList chats={[]} loading onCreate={createChat} />`,
      },
    },
  },
};

export const WithoutSearch: Story = {
  args: { chats, activeId: 'c1', searchable: false, onDelete: () => undefined },
  parameters: {
    docs: {
      source: {
        code: `<ChatList chats={chats} activeId={activeId} searchable={false} onDelete={deleteChat} />`,
      },
    },
  },
};
