import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  addDays,
  addMonths,
  dateKey,
  getMonthWeeks,
  isBefore,
  isSameDay,
  isWithinRange,
  startOfDay,
  startOfWeek,
  weekdayIndex,
} from './date';

const anyDay = fc.date({
  min: new Date(2000, 0, 1),
  max: new Date(2035, 11, 31),
  noInvalidDate: true,
});

describe('weekdayIndex', () => {
  it('starts the week on Monday', () => {
    expect(weekdayIndex(new Date(2024, 0, 1))).toBe(0);
    expect(weekdayIndex(new Date(2024, 0, 7))).toBe(6);
  });
});

describe('addDays', () => {
  it('is reversible', () => {
    fc.assert(
      fc.property(anyDay, fc.integer({ min: -365, max: 365 }), (date, amount) => {
        expect(isSameDay(addDays(addDays(date, amount), -amount), date)).toBe(true);
      }),
    );
  });
});

describe('startOfWeek', () => {
  it('is a Monday on or before the date', () => {
    fc.assert(
      fc.property(anyDay, (date) => {
        const start = startOfWeek(date);
        expect(weekdayIndex(start)).toBe(0);
        expect(isBefore(start, date) || isSameDay(start, date)).toBe(true);
        expect(isBefore(date, addDays(start, 7))).toBe(true);
      }),
    );
  });
});

describe('dateKey', () => {
  it('formats a local day without time', () => {
    expect(dateKey(new Date(2025, 10, 5))).toBe('2025-11-05');
  });
});

describe('getMonthWeeks', () => {
  it('pads every row to seven cells and keeps all days', () => {
    const weeks = getMonthWeeks(new Date(2024, 1, 1));
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    const days = weeks.flat().filter((day): day is Date => day !== null);
    expect(days).toHaveLength(29);
    expect(isSameDay(days[0], new Date(2024, 1, 1))).toBe(true);
    expect(isSameDay(days[days.length - 1], new Date(2024, 1, 29))).toBe(true);
  });
});

describe('isWithinRange', () => {
  it('does not depend on the order of the bounds', () => {
    const from = new Date(2024, 0, 10);
    const to = new Date(2024, 0, 20);
    const day = new Date(2024, 0, 15);
    expect(isWithinRange(day, from, to)).toBe(true);
    expect(isWithinRange(day, to, from)).toBe(true);
    expect(isWithinRange(new Date(2024, 0, 1), from, to)).toBe(false);
  });

  it('is false when a bound is missing', () => {
    expect(isWithinRange(new Date(2024, 0, 15), new Date(2024, 0, 10), null)).toBe(false);
  });
});

describe('addMonths', () => {
  it('clamps the day to the target month', () => {
    expect(isSameDay(addMonths(new Date(2024, 0, 31), 1), new Date(2024, 1, 29))).toBe(true);
    expect(isSameDay(addMonths(new Date(2023, 0, 31), 1), new Date(2023, 1, 28))).toBe(true);
  });
});

describe('isSameDay', () => {
  it('ignores the time of day', () => {
    expect(isSameDay(new Date(2024, 0, 1, 0, 0), new Date(2024, 0, 1, 23, 59))).toBe(true);
    expect(isSameDay(startOfDay(new Date(2024, 0, 1, 15)), new Date(2024, 0, 1))).toBe(true);
  });
});
