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
  'Пользователь спрашивает про кэшбэк. Нужно уточнить категорию и выбрать карту. Смотрю тарифы дебетовой карты: 1% на всё, до 15% в выбранных категориях.';

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
