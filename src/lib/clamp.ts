/** Ограничивает значение диапазоном `[min, max]`. `min > max` → возвращает `max`, `NaN` → `NaN`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
