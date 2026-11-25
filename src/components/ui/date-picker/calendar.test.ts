import { describe, expect, it } from 'vitest';
import { shiftFocusedDay } from './Calendar';

describe('shiftFocusedDay', () => {
  it('moves by months and clamps to the allowed range', () => {
    const min = new Date(2024, 4, 10);
    const max = new Date(2024, 7, 20);

    expect(shiftFocusedDay(new Date(2024, 5, 15), -1, min, max)).toEqual(new Date(2024, 4, 15));
    expect(shiftFocusedDay(new Date(2024, 4, 10), -1, min, max)).toEqual(min);
    expect(shiftFocusedDay(new Date(2024, 7, 20), 1, min, max)).toEqual(max);
  });

  it('keeps the day when there are no bounds', () => {
    expect(shiftFocusedDay(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29));
  });
});
