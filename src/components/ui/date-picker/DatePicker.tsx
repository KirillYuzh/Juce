import { useState } from 'react';
import styles from './DatePicker.module.css';
import { Icon } from '../Icon';
import { Calendar, type CalendarMode } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import {
  addDays,
  clampDate,
  formatDate,
  formatDateRange,
  startOfMonth,
  today,
  type DateRange,
} from '../../../lib/date';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface DateRangePreset {
  label: string;
  getRange: () => DateRange;
}

/** getRange() keeps presets relative to the day the user opens the picker. */
export const defaultRangePresets: DateRangePreset[] = [
  {
    label: 'Сегодня',
    getRange: () => {
      const day = today();
      return { from: day, to: day };
    },
  },
  {
    label: 'Последние 7 дней',
    getRange: () => {
      const day = today();
      return { from: addDays(day, -6), to: day };
    },
  },
  {
    label: 'Этот месяц',
    getRange: () => {
      const day = today();
      return { from: startOfMonth(day), to: day };
    },
  },
];

interface DatePickerBaseProps {
  placeholder?: string;
  /** Range mode only; defaults to defaultRangePresets. Pass [] to hide the column. */
  presets?: DateRangePreset[];
  /** Render the calendar in place, without a trigger and a popover. */
  inline?: boolean;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'm' | 'l';
}

export type DatePickerProps =
  | ({
      mode?: 'single';
      value?: Date | null;
      onChange?: (value: Date | null) => void;
    } & DatePickerBaseProps)
  | ({
      mode: 'range';
      value?: DateRange | null;
      onChange?: (value: DateRange | null) => void;
    } & DatePickerBaseProps);

export function DatePicker(props: DatePickerProps) {
  const { placeholder, presets, inline, min, max, disabled, id, className, size = 'l' } = props;
  const mode: CalendarMode = props.mode ?? 'single';

  const [innerValue, setInnerValue] = useState<Date | DateRange | null>(props.value ?? null);
  const [open, setOpen] = useState(false);
  const value = props.value !== undefined ? props.value : innerValue;

  const commit = (next: Date | DateRange | null) => {
    setInnerValue(next);
    if (props.mode === 'range') props.onChange?.(next as DateRange | null);
    else props.onChange?.(next as Date | null);
  };

  const handleSelect = (next: Date | DateRange | null) => {
    commit(next);
    const complete =
      mode === 'range'
        ? Boolean((next as DateRange | null)?.from && (next as DateRange | null)?.to)
        : next !== null;
    if (complete) setOpen(false);
  };

  const applyPreset = (preset: DateRangePreset) => {
    const next = preset.getRange();
    commit({
      from: next.from ? clampDate(next.from, min, max) : null,
      to: next.to ? clampDate(next.to, min, max) : null,
    });
    setOpen(false);
  };

  const text =
    mode === 'range'
      ? formatDateRange(value as DateRange | null)
      : value
        ? formatDate(value as Date)
        : '';
  const display = text || placeholder || (mode === 'range' ? 'Выберите период' : 'Выберите дату');
  const presetItems = mode === 'range' ? (presets ?? defaultRangePresets) : [];

  const body = (
    <div className={styles.body}>
      {presetItems.length > 0 && (
        <div className={styles.presets} role="group" aria-label="Быстрый выбор периода">
          {presetItems.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles.preset}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <Calendar
        mode={mode}
        value={value}
        onChange={handleSelect}
        min={min}
        max={max}
        autoFocus={!inline}
        className={styles.calendar}
      />
    </div>
  );

  if (inline) {
    return (
      <div
        className={cx(styles.inline, className)}
        role="group"
        aria-label={mode === 'range' ? 'Выбор периода' : 'Выбор даты'}
      >
        {body}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} className={className}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cx(styles.trigger, styles[`size-${size}`])}
      >
        <span className={styles.icon} aria-hidden="true">
          <Icon name="calendar" size={20} />
        </span>
        <span className={cx(styles.value, !text && styles.placeholder)}>{display}</span>
      </PopoverTrigger>

      <PopoverContent
        className={styles.popover}
        role="dialog"
        aria-label={mode === 'range' ? 'Выбор периода' : 'Выбор даты'}
      >
        {body}
      </PopoverContent>
    </Popover>
  );
}
