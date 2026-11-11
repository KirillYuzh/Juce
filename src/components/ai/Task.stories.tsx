import type { Meta, StoryObj } from '@storybook/react-vite';
import { Task, type TaskStep } from './Task';

const meta: Meta = {
  title: 'AI/Task',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const steps: TaskStep[] = [
  { id: 'open', title: 'Открыл страницу дебетовой карты', status: 'done' },
  { id: 'tariffs', title: 'Сверил тарифы', file: 'tariffs.md', status: 'done' },
  { id: 'rates', title: 'Посчитал кэшбэк', status: 'running' },
  { id: 'answer', title: 'Собрал ответ', status: 'pending' },
];

export const Running: Story = {
  render: () => <div style={{ width: 420 }}><Task title="Считаю кэшбэк" status="running" steps={steps} /></div>,
};

export const Done: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Task title="Ответ готов" status="done" steps={steps.map((s) => ({ ...s, status: 'done' as const }))} />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Task
        title="Не удалось посчитать кэшбэк"
        status="error"
        defaultOpen
        steps={[
          { id: 'open', title: 'Открыл страницу дебетовой карты', status: 'done' },
          { id: 'api', title: 'Запрос к тарифам', status: 'error' },
          { id: 'answer', title: 'Собрал ответ', status: 'pending' },
        ]}
      />
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Task title="Ищу ответ по ипотеке" status="running" steps={steps.slice(0, 2)}>
        <Task title="Подзадача: ставки" status="done" steps={[{ id: 'a', title: 'Собрал ставки', status: 'done' }]} />
      </Task>
    </div>
  ),
};
