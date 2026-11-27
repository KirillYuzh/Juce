import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ChatList, type ChatListItem } from './ChatList';

const chats: ChatListItem[] = [
  { id: 'a', title: 'Первый диалог', preview: 'Про горутины' },
  { id: 'b', title: 'Второй диалог', preview: 'Про матрицы' },
];

const items = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-chat-item]'));

describe('ChatList', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('shows every chat and marks the active one', () => {
    render(<ChatList chats={chats} activeId="b" />);
    expect(screen.getByText('Первый диалог')).toBeTruthy();
    expect(items()).toHaveLength(2);
    expect(items()[1].getAttribute('aria-current')).toBe('true');
    expect(items()[0].getAttribute('aria-current')).toBeNull();
  });

  it('selects a chat on click', () => {
    const onSelect = vi.fn();
    render(<ChatList chats={chats} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Второй диалог'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('filters chats by title and preview', () => {
    render(<ChatList chats={chats} />);
    fireEvent.change(screen.getByLabelText('Поиск по диалогам'), {
      target: { value: 'матриц' },
    });
    expect(screen.getByText('Второй диалог')).toBeTruthy();
    expect(screen.queryByText('Первый диалог')).toBeNull();
  });

  it('opens the actions menu and copies a chat', () => {
    const onCopy = vi.fn();
    render(<ChatList chats={chats} onCopy={onCopy} />);
    fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: /Скопировать/ }));
    expect(onCopy).toHaveBeenCalledWith(chats[1]);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('downloads a chat from the menu', () => {
    const onDownload = vi.fn();
    render(<ChatList chats={chats} onDownload={onDownload} />);
    fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));
    fireEvent.click(screen.getByRole('menuitem', { name: /Скачать/ }));
    expect(onDownload).toHaveBeenCalledWith(chats[1]);
  });

  it('revokes the download blob and removes the link even when the click throws', () => {
    vi.useFakeTimers();
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:chat');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw new Error('click failed');
    });
    const absorb = () => undefined;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.addEventListener('error', absorb);
    try {
      render(<ChatList chats={chats} />);
      fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));
      expect(() =>
        fireEvent.click(screen.getByRole('menuitem', { name: /Скачать/ }))
      ).not.toThrow();

      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(document.querySelector('a[download]')).toBeNull();
      expect(revokeObjectURL).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1000));
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:chat');
    } finally {
      window.removeEventListener('error', absorb);
      consoleError.mockRestore();
    }
  });

  it('closes the actions menu on a pointer down outside', () => {
    render(<ChatList chats={chats} />);
    fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('moves focus with Home and End in the actions menu', () => {
    render(<ChatList chats={chats} />);
    const trigger = screen.getByLabelText('Действия с чатом «Второй диалог»');
    fireEvent.click(trigger);

    const menu = screen.getByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);

    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(items[items.length - 1]);
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);

    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('moves focus with the arrow keys in the actions menu', () => {
    render(<ChatList chats={chats} onDelete={() => {}} />);
    fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));

    const menuItems = within(screen.getByRole('menu')).getAllByRole('menuitem');
    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menuItems[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(menuItems[1]);
    fireEvent.keyDown(menuItems[1], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(menuItems[2]);

    fireEvent.keyDown(menuItems[2], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(menuItems[0]);
    fireEvent.keyDown(menuItems[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(menuItems[2]);
  });

  it('moves focus with Home and End in the chat list', () => {
    render(<ChatList chats={chats} />);
    const search = screen.getByLabelText('Поиск по диалогам');
    fireEvent.keyDown(search, { key: 'End' });
    expect(document.activeElement).toBe(items()[1]);
    fireEvent.keyDown(items()[1], { key: 'Home' });
    expect(document.activeElement).toBe(items()[0]);
  });

  it('deletes a chat only after the alert dialog is confirmed', () => {
    const onDelete = vi.fn();
    render(<ChatList chats={chats} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Действия с чатом «Второй диалог»'));
    fireEvent.click(screen.getByRole('menuitem', { name: /Удалить/ }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(document.querySelector('dialog')?.open).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));
    expect(onDelete).toHaveBeenCalledWith('b');
    expect(document.querySelector('dialog')?.open).toBe(false);
  });

  it('keeps the chat when deletion is cancelled', async () => {
    const onDelete = vi.fn();
    render(<ChatList chats={chats} onDelete={onDelete} />);
    const trigger = screen.getByLabelText('Действия с чатом «Второй диалог»');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: /Удалить/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Оставить' }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(document.querySelector('dialog')?.open).toBe(false);
    expect(screen.getByText('Второй диалог')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('shows skeleton rows while loading', () => {
    render(<ChatList chats={[]} loading />);
    expect(document.querySelectorAll('[data-chat-skeleton]')).toHaveLength(4);
    expect(items()).toHaveLength(0);
    expect(screen.queryByText('Здесь будут диалоги с помощником')).toBeNull();
    expect(document.querySelector('[data-chat-list]')?.getAttribute('aria-busy')).toBe('true');
  });

  it('moves focus with the arrow keys', () => {
    render(<ChatList chats={chats} />);
    const search = screen.getByLabelText('Поиск по диалогам');
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items()[0]);
    fireEvent.keyDown(items()[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items()[1]);
    fireEvent.keyDown(items()[1], { key: 'ArrowUp' });
    fireEvent.keyDown(items()[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(search);
  });
});
