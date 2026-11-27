import { useEffect, useRef, useState } from 'react';
import styles from './ColorPicker.module.css';
import { Input } from '../Fields';
import { cx } from '../../../lib/cx';
import { useControllableState } from '../../../lib/use-controllable-state';

export const COLOR_PRESETS = [
  '#ff6574',
  '#ff979c',
  '#c20e4d',
  '#2b6fc4',
  '#006fee',
  '#12b5c4',
  '#2f9e4f',
  '#6460e8',
  '#f2c230',
  '#1a1a1a',
] as const;

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeHex(input: string): string | null {
  const value = input.trim();
  if (!HEX_PATTERN.test(value)) return null;
  const digits = value.replace(/^#/, '').toLowerCase();
  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : digits;
  return `#${full}`;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  colors?: readonly string[];
  label?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  defaultValue,
  onChange,
  colors = COLOR_PRESETS,
  label = 'Цвет',
  hint,
  className,
  disabled,
}: ColorPickerProps) {
  const palette = colors.map((color) => normalizeHex(color) ?? color);
  const fallback = palette[0] ?? '#000000';
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: normalizeHex(defaultValue ?? '') ?? fallback,
    onChange,
  });
  const [draft, setDraft] = useState(selected);
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const swatches = palette.some((color) => color.toLowerCase() === selected.toLowerCase())
    ? palette
    : [selected, ...palette];
  const currentIndex = swatches.findIndex(
    (color) => color.toLowerCase() === selected.toLowerCase()
  );

  useEffect(() => {
    if (document.activeElement !== inputRef.current) setDraft(selected);
  }, [selected]);

  const choose = (color: string) => {
    setSelected(color);
    setDraft(color);
  };

  const onSwatchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!swatches.length) return;
    const index = currentIndex >= 0 ? currentIndex : 0;
    let next = index;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (index + 1) % swatches.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index - 1 + swatches.length) % swatches.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = swatches.length - 1;
        break;
      default:
        return;
    }

    const swatch = swatches[next];
    if (!swatch) return;
    event.preventDefault();
    choose(swatch);
    swatchRefs.current[next]?.focus();
  };

  const onHexChange = (raw: string) => {
    setDraft(raw);
    const hex = normalizeHex(raw);
    if (hex) setSelected(hex);
  };

  return (
    <div className={cx(styles.root, className)}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={styles.swatches}
        onKeyDown={onSwatchKeyDown}
      >
        {swatches.map((color, index) => {
          const checked = color.toLowerCase() === selected.toLowerCase();

          return (
            <button
              key={`${color}-${index}`}
              ref={(node) => {
                swatchRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={color}
              title={color}
              disabled={disabled}
              tabIndex={checked ? 0 : -1}
              className={styles.swatch}
              style={{ backgroundColor: color }}
              onClick={() => choose(color)}
            />
          );
        })}
      </div>
      <Input
        ref={inputRef}
        size="s"
        spellCheck={false}
        disabled={disabled}
        aria-label={label === 'Цвет' ? 'HEX-код цвета' : `${label}: HEX`}
        value={draft}
        onChange={(event) => onHexChange(event.target.value)}
        onBlur={() => setDraft(selected)}
      />
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}
