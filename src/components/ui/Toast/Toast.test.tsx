import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ToastProvider,
  useToast,
  type ToastOptions,
  type ToastProviderProps,
} from './ToastProvider';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../Dialog/Dialog';

function ToastTrigger({ options, label = 'Показать' }: { options: ToastOptions; label?: string }) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>{label}</button>;
}

function renderWithProvider(ui: React.ReactNode, props: Omit<ToastProviderProps, 'children'> = {}) {
  return render(<ToastProvider {...props}>{ui}</ToastProvider>);
}

// MutationObserver доставляет записи микротаской, поэтому ждём кадр без таймеров.
async function flush() {
  await act(async () => {});
}

async function click(name: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
}

function DialogWithToast() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Открыть диалог</DialogTrigger>
      <DialogContent>
        <DialogTitle>Заголовок</DialogTitle>
        <ToastTrigger options={{ title: 'Из модалки', duration: 60000 }} />
      </DialogContent>
    </Dialog>
  );
}

function RemovableDialog() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button onClick={() => setVisible(false)}>Убрать диалог</button>
      <ToastTrigger options={{ title: 'Живой тост', duration: 60000 }} />
      {visible && (
        <Dialog open onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Заголовок</DialogTitle>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const openDialog = () => {
  const element = document.querySelector('dialog');
  if (!element) throw new Error('Диалог не отрендерен');
  return element;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('Toast', () => {
  it('показывает заголовок и описание', () => {
    renderWithProvider(<ToastTrigger options={{ title: 'Сохранено', description: 'Готово' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    expect(screen.getByText('Сохранено')).toBeTruthy();
    expect(screen.getByText('Готово')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('держит действие в строке с описанием и вызывает onClick', () => {
    const onClick = vi.fn();
    renderWithProvider(
      <ToastTrigger
        options={{
          title: 'Экспорт завершён',
          description: 'Файл лежит в загрузках',
          action: { label: 'Открыть', onClick },
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    const description = screen.getByText('Файл лежит в загрузках');
    const action = screen.getByRole('button', { name: 'Открыть' });
    expect(action.parentElement).toBe(description.parentElement);

    fireEvent.click(action);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('держит действие в нижней строке, когда описания нет', () => {
    renderWithProvider(
      <ToastTrigger
        options={{ title: 'Экспорт завершён', action: { label: 'Открыть', onClick: () => {} } }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    const title = screen.getByText('Экспорт завершён');
    const action = screen.getByRole('button', { name: 'Открыть' });
    expect(title.parentElement?.contains(action)).toBe(false);
    expect(action.parentElement?.textContent).toBe('Открыть');
  });

  it('исчезает через duration', () => {
    renderWithProvider(<ToastTrigger options={{ title: 'Сохранено', duration: 3000 }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));
    expect(screen.getByText('Сохранено')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Сохранено')).toBeNull();
  });

  it('закрывается вручную', () => {
    renderWithProvider(<ToastTrigger options={{ title: 'Сохранено' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть уведомление' }));

    expect(screen.queryByText('Сохранено')).toBeNull();
  });

  it('даёт error роль alert', () => {
    renderWithProvider(<ToastTrigger options={{ title: 'Ошибка', tone: 'error' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    expect(screen.getByRole('alert').textContent).toContain('Ошибка');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('ограничивает стопку через max', () => {
    function Stack() {
      const { toast } = useToast();
      return (
        <button
          onClick={() => {
            toast({ title: 'Первый' });
            toast({ title: 'Второй' });
            toast({ title: 'Третий' });
          }}
        >
          Показать
        </button>
      );
    }

    renderWithProvider(<Stack />, { max: 2 });
    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    expect(screen.queryByText('Первый')).toBeNull();
    expect(screen.getByText('Второй')).toBeTruthy();
    expect(screen.getByText('Третий')).toBeTruthy();
  });

  it('dismiss() очищает все уведомления', () => {
    function ClearAll() {
      const { toast, dismiss } = useToast();
      return (
        <>
          <button
            onClick={() => {
              toast({ title: 'Первый' });
              toast({ title: 'Второй' });
            }}
          >
            Показать
          </button>
          <button onClick={() => dismiss()}>Очистить</button>
        </>
      );
    }

    renderWithProvider(<ClearAll />);
    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));
    expect(screen.getByText('Первый')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(screen.queryByText('Первый')).toBeNull();
    expect(screen.queryByText('Второй')).toBeNull();
  });

  it('останавливает таймер на фокусе и продолжает после blur', () => {
    renderWithProvider(<ToastTrigger options={{ title: 'Долго' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));

    const close = screen.getByRole('button', { name: 'Закрыть уведомление' });
    act(() => {
      close.focus();
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Долго')).toBeTruthy();

    act(() => {
      close.blur();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByText('Долго')).toBeNull();
  });

  it('чистит таймеры при размонтировании провайдера', () => {
    const { unmount } = renderWithProvider(<ToastTrigger options={{ title: 'Сохранено' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Показать' }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('рендерится на сервере и отдаёт дочерний узел', () => {
    const html = renderToString(
      <ToastProvider>
        <button>ok</button>
      </ToastProvider>
    );

    expect(html).toContain('ok');
  });

  it('порталит тост внутрь открытого диалога', async () => {
    renderWithProvider(<DialogWithToast />);
    await click('Открыть диалог');
    await click('Показать');

    expect(openDialog().open).toBe(true);
    expect(openDialog().contains(screen.getByText('Из модалки'))).toBe(true);
  });

  it('возвращает тост в body после закрытия диалога', async () => {
    renderWithProvider(<DialogWithToast />);
    await click('Открыть диалог');
    await click('Показать');
    expect(openDialog().contains(screen.getByText('Из модалки'))).toBe(true);

    await click('Закрыть');

    const toast = screen.getByText('Из модалки');
    expect(openDialog().contains(toast)).toBe(false);
    expect(document.body.contains(toast)).toBe(true);
  });

  it('возвращает тост в body, когда открытый диалог исчез из DOM', async () => {
    renderWithProvider(<RemovableDialog />);
    await flush();
    await click('Показать');
    expect(openDialog().contains(screen.getByText('Живой тост'))).toBe(true);

    await click('Убрать диалог');

    expect(document.querySelector('dialog')).toBeNull();
    const toast = screen.getByText('Живой тост');
    expect(document.body.contains(toast)).toBe(true);
    expect(toast.closest('dialog')).toBeNull();
  });
});
