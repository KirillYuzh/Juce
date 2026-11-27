export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export const MONTHS_NOMINATIVE = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const WEEKDAYS_FULL = [
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
  'воскресенье',
];

export function toValidDate(date: Date | null | undefined): Date | null {
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

export function weekdayIndex(date: Date): number {
  const day = date.getDay();
  return Number.isNaN(day) ? 0 : (day + 6) % 7;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfWeek(date: Date): Date {
  return addDays(startOfDay(date), -weekdayIndex(date));
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  target.setDate(Math.min(date.getDate(), daysInMonth(target)));
  return target;
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function today(): Date {
  return startOfDay(new Date());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function dayNumber(date: Date): number {
  return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
}

export function isBefore(a: Date, b: Date): boolean {
  return dayNumber(a) < dayNumber(b);
}

export function isAfter(a: Date, b: Date): boolean {
  return isBefore(b, a);
}

export function isWithinRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const [start, end] = isBefore(to, from) ? [to, from] : [from, to];
  return !isBefore(date, start) && !isAfter(date, end);
}

export function isDateDisabled(date: Date, min?: Date | null, max?: Date | null): boolean {
  if (min && isBefore(date, min)) return true;
  if (max && isAfter(date, max)) return true;
  return false;
}

export function clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
  if (min && isBefore(date, min)) return startOfDay(min);
  if (max && isAfter(date, max)) return startOfDay(max);
  return date;
}

export function dateKey(date: Date): string {
  if (!toValidDate(date)) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getMonthWeeks(month: Date): Array<Array<Date | null>> {
  const first = startOfMonth(month);
  const total = daysInMonth(month);
  const weeks: Array<Array<Date | null>> = [];
  let row: Array<Date | null> = new Array<Date | null>(weekdayIndex(first)).fill(null);

  for (let day = 1; day <= total; day += 1) {
    row.push(new Date(first.getFullYear(), first.getMonth(), day));
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  }
  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    weeks.push(row);
  }
  return weeks;
}

export function formatDate(date: Date): string {
  if (!toValidDate(date)) return '';
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateFull(date: Date): string {
  if (!toValidDate(date)) return '';
  return `${formatDate(date)}, ${WEEKDAYS_FULL[weekdayIndex(date)]}`;
}

function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]}`;
}

export function formatDateRange(range: DateRange | null | undefined): string {
  if (!range) return '';
  const from = toValidDate(range.from);
  const to = toValidDate(range.to);
  if (!from && !to) return '';

  if (from && to) {
    const [start, end] = isBefore(to, from) ? [to, from] : [from, to];
    if (isSameDay(start, end)) return formatDate(start);
    if (isSameMonth(start, end)) {
      return `${start.getDate()} – ${end.getDate()} ${MONTHS_GENITIVE[end.getMonth()]} ${end.getFullYear()}`;
    }
    if (start.getFullYear() === end.getFullYear()) {
      return `${formatDayMonth(start)} – ${formatDayMonth(end)} ${end.getFullYear()}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
  }

  return from ? `с ${formatDate(from)}` : `по ${formatDate(to as Date)}`;
}
