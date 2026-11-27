import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { Button } from '../Button';
import { Input } from '../Fields';

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj;

const DIALOG_SOURCE = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Создать проект</DialogTrigger>
  <DialogContent size="m">
    <DialogHeader>
      <DialogTitle>Новый проект</DialogTitle>
      <DialogDescription>Название увидят только участники команды.</DialogDescription>
    </DialogHeader>
    <form onSubmit={(event) => event.preventDefault()}>
      <Input placeholder="Название проекта" required />
    </form>
    <DialogFooter>
      <DialogClose>Отмена</DialogClose>
      <Button size="m" onClick={() => setOpen(false)}>
        Создать
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Создать проект</DialogTrigger>
      <DialogContent size="m">
        <DialogHeader>
          <DialogTitle>Новый проект</DialogTitle>
          <DialogDescription>Название увидят только участники команды.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => event.preventDefault()}>
          <Input placeholder="Название проекта" required />
        </form>
        <DialogFooter>
          <DialogClose>Отмена</DialogClose>
          <Button size="m" onClick={() => setOpen(false)}>
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <DialogExample />,
  parameters: { docs: { source: { code: DIALOG_SOURCE } } },
};
