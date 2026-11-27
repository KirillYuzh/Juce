import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';
import { Icon } from '../Icon';

const meta = {
  title: 'Primitives/Timeline',
  component: Timeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: 'spec',
        title: 'Спецификация',
        time: '12 окт',
        description: 'Собрали требования и зафиксировали контракт темы.',
        tone: 'success',
        icon: <Icon name="check" size={16} />,
      },
      {
        id: 'build',
        title: 'Сборка',
        time: '13 окт',
        description: 'Типы, линтеры и пакет прошли проверку.',
        tone: 'accent',
      },
      {
        id: 'review',
        title: 'Ревью',
        time: '14 окт',
        description: 'Проверяем доступность и контраст в каждой теме.',
        tone: 'neutral',
        icon: <Icon name="user" size={16} />,
      },
      {
        id: 'fix',
        title: 'Исправление',
        time: '15 окт',
        description: 'Правим найденные замечания перед релизом.',
        tone: 'error',
        icon: <Icon name="alertCircle" size={16} />,
      },
    ],
  },
};
