import type { Meta, StoryObj } from '@storybook/react-vite';
import { StateMessage } from './StateMessage';
import { Button } from '../Button';
import { Spinner } from '../Display';
import { Stack } from '../Layout';

const meta: Meta = {
  title: 'Primitives/State message',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Stack gap="8">
      <StateMessage
        title="Пока пусто"
        text="Добавьте первый проект, чтобы увидеть статистику."
        action={
          <Button size="s" variant="secondary">
            Создать проект
          </Button>
        }
      />
      <StateMessage
        tone="error"
        title="Не удалось загрузить данные"
        text="Проверьте соединение и попробуйте снова."
        action={
          <Button size="s" variant="secondary">
            Повторить
          </Button>
        }
      />
      <StateMessage icon={<Spinner size={32} />} title="Загружаем данные" />
    </Stack>
  ),
};
