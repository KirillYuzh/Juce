import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChatList, type ChatListItem } from './ChatList';

const chats: ChatListItem[] = [
  { id: 'a', title: 'Первый диалог', preview: 'Про горутины' },
  { id: 'b', title: 'Второй диалог', preview: 'Про матрицы' },
];

const items = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-chat-item]'));

describe('ChatList', () => {
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

  it('deletes a chat only after confirmation', () => {
    const onDelete = vi.fn();
    render(<ChatList chats={chats} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Удалить диалог «Второй диалог»'));
    expect(onDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Подтвердить удаление'));
    expect(onDelete).toHaveBeenCalledWith('b');
  });

  it('shows skeleton rows while loading', () => {
    render(<ChatList chats={[]} loading />);
    expect(document.querySelectorAll('[data-chat-skeleton]')).toHaveLength(4);
    expect(items()).toHaveLength(0);
    expect(screen.queryByText('Здесь будут диалоги с помощником')).toBeNull();
    expect(document.querySelector('[data-chat-list]')?.getAttribute('aria-busy')).toBe('true');
  });

  it('cancels deletion without removing the chat', () => {
    const onDelete = vi.fn();
    render(<ChatList chats={chats} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Удалить диалог «Второй диалог»'));
    fireEvent.click(screen.getByLabelText('Отменить удаление'));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Удалить диалог «Второй диалог»')).toBeTruthy();
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
