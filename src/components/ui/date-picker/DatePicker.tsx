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
import { cx } from '../../../lib/cx';

export interface DateRangePreset {
  label: string;
  getRange: () => DateRange;
}

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
  presets?: DateRangePreset[];
  inline?: boolean;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'm' | 'l';
  label?: string;
  'aria-label'?: string;
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

function isDateRange(value: Date | DateRange | null): value is DateRange {
  return value !== null && typeof value === 'object' && !(value instanceof Date);
}

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder,
    presets,
    inline,
    min,
    max,
    disabled,
    id,
    className,
    size = 'l',
    label,
    'aria-label': ariaLabel,
  } = props;
  const binding =
    props.mode === 'range'
      ? { mode: 'range' as const, onSelect: props.onChange }
      : { mode: 'single' as const, onSelect: props.onChange };
  const mode: CalendarMode = binding.mode;

  const [innerValue, setInnerValue] = useState<Date | DateRange | null>(props.value ?? null);
  const [open, setOpen] = useState(false);
  const value = props.value !== undefined ? props.value : innerValue;

  const commit = (next: Date | DateRange | null) => {
    setInnerValue(next);
    if (binding.mode === 'range') {
      binding.onSelect?.(isDateRange(next) ? next : null);
    } else {
      binding.onSelect?.(next instanceof Date ? next : null);
    }
  };

  const handleSelect = (next: Date | DateRange | null) => {
    commit(next);
    const complete =
      binding.mode === 'range'
        ? isDateRange(next) && Boolean(next.from && next.to)
        : next instanceof Date;
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
    binding.mode === 'range'
      ? formatDateRange(isDateRange(value) ? value : null)
      : value instanceof Date
        ? formatDate(value)
        : '';
  const display = text || placeholder || (mode === 'range' ? 'Выберите период' : 'Выберите дату');
  const presetItems = binding.mode === 'range' ? (presets ?? defaultRangePresets) : [];

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
        aria-label={ariaLabel ?? label}
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
