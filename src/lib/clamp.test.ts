import { describe, expect, it } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  it('keeps a value inside the range untouched', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('raises a value below the range to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('lowers a value above the range to max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it('returns max when min is greater than max', () => {
    expect(clamp(5, 10, 0)).toBe(0);
  });

  it('propagates NaN', () => {
    expect(clamp(Number.NaN, 0, 10)).toBeNaN();
  });
});
