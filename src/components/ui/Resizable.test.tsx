import { describe, expect, it } from 'vitest';
import { drag, pairRange, type ResizableLimits } from './Resizable';

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
