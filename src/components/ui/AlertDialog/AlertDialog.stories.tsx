import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from './AlertDialog';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/Alert dialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj;

function Demo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('ничего');

  return (
    <div style={{ display: 'grid', gap: 'var(--tb-space-4)', justifyItems: 'start' }}>
      <Button onClick={() => setOpen(true)}>Удалить чат</Button>
      <p className="tb-text-m">Результат: {result}</p>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Удалить чат «Утечка горутины»?"
        description="История переписки удалится без возможности восстановления."
        cancelLabel="Оставить"
        confirmLabel="Удалить"
        onConfirm={() => setResult('удалён')}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};
