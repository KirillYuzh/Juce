import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from './Sidebar';

const cssSource = readFileSync(
  resolve(process.cwd(), 'src/components/ui/Sidebar.module.css'),
  'utf8'
);

function ruleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(cssSource)?.[1];
  if (body === undefined) throw new Error(`нет правила «${selector}»`);
  return body;
}

function px(body: string, property: string): number {
  const value = new RegExp(`${property}:\\s*(-?\\d+)px`).exec(body)?.[1];
  if (value === undefined) throw new Error(`нет «${property}» в px: ${body}`);
  return Number(value);
}

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

describe('SidebarRail', () => {
  function Rail() {
    return (
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    );
  }

  it('меняет подпись и состояние при сворачивании', () => {
    render(<Rail />);

    const expanded = screen.getByRole('button', { name: 'Свернуть панель' });
    expect(expanded.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(expanded);

    const collapsed = screen.getByRole('button', { name: 'Развернуть панель' });
    expect(collapsed.getAttribute('aria-expanded')).toBe('false');
  });

  it('указывает на панель, которой управляет', () => {
    render(<Rail />);

    const rail = screen.getByRole('button', { name: 'Свернуть панель' });
    expect(rail.getAttribute('aria-controls')).toBe(document.querySelector('aside')?.id);
  });

  it('держит хитзону не уже 24px при видимых 10px', () => {
    const inset = -px(ruleBody('.rail::before'), 'left');
    expect(px(ruleBody('.rail'), 'width') + 2 * inset).toBeGreaterThanOrEqual(24);
  });
});

describe('Sidebar в мобильном режиме', () => {
  function MobileSidebar() {
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Профиль</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );
  }

  function stubMobile() {
    window.matchMedia = ((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  it('блокирует прокрутку, пока открыт drawer, и снимает после закрытия', () => {
    stubMobile();
    render(<MobileSidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Переключить панель' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Переключить панель' }));
    expect(document.body.style.overflow).toBe('');
  });
});
