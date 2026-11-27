import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList } from './DescriptionList';
import { Badge } from '../Display';

const meta: Meta = {
  title: 'Primitives/Description list',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DescriptionList
      columns={3}
      items={[
        { label: 'Проект', value: 'Вектор' },
        { label: 'Владелец', value: 'Команда ядра' },
        { label: 'Статус', value: <Badge tone="success">Активен</Badge> },
        { label: 'Последняя сборка', value: '27 ноября, 14:02' },
        { label: 'Задач в работе', value: '12' },
        { label: 'Покрытие тестами', value: '84%' },
      ]}
    />
  ),
};
