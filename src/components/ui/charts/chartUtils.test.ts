import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  arcPath,
  axisTicks,
  bandIndex,
  labelStep,
  linePath,
  niceStep,
  pointerIndex,
  signedTicks,
  toNumber,
  valueExtent,
} from './chartUtils';

const mantissa = (step: number) => step / 10 ** Math.floor(Math.log10(step));

describe('niceStep', () => {
  it('returns 1, 2 or 5 times a power of ten', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.001, max: 1_000_000, noNaN: true }), (raw) => {
        expect([1, 2, 5]).toContain(mantissa(niceStep(raw)));
      })
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
      })
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

describe('valueExtent', () => {
  it('covers zero and both signs', () => {
    expect(
      valueExtent([
        [-10, 4],
        [2, -3],
      ])
    ).toEqual({ min: -10, max: 4 });
    expect(valueExtent([[5, 7]])).toEqual({ min: 0, max: 7 });
    expect(valueExtent([])).toEqual({ min: 0, max: 0 });
  });

  it('handles long series without spreading them into arguments', () => {
    const series = Array.from({ length: 200_000 }, (_, index) => index - 100_000);
    expect(() => valueExtent([series])).not.toThrow();
    expect(valueExtent([series])).toEqual({ min: -100_000, max: 99_999 });
  });
});

describe('pointerIndex', () => {
  it('rounds to the nearest point and clamps to the series', () => {
    expect(pointerIndex(-100, 100, 0, 5)).toBe(0);
    expect(pointerIndex(50, 100, 0, 5)).toBe(2);
    expect(pointerIndex(500, 100, 0, 5)).toBe(4);
    expect(pointerIndex(10, 100, 0, 0)).toBeNull();
  });
});

describe('bandIndex', () => {
  it('maps a position to a band and clamps it', () => {
    expect(bandIndex(0, 20, 4)).toBe(0);
    expect(bandIndex(45, 20, 4)).toBe(2);
    expect(bandIndex(400, 20, 4)).toBe(3);
    expect(bandIndex(12, 20, 0)).toBeNull();
  });
});
