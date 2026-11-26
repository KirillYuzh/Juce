import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Header } from './Header';
import { homeNav } from '../../data/home';

describe('Header', () => {
  it('gives every mobile menu its own id', () => {
    render(
      <>
        <Header nav={homeNav} />
        <Header nav={homeNav} />
      </>
    );

    const buttons = screen.getAllByLabelText('Открыть меню');
    const ids = buttons.map((button) => button.getAttribute('aria-controls'));
    expect(ids[0]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);

    fireEvent.click(buttons[0]);
    expect(document.getElementById(ids[0] as string)).toBeTruthy();
  });

  it('renders nested links in the mobile menu', () => {
    render(<Header nav={homeNav} />);
    fireEvent.click(screen.getByLabelText('Открыть меню'));

    const menu = screen.getByRole('navigation', { name: 'Мобильное меню' });
    expect(within(menu).getByText('Ассистент Джупсик')).toBeTruthy();
    expect(within(menu).getByText('Java-разработчикам')).toBeTruthy();

    fireEvent.click(within(menu).getByText('Статьи'));
    expect(screen.queryByRole('navigation', { name: 'Мобильное меню' })).toBeNull();
  });

  it('reflects the desktop dropdown state and closes it on Escape', () => {
    render(<Header nav={homeNav} />);
    const trigger = screen.getByRole('link', { name: 'Платформа' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Ассистент Джупсик');

    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('moves focus into the mobile menu and back to the toggle', () => {
    render(<Header nav={homeNav} />);
    const toggle = screen.getByLabelText('Открыть меню');

    fireEvent.click(toggle);
    const menu = screen.getByRole('navigation', { name: 'Мобильное меню' });
    expect(menu.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: 'Мобильное меню' })).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });
});
