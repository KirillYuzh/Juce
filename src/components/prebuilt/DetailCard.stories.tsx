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

const mediaPositions = [
  { position: 'top', label: 'Сверху' },
  { position: 'bottom', label: 'Снизу' },
  { position: 'right', label: 'Справа' },
  { position: 'back', label: 'Сзади' },
] as const;

export const MediaPositions: Story = {
  name: 'Media positions',
  args: { title: 'Утечка горутины' },
  parameters: { layout: 'padded' },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 24,
        width: 860,
      }}
    >
      {mediaPositions.map(({ position, label }) => (
        <figure style={{ display: 'grid', gap: 8, margin: 0 }} key={position}>
          <figcaption style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>
            {label}
          </figcaption>
          <DetailCard
            title="Утечка горутины"
            description="Почему горутина не завершается и как это заметить в проде."
            media={<img alt="" src="/images/wang/laugh.jpeg" />}
            mediaPosition={position}
            meta={[
              { id: 'level', label: 'Уровень', value: 'Senior' },
              { id: 'time', label: 'Время', value: '35 минут' },
            ]}
          />
        </figure>
      ))}
    </div>
  ),
};
