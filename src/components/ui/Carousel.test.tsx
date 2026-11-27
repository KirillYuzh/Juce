import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Carousel, CarouselContent, CarouselItem } from './Carousel';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

function ruleBody(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1];
  if (body === undefined) throw new Error(`нет правила «${selector}»`);
  return body;
}

function px(body: string, property: string): number {
  const value = new RegExp(`${property}:\\s*(-?\\d+)px`).exec(body)?.[1];
  if (value === undefined) throw new Error(`нет «${property}» в px: ${body}`);
  return Number(value);
}

const cssSource = read('src/components/ui/Carousel.module.css');
const structureSource = read('src/styles/structure.css');

describe('Carousel: цели нажатия точек', () => {
  it('хитзона точки не меньше 24×24 при визуальных 6×6', () => {
    const dot = ruleBody(cssSource, '.dot');
    const hit = ruleBody(cssSource, '.dot::after');
    const inset = -px(hit, 'inset');

    expect(dot).toContain('position: relative');
    expect(px(dot, 'width') + 2 * inset).toBeGreaterThanOrEqual(24);
    expect(px(dot, 'height') + 2 * inset).toBeGreaterThanOrEqual(24);
  });

  it('хитзоны соседних точек не накладываются', () => {
    const inset = -px(ruleBody(cssSource, '.dot::after'), 'inset');
    const token = /gap:\s*var\((--tb-space-\d+)\)/.exec(ruleBody(cssSource, '.dots'))?.[1];
    if (token === undefined) throw new Error('gap точек задан не токеном --tb-space-*');
    const gap = Number(new RegExp(`${token}:\\s*(\\d+)px`).exec(structureSource)?.[1]);

    expect(gap).toBeGreaterThanOrEqual(2 * inset);
  });
});

describe('Carousel: роли на русском', () => {
  function Demo(props: { roleDescription?: string; slideRoleDescription?: string }) {
    return (
      <Carousel aria-label="Фотографии" {...props}>
        <CarouselContent>
          <CarouselItem>Первый</CarouselItem>
          <CarouselItem>Второй</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
  }

  const descriptions = (role: string) =>
    screen.getAllByRole(role).map((node) => node.getAttribute('aria-roledescription'));

  it('по умолчанию называет роли по-русски', () => {
    render(<Demo />);

    expect(descriptions('region')).toEqual(['карусель']);
    expect(screen.getByRole('region', { name: 'Фотографии' })).toBeTruthy();
    expect(descriptions('group')).toEqual(['слайд', 'слайд']);
  });

  it('принимает свои подписи ролей', () => {
    render(<Demo roleDescription="галерея" slideRoleDescription="фотография" />);

    expect(descriptions('region')).toEqual(['галерея']);
    expect(descriptions('group')).toEqual(['фотография', 'фотография']);
  });
});
