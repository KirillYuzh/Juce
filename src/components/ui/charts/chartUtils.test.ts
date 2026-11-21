import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { arcPath, axisTicks, labelStep, linePath, niceStep, signedTicks, toNumber } from './chartUtils';

const mantissa = (step: number) => step / 10 ** Math.floor(Math.log10(step));

describe('niceStep', () => {
  it('returns 1, 2 or 5 times a power of ten', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.001, max: 1_000_000, noNaN: true }), (raw) => {
        expect([1, 2, 5]).toContain(mantissa(niceStep(raw)));
      }),
    );
  });
});

describe('axisTicks', () => {
  it('covers the maximum and starts at zero', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 100_000, noNaN: true }), (maxValue) => {
        const ticks = axisTicks(maxValue, 5);
        expect(ticks.max).toBeGreaterThanOrEqual(maxValue);
        expect(ticks.values[0]).toBe(0);
        expect(ticks.values[ticks.values.length - 1]).toBeCloseTo(ticks.max, 6);
      }),
    );
  });
});

describe('signedTicks', () => {
  it('includes both bounds', () => {
    const ticks = signedTicks(-30, 70, 5);
    expect(ticks.min).toBeLessThanOrEqual(-30);
    expect(ticks.max).toBeGreaterThanOrEqual(70);
  });
});

describe('linePath', () => {
  const points: Array<[number, number]> = [
    [0, 10],
    [10, 20],
    [20, 5],
  ];

  it('starts with a move and draws one curve per segment', () => {
    const path = linePath(points, 'smooth');
    expect(path.startsWith('M0,10')).toBe(true);
    expect(path.match(/C/g)).toHaveLength(points.length - 1);
  });

  it('draws steps and straight lines without curves', () => {
    expect(linePath(points, 'step')).not.toContain('C');
    expect(linePath(points, 'linear').match(/L/g)).toHaveLength(points.length - 1);
  });

  it('returns an empty path for no points', () => {
    expect(linePath([], 'smooth')).toBe('');
  });
});

describe('arcPath', () => {
  it('closes the slice', () => {
    const path = arcPath(50, 50, 20, 40, 0, Math.PI / 2);
    expect(path.endsWith('Z')).toBe(true);
    expect(path).toContain('A40,40');
  });
});

describe('labelStep', () => {
  it('always keeps at least one label per gap', () => {
    expect(labelStep(12, 600, 64)).toBe(2);
    expect(labelStep(120, 640, 64)).toBe(12);
  });
});

describe('toNumber', () => {
  it('falls back to zero for non-numeric values', () => {
    expect(toNumber('3.5')).toBe(3.5);
    expect(toNumber(4)).toBe(4);
    expect(toNumber('nope')).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });
});
