import { useEffect, useId, useRef, useState } from 'react';
import styles from './Calendar.module.css';
import { Icon } from '../Icon';
import {
  MONTHS_NOMINATIVE,
  WEEKDAYS_SHORT,
  addDays,
  addMonths,
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
  type DateRange,
} from '../../../lib/date';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type CalendarMode = 'single' | 'range';

export interface CalendarProps {
  mode?: CalendarMode;
  /** Date for single mode, { from, to } for range mode. */
  value?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | null) => void;
  /** Controlled visible month. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
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
  className,
}: CalendarProps) {
  const selectedDay = mode === 'single' ? ((value as Date | null | undefined) ?? null) : null;
  const range = mode === 'range' ? ((value as DateRange | null | undefined) ?? null) : null;

  const [innerMonth, setInnerMonth] = useState(() =>
    startOfMonth(defaultMonth ?? selectedDay ?? range?.from ?? new Date())
  );
  const visibleMonth = month ? startOfMonth(month) : innerMonth;

  const [focusedDay, setFocusedDay] = useState(() =>
    startOfDay(selectedDay ?? range?.from ?? new Date())
  );

  const titleId = useId();
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  // Focus follows the keyboard and the first open, never a mouse click on a nav button.
  const wantFocus = useRef(true);

  const setMonth = (next: Date) => {
    if (!month) setInnerMonth(next);
    onMonthChange?.(next);
  };

  const moveFocus = (next: Date) => {
    wantFocus.current = true;
    setFocusedDay(next);
    if (!isSameMonth(next, visibleMonth)) setMonth(startOfMonth(next));
  };

  useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    dayRefs.current.get(dateKey(focusedDay))?.focus();
  }, [focusedDay, visibleMonth]);

  const goMonth = (amount: number) => {
    // Keep the day-of-month when paging, so the roving tab stop stays inside the grid.
    setFocusedDay(addMonths(focusedDay, amount));
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

  const canGoPrev = !min || isBefore(min, startOfMonth(visibleMonth));
  const canGoNext = !max || isBefore(endOfMonth(visibleMonth), max);
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
              const disabled = isDateDisabled(day, min, max);
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
