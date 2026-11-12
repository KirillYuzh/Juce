import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reasoning } from './Reasoning';

const meta: Meta = {
  title: 'AI/Reasoning',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const text =
  'Пользователь спрашивает про утечку горутин. Проверяю, как устроен небуферизованный канал и какие способы выхода из блокировки есть в стандартной библиотеке.';

export const Streaming: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Reasoning text={text} isStreaming />
    </div>
  ),
};

export const Complete: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Reasoning text={text} duration={4} defaultOpen={false} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Reasoning text="" isStreaming />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ width: 420 }}>
        <Reasoning text={text} duration={4} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
