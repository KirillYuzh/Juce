import type { Meta, StoryObj } from '@storybook/react-vite';
import { MediaPanel } from './MediaPanel';

const meta = {
  title: 'Prebuilt/Media panel',
  component: MediaPanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MediaPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Платформа, которая объясняет, а не подсказывает',
    text: 'Разбор кода, доказательства по шагам и тесты — в одном рабочем пространстве.',
    media: <img src="/images/wang/laugh.jpeg" alt="" />,
    links: [{ label: 'Открыть ассистента', href: '#/assistant' }],
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <MediaPanel {...args} />
    </div>
  ),
};
