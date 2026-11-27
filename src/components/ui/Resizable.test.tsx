import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { drag, pairRange, type ResizableLimits } from './Resizable';

const cssSource = readFileSync(
  resolve(process.cwd(), 'src/components/ui/Resizable.module.css'),
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

const wide: ResizableLimits[] = [
  { min: 0, max: 100 },
  { min: 0, max: 100 },
];

describe('pairRange', () => {
  it('intersects the limits of both panels', () => {
    const limits: ResizableLimits[] = [
      { min: 20, max: 80 },
      { min: 10, max: 60 },
    ];
    expect(pairRange([50, 50], 0, limits)).toEqual({ min: 40, max: 80 });
  });
});

describe('drag', () => {
  it('keeps the pair sum while moving the separator', () => {
    expect(drag([50, 50], 0, 20, wide)).toEqual([70, 30]);
    expect(drag([50, 50], 0, -20, wide)).toEqual([30, 70]);
  });

  it('clamps to both panel limits', () => {
    const limits: ResizableLimits[] = [
      { min: 20, max: 80 },
      { min: 10, max: 60 },
    ];
    expect(drag([50, 50], 0, 100, limits)).toEqual([80, 20]);
    expect(drag([50, 50], 0, -100, limits)).toEqual([40, 60]);
  });

  it('leaves a single panel untouched', () => {
    expect(drag([100], 0, 10, wide)).toEqual([100]);
  });
});

describe('цель нажатия разделителя', () => {
  it('не уже 24px при видимой линии 1px', () => {
    const inset = -px(ruleBody('.handle::before'), 'left');
    expect(px(ruleBody('.handle'), 'width') + 2 * inset).toBeGreaterThanOrEqual(24);
  });

  it('не ниже 24px в вертикальном режиме', () => {
    const selector = ".group[data-orientation='vertical'] .handle";
    const inset = -px(ruleBody(`${selector}::before`), 'top');
    expect(px(ruleBody(selector), 'height') + 2 * inset).toBeGreaterThanOrEqual(24);
  });
});
