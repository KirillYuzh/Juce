import { useEffect, useId, useRef, useState } from 'react';
import styles from './Calendar.module.css';
import { Icon } from '../Icon';
import {
  MONTHS_NOMINATIVE,
  WEEKDAYS_SHORT,
  addDays,
  addMonths,
  clampDate,
  dateKey,
  endOfMonth,
  endOfWeek,
  formatDateFull,
  getMonthWeeks,
  isBefore,
  isDateDisabled,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toValidDate,
  type DateRange,
} from '../../../lib/date';
import { cx } from '../../../lib/cx';

export type CalendarMode = 'single' | 'range';

export function shiftFocusedDay(day: Date, months: number, min?: Date, max?: Date): Date {
  return clampDate(addMonths(day, months), min, max);
}

export interface CalendarProps {
  mode?: CalendarMode;
  value?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | null) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  autoFocus?: boolean;
  className?: string;
}

export function Calendar({
  mode = 'single',
  value,
  onChange,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  autoFocus = true,
  className,
}: CalendarProps) {
  const selectedDay = mode === 'single' ? toValidDate(value as Date | null | undefined) : null;
  const rangeValue = mode === 'range' ? (value as DateRange | null | undefined) : null;
  const range: DateRange | null = rangeValue
    ? { from: toValidDate(rangeValue.from), to: toValidDate(rangeValue.to) }
    : null;
  const safeMonth = toValidDate(month);
  const safeDefaultMonth = toValidDate(defaultMonth);
  const safeMin = toValidDate(min) ?? undefined;
  const safeMax = toValidDate(max) ?? undefined;

  const [innerMonth, setInnerMonth] = useState(() =>
    startOfMonth(safeDefaultMonth ?? selectedDay ?? range?.from ?? new Date())
  );
  const visibleMonth = safeMonth ? startOfMonth(safeMonth) : innerMonth;

  const [focusedDay, setFocusedDay] = useState(() =>
    startOfDay(selectedDay ?? range?.from ?? new Date())
  );

  const titleId = useId();
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const wantFocus = useRef(true);

  const setMonth = (next: Date) => {
    if (!safeMonth) setInnerMonth(next);
    onMonthChange?.(next);
  };

  const moveFocus = (next: Date) => {
    const target = clampDate(next, safeMin, safeMax);
    wantFocus.current = true;
    setFocusedDay(target);
    if (!isSameMonth(target, visibleMonth)) setMonth(startOfMonth(target));
  };

  useEffect(() => {
    if (!autoFocus || !wantFocus.current) return;
    wantFocus.current = false;
    dayRefs.current.get(dateKey(focusedDay))?.focus();
  }, [focusedDay, visibleMonth, autoFocus]);

  const goMonth = (amount: number) => {
    setFocusedDay(shiftFocusedDay(focusedDay, amount, safeMin, safeMax));
    setMonth(addMonths(visibleMonth, amount));
  };

  const selectDay = (day: Date) => {
    if (mode === 'range') {
      if (!range?.from || range.to) {
        onChange?.({ from: day, to: null });
      } else if (isBefore(day, range.from)) {
        onChange?.({ from: day, to: range.from });
      } else {
        onChange?.({ from: range.from, to: day });
      }
      return;
    }
    onChange?.(day);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focusedDay, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusedDay, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusedDay, -7);
        break;
      case 'ArrowDown':
        next = addDays(focusedDay, 7);
        break;
      case 'Home':
        next = startOfWeek(focusedDay);
        break;
      case 'End':
        next = endOfWeek(focusedDay);
        break;
      case 'PageUp':
        next = addMonths(focusedDay, -1);
        break;
      case 'PageDown':
        next = addMonths(focusedDay, 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const canGoPrev = !safeMin || isBefore(safeMin, startOfMonth(visibleMonth));
  const canGoNext = !safeMax || isBefore(endOfMonth(visibleMonth), safeMax);
  const todayKey = dateKey(new Date());

  return (
    <div className={cx(styles.calendar, className)}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Предыдущий месяц"
          disabled={!canGoPrev}
          onClick={() => goMonth(-1)}
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <div id={titleId} className={styles.title} aria-live="polite">
          {`${MONTHS_NOMINATIVE[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}
        </div>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Следующий месяц"
          disabled={!canGoNext}
          onClick={() => goMonth(1)}
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS_SHORT.map((weekday) => (
          <span key={weekday} className={styles.weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className={styles.grid} role="grid" aria-labelledby={titleId} onKeyDown={handleKeyDown}>
        {getMonthWeeks(visibleMonth).map((week, weekIndex) => (
          <div key={weekIndex} role="row" className={styles.row}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return (
                  <span
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className={styles.empty}
                    aria-hidden="true"
                  />
                );
              }

              const key = dateKey(day);
              const disabled = isDateDisabled(day, safeMin, safeMax);
              const isFrom = mode === 'range' && !!range?.from && isSameDay(day, range.from);
              const isTo = mode === 'range' && !!range?.to && isSameDay(day, range.to);
              const isSelected =
                mode === 'single' ? !!selectedDay && isSameDay(day, selectedDay) : isFrom || isTo;
              const inRange =
                mode === 'range' && !!range?.from && !!range?.to
                  ? isWithinRange(day, range.from, range.to)
                  : false;
              const suffix =
                isFrom && isTo
                  ? ', диапазон'
                  : isFrom
                    ? ', начало диапазона'
                    : isTo
                      ? ', конец диапазона'
                      : '';

              return (
                <div
                  key={key}
                  role="gridcell"
                  aria-selected={isSelected}
                  className={cx(
                    styles.cell,
                    inRange && styles.cellInRange,
                    isFrom && styles.cellStart,
                    isTo && styles.cellEnd
                  )}
                >
                  <button
                    ref={(element) => {
                      if (element) dayRefs.current.set(key, element);
                      else dayRefs.current.delete(key);
                    }}
                    type="button"
                    tabIndex={isSameDay(day, focusedDay) ? 0 : -1}
                    aria-disabled={disabled || undefined}
                    aria-label={`${formatDateFull(day)}${suffix}`}
                    className={cx(
                      styles.day,
                      isSelected && styles.selected,
                      dateKey(day) === todayKey && styles.today
                    )}
                    onClick={() => {
                      if (disabled) return;
                      setFocusedDay(day);
                      selectDay(day);
                    }}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
