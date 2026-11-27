import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './Sidebar';

const cssSource = readFileSync(
  resolve(process.cwd(), 'src/components/ui/Sidebar.module.css'),
  'utf8'
);

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

function CollapsedIconSidebar() {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton icon={<span />}>Профиль</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
}

describe('Sidebar в режиме collapsed + icon', () => {
  it('оставляет подпись кнопки в дереве доступности', () => {
    render(<CollapsedIconSidebar />);
    const aside = document.querySelector('aside');
    expect(aside?.getAttribute('data-state')).toBe('collapsed');
    expect(aside?.getAttribute('data-collapsible')).toBe('icon');

    expect(screen.getByRole('button', { name: 'Профиль' })).toBeTruthy();
  });

  it('прячет .menuLabel визуально, а не через display: none', () => {
    const rule = cssSource.match(
      /\.sidebar\[data-state='collapsed'\]\[data-collapsible='icon'\] \.menuLabel\s*\{([^}]*)\}/
    );
    const body = rule?.[1] ?? '';

    expect(rule).not.toBeNull();
    expect(body).not.toContain('display: none');
    for (const declaration of [
      'position: absolute',
      'width: 1px',
      'height: 1px',
      'margin: -1px',
      'padding: 0',
      'overflow: hidden',
      'clip-path: inset(50%)',
      'white-space: nowrap',
      'border: 0',
    ]) {
      expect(body).toContain(declaration);
    }
  });

  it('оставляет .groupLabel, .menuBadge и .menuAction скрытыми', () => {
    const rule = cssSource.match(
      /\.sidebar\[data-state='collapsed'\]\[data-collapsible='icon'\] \.groupLabel,\s*\.sidebar\[data-state='collapsed'\]\[data-collapsible='icon'\] \.menuBadge,\s*\.sidebar\[data-state='collapsed'\]\[data-collapsible='icon'\] \.menuAction\s*\{([^}]*)\}/
    );

    expect(rule?.[1]).toContain('display: none');
  });
});
