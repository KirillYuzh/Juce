import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailCard } from './DetailCard';
import { Badge } from '../ui/Display';

const meta = {
  title: 'Prebuilt/Detail card',
  component: DetailCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Утечка горутины',
    description: 'Почему горутина не завершается и как это заметить в проде.',
    tags: <Badge tone="neutral">Go</Badge>,
    meta: [
      { id: 'level', label: 'Уровень', value: 'Senior' },
      { id: 'time', label: 'Время', value: '35 минут' },
    ],
    href: '#',
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <DetailCard {...args} />
    </div>
  ),
};
