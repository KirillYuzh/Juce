import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section } from './Section';
import { Button } from '../Button';
import { Stack } from '../Layout';
import { Text } from '../Typography';

const meta: Meta = {
  title: 'Primitives/Section',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Section
      title="Результаты"
      description="Данные за последнюю неделю."
      actions={
        <Button size="s" variant="secondary">
          Фильтр
        </Button>
      }
    >
      <Stack gap="3">
        <Text>Сборка проходит на 98% запусков, падения — только в задачах с сетью.</Text>
        <Text tone="secondary">Отчёт обновляется каждые 15 минут.</Text>
      </Stack>
    </Section>
  ),
};
