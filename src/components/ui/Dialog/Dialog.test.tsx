import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogRole,
  type DialogSize,
} from './Dialog';

function Harness({
  role,
  closable,
  size,
}: {
  role?: DialogRole;
  closable?: boolean;
  size?: DialogSize;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Открыть</DialogTrigger>
      <DialogContent role={role} closable={closable} size={size}>
        <DialogHeader>
          <DialogTitle>Заголовок</DialogTitle>
          <DialogDescription>Описание</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Готово</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const dialog = () => {
  const element = document.querySelector('dialog');
  if (!element) throw new Error('Диалог не отрендерен');
  return element;
};

function UnmountHarness() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Открыть</DialogTrigger>
      {open && (
        <DialogContent>
          <DialogTitle>Заголовок</DialogTitle>
          <DialogClose>Готово</DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens from the trigger and names itself from the title and description', () => {
    render(<Harness />);

    expect(dialog().open).toBe(false);
    expect(dialog().getAttribute('role')).toBe('dialog');
    expect(dialog().getAttribute('aria-modal')).toBe('true');
    expect(dialog().getAttribute('data-size')).toBe('m');

    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));

    expect(dialog().open).toBe(true);
    expect(dialog().getAttribute('aria-labelledby')).toBe(
      screen.getByRole('heading', { name: 'Заголовок' }).id
    );
    expect(dialog().getAttribute('aria-describedby')).toBe(screen.getByText('Описание').id);
  });

  it('closes from the trigger, the close button and DialogClose', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    fireEvent.click(trigger);
    expect(dialog().open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Готово' }));
    expect(dialog().open).toBe(false);

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(dialog().open).toBe(false);
  });

  it('returns focus to the element that opened it', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(document.activeElement).toBe(trigger);
  });

  it('возвращает фокус, когда открытый DialogContent размонтирован', () => {
    render(<UnmountHarness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    trigger.focus();
    fireEvent.click(trigger);
    expect(dialog().open).toBe(true);

    const close = screen.getByRole('button', { name: 'Готово' });
    close.focus();
    fireEvent.click(close);

    expect(document.querySelector('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('восстанавливает фокус один раз при обычном закрытии', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });
    trigger.focus();
    const focusSpy = vi.spyOn(trigger, 'focus');

    fireEvent.click(trigger);
    const close = screen.getByRole('button', { name: 'Закрыть' });
    close.focus();
    fireEvent.click(close);

    expect(document.activeElement).toBe(trigger);
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop click and stays open on a content click', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));

    fireEvent.click(screen.getByRole('heading', { name: 'Заголовок' }));
    expect(dialog().open).toBe(true);

    fireEvent.click(dialog());
    expect(dialog().open).toBe(false);
  });

  it('closes on the native cancel event', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));

    fireEvent(dialog(), new Event('cancel'));

    expect(dialog().open).toBe(false);
  });

  it('renders an alertdialog without the close button when closable is false', () => {
    render(<Harness role="alertdialog" closable={false} size="s" />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));

    expect(dialog().getAttribute('role')).toBe('alertdialog');
    expect(dialog().getAttribute('data-size')).toBe('s');
    expect(screen.queryByRole('button', { name: 'Закрыть' })).toBeNull();
  });

  it('блокирует прокрутку документа, пока открыт', () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('снимает блокировку, когда открытый DialogContent размонтирован', () => {
    const { unmount } = render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
