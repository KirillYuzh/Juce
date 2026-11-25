import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceCard } from './ServiceCard';

const meta = {
  title: 'Prebuilt/Service card',
  component: ServiceCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SERVICES = [
  {
    id: 'search',
    title: 'Поиск по документации и коду',
    text: 'Находит нужный раздел javadoc, pkg.go.dev или исходников, отбрасывает устаревшее и объясняет, почему выбрал этот ответ.',
    link: { label: 'Попробовать', href: '#/assistant' },
  },
  {
    id: 'review',
    title: 'Разбор темы',
    text: 'Собирает объяснение по теме: определения, примеры и типичные ошибки, с ссылкой на каждый шаг.',
    link: { label: 'Как это работает', href: '#' },
  },
  {
    id: 'cite',
    title: 'Тесты и примеры',
    text: 'Пишет юнит-тесты на JUnit и Go, разбирает падения и показывает минимальный пример, который воспроизводит баг.',
    link: { label: 'Стандарты', href: '#' },
  },
];

export const Default: Story = {
  args: {
    title: SERVICES[0].title,
    description: SERVICES[0].text,
    link: SERVICES[0].link,
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ServiceCard {...args} />
    </div>
  ),
};

export const Group: Story = {
  args: { title: 'Что умеет Джупсик', link: { label: 'Попробовать', href: '#/assistant' } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 24,
        width: 1080,
      }}
    >
      {SERVICES.map((service) => (
        <ServiceCard
          key={service.id}
          title={service.title}
          description={service.text}
          link={service.link}
        />
      ))}
    </div>
  ),
};
