import type { Meta, StoryObj } from '@storybook/react-vite';
import { CollapsibleList, List, ListRow } from './List';
import { Badge } from '../Display';
import { Stack } from '../Layout';

const meta: Meta = {
  title: 'Primitives/List',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const tasks = [
  'Сборка релиза',
  'Проверка доступности',
  'Обновление документации',
  'Разбор инцидента',
  'Синхронизация макетов',
  'Ревизия токенов',
];

export const Default: Story = {
  render: () => (
    <Stack gap="8">
      <List>
        <ListRow
          leading={<span>01</span>}
          title="Документация"
          description="Гайд по компонентам и токенам"
          href="#"
          trailing={<Badge tone="success">Готово</Badge>}
        />
        <ListRow
          leading={<span>02</span>}
          title="Открыть отчёт"
          description="Данные за последнюю неделю"
          onClick={() => undefined}
          trailing={<Badge>В работе</Badge>}
        />
        <ListRow leading={<span>03</span>} title="Статичная строка" meta="Без действия" />
        <ListRow
          leading={<span>04</span>}
          title="Отчёт за неделю"
          description="Длинное описание в две строки: номер и бейдж держатся верхней кромки строки, а не середины."
          trailing={<Badge tone="warning">Проверка</Badge>}
        />
      </List>

      <CollapsibleList
        items={tasks.map((title, index) => (
          <ListRow key={title} title={title} meta={`Задача ${index + 1}`} />
        ))}
        initial={3}
      />
    </Stack>
  ),
};
