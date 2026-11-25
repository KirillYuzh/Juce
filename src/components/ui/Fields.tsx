import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './Fields.module.css';
import { Chip } from './Display';
import { Icon } from './Icon';
import { cx } from '../../lib/cx';
import { radiusStyle, type RadiusValue } from '../../lib/radius';

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredMark?: boolean;
  id: string;
  children: ReactNode;
  className?: string;
  controlClassName?: string;
  controlStyle?: CSSProperties;
}

function FieldShell({
  label,
  hint,
  error,
  required,
  requiredMark = true,
  id,
  children,
  className,
  controlClassName,
  controlStyle,
}: FieldShellProps) {
  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && requiredMark && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={cx(styles.control, controlClassName, error && styles.invalid)}
        style={controlStyle}
      >
        {children}
      </div>
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
}

export type InputSize = 's' | 'm' | 'l';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  radius?: RadiusValue;
  requiredMark?: boolean;
  suffixSlot?: ReactNode;
  className?: string;
  fieldClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  size = 'l',
  radius,
  requiredMark = true,
  suffixSlot,
  className,
  fieldClassName,
  id,
  style,
  required,
  placeholder,
  'aria-label': ariaLabel,
  ...rest
}: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const usePlaceholderLabel = !label && required && requiredMark && Boolean(placeholder);

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={inputId}
      className={fieldClassName}
      controlClassName={styles[`control-${size}`]}
      controlStyle={radiusStyle(radius)}
    >
      <input
        id={inputId}
        className={cx(styles.input, styles[`size-${size}`], className)}
        style={radiusStyle(radius, style)}
        required={required}
        placeholder={usePlaceholderLabel ? ' ' : placeholder}
        aria-label={label ? ariaLabel : (ariaLabel ?? placeholder)}
        {...rest}
      />
      {usePlaceholderLabel && (
        <span
          className={cx(
            styles.placeholderOverlay,
            styles.placeholderInput,
            size === 's' && styles.placeholderSmall
          )}
          aria-hidden="true"
        >
          {placeholder}
          <span className={styles.requiredMark}>*</span>
        </span>
      )}
      {suffixSlot && <span className={styles.suffix}>{suffixSlot}</span>}
    </FieldShell>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
  fieldClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  requiredMark = true,
  fieldClassName,
  id,
  className,
  required,
  placeholder,
  'aria-label': ariaLabel,
  ...rest
}: TextareaProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const usePlaceholderLabel = !label && required && requiredMark && Boolean(placeholder);

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={inputId}
      className={fieldClassName}
      controlClassName={styles['control-textarea']}
    >
      <textarea
        id={inputId}
        className={cx(styles.textarea, className)}
        required={required}
        placeholder={usePlaceholderLabel ? ' ' : placeholder}
        aria-label={label ? ariaLabel : (ariaLabel ?? placeholder)}
        {...rest}
      />
      {usePlaceholderLabel && (
        <span
          className={cx(styles.placeholderOverlay, styles.placeholderTextarea)}
          aria-hidden="true"
        >
          {placeholder}
          <span className={styles.requiredMark}>*</span>
        </span>
      )}
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'onChange' | 'multiple' | 'size'
> {
  label?: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
  options: SelectOption[];
  fieldClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Select({
  label,
  hint,
  error,
  requiredMark = true,
  options,
  fieldClassName,
  id,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  ...rest
}: SelectProps) {
  const generated = useId();
  const triggerId = id ?? generated;
  const listId = `${triggerId}-listbox`;

  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const current = value !== undefined ? value : innerValue;
  const selectedIndex = options.findIndex((option) => option.value === current);
  const selected = options[selectedIndex];

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (value === undefined) setInnerValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    setActiveIndex(Math.max(selectedIndex, 0));
    listRef.current?.focus();
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + options.length) % options.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={triggerId}
      className={fieldClassName}
    >
      <div ref={wrapperRef} className={styles.selectWrap}>
        <button
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          id={triggerId}
          type="button"
          disabled={disabled}
          className={cx(styles.selectTrigger, className)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required={required || undefined}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((next) => !next)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className={cx(styles.selectValue, !selected && styles.selectPlaceholder)}>
            {selected?.label ?? 'Выберите'}
          </span>
          {!label && required && requiredMark && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
          <span className={styles.selectChevron} aria-hidden="true">
            <Icon name="chevronDown" size={20} />
          </span>
        </button>

        {open && (
          <div className={styles.selectMenu}>
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={triggerId}
              aria-activedescendant={
                options[activeIndex] ? `${triggerId}-${activeIndex}` : undefined
              }
              className={cx(styles.selectList, 'tb-scroll-fade-y')}
              onKeyDown={onListKeyDown}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${triggerId}-${index}`}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={cx(
                    styles.selectOption,
                    index === activeIndex && styles.selectOptionActive,
                    index === selectedIndex && styles.selectOptionSelected
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                >
                  {option.label}
                  {index === selectedIndex && <Icon name="check" size={20} />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FieldShell>
  );
}

export interface ChipSelectOption {
  value: string;
  label: string;
}

export interface ChipSelectProps {
  options: ChipSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  fieldClassName?: string;
  'aria-label'?: string;
}

export function ChipSelect({
  options,
  value,
  onChange,
  label,
  hint,
  className,
  fieldClassName,
  'aria-label': ariaLabel,
}: ChipSelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <div className={cx(styles.field, fieldClassName)}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <div
        className={cx(styles.chipGroup, className)}
        role="group"
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={hint ? hintId : undefined}
      >
        {options.map((option) => (
          <Chip
            key={option.value}
            variant="outline"
            active={value.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}

export interface ChoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx(styles.choice, className)}>
      <input type="checkbox" {...rest} />
      <span className={styles.box} aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ label, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx(styles.choice, className)}>
      <input type="radio" {...rest} />
      <span className={styles.radioCircle} aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export function Switch({ label, className, ...rest }: SwitchProps) {
  return (
    <label className={cx(styles.switch, className)}>
      <input type="checkbox" role="switch" {...rest} />
      <span className={styles.switchTrack} aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
}
