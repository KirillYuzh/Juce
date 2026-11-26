import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar, SidebarProvider, SidebarRail, SidebarTrigger } from './Sidebar';

function Demo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  );
}

describe('Sidebar', () => {
  it('переключает панель по триггеру и меняет подпись rail', () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Переключить панель' });
    const rail = screen.getByRole('button', { name: 'Свернуть панель' });

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(rail.getAttribute('aria-label')).toBe('Развернуть панель');
    expect(screen.queryByRole('button', { name: 'Свернуть панель' })).toBeNull();

    fireEvent.click(rail);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(rail.getAttribute('aria-label')).toBe('Свернуть панель');
  });

  it('применяет два переключения в одном тике друг за другом', () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Переключить панель' });

    act(() => {
      fireEvent.click(trigger);
      fireEvent.click(trigger);
    });

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: 'Свернуть панель' })).toBeTruthy();
  });
});
