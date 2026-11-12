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
  { id: 'open', title: 'Открыл исходники планировщика', status: 'done' },
  { id: 'docs', title: 'Сверил с документацией', file: 'runtime.md', status: 'done' },
  { id: 'repro', title: 'Собрал минимальный пример', status: 'running' },
  { id: 'answer', title: 'Собрал ответ', status: 'pending' },
];

export const Running: Story = {
  render: () => <div style={{ width: 420 }}><Task title="Ищу причину утечки" status="running" steps={steps} /></div>,
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
        title="Не удалось воспроизвести баг"
        status="error"
        defaultOpen
        steps={[
          { id: 'open', title: 'Открыл исходники планировщика', status: 'done' },
          { id: 'go', title: 'Запуск примера на Go', status: 'error' },
          { id: 'answer', title: 'Собрал ответ', status: 'pending' },
        ]}
      />
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Task title="Разбираю задачу про графы" status="running" steps={steps.slice(0, 2)}>
        <Task title="Подзадача: обход в ширину" status="done" steps={[{ id: 'a', title: 'Построил BFS', status: 'done' }]} />
      </Task>
    </div>
  ),
};
